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
      <blockquote className="text-5xl font-extrabold italic text-center text-white p-2 whitespace-nowrap ml-[50px]">
        LibGen
        <span className="ml-10 before:block before:absolute before:-inset-2 rotate-12 shadow-xl shadow-black before:bg-rose-400 before:border-2 before:border-zinc-800 before:rounded-md relative inline-block hover:-rotate-0 transition duration-500 ease-in-out">
          <span className="relative p-2 text-white text-[40px]">Books</span>
        </span>
      </blockquote>
    </div>
  )
}

export default Navbar
