# CloudDeck Documentation

## Overview
CloudDeck is a "Bring Your Own Backend" (BYOB) style dashboard for Cloudinary. It bridges the gap between the powerful Cloudinary API and a user-friendly interface for those who don't want to log into the full Cloudinary Console for quick tasks.

## Architecture

### Frontend
The frontend is a Single Page Application (SPA) built with React and Vite.
- **State Management**: Zustand is used for global state (credentials, assets, UI preferences).
- **Styling**: Tailwind CSS v4 with a custom theme for dark/light mode.
- **Icons**: Lucide React.
- **Animations**: Framer Motion (motion/react).

### Backend
The backend is an Express server that acts as a secure proxy for the Cloudinary Admin and Upload APIs.
- **Authentication**: The backend expects Cloudinary credentials in the request headers (`x-cloud-name`, `x-api-key`, `x-api-secret`).
- **Signature Generation**: For secure uploads, the backend generates a signature using the `api_secret` so the client can upload directly to Cloudinary's servers without exposing the secret.

## API Endpoints

- `GET /api/validate`: Pings Cloudinary to check if credentials are valid.
- `GET /api/assets`: Lists resources (images, videos, etc.) with support for prefix (folders) and pagination.
- `GET /api/folders`: Lists subfolders for a given path.
- `GET /api/usage`: Fetches account usage statistics.
- `POST /api/sign-upload`: Generates a signature for client-side uploads.
- `DELETE /api/assets`: Deletes one or more resources.
- `PATCH /api/assets/rename`: Renames a resource.

## Usage Guide

1. **Connection**: Enter your Cloud Name, API Key, and API Secret. You can find these in your Cloudinary Dashboard.
2. **Navigation**: Use the sidebar to switch between Images, Videos, and Raw files. Click on folders to dive deeper.
3. **Uploading**: Click the "Upload" button or drag files directly into the dashboard.
4. **Management**: Hover over an asset to see quick actions (Copy URL, Download). Use the small icons to Rename or Delete.

## Terms of Use
By using CloudDeck, you acknowledge that:
- You are responsible for the security of your Cloudinary credentials.
- CloudDeck does not store your data, but it does transmit it to Cloudinary.
- Usage of CloudDeck is subject to Cloudinary's own Terms of Service.
