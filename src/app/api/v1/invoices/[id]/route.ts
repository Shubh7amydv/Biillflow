import * as invoiceController from '@/controllers/invoice-controller';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  return await invoiceController.get(req, context);
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  return await invoiceController.update(req, context);
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  return await invoiceController.destroy(req, context);
}
