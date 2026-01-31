import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await connectMongoDB();

        const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json({ message: "Error updating task" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectMongoDB();
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
    }
}