import { Link } from 'react-router';

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 shadow-sm backdrop-blur print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="font-serif text-xl font-bold tracking-tight text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          RecipeFinder
        </Link>
        <Link
          to="/"
          className="rounded-full px-4 py-2 text-sm font-semibold text-text transition hover:bg-background hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Explore recipes
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
