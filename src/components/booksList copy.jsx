import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchBar from './searchBar'
import '../input.css'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('react')
  const itemsPerPage = 12

  const fetchBooks = async (query, page = 0) => {
    if (query === '') {
      return
    }
    const response = await axios.get(
      `http://localhost:5000/search?query=${query}&startIndex=${
        page * itemsPerPage
      }&maxResults=${itemsPerPage}`
    )

    setBooks(response.data)
  }

  const handleSearch = query => {
    setCurrentQuery(query)
    setPage(0)
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
    fetchBooks(currentQuery, page)
  }, [page, currentQuery])

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <div className="p-8 w-full m-auto">
        <div className="grid gap-20 lg:grid-cols-3 md:grid-cols-2">
          {books.map((book, index) => (
            <div key={`${book.title}-${index}`}>
              <div className="grid-flow bg-white rounded-lg shadow-xl shadow-black border-2 border-slate-600 w-[270px] h-[375px]">
                <div className="flex p-6">
                  <img
                    src={book.cover}
                    className="w-[135px] h-[190px] m-auto mt-3 mb-3 rounded-sm shadow-md shadow-black"
                  />
                </div>
                <hr className="border-black mb-3 border" />
                <div className="px-1 text-start">
                  <h2 className="font-bold text-xl overflow-hidden whitespace-nowrap w-full text-ellipsis">
                    {book.title}
                  </h2>
                  <p className="text-gray-900 text-xs overflow-hidden whitespace-nowrap w-full text-ellipsis">
                    {book.author}
                  </p>
                </div>
                <div className="flex justify-end px-3 mt-1">
                  {book.downloadLink ? (
                    <a
                      href={book.downloadLink}
                      className="mt-1 h-[30px] inline-block bg-blue-300 py-1 px-2 rounded-md shadow-md shadow-black hover:bg-blue-500 hover:text-white border border-black"
                    >
                      <p className="text-center font-bold text-sm">Descarga</p>
                    </a>
                  ) : (
                    <p className="text-red-400 text-sm mt-3 p-1">
                      No existe url de descarga.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1 mt-5">
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
