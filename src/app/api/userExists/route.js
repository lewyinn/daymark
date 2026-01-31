import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();

        // Cari user berdasarkan email, kita hanya butuh _id-nya saja untuk validasi
        const user = await User.findOne({ email }).select("_id");

        console.log("User found: ", user);

        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error checking if user exists." },
            { status: 500 }
        );
    }
}