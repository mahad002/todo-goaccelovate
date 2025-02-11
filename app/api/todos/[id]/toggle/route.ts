import { NextResponse } from "next/server";
import clientPromise from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { completed } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('todos').findOneAndUpdate(
    {
      _id: new ObjectId(params.id),
      userId: new ObjectId(user.userId as string)
    },
    {
      $set: {
        completed,
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