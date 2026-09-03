import * as invoiceController from '@/controllers/invoice-controller';

export async function POST(
  req: Request,
  context: { params: { publicToken: string } }
) {
  return await invoiceController.payPublic(req, context);
}
