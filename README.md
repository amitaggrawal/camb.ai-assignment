# iAudio

A demo audio application built with React, TypeScript, and Vite. This application provides an interactive audio interface with drag-and-drop functionality and audio visualization capabilities.

## Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite for optimal performance
- **Audio Visualization**: Uses WaveSurfer.js for multi-track audio visualization
- **Drag & Drop**: File upload functionality with react-dropzone
- **Responsive Design**: Styled with Module CSS for a modern, responsive interface
- **Icon Integration**: FontAwesome icons for enhanced UI elements

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd camb-ai-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if you're using yarn:
   ```bash
   yarn install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server with hot module replacement (HMR). The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build using:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ControlPanel/     # Audio control interface
│   └── DragNDrop/        # File upload component
├── hooks/
│   └── useHotKey.tsx     # Custom keyboard shortcuts hook
├── assets/               # Static assets
└── App.tsx              # Main application component
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **WaveSurfer.js** - Audio visualization library
- **React Dropzone** - Drag and drop file upload
- **FontAwesome** - Icon library

## Approach & Technical Decisions

### Drag & Drop Implementation
I chose **React Dropzone** over the suggested `react-dnd` library for the following reasons:

- **Purpose-specific**: According to [this comprehensive comparison](https://dev.to/gulshanaggarwal/5-npm-packages-you-can-use-for-drag-drop-in-your-react-app-3g6g), `react-dnd` is a general-purpose drag & drop library, while React-Dropzone is specifically designed for file upload handling
- **Simplified API**: React-Dropzone provides a more straightforward API for file upload scenarios
- **Better UX**: Built-in support for drag states, file validation, and upload feedback

### Audio Visualization & Multi-track Management
For audio visualization and multi-track management, I selected **`wavesurfer-multitrack`**:

- **Multi-track Support**: Unlike the free `wavesurfer` package which only handles single audio files, `wavesurfer-multitrack` provides the multi-track functionality required for this assignment
- **Commercial Package**: While this is a paid package, it offers the specific functionality needed without extensive customization

**Alternative Considered**: [waveform-playlist](https://www.npmjs.com/package/waveform-playlist) - An open-source alternative with extensive features, but it has a significantly larger bundle size and would require substantial customization for our specific needs.

### Design Patterns
- **Component-based Architecture**: Modular components for different functionalities (ControlPanel, DragNDrop)
- **Custom Hooks**: `useHotKey` for keyboard shortcut management
- **CSS Modules**: For scoped styling and better maintainability

## Key Challenges & Solutions

### 1. Audio Terminology Understanding
**Challenge**: The assignment used audio-specific terminology (like "Audio pill") that wasn't immediately clear to developers without audio mixing experience.

**Solution**: Researched audio mixing, web audio, audio waves concepts and implemented a simplified interface that maintains the core functionality while being more intuitive for general users.

### 2. Multi-track Audio Management
**Challenge**: Finding the right balance between functionality and bundle size for multi-track audio handling.

**Solution**: Evaluated multiple libraries and chose `wavesurfer-multitrack` for its focused feature set and reasonable bundle size.

## Potential Enhancements

If given more development time, I would consider the following improvements:

### UI/UX Enhancements
- **Animations**: Add smooth transitions and animations similar to the sample application
- **Better Visual Feedback**: Enhanced drag states, loading indicators, and error handling for unsupported file formats with clear user messaging
- **Responsive Design**: Improved mobile and tablet experience

### Functional Improvements
- **Linked Play/Pause**: Synchronized playback controls across all tracks
- **Volume Management**: Individual and master volume controls with visual indicators
- **Track Linking**: Ability to link tracks for synchronized operations
- **Keyboard Shortcuts**: Extended keyboard navigation and shortcuts
- **Export Functionality**: Ability to export the mixed audio

### Technical Improvements
- **Performance Optimization**: Lazy loading for large audio files
- **Error Handling**: More robust error handling and user feedback
- **Accessibility**: Enhanced keyboard navigation and screen reader support
- **Testing**: Comprehensive unit and integration tests

## Contributing

This is a demo application. Feel free to explore the code and experiment with the features.

## License

This project is for demonstration purposes.
