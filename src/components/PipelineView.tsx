import { motion } from "motion/react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export type AgentStage =
  | "idle"
  | "orchestrator"
  | "dataEngineer"
  | "mlScientist"
  | "reviewer"
  | "dataVisualization"
  | "mlops"
  | "business"
  | "complete";

const stages = [
  { id: "orchestrator", label: "Orchestrator", desc: "Planning & Framing" },
  { id: "dataEngineer", label: "Data Engineer", desc: "Profiling & Cleaning" },
  { id: "mlScientist", label: "ML Scientist", desc: "Modeling & Tuning" },
  { id: "reviewer", label: "Reviewer", desc: "Gating & Validation" },
  {
    id: "dataVisualization",
    label: "Data Visualization",
    desc: "Dashboards & Insights",
  },
  { id: "mlops", label: "MLOps", desc: "Deployment Prep" },
  { id: "business", label: "Business Translator", desc: "ROI & Insights" },
];

interface PipelineViewProps {
  currentStage: AgentStage;
}

export function PipelineView({ currentStage }: PipelineViewProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const isComplete = currentStage === "complete";

  return (
    <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
      <h3 className="text-sm font-semibold text-zinc-300 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Agent Team Collaboration Pipeline
      </h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />

        {stages.map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const isDone =
            isComplete || (currentIndex !== -1 && idx < currentIndex);

          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive
                    ? "#10b981"
                    : isDone
                      ? "#059669"
                      : "#27272a",
                  borderColor: isActive
                    ? "#34d399"
                    : isDone
                      ? "#10b981"
                      : "#3f3f46",
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors",
                  isActive && "shadow-emerald-500/20",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-zinc-950" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-zinc-950 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500" />
                )}
              </motion.div>

              <div className="text-center absolute top-14 w-32 -ml-11">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive
                      ? "text-emerald-400"
                      : isDone
                        ? "text-zinc-300"
                        : "text-zinc-500",
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-12" /> {/* Spacer for absolute text */}
    </div>
  );
}
