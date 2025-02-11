import { NextResponse } from "next/server";
import clientPromise from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const result = await db.collection('todos').findOneAndUpdate(
    {
      _id: new ObjectId(params.id),
      userId: new ObjectId(user.userId as string)
    },
    {
      $set: {
        title,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    return new NextResponse("Todo not found", { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('todos').deleteOne({
    _id: new ObjectId(params.id),
    userId: new ObjectId(user.userId as string)
  });

  if (result.deletedCount === 0) {
    return new NextResponse("Todo not found", { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}