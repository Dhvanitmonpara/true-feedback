import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import VerificationEmail from "../../emails/verificationEmail";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    const mailOptions = {
      from: "nextauth@gmail.com",
      to: email,
      subject: "Verification code for True Feedback",
      html: emailHtml,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return { ...mailResponse, success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
      return { success: false, message: error.message };
    } else {
      console.error("Unknown error sending email:", error);
      return { success: false, message: "Unknown error occurred" };
    }
  }
};
