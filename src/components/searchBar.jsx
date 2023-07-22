import { useState } from 'react'
import '../input.css'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(query)
    setQuery('')
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center text-center mt-7"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar"
          className="py-2 px-4 border text-slate-500 border-black rounded-l-lg flex-grow shadow-sm shadow-black focus:outline-none focus:shadow-md focus:shadow-black"
        />
        <button
          type="submit"
          className="bg-blue-400 hover:bg-blue-500 text-black shadow-sm shadow-black font-semibold py-2 px-4 rounded-r-lg focus:outline-none border border-black focus:shadow-md focus:shadow-slate-300"
        >
          Buscar
        </button>
      </form>
    </div>
  )
}
