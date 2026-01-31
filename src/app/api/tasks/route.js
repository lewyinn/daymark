import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
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
        // Ambil task user, urutkan berdasarkan deadline terdekat (ascending)
        const tasks = await Task.find({ userId: session.user.id }).sort({ deadline: 1 });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validasi basic
        if (!body.title || !body.deadline) {
            return NextResponse.json({ message: "Title and Deadline are required" }, { status: 400 });
        }

        await connectMongoDB();

        const newTask = await Task.create({ ...body, userId: session.user.id });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating task" }, { status: 500 });
    }
}