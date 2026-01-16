import { Suspense } from "react";
import { Artist } from "./Artist/Artist";

export default function ArtistPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Artist></Artist>
    </Suspense>
  );
}
