import { NextRequest } from "next/server";

export async function extractBody(req: NextRequest | Response) {
  if (!req.body) {
    console.error("No body received");
    return null; // Return null for no body received
  }

  const decoder = new TextDecoder();
  const reader = req.body?.getReader();
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (body.trim() === "") {
        console.error("Received empty body");
        return null; // Return null for empty body
      }

      console.log("Received body:", body);
      try {
        return JSON.parse(body);
      } catch (error) {
        console.error("Error parsing body as JSON:", error);
        return null; // Return null for invalid JSON
      }
    }

    body = body + decoder.decode(value);
  }
}
