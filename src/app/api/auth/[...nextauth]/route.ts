import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "../../../../api/auth/api-requests/login_user";
import { AuthOptions } from "next-auth";

import { jwtCallback, sessionCallback } from "../../utils/authCallback";

// Опции для NextAuth
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // эта функция автоматически вызывается библиотекой next auth
      async authorize(credentials) {
        // Логика авторизации
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const loginResponse = await loginUser(
          credentials?.email,
          credentials?.password
        );

        // Если авторизация успешна, возвращаем пользователя
        if (loginResponse) {
          return {
            id:
              typeof loginResponse.id == "string"
                ? loginResponse.id
                : loginResponse.id.toString(),
            name: loginResponse.name,
            email: loginResponse.email,
          };
        }

        // Если авторизация не удалась
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return jwtCallback({ token, user }); // Используйте вынесенный коллбэк
    },
    async session({ session, token }) {
      return sessionCallback({ session, token }); // Используйте вынесенный коллбэк
    },
  },

  cookies: {
    sessionToken: {
      name: "next-auth.token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 12 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
