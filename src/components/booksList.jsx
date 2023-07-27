import { useState, useEffect } from 'react'
import axios from 'axios'
import '../input.css'
import Dialogs from './dialogs'

const BASE_URL = '/.netlify/functions'
const itemsPerPage = 20

const fetchBooks = async (
  query,
  category,
  language,
  page = 0,
  retries = 1,
  setBooks,
  setNoBooks,
  setLoading
) => {
  setLoading(true)
  setNoBooks(false)
  let response
  const startIndex = page * itemsPerPage
  try {
    if (query) {
      response = await axios.get(
        `${BASE_URL}/search?query=${query}&startIndex=${startIndex}&maxResults=${itemsPerPage}&language=${language}`
      )
    } else if (category) {
      response = await axios.get(
        `${BASE_URL}/search?category=${category}&startIndex=${startIndex}&maxResults=${itemsPerPage}&language=${language}`
      )
    }

    if (response && response.data) {
      if (response.data.length > 0) {
        setBooks(response.data)
        setNoBooks(false)
      } else {
        console.log('No books returned')
        setBooks([])
        if (retries > 0) {
          console.log(`No books found. Retrying... ${retries} attempts left.`)
          setTimeout(
            () =>
              fetchBooks(
                query,
                category,
                language,
                page,
                retries - 1,
                setBooks,
                setNoBooks,
                setLoading
              ),
            0
          )
          return
        } else {
          console.error('Failed to fetch books after multiple attempts')
          setBooks([])
          setNoBooks(true)
        }
      }
    }
  } catch (error) {
    if (
      (error.response && error.response.status === 502) ||
      (retries > 0 && !error.message.includes('No books returned'))
    ) {
      console.log(`Attempt failed. Retrying... ${retries} attempts left.`)
      setBooks([])
      setTimeout(
        () =>
          fetchBooks(
            query,
            category,
            language,
            page,
            retries - 1,
            setBooks,
            setNoBooks,
            setLoading
          ),
        0
      )
      return
    } else {
      console.error('Failed to fetch books after multiple attempts', error)
      setBooks([])
      setNoBooks(true)
    }
  }
  setLoading(false)
}

export default function BooksList({ searchParam, page, setPage, language }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [noBooks, setNoBooks] = useState(false)

  if (searchParam.category === '' && searchParam.query === '') {
    searchParam.category = 'Poetry'
  }

  const handleNextPageClick = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handleFirstPageClick = () => {
    setPage(0)
  }

  const handlePreviousPageClick = () => {
    setPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0))
  }

  useEffect(() => {
    fetchBooks(
      searchParam.query,
      searchParam.category,
      language,
      page,
      2,
      setBooks,
      setNoBooks,
      setLoading
    )
  }, [page, searchParam, language])

  return (
    <>
      {selectedBook && (
        <Dialogs
          isOpen={!!selectedBook}
          setIsOpen={() => setSelectedBook(null)}
          bookDescription={selectedBook}
        />
      )}

      <div className="p-6 w-full m-auto">
        {loading && (
          <div className="flex text-center justify-center text-3xl animate-pulse font-semibold text-rose-400 py-20">
            Cargando...
          </div>
        )}

        {noBooks ? (
          <div className="flex text-center justify-center text-3xl animate-pulse font-semibold text-rose-400 py-20">
            No se encontraron libros.
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 justify-items-center items-center">
            {!loading &&
              books.map((book, index) => (
                <div key={`${book.title}-${index}`}>
                  <div key={`${book.title}-${index}`}>
                    <div className="grid-flow w-[230px] h-[320px]rounded-md">
                      <div className="text-center">
                        <h2 className="font-extrabold py-1 px-6 text-md text-slate-300 overflow-hidden whitespace-nowrap w-full text-ellipsis">
                          {book.title}
                        </h2>
                      </div>
                      <div>
                        <a
                          className="flex p-1"
                          onClick={() => {
                            setSelectedBook(book)
                          }}
                        >
                          <img
                            src={book.cover}
                            className="w-[180px] h-[250px] m-auto rounded-sm shadow-md shadow-zinc-800 cursor-pointer hover:mix-blend-plus-lighter hover:shadow-lg hover:shadow-rose-200 transition duration-300 ease-in-out"
                          />
                        </a>

                        <div className="text-center">
                          <p className="text-slate-300 mb-1 p-1 text-xs overflow-hidden whitespace-nowrap w-full text-ellipsis">
                            ({book.author})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="flex justify-center gap-1 mt-10">
        <button
          onClick={handleFirstPageClick}
          className="inline-block bg-blue-300 py-1 px-2 rounded-md shadow-sm shadow-black hover:bg-blue-500 hover:text-white border border-black"
        >
          <p className="font-bold text-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </p>
        </button>
        <button
          onClick={handlePreviousPageClick}
          className="inline-block bg-blue-300 py-1 px-2 rounded-md shadow-sm shadow-black hover:bg-blue-500 hover:text-white border border-black"
        >
          <p className="font-bold text-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </p>
        </button>
        <button
          onClick={handleNextPageClick}
          className="inline-block bg-blue-300 py-1 px-2 rounded-md shadow-sm shadow-black hover:bg-blue-500 hover:text-white border border-black"
        >
          <p className="font-bold text-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </p>
        </button>
      </div>
    </>
  )
}
