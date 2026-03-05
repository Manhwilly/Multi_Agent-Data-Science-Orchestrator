import { GoogleGenAI, Type } from "@google/genai";
import { AgentResponse } from "./geminiService";

export interface ModelConfig {
  provider: "gemini" | "openai" | "ollama_local";
  model: string;
  key_ref?: string;
  local_endpoint?: string;
  timeout: number;
  max_tokens: number;
}

// Simulated server-side secrets manager
const secretsManager = {
  getSecret: (keyRef?: string): string | null => {
    if (!keyRef) return null;
    // In a real app, this would be a secure backend call.
    // Here we simulate it by reading from a secure local storage vault.
    const vault = JSON.parse(localStorage.getItem("_secure_vault_keys") || "{}");
    return vault[keyRef] || null;
  },
  setSecret: (keyRef: string, secret: string) => {
    const vault = JSON.parse(localStorage.getItem("_secure_vault_keys") || "{}");
    vault[keyRef] = secret;
    localStorage.setItem("_secure_vault_keys", JSON.stringify(vault));
  },
  removeSecret: (keyRef: string) => {
    const vault = JSON.parse(localStorage.getItem("_secure_vault_keys") || "{}");
    delete vault[keyRef];
    localStorage.setItem("_secure_vault_keys", JSON.stringify(vault));
  }
};

export const saveModelConfig = (config: ModelConfig, rawKey?: string) => {
  if (rawKey) {
    const keyRef = `secret-${Date.now()}`;
    secretsManager.setSecret(keyRef, rawKey);
    config.key_ref = keyRef;
  }
  localStorage.setItem("model_config", JSON.stringify(config));
};

export const getModelConfig = (): ModelConfig => {
  const stored = localStorage.getItem("model_config");
  if (stored) {
    return JSON.parse(stored);
  }
  // Default fallback
  return {
    provider: "gemini",
    model: "gemini-3.1-pro-preview",
    timeout: 30,
    max_tokens: 1024,
  };
};

const redactSecrets = (prompt: string): string => {
  // Basic redaction to ensure no secrets leak in the prompt
  return prompt.replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED]")
               .replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED]");
};

export async function callModel(
  modelConfig: ModelConfig,
  prompt: string,
  schemaConfig?: any
): Promise<string> {
  const sanitizedPrompt = redactSecrets(prompt);

  if (modelConfig.provider === "ollama_local") {
    const endpoint = modelConfig.local_endpoint || "http://localhost:11434";
    
    // Health check
    try {
      await fetch(endpoint, { method: "GET" });
    } catch (e) {
      throw new Error(`Unable to reach Ollama at ${endpoint}. Please ensure Ollama is running and reachable from this machine. See Settings → Integrations → Ollama for instructions.`);
    }

    // Call Ollama
    const response = await fetch(`${endpoint}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelConfig.model,
        prompt: sanitizedPrompt,
        stream: false,
        format: schemaConfig ? "json" : undefined,
        options: {
          num_predict: modelConfig.max_tokens,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Log routing decision without secrets
    console.log(JSON.stringify({
      user_id: "local_user",
      provider: "ollama_local",
      model: modelConfig.model,
      timestamp: new Date().toISOString()
    }));

    return data.response;
  } else {
    // Cloud providers
    let apiKey = secretsManager.getSecret(modelConfig.key_ref);
    
    // Fallback to platform env var for Gemini if no user key is provided
    if (!apiKey && modelConfig.provider === "gemini" && process.env.GEMINI_API_KEY) {
      apiKey = process.env.GEMINI_API_KEY;
    }

    if (!apiKey) {
      throw new Error("Model call blocked: API key not found or invalid. Please check Settings > Integrations.");
    }

    if (modelConfig.provider === "gemini") {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelConfig.model,
        contents: sanitizedPrompt,
        config: {
          responseMimeType: schemaConfig ? "application/json" : "text/plain",
          responseSchema: schemaConfig,
          temperature: 0.2,
        }
      });

      // Log routing decision without secrets
      console.log(JSON.stringify({
        user_id: "local_user",
        provider: "gemini",
        model: modelConfig.model,
        key_ref: modelConfig.key_ref || "platform_default",
        timestamp: new Date().toISOString()
      }));

      if (!response.text) {
        throw new Error("No response from Gemini");
      }
      return response.text;
    } else if (modelConfig.provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages: [{ role: "user", content: sanitizedPrompt }],
          max_tokens: modelConfig.max_tokens,
          response_format: schemaConfig ? { type: "json_object" } : undefined,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI error: ${response.statusText}`);
      }

      const data = await response.json();

      // Log routing decision without secrets
      console.log(JSON.stringify({
        user_id: "local_user",
        provider: "openai",
        model: modelConfig.model,
        key_ref: modelConfig.key_ref,
        timestamp: new Date().toISOString()
      }));

      return data.choices[0].message.content;
    }

    throw new Error(`Unsupported provider: ${modelConfig.provider}`);
  }
}
