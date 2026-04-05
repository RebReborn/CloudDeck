# CloudDeck | Stellar Horizon ☁️✨

CloudDeck is a premium, high-performance media dashboard for Cloudinary. Re-imagined with the "Stellar Horizon" design language, it combines elite glassmorphism with advanced AI insights to provide a next-generation asset management experience.

## ✨ Features

- **Stellar Horizon UI**: A world-class Dark-Mode-First design featuring:
  - **Glassmorphism 2.0**: Sophisticated transparency and blur effects.
  - **Dynamic Backgrounds**: Mouse-reactive glowing starfields for an immersive experience.
  - **Micro-Animations**: Fluid transitions powered by Framer Motion.
- **Magic Insight (Optional AI)**: 
  - Integrated **Google Gemini 1.5 Flash**.
  - Automatic image/video analysis and description generation.
  - Intelligent context-aware tagging.
- **No Database Architecture**: Connect instantly using your Cloudinary credentials. Your data stays yours.
- **Secure Handling**: Sensitive operations and API secrets are signed server-side.
- **Comprehensive Media Actions**:
  - Drag-and-drop uploads with real-time transfer progress.
  - Instant re-designation (Rename) and asset purging (Delete).
  - One-click CDN URL copying and external viewing.
- **Usage Analytics**: Real-time tracking of storage, bandwidth, and asset volume.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, **Tailwind CSS v4**, Zustand, Framer Motion (`motion/react`), Lucide.
- **Backend**: Node.js, Express, Cloudinary SDK, **Google Gen AI SDK v2**.
- **Theming**: Advanced OKLCH color space with custom design tokens.

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rebreborn/clouddeck.git
   cd CloudDeck
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional for AI):
   Add `GEMINI_API_KEY` to your `.env` to enable Magic Insight.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📄 License

This project is licensed under the MIT License.
