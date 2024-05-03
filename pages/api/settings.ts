import { NextFetchEvent, NextRequest } from "next/server";
import { extractBody } from "./utils/extractBody";
import zod, { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import sqlstring from "sqlstring";
import { Pool } from "@neondatabase/serverless";

export const config = {
  runtime: "edge",
};

const createSettingsSchema = zod.object({
  settingID: z.string(), // Assuming settingID is a string UUID
  UserID: z.string(), // Assuming UserID is a string UUID
  textSize: z.number().int(), // Assuming textSize is an integer
  theme: z.string().max(10),
});

async function createSettingsHandler(req: NextRequest, event: NextFetchEvent) {
  const body = await extractBody(req);

  const { settingID, UserID, textSize, theme } =
    createSettingsSchema.parse(body);

  const userPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const userExistenceQuery = sqlstring.format(
    `SELECT userid FROM "user" WHERE userid = ?`,
    [UserID]
  );

  try {
    const { rows } = await userPool.query(userExistenceQuery);
    if (rows.length === 0) {
      // User doesn't exist, return an error response
      return new Response("User not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return new Response("Internal server error", { status: 500 });
  } finally {
    event.waitUntil(userPool.end());
  }

  const id = uuidv4();

  const createSettingsQuery = sqlstring.format(
    `INSERT INTO setting (settingid ,userid ,textsize ,theme) VALUES (?,?,?,?)`,
    [id, UserID, textSize, theme]
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query(createSettingsQuery);
    return new Response(JSON.stringify({ settingID }));
  } catch (error) {
    console.error(error);
    return new Response("Page Not Found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}
async function readSettingsHandler(req: NextRequest, event: NextFetchEvent) {
  const { searchParams } = new URL(req.url);

  const UserID = searchParams.get("userid");

  if (!UserID) {
    return new Response("Page not found", {
      status: 404,
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const getSettingsQuery = sqlstring.format(
    `SELECT settingid, textsize, theme from setting WHERE userid = ? ;`,
    [UserID]
  );

  try {
    const { rows: settingsRows } = await pool.query(getSettingsQuery);

    return new Response(JSON.stringify(settingsRows));
  } catch (error) {
    console.error(error);
    return new Response("Page not found", {
      status: 404,
    });
  } finally {
    event.waitUntil(pool.end());
  }
}

async function handler(req: NextRequest, event: NextFetchEvent) {
  if (req.method === "POST") {
    return createSettingsHandler(req, event);
  }

  if (req.method === "GET") {
    return readSettingsHandler(req, event);
  }

  return new Response("Invalid method", {
    status: 405,
  });
}

export default handler;
