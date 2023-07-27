import { useState, useEffect, useRef } from 'react'
import { RadioGroup } from '@headlessui/react'

const plans = [
  {
    name: 'Ficción',
    category: 'Fiction',
  },
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
]
const emptyPlan = { name: '', category: '' }

export default function SideMenu({
  setCurrentCategory,
  reset,
  setReset,
  category,
}) {
  const [selected, setSelected] = useState(plans[0])

  const selectedCategoryRef = useRef(selected.category)

  useEffect(() => {
    if (reset) {
      setSelected(plans[0])
      setReset(false)
    }
  }, [reset, setReset])

  useEffect(() => {
    if (selectedCategoryRef.current !== selected.category) {
      selectedCategoryRef.current = selected.category
      setCurrentCategory(selected.category)
    }
  }, [selected, setCurrentCategory])

  useEffect(() => {
    if (category === '') {
      setSelected(emptyPlan)
    }
  }, [category])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="flex flex-wrap gap-2 items-center justify-center py-2 lg:px-40 m-auto overflow-hidden max-h-[100px]">
        {plans.map(plan => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            className={({ active, checked }) =>
              `${active ? 'ring-2 ring-zinc-900 ring-opacity-60' : ''}
            ${
              checked
                ? 'bg-rose-400 text-white shadow-xl shadow-zinc-900'
                : 'bg-white shadow-xl shadow-zinc-900 hover:bg-rose-200 hover:text-white'
            }
            cursor-pointer rounded-lg px-2  w-[140px] h-10 shadow-md focus:outline-none`
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center">
                    <div className="text-sm font-bold">
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
