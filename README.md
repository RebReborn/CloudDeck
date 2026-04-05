# CloudDeck ☁️

CloudDeck is a modern, secure, and fast media dashboard for Cloudinary. It allows users to manage their assets without creating a separate account, using their Cloudinary API credentials directly.

## ✨ Features

- **No Login Required**: Connect instantly using your Cloudinary Cloud Name, API Key, and API Secret.
- **Secure**: Sensitive operations are handled server-side. API secrets are never exposed to the frontend.
- **Media Management**:
  - Browse images, videos, and raw files.
  - Grid and List view modes.
  - Folder navigation with breadcrumbs.
  - Search by filename.
- **File Actions**:
  - Upload via drag-and-drop with progress tracking.
  - Rename and Delete assets.
  - Copy secure URLs and Download files.
- **Usage Analytics**: Real-time tracking of storage, bandwidth, and asset count.
- **Modern UI**:
  - Responsive design (Mobile & Desktop).
  - Dark and Light mode support.
  - Smooth animations with Framer Motion.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Cloudinary SDK.
- **Deployment**: Optimized for Cloud Run / Vercel / Railway.

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rebreborn/clouddeck.git
   cd clouddeck
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔒 Security

CloudDeck is designed with security as a priority:
- **Client-Side Storage**: Credentials are stored in `sessionStorage`, meaning they are cleared when the browser tab is closed.
- **Server-Side Signing**: Upload signatures and sensitive API calls are performed on the backend.
- **No Database**: We do not store your credentials or media data on our servers.

## 📄 License

This project is licensed under the MIT License.
