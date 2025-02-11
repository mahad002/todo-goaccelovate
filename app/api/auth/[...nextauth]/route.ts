import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      if (account?.provider === 'google') {
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', user.email)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert([
            {
              email: user.email,
              name: user.name,
              avatar_url: user.image
            }
          ]);
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        session.user.id = user?.id;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };