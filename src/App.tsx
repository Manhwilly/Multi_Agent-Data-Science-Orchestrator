import { useState, useRef, ChangeEvent } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatInput } from "./components/ChatInput";
import { PipelineView, AgentStage } from "./components/PipelineView";
import { Dashboard } from "./components/Dashboard";
import { generateAgentAnalysis, AgentResponse } from "./services/geminiService";
import { generateCombinedSample } from "./services/dataParser";
import { Activity, FileSpreadsheet, Database } from "lucide-react";
import { ConnectDBModal } from "./components/ConnectDBModal";
import {
  DataSourcesView,
  AgentTeamView,
  ExperimentsView,
  HistoryView,
  SettingsView,
} from "./components/Views";

export default function App() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [currentStage, setCurrentStage] = useState<AgentStage>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<AgentResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Global Data State
  const [globalFiles, setGlobalFiles] = useState<File[]>([]);
  const [databases, setDatabases] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<AgentResponse[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // UI State
  const [isDBModalOpen, setIsDBModalOpen] = useState(false);
  const headerFileInputRef = useRef<HTMLInputElement>(null);

  const addHistory = (
    action: string,
    details: string,
    data?: AgentResponse,
  ) => {
    setHistory((prev) => [
      { action, details, timestamp: new Date().toISOString(), data },
      ...prev,
    ]);
  };

  const handleAttachFiles = (files: File[]) => {
    setGlobalFiles((prev) => [...prev, ...files]);
    addHistory("Files Uploaded", `Uploaded ${files.length} file(s).`);
  };

  const handleRemoveFile = (index: number) => {
    setGlobalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConnectDB = (db: any) => {
    setDatabases((prev) => [...prev, db]);
    addHistory(
      "Database Connected",
      `Connected to ${db.type} database: ${db.name}`,
    );
  };

  const handleRemoveDB = (id: string) => {
    setDatabases((prev) => prev.filter((db) => db.id !== id));
  };

  const handleHeaderFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAttachFiles(Array.from(e.target.files));
      if (headerFileInputRef.current) {
        headerFileInputRef.current.value = "";
      }
    }
  };

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setError(null);
    setDashboardData(null);
    setActiveTab("workspace");

    try {
      addHistory("Analysis Started", `User requested: "${message}"`);
      const datasetSample = await generateCombinedSample(
        globalFiles,
        databases,
      );

      // Simulate pipeline stages for UX
      const stages: AgentStage[] = [
        "orchestrator",
        "dataEngineer",
        "mlScientist",
        "reviewer",
        "dataVisualization",
        "mlops",
        "business",
      ];
      let stageIndex = 0;

      const interval = setInterval(() => {
        if (stageIndex < stages.length) {
          setCurrentStage(stages[stageIndex]);
          stageIndex++;
        }
      }, 2000);

      // Call Gemini API
      const response = await generateAgentAnalysis(datasetSample, message);

      clearInterval(interval);
      setCurrentStage("complete");
      setDashboardData(response);
      setExperiments((prev) => [response, ...prev]);
      addHistory(
        "Analysis Complete",
        "Generated dashboard and insights successfully.",
        response,
      );
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "An error occurred while processing your request. Please try again.",
      );
      setCurrentStage("idle");
      addHistory(
        "Analysis Failed",
        err.message || "An error occurred during the analysis process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExperiment = (exp: AgentResponse) => {
    setDashboardData(exp);
    setCurrentStage("complete");
    setActiveTab("workspace");
    addHistory(
      "Experiment Loaded",
      `Loaded experiment from ${new Date(exp.timestamp).toLocaleString()}`,
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "data":
        return (
          <DataSourcesView
            files={globalFiles}
            databases={databases}
            onRemoveFile={handleRemoveFile}
            onRemoveDB={handleRemoveDB}
            onOpenDBModal={() => setIsDBModalOpen(true)}
            onUploadClick={() => headerFileInputRef.current?.click()}
          />
        );
      case "agents":
        return <AgentTeamView />;
      case "experiments":
        return (
          <ExperimentsView
            experiments={experiments}
            onLoadExperiment={handleLoadExperiment}
          />
        );
      case "history":
        return (
          <HistoryView
            history={history}
            onLoadExperiment={handleLoadExperiment}
          />
        );
      case "settings":
        return <SettingsView />;
      case "workspace":
      default:
        return (
          <div className="max-w-5xl mx-auto pb-32">
            {currentStage !== "idle" && (
              <PipelineView currentStage={currentStage} />
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            {dashboardData && currentStage === "complete" && (
              <Dashboard data={dashboardData} />
            )}

            {currentStage === "idle" && !dashboardData && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Welcome to Data Copilot
                </h2>
                <p className="text-zinc-400 max-w-md mb-8">
                  Upload your datasets or connect a database, then describe your
                  business problem. Our autonomous AI team will handle the rest.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left w-full max-w-lg">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-zinc-300 mb-1">
                      1. Add Data Sources
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Upload multiple CSVs, JSONs, or connect a DB.
                    </p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-zinc-300 mb-1">
                      2. Describe Problem
                    </h3>
                    <p className="text-xs text-zinc-500">
                      "Predict churn and estimate ROI."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-medium text-zinc-200">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDBModalOpen(true)}
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Connect DB
            </button>
            <input
              type="file"
              multiple
              ref={headerFileInputRef}
              onChange={handleHeaderFileUpload}
              className="hidden"
              accept=".csv,.xlsx,.json,.txt"
            />
            <button
              onClick={() => headerFileInputRef.current?.click()}
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Upload Files
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>

        {/* Fixed Chat Input (Only show in Workspace or if they want to trigger analysis from anywhere) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <ChatInput
              onSend={handleSend}
              onAttachFiles={handleAttachFiles}
              isLoading={isLoading}
              globalFilesCount={globalFiles.length + databases.length}
            />
          </div>
        </div>
      </main>

      <ConnectDBModal
        isOpen={isDBModalOpen}
        onClose={() => setIsDBModalOpen(false)}
        onConnect={handleConnectDB}
      />
    </div>
  );
}
