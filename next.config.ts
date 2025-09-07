import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Desactivar Turbopack (solución al error del LICENSE)
  experimental: {
    turbo: undefined
  },
  
  // Variables de entorno
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  
  // Configuración recomendada para producción
  output: 'standalone',
  
  // Opcional: Para evitar problemas con archivos no-JS
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.(txt|md|LICENSE)$/,
      type: 'asset/resource',
    });
    return config;
  }
};

export default nextConfig;