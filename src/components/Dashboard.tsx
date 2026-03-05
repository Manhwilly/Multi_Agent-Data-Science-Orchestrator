import { AgentResponse } from "../services/geminiService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  FileCode,
  Server,
  Lightbulb,
  ShieldCheck,
  Database,
  Terminal,
} from "lucide-react";
import { cn } from "../lib/utils";

interface DashboardProps {
  data: AgentResponse;
}

export function Dashboard({ data }: DashboardProps) {
  const {
    orchestrator,
    dataEngineer,
    mlScientist,
    reviewer,
    dataVisualization,
    mlops,
    business,
    evidence,
  } = data;

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const renderChart = (chart: any) => {
    switch (chart.type) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chart.data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fff",
              }}
            />
          </PieChart>
        );
      case "line":
        return (
          <LineChart data={chart.data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={chart.data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case "bar":
      default:
        return (
          <BarChart data={chart.data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "#27272a" }}
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Reviewer Checklist (Gating) */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Reviewer Checklist & Gating
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {[
            { label: "Data Leakage", status: reviewer.dataLeakage },
            { label: "Sample Size", status: reviewer.sampleSizeOk },
            { label: "PII Detected", status: reviewer.piiDetected === "yes" ? "fail" : "pass" },
            { label: "Explainability", status: reviewer.explainabilityOk },
            { label: "Statistical Sig.", status: reviewer.statisticalSignificance },
          ].map((check, i) => (
            <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-zinc-500 mb-1">{check.label}</span>
              <span className={`text-sm font-bold uppercase ${check.status.toLowerCase() === "pass" ? "text-emerald-500" : "text-red-500"}`}>
                {check.status}
              </span>
            </div>
          ))}
        </div>
        {reviewer.remediationActions && reviewer.remediationActions.toLowerCase() !== "none" && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h4 className="text-sm font-semibold text-red-400 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Remediation Required
            </h4>
            <p className="text-sm text-red-200/80">{reviewer.remediationActions}</p>
          </div>
        )}
      </section>

      {/* Executive Summary & KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Executive Summary
          </h2>
          <p className="text-zinc-300 leading-relaxed mb-6">
            {business.executiveSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dataVisualization.kpis.map((kpi, i) => (
              <div
                key={i}
                className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
              >
                <p className="text-xs font-medium text-zinc-500 mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-white">
                    {kpi.value}
                  </span>
                  <span
                    className={`text-xs font-medium mb-1 ${kpi.trend.startsWith("+") ? "text-emerald-400" : kpi.trend.startsWith("-") ? "text-red-400" : "text-zinc-400"}`}
                  >
                    {kpi.trend}
                  </span>
                </div>
                {kpi.confidenceInterval && (
                  <p className="text-[10px] text-zinc-600 mt-1">CI: {kpi.confidenceInterval}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            Recommended Actions
          </h2>
          <ul className="space-y-3 flex-1">
            {business.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-zinc-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="mt-0.5">{rec}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Estimated ROI
            </h3>
            <p className="text-sm text-white font-semibold">
              {business.roiEstimate}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Mean: {evidence.keyMetrics.roiMean} | CI: [{evidence.keyMetrics.roiCiLower}, {evidence.keyMetrics.roiCiUpper}]
            </p>
          </div>
        </div>
      </section>

      {/* Business Translator & Simulator */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-orange-500" />
          Business Translation & Simulator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Assumptions</h4>
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1 mb-4">
              {business.assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sensitivity Summary</h4>
            <p className="text-sm text-zinc-300">{business.sensitivitySummary}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Simulator Command</h4>
            <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-400 mb-4">
              <code>{business.simulatorCommand}</code>
            </pre>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-xs text-blue-300">
                Use the simulator command in your local environment to test different scenarios and budget shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Bundle */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          Evidence Bundle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl mb-4">
              <p className="text-xs text-zinc-500 mb-1">Total Sample Size</p>
              <p className="text-2xl font-bold text-white">n={evidence.sampleSize}</p>
            </div>
          </div>
          <div className="col-span-2">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Raw Tool Outputs</h4>
            <div className="space-y-2">
              {evidence.rawOutputs.map((out, i) => (
                <pre key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 overflow-x-auto text-xs font-mono text-zinc-400">
                  <code>{out}</code>
                </pre>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization (A3 Dashboard Style) */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Data Visualization & Insights
          </h2>
          <p className="text-zinc-400 text-sm">{dataVisualization.insights}</p>
        </div>

        <div className="space-y-8">
          {dataVisualization.charts.map((chart, i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-zinc-950 border border-zinc-800 rounded-xl p-6"
            >
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-medium text-zinc-200">
                    {chart.title}
                  </h3>
                  <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                    n={chart.sampleSize}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-6">
                  {chart.description}
                </p>
                <div className="h-72 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(chart)}
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-semibold text-zinc-300">
                    Deep Explanation
                  </h4>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {chart.deepExplanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ML & Data Engineering */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-orange-500" />
            Model Strategy
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Approach
              </h4>
              <p className="text-sm text-zinc-300">{mlScientist.strategy}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Selection & Evaluation
              </h4>
              <p className="text-sm text-zinc-300">
                {mlScientist.modelSelection}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                {mlScientist.evaluation}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Explainability
              </h4>
              <p className="text-sm text-zinc-300">
                {mlScientist.explainability}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Data Quality & Risks
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Data Quality
              </h4>
              <p className="text-sm text-zinc-300">
                {dataEngineer.dataQuality}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Preprocessing
              </h4>
              <p className="text-sm text-zinc-300">
                {dataEngineer.preprocessing}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-1">
                Leakage Risks & Compliance
              </h4>
              <p className="text-sm text-yellow-100/80">
                {dataEngineer.leakageRisks}
              </p>
              <p className="text-sm text-yellow-100/80 mt-2">
                {business.complianceNotes}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment & MLOps */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-500" />
          Deployment & MLOps
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Architecture
              </h4>
              <p className="text-sm text-zinc-300">{mlops.architecture}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Monitoring Plan
              </h4>
              <p className="text-sm text-zinc-300">{mlops.monitoringPlan}</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Deployment Artifacts
              </h4>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-400">
                <code>{mlops.deploymentCode}</code>
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Temporal Workflow YAML
              </h4>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-blue-400">
                <code>{mlops.workflowYaml}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
