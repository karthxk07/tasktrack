const config = {
  API_BASE_URL: wwindow._env_?.VITE_APP_PROD_BASE_URL || window._env_?.VITE_APP_DEV_BASE_URL || 'http://localhost:8080',
};

export default config;
