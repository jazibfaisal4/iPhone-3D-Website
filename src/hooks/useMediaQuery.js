import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for responsive media queries.
 * Returns true when the viewport matches the given query string.
 * 
 * @param {string} query - CSS media query string, e.g. '(max-width: 760px)'
 * @returns {boolean}
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 760px)');
 */
const useMediaQuery = (query) => {
  const getMatch = useCallback(() => window.matchMedia(query).matches, [query]);
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Modern browsers
    mql.addEventListener('change', handler);
    // Sync in case the query changed
    setMatches(mql.matches);

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;
