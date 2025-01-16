import { useEffect, useRef, useState, type RefObject } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { AudioLines } from "lucide-react";

interface SpotifyGrantAccess {
  access_token: string;
  expires_in: number;
}

const grant_type = "client_credentials";
const client_id = "3433502d2fb94c7d9829be06efceda4b";
const client_secret = "703f9014ee2c410b996558ad2f008208";

const requestAccessToken = async () => {
  const params = new URLSearchParams({ grant_type, client_id, client_secret });
  const url = `https://accounts.spotify.com/api/token?${params.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  let { access_token, expires_in }: SpotifyGrantAccess = await response.json();
  return { access_token, expires_in: Date.now() + expires_in * 1000 };
};

const isAccessTokenExpired = (
  credentials: RefObject<SpotifyGrantAccess | null>
) => !credentials.current || Date.now() > credentials.current.expires_in;

export const SpotifySearch = () => {
  const credentials = useRef<SpotifyGrantAccess | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [debounced] = useDebounce(query, 500);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }

    const handleSearch = async () => {
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();

      if (isAccessTokenExpired(credentials)) {
        credentials.current = await requestAccessToken();
      }

      // Search for songs
      const params = new URLSearchParams({
        type: "track",
        limit: "5",
        q: query,
      });

      const url = `https://api.spotify.com/v1/search?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + credentials.current?.access_token,
        },
        signal: abortController.current.signal,
      });

      const searchData = await response.json();
      console.log(searchData);

      setResults(searchData.tracks.items);
    };

    handleSearch().catch(console.error);
  }, [debounced]);

  return (
    <div className="relative">
      <div className="w-full flex flex-row items-center gap-x-3">
        <AudioLines className="size-8 text-slate-300" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Añade tus canciones favoritas..."
          className="border-slate-300 placeholder:text-slate-300 placeholder:text-xs placeholder:opacity-75 rounded-3xl text-white font-semibold italic text-sm"
        />
      </div>
      <motion.ul className="absolute z-10 mt-2 text-white rounded-3xl">
        {results.map((track: any, i) => (
          <motion.li
            key={track.id}
            className={`bg-sky-950 p-3 border-b border-slate-700
              ${i === 0 ? "rounded-t-3xl" : ""}
              ${i === results.length - 1 ? "rounded-b-3xl" : ""}`}
            initial={{ translateY: -10 * i }}
            animate={{ translateY: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => {}}
          >
            <div className="flex flex-row gap-x-3">
              <img
                className="w-1/5 rounded-md"
                src={track.album.images.at(0).url}
              />
              <div className="w-3/5 flex flex-col">
                <span className="font-semibold">{track.name}</span>
                <span className="text-xs font-bold text-gray-400">
                  {track.artists.map((artist: any) => artist.name).join(", ")}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
