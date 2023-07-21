import { Switch } from '@headlessui/react'

export default function MySwitch({ enabled, setEnabled }) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-rose-400' : 'bg-rose-400'}
relative inline-flex h-[40px] w-[120px] shrink-0 cursor-pointer rounded-full border-2 border-white shadow-xl shadow-zinc-800 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        className={`absolute z-0 text-xs font-bold text-white ml-4 ${
          enabled ? 'invisible' : 'visible'
        }`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Categorías
      </span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-[82px]' : 'translate-x-0'}
  pointer-events-none inline-block h-[35px] w-[35px] transform rounded-full bg-white shadow-md shadow-zinc-600 ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}
