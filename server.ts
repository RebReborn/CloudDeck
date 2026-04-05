import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to configure Cloudinary per request
  const configureCloudinary = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cloudName = req.headers['x-cloud-name'] as string;
    const apiKey = req.headers['x-api-key'] as string;
    const apiSecret = req.headers['x-api-secret'] as string;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(401).json({ error: 'Missing Cloudinary credentials' });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    next();
  };

  // API Routes
  app.get('/api/validate', configureCloudinary, async (req, res) => {
    try {
      await cloudinary.api.ping();
      res.json({ status: 'ok' });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Invalid credentials' });
    }
  });

  app.get('/api/assets', configureCloudinary, async (req, res) => {
    try {
      const { prefix, resource_type = 'image', next_cursor, max_results = 50 } = req.query;
      
      const options: any = {
        resource_type,
        max_results: Number(max_results),
        type: 'upload'
      };

      if (prefix) options.prefix = prefix;
      if (next_cursor) options.next_cursor = next_cursor;

      const result = await cloudinary.api.resources(options);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/folders', configureCloudinary, async (req, res) => {
    try {
      const { path: folderPath } = req.query;
      const result = await cloudinary.api.sub_folders(folderPath as string || '');
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/usage', configureCloudinary, async (req, res) => {
    try {
      const result = await cloudinary.api.usage();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sign-upload', configureCloudinary, (req, res) => {
    try {
      const { folder, timestamp } = req.body;
      const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        cloudinary.config().api_secret!
      );
      res.json({ signature });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/assets', configureCloudinary, async (req, res) => {
    try {
      const { public_ids, resource_type = 'image' } = req.body;
      console.log('Attempting to delete assets:', { public_ids, resource_type });
      const result = await cloudinary.api.delete_resources(public_ids, { resource_type });
      console.log('Delete result:', result);
      res.json(result);
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/assets/rename', configureCloudinary, async (req, res) => {
    try {
      const { from_public_id, to_public_id, resource_type = 'image' } = req.body;
      const result = await cloudinary.uploader.rename(from_public_id, to_public_id, { resource_type });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
