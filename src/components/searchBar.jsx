import React, { useState } from 'react'

export default function SearchBar({ onSearch, label }) {
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
        className="flex justify-center text-center mt-7 relative"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar"
          className="py-2 px-4 border text-slate-500 border-black rounded-l-lg flex-grow shadow-sm shadow-black focus:outline-none focus:shadow-md focus:shadow-black"
        />
        {label !== '' && (
          <p className="text-rose-400 w-full text-lg text-center font-bold absolute top-0 left-0 p-2 animate-pulse pointer-events-none">
            Resultados de: {label}
          </p>
        )}
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
