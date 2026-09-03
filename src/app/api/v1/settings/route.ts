import * as settingsController from '@/controllers/settings-controller';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return await settingsController.get(req);
}

export async function PATCH(req: Request) {
  return await settingsController.update(req);
}
