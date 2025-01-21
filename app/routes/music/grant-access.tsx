import { logto } from "~/auth.server";
import type { Route } from "./+types/grant-access";
import { redirect } from "react-router";

interface SpotifyGrantAccess {
  access_token: string;
  expires_in: number;
}

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;

if (!client_id || !client_secret) {
  throw new Error("Missing Spotify client ID or secret");
}

export async function loader({ request }: Route.LoaderArgs) {
  const context = await logto.getContext({})(request);

  if (!context.isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  const auth = Buffer.from(client_id + ":" + client_secret).toString("base64");
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

  let { access_token, expires_in }: SpotifyGrantAccess = await response.json();
  return Response.json({
    access_token,
    expires_in: Date.now() + expires_in * 1000,
  });
}
