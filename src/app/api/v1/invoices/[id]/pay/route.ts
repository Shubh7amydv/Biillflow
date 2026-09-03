import * as invoiceController from '@/controllers/invoice-controller';

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  return await invoiceController.pay(req, context);
}
