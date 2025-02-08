import fs from "fs";
import { logto } from "~/auth.server";
import type { Route } from "./+types/grant-access";
import { redirect } from "react-router";

interface SpotifyGrantAccess {
  access_token: string;
  expires_in: number;
}

const clientId = process.env.SPOTIFY_CLIENT_ID!;
let clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";

if (process.env.NODE_ENV === "production") {
  const path = process.env.SPOTIFY_SECRET_FILE || "/run/secrets/spotify-secret";

  try {
    clientSecret = fs.readFileSync(path, "utf8").trim();
  } catch {
    throw new Error("Missing SPOTIFY_CLIENT_SECRET secret");
  }
}

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify client ID or secret");
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const response = await fetch(
    "https://accounts.spotify.com/api/token?grant_type=client_credentials",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, expires_in }: SpotifyGrantAccess = await response.json();
  return Response.json({
    access_token,
    expires_in: Date.now() + expires_in * 1000,
  });
}
