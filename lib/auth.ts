import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user?.hashedPassword) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
          });

          return {
            id: user._id.toString(),
            email: user.email,
            roles: user.roles,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.roles = user.roles;
      }
      
      // Handle OAuth sign-in
      if (account?.provider === 'google' && user?.email) {
        try {
          await connectDB();
          
          let dbUser = await User.findOne({ email: user.email.toLowerCase() });
          
          if (!dbUser) {
            // Create new user
            dbUser = await User.create({
              email: user.email.toLowerCase(),
              emailVerified: new Date(),
              lastLoginAt: new Date(),
            });
          } else {
            // Update last login
            await User.findByIdAndUpdate(dbUser._id, {
              lastLoginAt: new Date(),
            });
          }
          
          token.id = dbUser._id.toString();
          token.roles = dbUser.roles;
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider === 'google') {
        console.log('New user signed up:', user.email);
      }
    },
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      roles: string[];
    } & DefaultSession['user'];
  }
  
  interface User {
    id: string;
    email: string;
    roles: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: string[];
  }
}
