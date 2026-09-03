import { UserRepository } from '@/repository/user-repository';
import logger from '@/utils/logger';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(data: { name: string; email: string; password: string; businessName?: string }) {
    try {
      const email = data.email.trim().toLowerCase();

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        const err = new Error('User already exists with this email address.');
        (err as any).statusCode = 409;
        throw err;
      }

      if (!data.password || data.password.length < 8) {
        const err = new Error('Password must be at least 8 characters.');
        (err as any).statusCode = 400;
        throw err;
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await this.userRepository.create({
        name: data.name || email.split('@')[0],
        email,
        passwordHash,
        businessName: data.businessName || data.name || `${email.split('@')[0]}'s Studio`,
      });

      const { passwordHash: _, ...safeUser } = user as any;
      return safeUser;
    } catch (error) {
      logger.error('[AuthService:signup] error:', error);
      throw error;
    }
  }

  async validateCredentials(email: string, password: string) {
    try {
      const user = await this.userRepository.findByEmail(email.trim().toLowerCase());
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) return null;

      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      logger.error('[AuthService:validateCredentials] error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) return null;
      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      logger.error('[AuthService:getUserById] error:', error);
      throw error;
    }
  }
}

export default AuthService;
