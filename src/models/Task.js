import mongoose, { Schema, models } from "mongoose";

const taskSchema = new Schema(
    {
        userId: { type: String, required: true }, // Relasi ke User
        title: { type: String, required: true },
        description: { type: String, default: "" },
        deadline: { type: Date, required: true },
        status: { type: String, default: "pending" }, // pending, completed
        priority: { type: String, default: "medium" }, // low, medium, high
        reminders: { type: [Number], default: [] }, // Array of minutes (e.g. [60, 1440])
        remindersSent: { type: [Number], default: [] },
    },
    { timestamps: true }
);

const Task = models.Task || mongoose.model("Task", taskSchema);
export default Task;