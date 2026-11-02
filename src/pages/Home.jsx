import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextSkip, setNextSkip] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestId = useRef(0);
  const retryRequest = useRef({ skip: 0, query: '' });

  const fetchRecipes = useCallback(async (skipCount, searchQuery) => {
    const currentRequest = ++requestId.current;
    const isFirstPage = skipCount === 0;
    retryRequest.current = { skip: skipCount, query: searchQuery };
    setErrorMsg('');
    if (isFirstPage) {
      setLoading(true);
      setRecipes([]);
      setTotal(0);
      setNextSkip(0);
    }
    else setLoadingMore(true);

    try {
      const endpoint = searchQuery
        ? 'https://dummyjson.com/recipes/search'
        : 'https://dummyjson.com/recipes';
      const params = new URLSearchParams({
        limit: '6',
        skip: String(skipCount),
      });
      if (searchQuery) params.set('q', searchQuery);

      const { data } = await axios.get(`${endpoint}?${params.toString()}`);
      if (currentRequest !== requestId.current) return;

      setRecipes((previous) =>
        isFirstPage ? data.recipes : [...previous, ...data.recipes],
      );
      setTotal(data.total);
      setNextSkip(skipCount + data.recipes.length);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      console.error('Could not fetch recipes:', error);
      setErrorMsg('Recipes could not be loaded. Please try again.');
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) fetchRecipes(0, '');
    });
    return () => {
      active = false;
      requestId.current += 1;
    };
  }, [fetchRecipes]);

  function handleSearch(event) {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setQuery(nextQuery);
    fetchRecipes(0, nextQuery);
  }

  function clearSearch() {
    setSearchInput('');
    setQuery('');
    fetchRecipes(0, '');
  }

  function loadMore() {
    if (!loadingMore && !loading && nextSkip < total) {
      fetchRecipes(nextSkip, query);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <section className="relative my-6 overflow-hidden rounded-3xl bg-[#f0e2d2] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/30" />
        <div className="relative max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Find your next favorite
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-text sm:text-5xl">
            Good food starts with a good recipe.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Discover simple, delicious ideas for every meal and make something worth sharing.
          </p>

          <form onSubmit={handleSearch} className="mt-7 flex max-w-xl gap-2 rounded-2xl bg-card p-2 shadow-sm">
            <label className="sr-only" htmlFor="recipe-search">Search recipes</label>
            <input
              id="recipe-search"
              name="search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Try “pasta” or “breakfast”"
              className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-text outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section aria-labelledby="recipes-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              {query ? 'Search results' : 'Made for you'}
            </p>
            <h2 id="recipes-heading" className="font-serif text-2xl font-bold text-text sm:text-3xl">
              {query ? `Recipes for “${query}”` : 'Explore recipes'}
            </h2>
          </div>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Clear search
            </button>
          )}
        </div>

        {errorMsg && (
          <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => fetchRecipes(retryRequest.current.skip, retryRequest.current.query)}
              className="ml-2 font-bold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading recipes">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-52 animate-pulse bg-border" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-border" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-border" />
                  <div className="h-4 w-full animate-pulse rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            {nextSkip < total && (
              <div className="mt-9 text-center">
                <button
                  onClick={loadMore}
                  type="button"
                  disabled={loadingMore}
                  className="rounded-full border border-accent px-7 py-3 font-semibold text-accent transition hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingMore ? 'Loading recipes…' : 'Load more recipes'}
                </button>
              </div>
            )}
          </>
        ) : (
          !errorMsg && (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <p className="mb-3 text-4xl" aria-hidden="true">🥣</p>
              <h3 className="font-serif text-xl font-bold text-text">No recipes found</h3>
              <p className="mt-2 text-muted">Try another search to find something delicious.</p>
            </div>
          )
        )}
      </section>
    </main>
  );
}

export default Home;
