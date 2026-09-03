import * as dashboardController from '@/controllers/dashboard-controller';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return await dashboardController.get(req);
}
