import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetArtistsBaseDataQuery } from "../../../store/api/artists.api";

export const SearchInput = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: artists = [] } = useGetArtistsBaseDataQuery();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredArtists = debouncedQuery.trim() ? artists
    .filter((artist) =>
      artist.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
    .slice(0, 5) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleArtistSelect = (artist: { id: string; name: string }) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setShowMobileSearch(false);
    router.push(`/artist?id=${artist.id}`);
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:block relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
          className="pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {showSuggestions && filteredArtists.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {filteredArtists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleArtistSelect(artist)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                {artist.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="md:hidden p-2 text-gray-900 dark:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-gray-900 z-50" style={{ marginInlineEnd: 0 }}>
          <div className="flex items-center space-x-2 p-4 mb-4">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-gray-900 dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={handleInputChange}
              autoFocus
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="px-4">
            {debouncedQuery.trim() && filteredArtists.length > 0 && (
              <div className="space-y-2">
              {filteredArtists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => handleArtistSelect(artist)}
                  className="w-full text-left px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {artist.name}
                </button>
              ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
