import * as authController from '@/controllers/auth-controller';

export async function POST(req: Request) {
  return await authController.signup(req);
}
