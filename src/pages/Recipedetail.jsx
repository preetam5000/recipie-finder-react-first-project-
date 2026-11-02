import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

function Recipedetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecipe() {
      setLoading(true);
      setError('');
      setRecipe(null);
      setCheckedIngredients([]);

      try {
        const { data } = await axios.get(
          `https://dummyjson.com/recipes/${encodeURIComponent(id)}`,
          { signal: controller.signal },
        );
        setRecipe(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError.response?.status === 404
            ? 'We could not find that recipe.'
            : 'We could not load this recipe. Please check your connection and try again.',
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchRecipe();
    return () => controller.abort();
  }, [id]);

  function toggleIngredient(index) {
    setCheckedIngredients((checked) =>
      checked.includes(index)
        ? checked.filter((item) => item !== index)
        : [...checked, index],
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12" aria-live="polite">
        <div className="mb-8 h-5 w-32 animate-pulse rounded bg-border" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-border md:h-[30rem]" />
          <div className="space-y-5 py-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-border" />
            <div className="h-28 animate-pulse rounded-2xl bg-border" />
          </div>
        </div>
        <p className="sr-only">Loading recipe…</p>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="mb-3 text-5xl" aria-hidden="true">🍽️</p>
        <h1 className="mb-2 font-serif text-3xl font-bold text-text">
          Recipe unavailable
        </h1>
        <p className="mx-auto mb-7 max-w-md text-muted">
          {error || 'We could not find that recipe.'}
        </p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Browse recipes
        </Link>
      </main>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const mealTypes = Array.isArray(recipe.mealType) ? recipe.mealType : [];
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
            <path d="M20 12H9" />
          </svg>
          All recipes
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-text transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M7 14h10v7H7z" />
          </svg>
          Print recipe
        </button>
      </div>

      <section className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid-cols-2">
        <div className="relative min-h-72 bg-border md:min-h-[34rem]">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            {[recipe.cuisine, recipe.difficulty].filter(Boolean).map((label) => (
              <span key={label} className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-text shadow-sm">
                {label}
              </span>
            ))}
          </div>
          <p className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-text">
            ★ <span className="text-accent">{Number(recipe.rating || 0).toFixed(1)}</span>
            <span className="ml-1 font-medium text-muted">
              ({recipe.reviewCount || 0} reviews)
            </span>
          </p>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            A recipe worth sharing
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
            {recipe.name}
          </h1>
          {mealTypes.length > 0 && (
            <p className="mt-4 text-muted">{mealTypes.join(' · ')}</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Prep', `${recipe.prepTimeMinutes ?? '—'} min`],
              ['Cook', `${recipe.cookTimeMinutes ?? '—'} min`],
              ['Serves', recipe.servings ?? '—'],
              ['Calories', recipe.caloriesPerServing ? `${recipe.caloriesPerServing} kcal` : '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-background p-3">
                <p className="text-xs font-medium text-muted">{label}</p>
                <p className="mt-1 font-bold text-text">{value}</p>
              </div>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">Get ready</p>
              <h2 className="font-serif text-2xl font-bold text-text">Ingredients</h2>
            </div>
            <span className="text-sm text-muted">{ingredients.length} items</span>
          </div>
          {ingredients.length > 0 ? (
            <ul className="space-y-1">
              {ingredients.map((ingredient, index) => {
                const checked = checkedIngredients.includes(index);
                return (
                  <li key={`${ingredient}-${index}`}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-background">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIngredient(index)}
                        className="mt-1 h-4 w-4 accent-accent"
                      />
                      <span className={checked ? 'text-muted line-through' : 'text-text'}>
                        {ingredient}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted">No ingredient list is available.</p>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">Step by step</p>
            <h2 className="font-serif text-2xl font-bold text-text">Instructions</h2>
          </div>
          {instructions.length > 0 ? (
            <ol className="space-y-5">
              {instructions.map((step, index) => (
                <li key={`${step}-${index}`} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-accent">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-text">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted">No instructions are available.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Recipedetail;
