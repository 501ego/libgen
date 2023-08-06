export default function FooterContent() {
  return (
    <section
      aria-label="Footer content"
      className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8"
    >
      <h6 className="text-center text-base font-semibold uppercase text-gray-400 tracking-wider">
        © 2023 University project made by {'Diego.'}
      </h6>
      <p className="mt-8 text-center text-sm text-gray-400">
        {'All rights reserved.'}
      </p>
      <p className="mt-8 text-center text-xs text-gray-400">
        {' '}
        Sometimes the API is slow, please be patient.
      </p>
    </section>
  )
}
