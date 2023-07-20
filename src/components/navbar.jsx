import { useState } from 'react'

function Navbar({ setQuery }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (e, value) => {
    e.preventDefault()
    if (value) {
      setQuery(value)
    }
    setIsOpen(false)
  }

  return (
    <div className="p-3 w-full relative">
      <blockquote className="text-5xl font-extrabold italic text-center text-white p-2 whitespace-nowrap ml-[200px] hidden sm:block">
        LibGen
        <span className="ml-10 before:block before:absolute before:-inset-2 rotate-12 shadow-xl shadow-black before:bg-rose-400 before:border-2 before:border-zinc-800 before:rounded-md relative inline-block hover:-rotate-0 hover:transition hover:duration-500 hover:ease-in-out">
          <span className="relative p-2 text-white text-[40px]">Books</span>
        </span>
      </blockquote>
      <nav className="absolute top-1 left-0 flex flex-wrap items-center justify-between p-5 text-white text-lg">
        <ol className="inline-flex gap-3">
          <li className="flex items-center">
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="block overflow-hidden focus:outline-none hover:text-blue-300"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 transition-transform duration-400 transform rotate-180"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 transition-transform duration-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {isOpen && (
                <div className="flex py-3 p-2 font-semibold absolute top-0 left-12 ml-2">
                  <a
                    href="/"
                    className="block px-4 py-2 hover:text-blue-300"
                    onClick={e => handleClick(e)}
                  >
                    Inicio
                  </a>
                  <a
                    href="/libros"
                    className="block px-4 py-2 hover:text-blue-300"
                  >
                    Favoritos
                  </a>
                </div>
              )}
            </div>
          </li>
        </ol>
      </nav>
    </div>
  )
}

export default Navbar
