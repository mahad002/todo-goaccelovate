import { NextResponse } from "next/server";
import clientPromise from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const todos = await db.collection('todos').find({
    userId: new ObjectId(user.userId as string)
  }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const user = await getUser();
  
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title } = await req.json();

  if (!title) {
    return new NextResponse("Title is required", { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const todo = await db.collection('todos').insertOne({
    title,
    completed: false,
    userId: new ObjectId(user.userId as string),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return NextResponse.json({
    id: todo.insertedId,
    title,
    completed: false,
    userId: user.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}