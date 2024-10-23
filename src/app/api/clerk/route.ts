import { Prisma } from "@prisma/client";
import db from "../../../db/index";

interface EmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUser {
  id: string;
  email_addresses: EmailAddress[];
  username?: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUser;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ClerkWebhookEvent;

    if (!payload) {
      return Response.json({ message: "No payload" });
    }

    if (payload.type === "user.created") {
      const email = payload.data.email_addresses[0].email_address;

      const userData: Prisma.UserCreateInput = {
        user_id: payload.data.id,
        email: email,
        name: payload.data.username || email,
      };

      const user = await db.user.create({
        data: userData,
      });

      if (!user) {
        return Response.json({ message: "Error creating user" });
      }

      return Response.json({ message: "Received" });
    }

    return Response.json({ message: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
