import { Link } from 'react-router';

function Notfound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">Lost in the kitchen?</p>
      <h1 className="mb-2 font-serif text-6xl font-bold text-accent">404</h1>
      <h2 className="mb-3 text-xl font-semibold text-text">Page not found</h2>
      <p className="mb-7 text-muted">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-flex rounded-full bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Back to recipes
      </Link>
    </main>
  );
}

export default Notfound;
