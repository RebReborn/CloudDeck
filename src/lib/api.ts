import axios from 'axios';
import { useCloudDeckStore } from '../store/useCloudDeckStore';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const credentials = useCloudDeckStore.getState().credentials;
  if (credentials) {
    config.headers['x-cloud-name'] = credentials.cloudName;
    config.headers['x-api-key'] = credentials.apiKey;
    config.headers['x-api-secret'] = credentials.apiSecret;
  }
  return config;
});

export default api;
