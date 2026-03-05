import { Type } from "@google/genai";
import { callModel, getModelConfig } from "./modelRouter";

export interface AgentResponse {
  id: string;
  timestamp: string;
  orchestrator: {
    plan: string;
    taskType: string;
    missingInformation: string;
  };
  dataEngineer: {
    dataQuality: string;
    preprocessing: string;
    leakageRisks: string;
  };
  mlScientist: {
    strategy: string;
    modelSelection: string;
    evaluation: string;
    explainability: string;
  };
  reviewer: {
    dataLeakage: string;
    sampleSizeOk: string;
    piiDetected: string;
    explainabilityOk: string;
    statisticalSignificance: string;
    remediationActions: string;
  };
  dataVisualization: {
    kpis: {
      label: string;
      value: string;
      trend: string;
      confidenceInterval?: string;
    }[];
    insights: string;
    charts: {
      title: string;
      type: string;
      description: string;
      data: { name: string; value: number }[];
      deepExplanation: string;
      sampleSize: number;
    }[];
  };
  mlops: {
    architecture: string;
    deploymentCode: string;
    monitoringPlan: string;
    workflowYaml: string;
  };
  business: {
    executiveSummary: string;
    roiEstimate: string;
    recommendations: string[];
    complianceNotes: string;
    simulatorCommand: string;
    assumptions: string[];
    sensitivitySummary: string;
  };
  evidence: {
    sampleSize: number;
    keyMetrics: {
      roiMean: number;
      roiCiLower: number;
      roiCiUpper: number;
    };
    rawOutputs: string[];
  };
}

