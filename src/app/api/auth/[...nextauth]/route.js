import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = { 
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in",
    },
    // 👇 BAGIAN INI YANG KITA UPDATE 👇
    callbacks: {
        async jwt({ token, user }) {
            // Callback ini jalan saat user login pertama kali
            // 'user' berisi data mentah dari database (return dari authorize di atas)
            if (user) {
                token.id = user._id;
                token.username = user.username; // Kita simpan field 'username' ke dalam token
            }
            return token;
        },
        async session({ session, token }) {
            // Callback ini jalan setiap kali session dicek di frontend
            if (token) {
                session.user.id = token.id;
                // Kita mapping: session.user.name DIISI DENGAN token.username
                session.user.name = token.username; 
                session.user.email = token.email;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };