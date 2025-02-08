import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { AudioLines } from "lucide-react";
import { useFetcher } from "react-router";

export const SpotifySearch = ({
  getToken,
}: {
  getToken: () => Promise<string>;
}) => {
  const fetcher = useFetcher();
  const abortController = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [debounced] = useDebounce(query, 500);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (abortController.current) abortController.current.abort();
    if (!debounced) return;

    abortController.current = new AbortController();
    const accessToken = await getToken();

    const params = new URLSearchParams({
      type: "track",
      limit: "5",
      q: query,
    });

    const url = `https://api.spotify.com/v1/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
      signal: abortController.current.signal,
    });

    const search = await response.json();
    setResults(search.tracks.items);
  };

  useEffect(() => {
    if (!debounced) setResults([]);
    handleSearch().catch(console.error);
  }, [debounced]);

  const addSong = async (track: any) => {
    const accessToken = await getToken();
    let artist = track.artists.at(0).name;

    const params = new URLSearchParams({
      type: "artist",
      limit: "1",
      q: artist,
    });

    const url = `https://api.spotify.com/v1/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const search = await response.json();
    const images = search.artists.items.at(0).images;

    const body = {
      id: track.id,
      name: track.name,
      pictureUrl: track.album.images.at(0).url,
      spotifyUrl: track.external_urls.spotify,
      popularity: track.popularity,
      duration: track.duration_ms,
      album: track.album.name,
      artistUrl: images.at(0).url,
      artist,
    };

    fetcher.submit(body, { action: "/music/handle-song", method: "post" });
    setQuery("");
    setResults([]);
  };

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
            className={`bg-sky-950 p-3 border-b border-slate-700 cursor-pointer
              ${i === 0 ? "rounded-t-3xl" : ""}
              ${i === results.length - 1 ? "rounded-b-3xl" : ""}`}
            initial={{ translateY: -10 * i }}
            animate={{ translateY: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => addSong(track)}
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
