import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
  const prompt =
    "Create a list of three open-ended and and engaging question formatted as a string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead on universal that encourage friendly interactions. For example, your output should be structured like this: 'What's a simple hobby you're recently started?||If you could have dinner with ay historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";

  try {
    const { text } = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      prompt: prompt,
    });

    return Response.json(
      {
        success: true,
        message: text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error generating text", error);
    return Response.json(
      {
        success: false,
        message: "Error generating text",
      },
      { status: 500 }
    );
  }
}
