import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/db';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username } = userSchema.parse(body);

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists (both email and username)
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      username,
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}