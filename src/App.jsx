import React, { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import BooksList from './components/booksList'
import Navbar from './components/navbar'
import SearchBar from './components/searchBar'
import SideMenu from './components/sidemenu'
import FooterContent from './components/footerContent'
import './input.css'
import { useLocation, Router, Route } from 'wouter'

function App() {
  const initialPage = localStorage.getItem('page')
    ? JSON.parse(localStorage.getItem('page'))
    : 0

  const [searchParam, setSearchParam] = useState(
    JSON.parse(localStorage.getItem('searchParam')) || {
      query: 'Javascript python',
      category: '',
    }
  )
  const [page, setPage] = useState(initialPage)
  const [reset, setReset] = useState(false)
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  )
  const [label, setLabel] = useState('')
  const [location, setLocation] = useLocation(
    `/search/${searchParam.query}/${searchParam.category}/${page}/${language}`
  )

  const handlePage = page => {
    setPage(page)
    setLocation(
      `/search/${searchParam.query}/${searchParam.category}/${page}/${language}`
    )
  }

  const handleSearch = query => {
    setTimeout(() => {
      setSearchParam({ query, category: '' })
    }, 90)
    setPage(0)
    setLabel(query)
    setReset(true)
    setLocation(`/search/${query}/0/${language}`)
  }

  const handleCategory = category => {
    setPage(0)
    setLocation(`/search/${category}/0/${language}`)
    setSearchParam({ query: '', category })
    setLabel('')
  }

  const handleLanguage = language => {
    setPage(0)
    setLanguage(language)
    setLocation(
      `/search/${searchParam.query}/${searchParam.category}/${page}/${language}`
    )
  }

  useEffect(() => {
    localStorage.setItem('searchParam', JSON.stringify(searchParam))
    localStorage.setItem('page', JSON.stringify(page))
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    setLocation(
      `/search/${searchParam.query}/${searchParam.category}/${page}/${language}`
    )
  }, [searchParam, page, language])

  return (
    <HelmetProvider>
      <Helmet>
        <title>Get Some Books</title>
        <meta
          name="description"
          content="Libgen & Google API- A place to find and Download books."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <header
        aria-label="Site header"
        className="align-middle h-[85px] flex justify-center items-center"
      >
        <div className="flex justify-center items-center w-full max-w-7xl mx-auto">
          <div className="ml-[67px] justify-start hidden sm:block"></div>
          <Navbar />
        </div>
      </header>
      <main
        aria-label="Main content"
        className="grow flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-8"
      >
        <section className="p-2 w-full text-center">
          <SearchBar
            onSearch={handleSearch}
            label={label}
            setLanguage={handleLanguage}
            language={language}
          />
          <SideMenu
            setCurrentCategory={handleCategory}
            reset={reset}
            setReset={setReset}
            category={searchParam.category}
          />

          <Router>
            <Route path={location}>
              <BooksList
                handlePage={handlePage}
                searchParam={searchParam}
                page={page}
                setPage={setPage}
                language={language}
              />
            </Route>
          </Router>
        </section>
      </main>
      <footer aria-label="Footer">
        <FooterContent />
      </footer>
    </HelmetProvider>
  )
}

export default App
