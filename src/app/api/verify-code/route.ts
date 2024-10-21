import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, code } = await request.json();

    const result = verifySchema.safeParse({ code });

    if (!result.success) {
      const verifyCodeErrors = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message: verifyCodeErrors[0],
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code is expired, Please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
