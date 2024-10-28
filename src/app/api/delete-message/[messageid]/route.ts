import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request, {params}: {params: {messageid: string}}) {

  const messageId = params.messageid
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

  try {
    
    const updatedResult = await UserModel.updateOne(
      {
        _id: user._id
      },
      {
        $pull: {
          messages: {
            _id: messageId
          }
        }
      }
    )

    if(updatedResult.modifiedCount == 0){
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    );
  }
}
