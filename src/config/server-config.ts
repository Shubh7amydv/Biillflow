export const serverConfig = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://saurabhyadav@localhost:5432/billflow',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'billflow-super-secure-production-ready-nextauth-secret-key-32chars',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  APP_URL: process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'invoices@billflow.app',
};

export default serverConfig;
