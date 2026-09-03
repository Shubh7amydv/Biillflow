import * as uploadController from '@/controllers/upload-controller';

export async function POST(req: Request) {
  return await uploadController.uploadLogo(req);
}
