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
  phone: string().max(20).min(1).optional(),
  picture: string().optional(),
  userid: string().uuid(),
});

const updateUserWithPasswordSchema = object({
  userid: string().uuid(),
  password: string().max(64).min(8),
  newPassword: string().max(64).min(8),
});

async function createUserHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);

  const { username, password, email, phone, picture } = schema.parse(body);

  console.log(body);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const userId = uuidv4();

  const sql = sqlstring.format(
    ` INSERT INTO "user" (userid, username, password, email, noph, picture) 
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    [userId, username, password, email, phone, picture]
  );

  console.log("sql", sql);

  await pool.query(sql);

  event.waitUntil(pool.end());

  return new Response(
    JSON.stringify({ username, password, email, phone, picture }),
    {
      status: 200,
    }
  );
}

async function readUserHandler(req: NextRequest, event: NextFetchEvent) {
  const { searchParams } = new URL(req.url);
  const UserID = searchParams.get("userid");

  if (!UserID) {
    return new Response("Page Not found", {
      status: 404,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getUserQuery = sqlstring.format(
    `SELECT * from "user" WHERE userid = ? ;`,
    [UserID]
  );

  console.log("getUserQuery", getUserQuery);

  try {
    const { rows: userRows } = await pool.query(getUserQuery);

    return new Response(JSON.stringify(userRows));
  } catch (error) {
    console.log(error);
    return new Response("Page Not Found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

async function updateUserHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);
  console.log("body1", body);

  const { username, email, phone, picture, userid } = schema.parse(body);

  if (!userid) {
    return new Response("UserID not provided", {
      status: 400,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const updateUserQuery = sqlstring.format(
    `UPDATE "user" SET username = ?, email = ?, noph = ?, picture = ? WHERE userid = ?;`,
    [username, email, phone, picture, userid]
  );

  console.log("updateUserQuery", updateUserQuery);

  try {
    await pool.query(updateUserQuery);

    // Fetch and return the updated user data
    const updatedUserDataQuery = sqlstring.format(
      `SELECT * from "user" WHERE userid = ?;`,
      [userid]
    );
    const { rows: updatedUserRows } = await pool.query(updatedUserDataQuery);
    console.log("updatedUserRows", updatedUserRows);

    return new Response(JSON.stringify(updatedUserRows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update user", {
      status: 500,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

async function updatePasswordHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);
  console.log("body!!!", body);

  const { password, newPassword, userid } =
    updateUserWithPasswordSchema.parse(body);
  if (!userid) {
    return new Response("UserID not provided", {
      status: 400,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Fetch the user data
    const userDataQuery = sqlstring.format(
      `SELECT password from "user" WHERE userid = ?;`,
      [userid]
    );

    console.log("userDataQuery", userDataQuery);
    const { rows: userRows } = await pool.query(userDataQuery);

    console.log("userRows", userRows);

    if (userRows.length === 0) {
      return new Response("User not found", {
        status: 404,
      });
    }

    const user = userRows[0];
    console.log("user", user);

    // Check if the current password matches the password stored in the database
    if (user.password !== password) {
      return new Response("Current password is incorrect", {
        status: 400,
      });
    }

    // Update the password
    const updatePasswordQuery = sqlstring.format(
      `UPDATE "user" SET password = ? WHERE userid = ?;`,
      [newPassword, userid]
    );

    console.log(updatePasswordQuery);
    await pool.query(updatePasswordQuery);

    return new Response("Password updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update password", {
      status: 500,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

export default async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method === "POST") {
    return createUserHandler(req, event);
  }

  if (req.method === "GET") {
    return readUserHandler(req, event);
  }

  if (req.method === "PUT") {
    return updateUserHandler(req, event);
  }

  if (req.method === "PATCH") {
    return updatePasswordHandler(req, event);
  }

  return new Response("invalid method", {
    status: 405,
  });
}
