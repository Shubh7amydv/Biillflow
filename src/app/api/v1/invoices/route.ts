import * as invoiceController from '@/controllers/invoice-controller';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return await invoiceController.getAll(req);
}

export async function POST(req: Request) {
  return await invoiceController.create(req);
}
