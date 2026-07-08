import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/Todo";

// GET — sab todos fetch karo
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    return Response.json({ todos });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST — naya todo banao
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.title || !body.userId) {
      return Response.json(
        { error: "Title and userId are required" },
        { status: 400 },
      );
    }

    const newTodo = await Todo.create({
      title: body.title,
      description: body.description,
      priority: body.priority,
      dueDate: body.dueDate,
      userId: body.userId,
    });

    return Response.json(
      { message: "Todo created", todo: newTodo },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
