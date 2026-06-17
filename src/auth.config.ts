import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/dashboard');
      
      if (isAdminRoute) {
        if (nextUrl.pathname === '/admin/login') return true;
        if (isLoggedIn) {
          const role = (auth?.user as any)?.role || "EMPLOYEE";
          const path = nextUrl.pathname;
          
          if (role === "EMPLOYEE") {
            const allowedPaths = ['/dashboard/products', '/dashboard/orders'];
            const isAllowed = path === '/dashboard' || allowedPaths.some(p => path.startsWith(p));
            if (!isAllowed) {
              return Response.redirect(new URL('/dashboard', nextUrl));
            }
          } else if (role === "ADMIN") {
            if (path.startsWith('/dashboard/users')) {
              return Response.redirect(new URL('/dashboard', nextUrl));
            }
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
