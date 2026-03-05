<div align="center">
<img width="1200" height="475" alt="Multi-Agent Data Science Orchestrator" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Multi-Agent Data Science Orchestrator

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

A sophisticated multi-agent system designed for data science workflows, enabling seamless collaboration between AI-powered agents. Supports integration with external AI APIs (like Google Gemini) and local model execution via Ollama, providing flexible deployment options for data analysis, visualization, and orchestration.

## 🌟 Features

- **Multi-Agent Orchestration**: Coordinate multiple AI agents for complex data science tasks
- **Dual Model Support**: Integrate with cloud AI APIs (Gemini) and local models (Ollama)
- **Interactive Dashboard**: Real-time visualization of agent activities and pipeline progress
- **Data Pipeline Management**: Build and monitor data processing workflows
- **Database Integration**: Connect to various databases for data sourcing
- **File Upload & Parsing**: Support for CSV, JSON, and other data formats
- **Experiment Tracking**: Log and analyze different agent configurations and results
- **Chat Interface**: Natural language interaction with the agent team
- **Responsive UI**: Modern, intuitive interface built with React and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- For local model support: [Ollama](https://ollama.ai/) installed and running
- For Gemini API: A valid Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Manhwilly/Multi_Agent-Data-Science-Orchestrator.git
   cd Multi_Agent-Data-Science-Orchestrator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OLLAMA_BASE_URL=http://localhost:11434  # Default Ollama URL
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to access the application.

## 📖 Usage

### Getting Started

1. **Select a Workspace**: Choose from available workspaces or create a new one.
2. **Connect Data Sources**: Upload files or connect to databases via the Data Sources tab.
3. **Configure Agents**: Set up your agent team in the Agent Team view.
4. **Run Experiments**: Execute data science tasks through the chat interface or pipeline builder.

### Key Components

- **Dashboard**: Overview of agent activities, metrics, and current status
- **Pipeline View**: Visual representation of data processing stages
- **Chat Input**: Natural language commands to agents
- **Data Sources**: Manage files, databases, and data connections
- **Experiments**: Track and compare different runs
- **History**: Log of all actions and results

### Working with Models

#### Using Gemini API
- Ensure your `GEMINI_API_KEY` is set in `.env.local`
- The system will automatically route requests to Gemini for cloud-based processing

#### Using Ollama (Local Models)
- Install and start Ollama on your machine
- Pull desired models: `ollama pull llama2` (or your preferred model)
- The system will detect local models and use them for inference

## 🏗️ Architecture

The application is built with a modular architecture:

- **Frontend**: React with TypeScript, styled with Tailwind CSS
- **Backend Services**: Express.js for API endpoints
- **AI Integration**: Flexible model router supporting multiple AI providers
- **Data Management**: SQLite for local storage, extensible to other databases
- **Visualization**: Recharts for data visualization components

### Core Services

- `geminiService.ts`: Handles interactions with Google Gemini API
- `modelRouter.ts`: Routes requests between different AI models
- `dataParser.ts`: Processes and transforms input data

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Required for Gemini |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `PORT` | Server port | `3000` |

### Build Configuration

- **Vite**: For fast development and optimized production builds
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- AI integration powered by [Google Gemini](https://ai.google.dev/) and [Ollama](https://ollama.ai/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Manhwilly/Multi_Agent-Data-Science-Orchestrator/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy orchestrating! 🚀**
