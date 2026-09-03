import * as invoiceController from '@/controllers/invoice-controller';

export async function GET(
  req: Request,
  context: { params: { publicToken: string } }
) {
  return await invoiceController.getPublic(req, context);
}
