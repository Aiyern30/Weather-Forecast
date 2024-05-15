import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "@neondatabase/serverless";
import { NextFetchEvent, NextRequest } from "next/server";
import zod, { object, string } from "zod";
import sqlstring from "sqlstring";
import { v4 as uuidv4 } from "uuid";
import { extractBody } from "./utils/extractBody";

export const config = {
  runtime: "edge",
};

// Validation
const schema = zod.object({
  username: string().max(64).min(1),
  password: string().max(64).min(8).optional(),
  email: string().max(255).email(),
  // phone: string().max(20).min(1).optional(),
  // picture: string().optional(),
  // userid: string().uuid().optional(),
});

async function loginUser(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);

  const { email, password, username } = schema.parse(body);
  console.log(email, password, username);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Query the database to find the user with the provided email
  const getUserQuery = sqlstring.format(
    `SELECT * FROM "user" WHERE email = ? and username = ?;`,
    [email, username]
  );
  console.log("getUserQuery", getUserQuery);

  try {
    const { rows } = await pool.query(getUserQuery);

    if (rows.length === 0) {
      const errorMessage = JSON.stringify({
        message: "Invalid email or password",
      });
      return new Response(errorMessage, { status: 401 });
    }

    const user = rows[0];

    if (user.password !== password) {
      const errorMessage = JSON.stringify({
        message: "Invalid email or password",
      });
      return new Response(errorMessage, { status: 401 });
    }

    const successMessage = JSON.stringify({ message: "Login successful" });
    return new Response(successMessage, { status: 200 });
  } catch (error) {
    console.error("Error querying database:", error);
    const errorMessage = JSON.stringify({ message: "Internal server error" });
    return new Response(errorMessage, { status: 500 });
  }
}

export default async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method === "POST") {
    return loginUser(req, event);
  }
}
