import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  trustHost: true,
  providers: [], // We'll add the actual provider in auth.ts
  pages: {
    signIn: '/connexion',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = isLoggedIn && auth.user?.role === 'ADMIN';
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isAuthPage = nextUrl.pathname.startsWith('/admin/login');

      if (isOnAdmin) {
        if (isAuthPage) {
          if (isAdmin) return Response.redirect(new URL('/admin', nextUrl));
          return true;
        }
        if (isAdmin) return true;

        const loginUrl = new URL('/admin/login', nextUrl);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
} satisfies NextAuthConfig;
