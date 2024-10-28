import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {_id: "$_id", messages: { $push: "$messages" }},
      }
    ]);

    if(!user || user.length === 0) {
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 404 }
          );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting message acceptance status: ", error);
    return Response.json(
      {
        success: false,
        message: "Error getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
