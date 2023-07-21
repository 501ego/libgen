import { useState, useEffect } from 'react'
import axios from 'axios'
import '../input.css'
import Dialogs from './dialogs'

export default function BooksList({ searchParam, page, setPage }) {
  const BASE_URL = '/.netlify/functions'

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [noBooks, setNoBooks] = useState(false)
  const itemsPerPage = 12
  if (searchParam.category === '' && searchParam.query === '') {
    searchParam.category = 'Fiction'
  }

  const fetchBooks = async (query, category, page = 0, retries = 2) => {
    setLoading(true)
    setNoBooks(false)
    let response
    const startIndex = page * itemsPerPage
    try {
      if (query) {
        response = await axios.get(
          `${BASE_URL}/search?query=${query}&startIndex=${startIndex}&maxResults=${itemsPerPage}`
        )
      } else if (category) {
        response = await axios.get(
          `${BASE_URL}/search?category=${category}&startIndex=${startIndex}&maxResults=${itemsPerPage}`
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
              () => fetchBooks(query, category, page, retries - 1),
              3000
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
        setTimeout(() => fetchBooks(query, category, page, retries - 1), 3000)
        return
      } else {
        console.error('Failed to fetch books after multiple attempts', error)
        setBooks([])
        setNoBooks(true)
      }
    }
    setLoading(false)
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
    fetchBooks(searchParam.query, searchParam.category, page)
  }, [page, searchParam])

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
        <h1 className="text-2xl font-bold text-center text-slate-50 mb-5">
          {'"'}
          {searchParam.query
            ? searchParam.query.toUpperCase()
            : searchParam.category
            ? searchParam.category.toUpperCase()
            : ''}
          {'"'}
        </h1>
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
          <div className="grid gap-10 xl:grid-cols-3 lg:grid-cols-2 justify-items-center items-center">
            {!loading &&
              books.map((book, index) => (
                <div key={`${book.title}-${index}`}>
                  <div key={`${book.title}-${index}`}>
                    <div className="grid-flow bg-slate-50 rounded-lg shadow-lg shadow-black border-2 border-zinc-800 w-[270px] h-[395px]">
                      <div className="px-2 text-center">
                        <h2 className="font-extrabold text-xl text-gray-700 overflow-hidden whitespace-nowrap w-full text-ellipsis mt-2 p-1">
                          {book.title.toUpperCase()}
                        </h2>
                      </div>
                      <div>
                        <a
                          className="flex p-1 mb-7"
                          onClick={() => {
                            setSelectedBook(book)
                          }}
                        >
                          <img
                            src={book.cover}
                            className="w-[145px] h-[200px] border-r-4 border-b-4 border-slate-50 rounded-br-lg m-auto mt-2 rounded-sm shadow-md shadow-black cursor-pointer hover:rotate-2 hover:shadow-xl hover:shadow-black transition duration-300 ease-in-out"
                          />
                        </a>
                      </div>
                      <hr className="border-slate-900 mb-3 border" />
                      <div className="px-2 text-center">
                        <p className="text-gray-900 text-sm overflow-hidden whitespace-nowrap w-full text-ellipsis">
                          ({book.author})
                        </p>
                      </div>
                      <div className="flex justify-end px-4 mt-6">
                        <p className="text-gray-900 text-sm overflow-hidden whitespace-nowrap w-full text-ellipsis mt-2 font-bold">
                          {book.publishedDate !== 'Desconocido'
                            ? ` ${book.publishedDate}`
                            : ''}
                        </p>
                        {book.downloadLink ? (
                          <a
                            href={book.downloadLink}
                            className="h-[30px] inline-block bg-blue-300 py-1 px-2 rounded-md shadow-md shadow-black hover:bg-blue-500 hover:text-white border border-black"
                          >
                            <p className="text-center font-bold text-sm">
                              Descarga
                            </p>
                          </a>
                        ) : (
                          <p className="text-red-400 text-sm mt-3 p-1">
                            No existe url de descarga.
                          </p>
                        )}
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
