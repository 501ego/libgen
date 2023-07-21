import React, { useState } from 'react'
import BooksList from './components/booksList'
import Navbar from './components/navbar'
import SearchBar from './components/searchBar'
import SideMenu from './components/sidemenu'
import MySwitch from './components/switch'
import './input.css'

function App() {
  const [searchParam, setSearchParam] = useState({ query: '', category: '' })
  const [reset, setReset] = useState(false)
  const [page, setPage] = useState(0)
  const [enabled, setEnabled] = useState(false)
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
      <header className="bg-zinc-800 align-middle h-[82px] flex justify-center">
        <div className="flex items-center justify-center w-full max-w-7xl">
          <div className="ml-[67px] justify-start hidden sm:block">
            <MySwitch enabled={enabled} setEnabled={setEnabled} />
          </div>
          <Navbar setQuery={handleSearch} />
        </div>
      </header>
      <main className="grow flex flex-row w-full max-w-7xl m-auto justify-center align-middle px-8">
        <aside className="w-[250px] mt-[130px] hidden sm:block">
          <SideMenu
            enabled={enabled}
            setEnabled={setEnabled}
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
