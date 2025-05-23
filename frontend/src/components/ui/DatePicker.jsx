import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import IconCalendar from '../../assets/icon-calendar.svg?react'

const DatePicker = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const datePickerRef = useRef(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  }, [value]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfMonth(monthStart);
  const endDate = endOfMonth(monthEnd);

  const daysInMonth = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <Motion.div 
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white cursor-pointer flex justify-between items-center"
        onClick={toggleDatePicker}
        whileTap={{ scale: 0.98 }}
      >
        <span className='font-extrabold'>{selectedDate ? format(selectedDate, 'd MMM yyyy') : 'Select date'}</span>
        <Motion.span 
          className="text-sec-300 flex items-center"
        >
          <IconCalendar />
        </Motion.span>
      </Motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <Motion.div 
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              type="button" 
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Previous month"
            >
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L2 5L6 1" stroke="#7C5DFA" strokeWidth="2"/>
              </svg>
            </button>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              {format(currentMonth, 'MMM yyyy')}
            </h3>
            <button 
              type="button" 
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label="Next month"
            >
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="#7C5DFA" strokeWidth="2"/>
              </svg>
            </button>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
                {day[0]}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              
              return (
                <button
                  key={day.toString()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={!isCurrentMonth}
                  className={`
                   cursor-pointer w-8 h-8 flex items-center justify-center text-sm rounded-full font-extrabold
                    ${isSelected 
                      ? 'text-pri-100' 
                      : isTodayDate 
                        ? 'text-pri-100' 
                        : isCurrentMonth 
                          ? 'text-gray-800 dark:text-gray-200' 
                          : 'text-gray-400 dark:text-gray-500'}
                    hover:text-pri-200 dark:hover:bg-gray-600
                    ${!isCurrentMonth ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  aria-label={`Select ${format(day, 'MMMM d, yyyy')}`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
