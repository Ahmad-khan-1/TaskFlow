import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    // Check karo ke email already exist to nahi karti
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User already exists with this email" },
        { status: 400 },
      );
    }

    // Password ko hash karo (10 = salt rounds, security strength)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // asli password nahi, hashed version save hoga
    });

    return Response.json(
      { message: "User created successfully", userId: newUser._id },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
