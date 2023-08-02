export default function Navbar() {
  return (
    <header role="banner">
      <nav className="p-3 w-full flex justify-center flex-wrap">
        <blockquote className="font-extrabold italic text-center text-white p-2 whitespace-nowrap ml-[50px] md:text-5xl text-3xl">
          Get some
          <span className="ml-4 before:block before:absolute before:-inset-2 rotate-12 shadow-xl  shadow-black before:bg-rose-400 before:border-2 before:border-zinc-800 before:rounded-md relative inline-block hover:-rotate-0 transition duration-500 ease-in-out">
            <span className="relative px-1 text-white text-2xl md:text-4xl">
              Books
            </span>
          </span>
        </blockquote>
      </nav>
    </header>
  )
}
