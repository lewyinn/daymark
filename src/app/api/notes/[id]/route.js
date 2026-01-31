import { connectMongoDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectMongoDB();

        // 1. Cari Note dulu
        const note = await Note.findById(id);
        if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

        // 2. Hapus gambar dari Cloudinary
        if (note.images && note.images.length > 0) {
            const publicIds = note.images.map(img => img.publicId);
            if (publicIds.length > 0) {
                await cloudinary.api.delete_resources(publicIds);
            }
        }

        // 3. Hapus Note dari DB
        await Note.findByIdAndDelete(id);

        return NextResponse.json({ message: "Note deleted" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error deleting note" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const newFiles = formData.getAll("newImages"); // File baru yg diupload
        const existingImagesJson = formData.get("existingImages"); // Gambar lama yg dipertahankan (JSON string)

        let finalImages = [];

        // A. Proses Gambar Lama
        if (existingImagesJson) {
            finalImages = JSON.parse(existingImagesJson);
        }

        await connectMongoDB();
        const oldNote = await Note.findById(id);

        // B. Cek Gambar Terhapus (Logic: Ada di DB lama, tapi gak ada di finalImages)
        // Ini agar Cloudinary bersih dari sampah
        const oldImages = oldNote.images || [];
        const imagesToDelete = oldImages.filter(
            oldImg => !finalImages.some(finalImg => finalImg.publicId === oldImg.publicId)
        );

        if (imagesToDelete.length > 0) {
            const idsToDelete = imagesToDelete.map(img => img.publicId);
            await cloudinary.api.delete_resources(idsToDelete);
        }

        // C. Upload Gambar Baru
        for (const file of newFiles) {
            if (file instanceof File) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

                const result = await cloudinary.uploader.upload(base64Image, {
                    folder: "daymark_notes",
                });

                finalImages.push({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        // D. Update DB
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, images: finalImages },
            { new: true }
        );

        return NextResponse.json(updatedNote);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error updating note" }, { status: 500 });
    }
}