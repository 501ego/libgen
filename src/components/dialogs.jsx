import { Dialog } from '@headlessui/react'

export default function Dialogs({ isOpen, setIsOpen, bookDescription }) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-5 transition-opacity" />
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom border p-3 bg-white rounded-lg text-left overflow-hidden shadow-xl shadow-black transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <Dialog.Panel>
            <div className="max-h-[550px] overflow-auto">
              <Dialog.Title className="text-4xl font-bold text-gray-700 text-center mb-2">
                {bookDescription.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-rose-300 text-center">
                Autor: ({bookDescription.author})
              </Dialog.Description>
              <p className="text-md text-justify p-3 ">
                {bookDescription.description}
              </p>
              <p className="text-sm text-end p-3 text-zinc-800 mt-3">
                {bookDescription.pages !== 'Desconocido' ? (
                  `${bookDescription.pages} páginas`
                ) : (
                  <br />
                )}
              </p>
              <p className="text-sm text-end p-3 text-zinc-800">
                Categoría: {bookDescription.categories}
              </p>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
              {bookDescription.previewLink ? (
                <a
                  href={bookDescription.previewLink}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-black shadow-md shadow-black px-4 py-2 bg-blue-300 text-base font-semibold hover:text-white hover:bg-blue-500 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <p className="text-center font-bold text-sm">Vista Previa</p>
                </a>
              ) : (
                <p className="text-red-400 text-sm mt-3 p-1">
                  No existe Vista Previa.
                </p>
              )}

              {bookDescription.downloadLink ? (
                <a
                  href={bookDescription.downloadLink}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-black shadow-md shadow-black px-4 py-2 bg-rose-300 text-base font-semibold hover:text-white hover:bg-rose-500 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <p className="text-center font-bold text-sm">Descarga</p>
                </a>
              ) : (
                <p className="text-red-400 text-sm mt-3 p-1">
                  No existe url de descarga.
                </p>
              )}

              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-black shadow-md shadow-black px-4 py-2 bg-blue-300 text-base font-semibold hover:text-white hover:bg-blue-500 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
