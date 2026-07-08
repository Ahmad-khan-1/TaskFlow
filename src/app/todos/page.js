import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/Todo";
import TodoList from "@/components/todo-list";
import Navbar from "@/components/navbar";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);

  await connectDB();
  const todos = await Todo.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar userName={session.user.name} />
      <div className="px-4 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Todos
          </h1>
          <TodoList
            initialTodos={JSON.parse(JSON.stringify(todos))}
            userId={session.user.id}
          />
        </div>
      </div>
    </div>
  );
}
