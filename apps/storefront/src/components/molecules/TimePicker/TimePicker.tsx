"use client"

import React from "react"
import { Button } from "@components/atoms"

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  available: boolean
  service_id?: string
  location_id?: string
  duration?: number
}

interface TimePickerProps {
  availableSlots: TimeSlot[]
  selectedSlot?: TimeSlot
  onSlotSelect: (slot: TimeSlot) => void
  isLoading?: boolean
  className?: string
}

export const TimePicker = ({
  availableSlots,
  selectedSlot,
  onSlotSelect,
  isLoading = false,
  className = "",
}: TimePickerProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (startString: string, endString: string) => {
    const start = new Date(startString)
    const end = new Date(endString)
    const durationMs = end.getTime() - start.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${minutes}m`
    }
  }

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Available Times</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-12 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (availableSlots.length === 0) {
    return (
      <div className={`${className}`}>
        <h3 className="font-semibold text-lg mb-4">Available Times</h3>
        <p className="text-gray-500 text-center py-8">
          No available time slots for the selected date.
        </p>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <h3 className="font-semibold text-lg mb-4">Available Times</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {availableSlots.filter(slot => slot.available).map((slot, index) => {
          const isSelected = selectedSlot?.start_time === slot.start_time
          
          return (
            <Button
              key={slot.id || index}
              variant={isSelected ? "filled" : "tonal"}
              size="small"
              onClick={() => onSlotSelect(slot)}
              className="flex flex-col items-center justify-center h-16 text-sm"
            >
              <span className="font-medium">
                {formatTime(slot.start_time)}
              </span>
              <span className="text-xs opacity-75">
                {formatDuration(slot.start_time, slot.end_time)}
              </span>
            </Button>
          )
        })}
      </div>
      
      {selectedSlot && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
            {" "}({formatDuration(selectedSlot.start_time, selectedSlot.end_time)})
          </p>
        </div>
      )}
    </div>
  )
}