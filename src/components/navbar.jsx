import React, { useState, useEffect } from 'react'

export default function Navbar({ setLanguage, language }) {
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const handleChange = event => {
    setSelectedLanguage(event.target.value)
    setLanguage(event.target.value)
  }

  return (
    <div className="p-3 w-full flex gap-10 justify-center flex-wrap">
      <blockquote className="font-extrabold italic text-center text-white p-2 whitespace-nowrap ml-[50px] md:text-5xl text-4xl">
        LibGen
        <span className="ml-10 before:block before:absolute before:-inset-2 rotate-12 shadow-xl  shadow-black before:bg-rose-400 before:border-2 before:border-zinc-800 before:rounded-md relative inline-block hover:-rotate-0 transition duration-500 ease-in-out">
          <span className="relative px-2 text-white text-3xl md:text-4xl">
            Books
          </span>
        </span>
      </blockquote>
      <div className="absolute justify-between items-center flex-nowrap top-[90px]">
        <fieldset>
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
            className="peer-checked/Inglés:text-blue-300 peer-checked/Inglés:animate-pulse ml-1  text-rose-300"
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
            className="peer-checked/Español:text-blue-300 peer-checked/Español:animate-pulse ml-1 text-rose-300"
          >
            Español
          </label>
        </fieldset>
      </div>
    </div>
  )
}
