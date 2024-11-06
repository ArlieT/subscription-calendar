import { NextResponse } from 'next/server';
import prisma from "../../../db/prisma";

interface EmailAddress {
  email_address: string;
  id: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: EmailAddress[];
    username?: string | null;
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ClerkWebhookEvent;

    if (!payload) {
      return NextResponse.json({ message: "No payload" });
    }

    if (payload.type === "user.created") {
      const email = payload.data.email_addresses[0].email_address;

      // Simplified user creation
      const user = await prisma.user.create({
        data: {
          user_id: payload.data.id,
          email: email,
          name: payload.data.username || email
        }
      });

      console.log('Created user:', user);

      return NextResponse.json({
        message: "User created successfully",
        user: user
      });
    }

    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello World!" });
}
