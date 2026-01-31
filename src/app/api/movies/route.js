import { connectMongoDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        // Ambil movie milik user yang sedang login saja
        const movies = await Movie.find({ userId: session.user.id }).sort({ updatedAt: -1 });

        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching movies" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        await connectMongoDB();

        // Tambahkan data baru dengan userId dari session
        const newMovie = await Movie.create({ ...body, userId: session.user.id });

        return NextResponse.json(newMovie, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating movie" }, { status: 500 });
    }
}