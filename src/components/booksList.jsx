import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../input.css'
import Dialogs from './dialogs'

const BASE_URL = '/.netlify/functions'
const itemsPerPage = 24

const handleError = (
  error,
  retries,
  query,
  category,
  language,
  page,
  setBooks,
  setNoBooks,
  setLoading,
  cancelTokenSource
) => {
  console.error(error)
  if (axios.isCancel(error)) {
  } else if (
    (error.response && error.response.status === 502) ||
    error.response.status === 500 ||
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
          setLoading,
          cancelTokenSource
        ),
      1000
    )
    return
  } else {
    console.error('Failed to fetch books after multiple attempts', error)
    setBooks([])
    setNoBooks(true)
  }
}

const fetchBooks = async (
  query,
  category,
  language,
  page = 0,
  retries = 1,
  setBooks,
  setNoBooks,
  setLoading,
  cancelTokenSource
) => {
  setLoading(true)
  setNoBooks(false)
  const startIndex = page * itemsPerPage
  const params = {
    startIndex,
    maxResults: itemsPerPage,
    language,
  }
  if (query) {
    params.query = query
  } else if (category) {
    params.category = category
  }
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params,
      cancelToken: cancelTokenSource.token,
    })
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
                setLoading,
                cancelTokenSource
              ),
            1000
          )
          return
        } else {
          handleError(
            new Error('Failed to fetch books after multiple attempts'),
            retries,
            query,
            category,
            language,
            page,
            setBooks,
            setNoBooks,
            setLoading,
            cancelTokenSource
          )
        }
      }
    }
  } catch (error) {
    handleError(
      error,
      retries,
      query,
      category,
      language,
      page,
      setBooks,
      setNoBooks,
      setLoading,
      cancelTokenSource
    )
  }
  setLoading(false)
}

export default function BooksList({
  searchParam,
  page,
  setPage,
  handlePage,
  language,
}) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [noBooks, setNoBooks] = useState(false)
  const cancelTokenSourceRef = useRef(null)

  let query = searchParam.query
  let category = searchParam.category

  const handleNextPageClick = () => {
    setPage(page + 1)
    handlePage(page + 1)
  }

  const handleFirstPageClick = () => {
    setPage(0)
    handlePage(0)
  }

  const handlePreviousPageClick = () => {
    setPage(page - 1)
    handlePage(page - 1)
  }

  useEffect(() => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('New search started')
    }

    cancelTokenSourceRef.current = axios.CancelToken.source()

    fetchBooks(
      query,
      category,
      language,
      page,
      2,
      setBooks,
      setNoBooks,
      setLoading,
      cancelTokenSourceRef.current
    )

    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted')
      }
    }
  }, [page, query, category, language])

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
          <div className="grid gap-3 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 justify-items-center items-center">
            {!loading &&
              books.map((book, index) => (
                <div key={`${book.title}-${index}`}>
                  <div className="grid-flow w-[210px] h-[310px] rounded-m">
                    <div className="text-center">
                      <h2 className="font-extrabold py-1 px-6 text-md text-slate-300 overflow-hidden whitespace-nowrap w-full text-ellipsis">
                        {book.title}
                      </h2>
                    </div>
                    <div>
                      <button
                        className="flex p-1"
                        onClick={() => {
                          setSelectedBook(book)
                        }}
                      >
                        <img
                          src={book.cover}
                          alt="book cover"
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                          className="w-[160px] h-[230px] m-auto rounded-sm shadow-md shadow-zinc-800 cursor-pointer hover:mix-blend-plus-lighter hover:shadow-md hover:shadow-rose-200 transition duration-300 ease-in-out"
                        />
                      </button>
                      <p className="text-slate-300 mb-1 p-1 text-xs overflow-hidden whitespace-nowrap w-full text-ellipsis px-6">
                        ({book.author})
                      </p>
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
