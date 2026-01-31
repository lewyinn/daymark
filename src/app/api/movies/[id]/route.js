import { connectMongoDB } from "@/lib/mongodb";
import Movie from "@/models/Movie";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
    // 👇 PERBAIKAN DI SINI: Tambahkan 'await' sebelum params
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await connectMongoDB();

        // Update dan kembalikan data baru
        const updatedMovie = await Movie.findByIdAndUpdate(id, body, { new: true });

        if (!updatedMovie) {
            return NextResponse.json({ message: "Movie not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMovie);
    } catch (error) {
        console.log(error); // Log error biar kelihatan di terminal
        return NextResponse.json({ message: "Error updating movie" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    // 👇 PERBAIKAN DI SINI: Tambahkan 'await' sebelum params
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectMongoDB();
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return NextResponse.json({ message: "Movie not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie deleted" });
    } catch (error) {
        console.log(error); // Log error biar kelihatan di terminal
        return NextResponse.json({ message: "Error deleting movie" }, { status: 500 });
    }
}