import db from "../../../db/index";

export interface EmailAddress {
  email_address: string;
  id: string;
}

export interface UserData {
  id: string;
  email_addresses: EmailAddress[];
  username?: string;
}

export interface CreateUserEvent {
  type: string;
  data: UserData;
}


//clerk webhook listener
export async function POST(request: Request) {
  const payload: CreateUserEvent = await request.json();
  console.log({ payload });

  if (!payload) {
    return Response.json({ message: "No payload" });
  }

  if (payload.type === "user.created") {
    const email = payload.data.email_addresses[0].email_address;
    const user = await db.user.create({
      data: {
        user_id: payload.data.id,
        email: email,
        name: payload.data.username || email,
      },
    });
    console.log({ user });

    if (!user) {
      return Response.json({ message: "Error creating user" });
    }
    return Response.json({ message: "Received" });
  }

  return Response.json({ message: "Invalid payload" }, { status: 400 });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
