import connectDB from "@/lib/connectDB";
import UserModel from "@/model/user.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already registered with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      
      const newUser = await new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      
      await newUser.save();
      console.log("newUser: ", newUser);
    }
    
    const emailResponse = await sendVerificationEmail(
      email as string,
      username as string,
      verifyCode as string
    );
    
    if (!emailResponse?.success) {
      return Response.json(
        { success: false, message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: `User ${existingUserByEmail ? "with this email already registered" : "registered successfully"}, Please verify your email` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user: ", error);
    return Response.json(
      { success: false, message: "Failed to register user" },
      { status: 500 }
    );
  }
}