export async function generateAgentAnalysis(
  datasetSample: string,
  userPrompt: string,
): Promise<AgentResponse> {
  const prompt = `
You are an Autonomous Agentic AI Data Science Team composed of specialized expert agents that collaborate to analyze datasets, build models, generate insights, and produce business-ready deliverables.

Your mission is to transform the provided dataset sample and user requirements into a production-quality analysis, robust machine learning models, clear business insights, and deployable artifacts.

Dataset Sample (First 5 rows):
${datasetSample}

User Request:
${userPrompt}

Analyze the request and the data, and provide a comprehensive response structured exactly as the requested JSON schema.
Act as the following agents:
1. Orchestrator Agent (Team Lead): Understand intent, break tasks, identify task type.
2. Data Engineer Agent: Profile data, clean, preprocess, report quality issues.
3. Machine Learning Scientist Agent: Propose modeling approaches, justify choices, define evaluation metrics.
4. Reviewer/Critic Agent: Run checks for data leakage, sample size, PII, explainability, and statistical significance.
5. Data Visualization Agent: Generate professional dashboard data, KPIs (with confidence intervals), charts (bar, line, pie, area) with 4-6 data points each, deep business explanations, and sample sizes.
6. Cloud & MLOps Engineer Agent: Prepare deployment architecture, containerize models, suggest scalable pipelines, provide Temporal workflow YAML.
7. Business Translator Agent: Translate technical results into business insights, estimate ROI, highlight risks, provide a parameterized simulator command, assumptions, and sensitivity summary.
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      orchestrator: {
        type: Type.OBJECT,
        properties: {
          plan: { type: Type.STRING, description: "Step-by-step plan" },
          taskType: {
            type: Type.STRING,
            description: "e.g., classification, regression, clustering",
          },
          missingInformation: {
            type: Type.STRING,
            description: "Any missing info or clarifying questions",
          },
        },
        required: ["plan", "taskType", "missingInformation"],
      },
      dataEngineer: {
        type: Type.OBJECT,
        properties: {
          dataQuality: {
            type: Type.STRING,
            description: "Report on missing values, outliers, imbalance",
          },
          preprocessing: {
            type: Type.STRING,
            description: "Cleaning and preprocessing steps",
          },
          leakageRisks: {
            type: Type.STRING,
            description: "Potential data leakage risks",
          },
        },
        required: ["dataQuality", "preprocessing", "leakageRisks"],
      },
      mlScientist: {
        type: Type.OBJECT,
        properties: {
          strategy: {
            type: Type.STRING,
            description: "Modeling strategy and algorithm choices",
          },
          modelSelection: {
            type: Type.STRING,
            description: "Baseline and complex models",
          },
          evaluation: {
            type: Type.STRING,
            description: "Evaluation metrics and cross-validation",
          },
          explainability: {
            type: Type.STRING,
            description: "Model interpretation (SHAP, feature importance)",
          },
        },
        required: [
          "strategy",
          "modelSelection",
          "evaluation",
          "explainability",
        ],
      },
      reviewer: {
        type: Type.OBJECT,
        properties: {
          dataLeakage: { type: Type.STRING, description: "pass/fail" },
          sampleSizeOk: { type: Type.STRING, description: "pass/fail" },
          piiDetected: { type: Type.STRING, description: "yes/no" },
          explainabilityOk: { type: Type.STRING, description: "pass/fail" },
          statisticalSignificance: { type: Type.STRING, description: "pass/fail" },
          remediationActions: { type: Type.STRING, description: "Remediation steps if any fail" },
        },
        required: ["dataLeakage", "sampleSizeOk", "piiDetected", "explainabilityOk", "statisticalSignificance", "remediationActions"],
      },
      dataVisualization: {
        type: Type.OBJECT,
        properties: {
          kpis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: {
                  type: Type.STRING,
                  description: "e.g., +5.2% or -2.1%",
                },
                confidenceInterval: { type: Type.STRING, description: "e.g., [3.10, 3.80]" },
              },
              required: ["label", "value", "trend"],
            },
          },
          insights: {
            type: Type.STRING,
            description: "High-level summary of visual findings",
          },
          charts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: {
                  type: Type.STRING,
                  description: "bar, line, pie, or area",
                },
                description: { type: Type.STRING },
                data: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.NUMBER },
                    },
                    required: ["name", "value"],
                  },
                  description: "Array of 4-6 data points for the chart",
                },
                deepExplanation: {
                  type: Type.STRING,
                  description:
                    "Deep professional explanation of what this chart means for the business",
                },
                sampleSize: { type: Type.NUMBER, description: "Sample size for this chart" },
              },
              required: [
                "title",
                "type",
                "description",
                "data",
                "deepExplanation",
                "sampleSize"
              ],
            },
          },
        },
        required: ["kpis", "insights", "charts"],
      },
      mlops: {
        type: Type.OBJECT,
        properties: {
          architecture: {
            type: Type.STRING,
            description: "Deployment architecture (AWS/Azure)",
          },
          deploymentCode: {
            type: Type.STRING,
            description: "FastAPI endpoint or Dockerfile snippet",
          },
          monitoringPlan: {
            type: Type.STRING,
            description: "Monitoring strategy and cost considerations",
          },
          workflowYaml: {
            type: Type.STRING,
            description: "Temporal workflow YAML snippet",
          },
        },
        required: ["architecture", "deploymentCode", "monitoringPlan", "workflowYaml"],
      },
      business: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: {
            type: Type.STRING,
            description: "Executive summary of the project",
          },
          roiEstimate: {
            type: Type.STRING,
            description: "Estimated ROI or business impact",
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable recommendations",
          },
          complianceNotes: {
            type: Type.STRING,
            description: "Risks, assumptions, and compliance (GDPR)",
          },
          simulatorCommand: {
            type: Type.STRING,
            description: "Parameterized simulator command, e.g., simulate_roi(budget_shift=0.15)",
          },
          assumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Assumptions for the economic claim",
          },
          sensitivitySummary: {
            type: Type.STRING,
            description: "Sensitivity analysis summary",
          },
        },
        required: [
          "executiveSummary",
          "roiEstimate",
          "recommendations",
          "complianceNotes",
          "simulatorCommand",
          "assumptions",
          "sensitivitySummary"
        ],
      },
      evidence: {
        type: Type.OBJECT,
        properties: {
          sampleSize: { type: Type.NUMBER },
          keyMetrics: {
            type: Type.OBJECT,
            properties: {
              roiMean: { type: Type.NUMBER },
              roiCiLower: { type: Type.NUMBER },
              roiCiUpper: { type: Type.NUMBER },
            },
            required: ["roiMean", "roiCiLower", "roiCiUpper"],
          },
          rawOutputs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exact tool outputs or test statistics",
          },
        },
        required: ["sampleSize", "keyMetrics", "rawOutputs"],
      },
    },
    required: [
      "orchestrator",
      "dataEngineer",
      "mlScientist",
      "reviewer",
      "dataVisualization",
      "mlops",
      "business",
      "evidence"
    ],
  };

  const modelConfig = getModelConfig();
  const text = await callModel(modelConfig, prompt, schema);

  const result = JSON.parse(text) as AgentResponse;
  result.id = Date.now().toString();
  result.timestamp = new Date().toISOString();
  return result;
}
