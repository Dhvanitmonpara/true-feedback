import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schema/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {

    // This is valid for pages router
//   if (request.method !== "GET") {
//     return Response.json(
//       {
//         success: false,
//         message: "Invalid request method",
//       },
//       { status: 405 }
//     );
//   }

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query params",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error checking username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
