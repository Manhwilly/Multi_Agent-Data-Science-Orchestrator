🤖 Autonomous Multi-Agent Data Science Orchestrator

A sophisticated multi-agent system designed for end-to-end data science workflows. It enables seamless collaboration between 6 specialised AI-powered agents to automate data profiling, predictive modelling, and ROI analysis.

Supports integration with external AI APIs (Google Gemini) and local, privacy-first model execution via Ollama.

🌟 Core Features

Multi-Agent Orchestration: Coordinate a specialised team of AI agents for complex data science tasks.

Dual Model Support: Switch seamlessly between cloud AI APIs (Gemini) and local, private models (Ollama).

Interactive Dashboard: Real-time visualisation of agent activities, thought processes, and pipeline progress.

Data Pipeline Management: Build, monitor, and execute data processing workflows.

Database & File Integration: Connect to various databases or upload CSV/JSON files directly.

Experiment Tracking: Log, compare, and analyse different agent configurations and output results.

Chat Interface: Natural language interaction with the agent team.

🧠 The Agent Team

This system utilises a specialised 6-agent architecture to mimic a real-world Data Science department:

Orchestrator Agent (Team Lead): Understands intent, breaks down complex requests, and routes tasks.

Data Engineer Agent: Profiles data, cleans, preprocesses, and reports quality issues.

Machine Learning Scientist Agent: Proposes modelling approaches, justifies mathematical choices, and defines evaluation metrics.

Analytics & Visualisation Agent: Generates EDA visuals and highlights key patterns.

Cloud & MLOps Engineer Agent: Prepares deployment architecture and suggests scalable pipelines.

Business Translator Agent: Translates technical model outputs into actionable business insights and ROI estimates.

🏗️ Architecture

The application is built with a highly modular, decoupled architecture:

Frontend: React with TypeScript, styled with Tailwind CSS. Visualisations powered by Recharts.

Backend Services: Express.js for scalable API endpoints.

AI Integration (modelRouter.ts): Flexible model router supporting multiple AI providers.

Data Management (dataParser.ts): SQLite for local storage, built to be extensible to enterprise databases.

🚀 Quick Start

Prerequisites

Node.js (version 18 or higher)

npm or yarn

Optional: Ollama installed and running (for local models)

Optional: A valid Google Gemini API key (for cloud models)

Installation

Clone the repository:

git clone [https://github.com/Manhwilly/Multi_Agent-Data-Science-Orchestrator.git](https://github.com/Manhwilly/Multi_Agent-Data-Science-Orchestrator.git)
cd Multi_Agent-Data-Science-Orchestrator


Install dependencies:

npm install


Set up environment variables:
Create a .env.local file in the root directory:

GEMINI_API_KEY=your_gemini_api_key_here
OLLAMA_BASE_URL=http://localhost:11434  # Default Ollama URL
PORT=3000


Start the development server:

npm run dev


Navigate to http://localhost:3000 to access the application.

📖 Usage Guide

Select a Workspace: Choose from available workspaces or create a new one for your project.

Connect Data Sources: Upload your CSV/JSON files or connect to databases via the Data Sources tab.

Configure Agents: Set up your agent team (Local vs. Cloud) in the Agent Team view.

Run Experiments: Execute data science tasks through the natural language chat interface and watch the Orchestrator delegate tasks.

Working with Models

Using Gemini API: Ensure your GEMINI_API_KEY is set. The system will automatically route heavy reasoning tasks to the cloud.

Using Ollama (Local/Private): Install Ollama, pull your desired model (e.g., ollama pull llama2), and the system will detect and utilize local models for privacy-first inference.

🤝 Contributing

We welcome contributions from the community!

Fork the repository

Create a feature branch: git checkout -b feature/your-feature

Commit your changes: git commit -am 'Add some feature'

Push to the branch: git push origin feature/your-feature

Submit a pull request

Development Commands

npm install       # Install dependencies
npm run dev       # Run in development mode
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run type checking


📄 License & Acknowledgments

This project is licensed under the MIT License - see the LICENSE file for details.

Built with React and Vite.

AI integration powered by Google Gemini and Ollama.

UI components styled with Tailwind CSS, icons from Lucide React.

📞 Support: If you encounter any issues, please check the Issues page or open a new ticket with detailed information. Happy orchestrating! 🚀