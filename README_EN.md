# LangFlow Chat Intelligent Knowledge Q&A Management System - Page Showcase

## Project Overview

LangFlow Chat is an intelligent knowledge Q&A management system based on Vue 3 + Vite + Electron, providing core functionalities including intelligent Q&A, knowledge base construction, document management, and model marketplace. The system features modern UI design and supports both desktop and web deployment.

The digital human and agent frontend and backend projects are stored in separate code repositories:

1. Frontend code repository: https://gitee.com/garveyer/lang-flow_3-d-digital-human_-front

2. Backend code repository: https://gitee.com/garveyer/lang-flow_3-d-digital-human_-back

## Technology Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Desktop Application**: Electron
- **UI Components**: Element Plus
- **Styling Framework**: Tailwind CSS
- **Routing Management**: Vue Router
- **HTTP Client**: Axios
- **Icon Library**: Font Awesome

## Page Showcase

### Complete Page Overview

| Feature Module | Page Path | File Naming Convention | Preview |
|---|---|---|---|
| Main Page | / | `main-page.png` | ![Main Page](./docs/assets/main-page.png) |
| Intelligent Q&A Main Page | /chat | `chat.png` | ![Intelligent Q&A Main Page](./docs/assets/chat.png) |
| Intelligent Q&A Conversation | /chat | `chat-conversation.png` | ![Intelligent Q&A Conversation](./docs/assets/chat-conversation.png) |
| Agent List | /chat | `agent-list.png` | ![Agent List](./docs/assets/agent-list.png) |
| Create Agent | /chat | `create-agent.png` | ![Create Agent](./docs/assets/create-agent.png) |
| Agent Configuration | /chat | `agent-config.png` | ![Agent Configuration](./docs/assets/agent-config.png) |
| Knowledge Base Construction | /knowledge | `knowledge-base.png` | ![Knowledge Base](./docs/assets/knowledge-base.png) |
| Knowledge Base List | /knowledge | `knowledge-list.png` | ![Knowledge Base List](./docs/assets/knowledge-list.png) |
| Create Knowledge Base - Step 1 | /knowledge | `create-knowledge-1.png` | ![Create Knowledge Base - Step 1](./docs/assets/create-knowledge-1.png) |
| Create Knowledge Base - Step 2 | /knowledge | `create-knowledge-2.png` | ![Create Knowledge Base - Step 2](./docs/assets/create-knowledge-2.png) |
| Create Knowledge Base - Step 3 | /knowledge | `create-knowledge-3.png` | ![Create Knowledge Base - Step 3](./docs/assets/create-knowledge-3.png) |
| Knowledge Base Detail | /knowledge | `knowledge-detail.png` | ![Knowledge Base Detail](./docs/assets/knowledge-detail.png) |
| Knowledge Base Edit | /knowledge | `knowledge-edit.png` | ![Knowledge Base Edit](./docs/assets/knowledge-edit.png) |
| Document Management | /upload | `document-management.png` | ![Document Management](./docs/assets/document-management.png) |
| File Upload | /upload | `file-upload.png` | ![File Upload](./docs/assets/file-upload.png) |
| File Preview - List View | /upload | `file-preview-list.png` | ![File Preview - List View](./docs/assets/file-preview-list.png) |
| File Preview - Detail View | /upload | `file-preview-detail.png` | ![File Preview - Detail View](./docs/assets/file-preview-detail.png) |
| Model Marketplace | /models | `model-square.png` | ![Model Marketplace](./docs/assets/model-square.png) |

> Screenshot storage path: **`docs/assets/`**, naming must be consistent with the table above, automatically loaded after push.

## Feature Module Details

### 1. Main Page (/)
**Function Description**: System main entry page, containing left navigation bar and right content area
**Key Features**:
- Dynamic gradient background effects
- Left navigation bar with 4 main functional modules
- Real-time network status display
- Responsive design supporting different screen sizes
- Brand logo animation effects

**Technical Implementation**:
- Vue 3 Composition API
- CSS3 animations and gradient effects
- Network status monitoring
- Route navigation management

### 2. Intelligent Q&A Module (/chat)
**Function Description**: Core functionality of the intelligent Q&A system, supporting agent creation and management
**Key Features**:
- Agent list display
- Create new agents
- Agent configuration management
- Real-time conversation functionality
- Support for multiple AI models

**Sub-pages**:
- **Agent List**: Display all available agents
- **Create Agent**: Create new agent configurations
- **Agent Configuration**: Configure agent parameters and behavior
- **Agent Details**: View detailed information about agents

### 3. Knowledge Base Construction Module (/knowledge)
**Function Description**: Knowledge base management system, supporting creation, editing, and management of knowledge bases
**Key Features**:
- Knowledge base list management
- Create new knowledge bases
- Knowledge base content editing
- Knowledge base detail viewing
- Support for multiple document formats

**Sub-pages**:
- **Knowledge Base List**: Display all knowledge bases
- **Create Knowledge Base**: Create new knowledge bases
- **Knowledge Base Details**: View detailed information about knowledge bases
- **Knowledge Base Edit**: Edit knowledge base content

### 4. Document Management Module (/upload)
**Function Description**: Document upload and management system
**Key Features**:
- File upload functionality
- File preview functionality
- Document format support
- File management operations

**Sub-pages**:
- **Document Management**: Document list and management interface
- **File Upload**: File upload interface
- **File Preview**: File preview functionality

### 5. Model Marketplace Module (/models)
**Function Description**: AI model management and selection system
**Key Features**:
- Model list display
- Add new models
- Model configuration management
- Model selection dialog

**Sub-pages**:
- **Model List**: Display all available models
- **Add Model**: Add new AI models
- **Model Selection Dialog**: Model selection interface

## Design Features

### 1. Visual Design
- **Modern UI**: Adopts modern design language with clean and beautiful interface
- **Gradient Background**: Dynamic gradient background effects to enhance visual experience
- **Animation Effects**: Rich CSS3 animation effects to improve user interaction experience
- **Responsive Design**: Supports adaptation to different screen sizes

### 2. Interaction Design
- **Intuitive Navigation**: Clear navigation structure, easy for users to understand and use
- **Real-time Feedback**: Timely operation feedback with good user experience
- **State Management**: Comprehensive component state management
- **Error Handling**: Friendly error prompts and handling mechanisms

### 3. Technical Features
- **Component-based Development**: Highly componentized development model
- **TypeScript Support**: Complete TypeScript type support
- **Modular Architecture**: Clear modular architecture design
- **Performance Optimization**: Multiple performance optimization strategies

## Deployment Instructions

### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Electron development mode
npm run electron-dev
```

### Production Environment
```bash
# Build web version
npm run build

# Build Electron application
npm run electron-build
```

## Project Structure

```
src/
├── api/                    # API interfaces
├── assets/                 # Static resources
├── components/             # Components
│   ├── FAQ/               # Intelligent Q&A components
│   ├── KBS/               # Knowledge base components
│   └── ModelSelect/       # Model selection components
├── routes/                # Route configuration
├── utils/                 # Utility functions
└── vue/                   # Vue pages
```

## Changelog

### v1.0.1
- Initial version release
- Support for intelligent Q&A functionality
- Support for knowledge base management
- Support for document management
- Support for model marketplace
- Support for Electron desktop application

## Contact Information

For questions or suggestions, please contact the development team.

---

*Last updated: December 2024*
