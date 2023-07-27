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
  const [language, setLanguage] = useState('en')
  const [label, setLabel] = useState('')

  const handleSearch = query => {
    setSearchParam({ query, category: '' })
    setPage(0)
    setReset(true)
    setLabel(query)
  }

  const handleCategory = category => {
    setSearchParam({ query: '', category })
    setPage(0)
    setLabel('')
  }

  const handleLanguage = language => {
    setLanguage(language)
  }

  return (
    <>
      <header className="bg-zinc-900 align-middle h-[85px] flex justify-center items-center">
        <div className="flex justify-center items-center w-full max-w-7xl mx-auto">
          <div className="ml-[67px] justify-start hidden sm:block"></div>
          <Navbar setLanguage={handleLanguage} language={language} />
        </div>
      </header>
      <main className="grow flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-8">
        <section className="p-2 w-full text-center">
          <SearchBar onSearch={handleSearch} label={label} />
          <SideMenu
            setCurrentCategory={handleCategory}
            reset={reset}
            setReset={setReset}
            category={searchParam.category}
          />
          <BooksList
            searchParam={searchParam}
            page={page}
            setPage={setPage}
            language={language}
          />
        </section>
      </main>
    </>
  )
}

export default App
