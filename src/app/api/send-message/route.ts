import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, content } = await req.json();

    if(!username || !content) {
      return Response.json(
        {
          success: false,
          message: "Username and content are required",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if(!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
        content,
        createdAt: new Date(),
    }

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        messages: "Message send successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send messages",
      },
      { status: 500 }
    );
  }
}
