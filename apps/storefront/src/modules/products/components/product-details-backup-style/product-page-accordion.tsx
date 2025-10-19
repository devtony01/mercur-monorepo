"use client"

import { useState } from "react"
import { ChevronDown } from "@medusajs/icons"

interface ProductPageAccordionProps {
  heading: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function ProductPageAccordion({
  heading,
  defaultOpen = false,
  children,
}: ProductPageAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50"
      >
        <h3 className="font-semibold text-gray-900">{heading}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t">
          {children}
        </div>
      )}
    </div>
  )
}