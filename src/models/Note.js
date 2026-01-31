import mongoose, { Schema, models } from "mongoose";

const noteSchema = new Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String, default: "" },
        // Array of image objects
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true }, // Penting untuk delete
            }
        ],
    },
    { timestamps: true }
);

const Note = models.Note || mongoose.model("Note", noteSchema);
export default Note;