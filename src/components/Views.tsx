import { useState, useEffect } from "react";
import {
  Database,
  FileSpreadsheet,
  Trash2,
  Users,
  Activity,
  Settings,
  History,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AgentResponse } from "../services/geminiService";
import { getModelConfig, saveModelConfig, ModelConfig } from "../services/modelRouter";

interface DataSourcesViewProps {
  files: File[];
  databases: any[];
  onRemoveFile: (index: number) => void;
  onRemoveDB: (id: string) => void;
  onOpenDBModal: () => void;
  onUploadClick: () => void;
}

export function DataSourcesView({
  files,
  databases,
  onRemoveFile,
  onRemoveDB,
  onOpenDBModal,
  onUploadClick,
}: DataSourcesViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Data Sources</h2>
        <p className="text-zinc-400 text-sm">
          Manage your connected databases and uploaded files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Databases */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Connected Databases
            </h3>
            <button
              onClick={onOpenDBModal}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              + Connect New
            </button>
          </div>

          {databases.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              No databases connected.
            </p>
          ) : (
            <ul className="space-y-3">
              {databases.map((db) => (
                <li
                  key={db.id}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {db.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {db.type} • {db.host}:{db.port}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveDB(db.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Files */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500" />
              Uploaded Files
            </h3>
            <button
              onClick={onUploadClick}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Upload File
            </button>
          </div>

          {files.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              No files uploaded.
            </p>
          ) : (
            <ul className="space-y-3">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
                >
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(i)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgentTeamView() {
  const agents = [
    {
      name: "Orchestrator",
      role: "Team Lead",
      desc: "Understands intent, breaks tasks, assigns work.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      name: "Data Engineer",
      role: "Data Prep",
      desc: "Profiles data, cleans, preprocesses, reports quality.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "ML Scientist",
      role: "Modeling",
      desc: "Proposes approaches, builds baselines, tunes models.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Reviewer/Critic",
      role: "Gating & Validation",
      desc: "Checks for data leakage, sample size, PII, and statistical significance.",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      name: "Data Visualization",
      role: "Dashboards",
      desc: "Generates professional dashboards, KPIs, and deep insights.",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      name: "MLOps Engineer",
      role: "Deployment",
      desc: "Prepares architecture, containerizes, suggests pipelines.",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      name: "Business Translator",
      role: "Strategy",
      desc: "Translates technical results into business insights.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-500" />
          Agent Team
        </h2>
        <p className="text-zinc-400 text-sm">
          Your autonomous AI data science department.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${agent.bg}`}
            >
              <Users className={`w-6 h-6 ${agent.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              {agent.role}
            </p>
            <p className="text-sm text-zinc-400 flex-1">{agent.desc}</p>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-500">Active & Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperimentsView({
  experiments,
  onLoadExperiment,
}: {
  experiments: AgentResponse[];
  onLoadExperiment: (exp: AgentResponse) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-500" />
          Experiments
        </h2>
        <p className="text-zinc-400 text-sm">
          Past analyses and generated dashboards. Click to load a previous
          state.
        </p>
      </div>

      {experiments.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No experiments yet
          </h3>
          <p className="text-zinc-500 text-sm">
            Go to the Workspace to run your first analysis.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiments.map((exp, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors group cursor-pointer"
              onClick={() => onLoadExperiment(exp)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    Experiment #{experiments.length - i}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    {new Date(exp.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mb-4 line-clamp-2">
                  {exp.business.executiveSummary}
                </p>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-950 rounded-md border border-zinc-800">
                    ROI: {exp.business.roiEstimate}
                  </span>
                  <span className="px-2 py-1 bg-zinc-950 rounded-md border border-zinc-800">
                    Task: {exp.orchestrator.taskType}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Load State <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoryView({
  history,
  onLoadExperiment,
}: {
  history: any[];
  onLoadExperiment: (exp: AgentResponse) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-500" />
          Project History
        </h2>
        <p className="text-zinc-400 text-sm">
          Audit log of all actions taken in the workspace.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        {history.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">
            No history recorded yet.
          </p>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
            {history.map((item, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white text-sm">
                      {item.action}
                    </h4>
                    <time className="text-xs text-zinc-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{item.details}</p>
                  {item.data && (
                    <button
                      onClick={() => onLoadExperiment(item.data)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                    >
                      <History className="w-3 h-3" />
                      Restore this version
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsView() {
  const [config, setConfig] = useState<ModelConfig>({
    provider: "gemini",
    model: "gemini-3.1-pro-preview",
    timeout: 30,
    max_tokens: 1024,
  });
  const [rawKey, setRawKey] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    setConfig(getModelConfig());
  }, []);

  const handleSave = () => {
    try {
      saveModelConfig(config, rawKey ? rawKey : undefined);
      const updatedConfig = getModelConfig();
      setConfig(updatedConfig);
      setRawKey(""); // Clear raw key from memory
      setSaveStatus(`Model configured: provider=${config.provider.toUpperCase()}, model=${config.model}. Your key is stored securely (reference id: ${updatedConfig.key_ref || 'platform_default'}).`);
      
      setTimeout(() => setSaveStatus(null), 5000);
    } catch (e) {
      console.error(e);
      setSaveStatus("Failed to save configuration.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-500" />
          Settings & Integrations
        </h2>
        <p className="text-zinc-400 text-sm">
          Manage your workspace preferences and model routing configuration.
        </p>
      </div>

      <div className="space-y-6">
        {/* Integrations Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Model Integrations
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Configure your preferred LLM provider. Keys are stored securely as opaque references and are never logged or sent in chat.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Provider
              </label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="gemini">Gemini (Cloud)</option>
                <option value="openai">OpenAI (Cloud)</option>
                <option value="ollama_local">Ollama (Local / On-Prem)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Model Name
              </label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                placeholder={config.provider === 'openai' ? 'gpt-4o' : config.provider === 'gemini' ? 'gemini-3.1-pro-preview' : 'llama3'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {config.provider === "ollama_local" ? (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Local Endpoint
                </label>
                <input
                  type="text"
                  value={config.local_endpoint || ""}
                  onChange={(e) => setConfig({ ...config, local_endpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Ensure Ollama is running locally. You may need to configure CORS if running from a different origin.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  API Key / Token
                </label>
                <input
                  type="password"
                  value={rawKey}
                  onChange={(e) => setRawKey(e.target.value)}
                  placeholder={config.key_ref ? `Stored securely as ${config.key_ref}` : "Enter new API key"}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  {config.provider === "gemini" && !config.key_ref && !rawKey ? "If left blank, uses platform default GEMINI_API_KEY." : "Enter a new key to update. Leave blank to keep existing key."}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save Configuration
              </button>
              {saveStatus && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  {saveStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Open Source Edition
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Local Privacy
                  </p>
                  <p className="text-xs text-zinc-500">
                    Data stays in your browser until analysis.
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-md border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
