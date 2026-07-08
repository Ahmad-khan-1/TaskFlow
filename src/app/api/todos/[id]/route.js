import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/Todo";

// GET — ek specific todo fetch karo
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // <-- yahan await lagaya

    const todo = await Todo.findById(id);

    if (!todo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ todo });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT — todo update karo
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // <-- yahan bhi
    const body = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: "after" },
    );

    if (!updatedTodo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ message: "Todo updated", todo: updatedTodo });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — todo delete karo
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // <-- yahan bhi

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ message: "Todo deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
