import React, { useState } from 'react'
import BooksList from './components/booksList'
import Navbar from './components/navbar'
import SearchBar from './components/searchBar'
import SideMenu from './components/sidemenu'
import './input.css'

function App() {
  const [searchParam, setSearchParam] = useState({ query: '', category: '' })
  const [reset, setReset] = useState(false)
  const [page, setPage] = useState(0)

  const handleSearch = query => {
    setSearchParam({ query, category: '' })
    setPage(0)
    setReset(true)
  }

  const handleCategory = category => {
    setSearchParam({ query: '', category })
    setPage(0)
  }

  return (
    <>
      <header className="bg-zinc-800 align-middle h-[82px]">
        <Navbar setQuery={handleSearch} />
      </header>
      <main className="grow flex flex-row w-full max-w-7xl m-auto justify-center align-middle">
        <aside className="w-[250px] mt-[150px] hidden sm:block">
          <SideMenu
            setCurrentCategory={handleCategory}
            reset={reset}
            setReset={setReset}
          />
        </aside>
        <section className="p-2 flex-wrap w-full">
          <SearchBar onSearch={handleSearch} />
          <BooksList searchParam={searchParam} page={page} setPage={setPage} />
        </section>
      </main>
    </>
  )
}

export default App
