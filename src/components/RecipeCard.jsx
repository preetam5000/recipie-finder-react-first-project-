import { Link } from "react-router";

function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        loading="lazy"
        className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 font-serif text-lg font-bold text-text">
          {recipe.name}
        </h3>
        <p className="mb-4 text-sm text-muted">
          {[recipe.cuisine, recipe.difficulty].filter(Boolean).join(' · ')}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="flex items-center gap-1 font-semibold text-text">
            <svg aria-hidden="true" className="h-4 w-4 fill-accent" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {Number(recipe.rating || 0).toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-muted">
            <svg aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {totalTime || '—'}{totalTime ? ' min' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;