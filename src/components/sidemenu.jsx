import { useState, useEffect, useRef } from 'react'
import { RadioGroup } from '@headlessui/react'
import { Switch } from '@headlessui/react'

const plans = [
  {
    name: 'Filosofía',
    category: 'Philosophy',
  },
  {
    name: 'Historia',
    category: 'History',
  },
  {
    name: 'Política',
    category: 'Politics',
  },
  {
    name: 'Psicología',
    category: 'Psychology',
  },
  {
    name: 'Sociología',
    category: 'sociology',
  },
  {
    name: 'Economía',
    category: 'economic',
  },
  {
    name: 'Programación',
    category: 'Computers',
  },
  {
    name: 'Matemáticas',
    category: 'Mathematics',
  },
  {
    name: 'Juegos',
    category: 'Games',
  },
]

export default function SideMenu({ setCurrentCategory, reset, setReset }) {
  const [selected, setSelected] = useState(plans[0])
  const [enabled, setEnabled] = useState(false)
  const selectedCategoryRef = useRef(selected.category)

  useEffect(() => {
    if (reset) {
      setSelected(plans[0])
      setEnabled(false)
      setReset(false)
    }
  }, [reset, setReset])

  useEffect(() => {
    if (selectedCategoryRef.current !== selected.category) {
      selectedCategoryRef.current = selected.category
      setCurrentCategory(selected.category)
    }
  }, [selected, setCurrentCategory])

  return (
    <div className="mt-2 text-center m-auto">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-rose-400' : 'bg-rose-400'}
    relative inline-flex h-[47px] w-[130px] shrink-0 cursor-pointer rounded-full border-2 border-white shadow-xl shadow-zinc-800 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          className={`absolute z-0 text-sm font-extrabold text-white ml-5 ${
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
          className={`${enabled ? 'translate-x-[85px]' : 'translate-x-0'}
      pointer-events-none inline-block h-[42px] w-[42px] transform rounded-full bg-white shadow-md shadow-zinc-600 ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>

      {enabled ? (
        <div className="sidebar hidden sm:block">
          <div className="w-full py-5">
            <RadioGroup value={selected} onChange={setSelected}>
              <RadioGroup.Label className="sr-only">
                Server size
              </RadioGroup.Label>
              <div className="space-y-2">
                {plans.map(plan => (
                  <RadioGroup.Option
                    key={plan.name}
                    value={plan}
                    className={({ active, checked }) =>
                      `${active ? 'ring-2 ring-zinc-900 ring-opacity-60' : ''}
                  ${
                    checked
                      ? 'bg-rose-300  text-white shadow-xl shadow-zinc-900 '
                      : 'bg-white shadow-xl shadow-zinc-900 hover:bg-rose-100 hover:text-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-md font-bold">
                              <RadioGroup.Label
                                as="p"
                                className={`${
                                  checked ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {plan.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className={`inline ${
                                  checked ? 'text-sky-100' : 'text-gray-500'
                                }`}
                              ></RadioGroup.Description>
                            </div>
                          </div>
                          {checked && (
                            <div className="shrink-0 text-white">
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#ffff" opacity="0.4" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
