"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import EventForm from "./event";
import EventList from "./eventL";

interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

type EventsMap = Record<string, Event[]>;

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventsMap>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined" && document.getElementById("root")) {
      Modal.setAppElement("#root");
    }
  }, []);

  useEffect(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const saveEvents = (updatedEvents: EventsMap): void => {
    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  };


  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getMonth(),
    currentMonth.getFullYear()
  );
  const firstDayOfMonth = getFirstDayOfMonth(
    currentMonth.getMonth(),
    currentMonth.getFullYear()
  );

  const handleDayClick = (day: number): void => {
    setSelectedDay(day);
    setModalOpen(true);
  };

  const addOrUpdateEvent = (event: Event): void => {
    if (selectedDay === null) return;
    const dateKey = `${currentMonth.getFullYear()}-${
      currentMonth.getMonth() + 1
    }-${selectedDay}`;
    const updatedEvents = {
      ...events,
      [dateKey]:
        editingEventIndex !== null
          ? events[dateKey].map((e, index) =>
              index === editingEventIndex ? event : e
            )
          : [...(events[dateKey] || []), event],
    };
    saveEvents(updatedEvents);
    setModalOpen(false);
    setEditingEventIndex(null);
  };

  const deleteEvent = (index: number): void => {
    if (selectedDay === null) return;
    const dateKey = `${currentMonth.getFullYear()}-${
      currentMonth.getMonth() + 1
    }-${selectedDay}`;
    const updatedEvents = { ...events };
    updatedEvents[dateKey].splice(index, 1);
    if (updatedEvents[dateKey].length === 0) {
      delete updatedEvents[dateKey];
    }
    saveEvents(updatedEvents);
  };

  const editEvent = (index: number): void => {
    setEditingEventIndex(index);
    setModalOpen(true);
  };

  const handleMonthChange = (increment: number): void => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newDate);
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl rounded-lg p-8">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-8">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-110 shadow-md"
          onClick={() => handleMonthChange(-1)}
        >
          &#9664; Previous
        </button>
        <h2 className="text-[14px] lg:text-[20px] font-bold text-white tracking-wide">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-110 shadow-md"
          onClick={() => handleMonthChange(1)}
        >
          Next &#9654;
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-4 text-center text-gray-300 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
          const isWeekend = day === "Sun" || day === "Sat";
          return (
            <div
              key={i}
              className={`font-semibold text-lg uppercase ${
                isWeekend ? "text-red-500" : "text-gray-300"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={i} className="h-16"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${currentMonth.getFullYear()}-${
            currentMonth.getMonth() + 1
          }-${day}`;
          const hasEvents = events[dateKey] && events[dateKey].length > 0;
          const isSelected = selectedDay === day;
          const isToday =
            new Date().getFullYear() === currentMonth.getFullYear() &&
            new Date().getMonth() === currentMonth.getMonth() &&
            new Date().getDate() === day;

          return (
            <div
              key={i}
              className={`border rounded-lg p-4 text-center cursor-pointer transition-transform duration-300 shadow-md 
                ${isSelected ? "bg-blue-600 text-white scale-105" : ""} 
                ${isToday ? "bg-green-500 text-white" : ""} 
                ${
                  hasEvents
                    ? "bg-yellow-400 text-black hover:scale-110"
                    : "hover:scale-105"
                }`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Events for{" "}
          {selectedDay
            ? `${selectedDay}-${
                currentMonth.getMonth() + 1
              }-${currentMonth.getFullYear()}`
            : ""}
        </h2>
        {selectedDay && (
          <EventList
            events={
              events[
                `${currentMonth.getFullYear()}-${
                  currentMonth.getMonth() + 1
                }-${selectedDay}`
              ] || []
            }
            onDelete={deleteEvent}
            onEdit={editEvent}
          />
        )}
        <hr className="my-6" />
        <EventForm
          selectedDay={
            selectedDay !== null
              ? `${currentMonth.getFullYear()}-${
                  currentMonth.getMonth() + 1
                }-${selectedDay}`
              : ""
          }
          onSave={addOrUpdateEvent}
          onClose={() => setModalOpen(false)}
          initialEvent={
            editingEventIndex !== null
              ? events[
                  `${currentMonth.getFullYear()}-${
                    currentMonth.getMonth() + 1
                  }-${selectedDay}`
                ][editingEventIndex]
              : undefined
          }
        />
      </Modal>
    </div>
  );
};

export default Calendar;
