import * as clientController from '@/controllers/client-controller';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return await clientController.getAll(req);
}

export async function POST(req: Request) {
  return await clientController.create(req);
}
