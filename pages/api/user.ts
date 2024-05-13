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
  userid: string().uuid().optional(),
});

const updateUserWithPasswordSchema = object({
  userid: string().uuid(),
  password: string().max(64).min(8),
  newPassword: string().max(64).min(8),
});

// async function loginUser(req: NextRequest, event: NextFetchEvent) {
//   const body = await extractBody(req);

//   const { email, password, username } = body;
//   console.log(email, password, username);

//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

//   // Query the database to find the user with the provided email
//   const getUserQuery = sqlstring.format(
//     `SELECT * FROM users WHERE email = ? and username = ?;`,
//     [email, username]
//   );
//   console.log("getUserQuery", getUserQuery);

//   try {
//     const { rows } = await pool.query(getUserQuery);

//     if (rows.length === 0) {
//       const errorMessage = JSON.stringify({
//         message: "Invalid email or password",
//       });
//       return new Response(errorMessage, { status: 401 });
//     }

//     const user = rows[0];

//     if (user.password !== password) {
//       const errorMessage = JSON.stringify({
//         message: "Invalid email or password",
//       });
//       return new Response(errorMessage, { status: 401 });
//     }

//     const successMessage = JSON.stringify({ message: "Login successful" });
//     return new Response(successMessage, { status: 200 });
//   } catch (error) {
//     console.error("Error querying database:", error);
//     const errorMessage = JSON.stringify({ message: "Internal server error" });
//     return new Response(errorMessage, { status: 500 });
//   }
// }

async function createUserHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);

  const { username, password, email, phone, picture } = schema.parse(body);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Check if the username, email, or phone number already exists in the database
    const checkExistingUserQuery = sqlstring.format(
      `SELECT * FROM "user" WHERE username = ? OR email = ? OR noph = ?;`,
      [username, email, phone]
    );

    const { rows: existingUsers } = await pool.query(checkExistingUserQuery);

    if (existingUsers.length > 0) {
      // At least one of username, email, or phone number already exists
      const duplicateFields = existingUsers
        .map((user) => {
          if (user.username === username) return "username";
          if (user.email === email) return "email";
          if (user.noph === phone) return "phone";
          return null;
        })
        .filter((field) => field !== null);

      return new Response(
        JSON.stringify({
          message: `The following fields are already registered: ${duplicateFields.join(
            ", "
          )}`,
        }),
        { status: 400 }
      );
    }

    // No duplicate entries found, proceed with user creation
    const userId = uuidv4();

    const sql = sqlstring.format(
      `INSERT INTO "user" (userid, username, password, email, noph, picture) 
      VALUES (?, ?, ?, ?, ?, ?);`,
      [userId, username, password, email, phone, picture]
    );

    await pool.query(sql);

    return new Response(JSON.stringify({ username, email, phone, picture }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ message: "Failed to create user" }), {
      status: 500,
    });
  } finally {
    event.waitUntil(pool.end());
  }
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

  // if (req.method === "POST") {
  //   return loginUser(req, event);
  // }

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
