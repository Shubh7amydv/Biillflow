import * as clientController from '@/controllers/client-controller';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  return await clientController.get(req, context);
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  return await clientController.update(req, context);
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  return await clientController.destroy(req, context);
}
