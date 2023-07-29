import React, { useState, useEffect } from 'react'

export default function SearchBar({ onSearch, label, setLanguage, language }) {
  const [query, setQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  let placeHolder = label == '' ? 'buscar' : label

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(query)
    setQuery('')
    placeHolder = { label }
  }

  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const handleChange = event => {
    setSelectedLanguage(event.target.value)
    setLanguage(event.target.value)
  }

  return (
    <div>
      <div className="flex justify-center items-center flex-nowrap text-center">
        <input
          id="Inglés"
          className="peer/Inglés"
          type="radio"
          name="status"
          value="en"
          checked={selectedLanguage === 'en'}
          onChange={handleChange}
        />
        <label
          htmlFor="Inglés"
          className="peer-checked/Inglés:text-blue-300 ml-1 text-rose-300"
        >
          Inglés
        </label>
        <input
          id="Español"
          className="peer/Español ml-5"
          type="radio"
          name="status"
          value="es"
          checked={selectedLanguage === 'es'}
          onChange={handleChange}
        />
        <label
          htmlFor="Español"
          className="peer-checked/Español:text-blue-300 ml-1 text-rose-300"
        >
          Español
        </label>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center text-center mt-7 relative"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeHolder}
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
