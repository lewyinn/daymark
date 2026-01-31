import { connectMongoDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectMongoDB();
        const notes = await Note.find({ userId: session.user.id }).sort({ updatedAt: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching notes" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const files = formData.getAll("images"); // Ambil semua file

        // 1. Upload ke Cloudinary
        const uploadedImages = [];

        for (const file of files) {
            if (file instanceof File) {
                // Convert file ke buffer lalu ke base64 agar bisa diupload via API
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

                const result = await cloudinary.uploader.upload(base64Image, {
                    folder: "daymark_notes", // Nama folder di cloudinary
                });

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        // 2. Simpan ke MongoDB
        await connectMongoDB();
        const newNote = await Note.create({
            userId: session.user.id,
            title,
            content,
            images: uploadedImages
        });

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error creating note" }, { status: 500 });
    }
}