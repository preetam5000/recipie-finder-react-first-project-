import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import axios from "axios";

function Home() {
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [nextSkip, setNextSkip] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const[query,setQuery]=useState("")

  async function fetchRecipes(skipCount, query) {
    try {
      setErrorMsg("")
      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`
      if (query) {
        url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`
      }

      const { data } = await axios.get(url)
      setRecipes((prev) => (skipCount === 0 ? data.recipes : [...prev, ...data.recipes]))
      setTotal(data.total)
      setNextSkip(skipCount + data.recipes.length)
    } catch (error) {
      console.error("Could not fetch recipes:", error)
      setErrorMsg("Please try again later.")
    }
  }

  useEffect(() => {
    fetchRecipes(0, query)
  }, [])

  function loadMore() {
    if (nextSkip < total) {
      fetchRecipes(nextSkip, query)
    }
  }
  function Searchrecipies(e){
    e.preventDefault();
    const form=new FormData(e.target);
    const query=form.get("search").trim();
    setQuery(query);
    fetchRecipes(0, query);

  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={Searchrecipies} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          name="search"
          type="text"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
          Search
        </button>
      </form>

      {errorMsg && <p className="text-center text-red-600 mb-4">{errorMsg}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={loadMore}
          type="button"
          className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
          disabled={nextSkip >= total}
        >
          Load More
        </button>
      </div>
    </main>
  )
}

export default Home
