"use client"

import React, { useState } from "react"
import { Button } from "@components/atoms"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  minValue?: Date
  maxValue?: Date
  isDisabled?: boolean
  disabledDates?: Date[]
  className?: string
}

export const DatePicker = ({
  value,
  onChange,
  minValue,
  maxValue,
  isDisabled = false,
  disabledDates = [],
  className = "",
}: DatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
  )

  const today = new Date()
  const minDate = minValue || today
  const maxDate = maxValue || new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (isDisabled) return true
    if (date < minDate || date > maxDate) return true
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.toDateString() === date.toDateString()
    )
  }

  const isDateSelected = (date: Date) => {
    return value && date.toDateString() === value.toDateString()
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!isDateDisabled(selectedDate) && onChange) {
      onChange(selectedDate)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null)

  return (
    <div className={`calendar ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="tonal"
          size="small"
          className="p-2"
          onClick={() => navigateMonth('prev')}
          disabled={currentMonth <= new Date(minDate.getFullYear(), minDate.getMonth(), 1)}
        >
          ←
        </Button>
        <h2 className="font-semibold text-lg">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button
          variant="tonal"
          size="small"
          className="p-2"
          onClick={() => navigateMonth('next')}
          disabled={currentMonth >= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)}
        >
          →
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="w-full">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center p-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2" />
          ))}
          
          {/* Month days */}
          {days.map((day) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const disabled = isDateDisabled(date)
            const selected = isDateSelected(date)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={disabled}
                className={`
                  w-10 h-10 rounded-full text-sm font-medium transition-colors
                  ${selected ? "bg-blue-500 text-white" : ""}
                  ${isToday && !selected ? "bg-blue-100 text-blue-600" : ""}
                  ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                  ${!selected && !isToday && !disabled ? "text-gray-900" : ""}
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}