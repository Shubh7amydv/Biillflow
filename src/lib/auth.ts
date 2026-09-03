import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthService } from '@/services/auth-service';
import serverConfig from '@/config/server-config';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || serverConfig.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    newUser: '/dashboard',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const authService = new AuthService();
          const user = await authService.validateCredentials(
            credentials.email,
            credentials.password
          );

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            businessName: user.businessName,
            currency: user.currency,
          } as any;
        } catch (error) {
          console.error('[NextAuth:authorize] Error validating credentials:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.businessName = (user as any).businessName;
        token.currency = (user as any).currency;
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.businessName) token.businessName = session.businessName;
        if (session.currency) token.currency = session.currency;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).businessName = token.businessName as string;
        (session.user as any).currency = token.currency as string;
      }
      return session;
    },
  },
};

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}
