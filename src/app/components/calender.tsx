"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import dayjs, { Dayjs } from "dayjs";
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
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [events, setEvents] = useState<EventsMap>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Set the modal app element in useEffect (only runs client-side)
  useEffect(() => {
    if (typeof window !== "undefined" && document.getElementById("root")) {
      Modal.setAppElement("#root");
    }
  }, []);

  // Load events from localStorage when the component mounts
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

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf("month").day();

  const handleDayClick = (day: number): void => {
    setSelectedDay(day);
    setModalOpen(true);
  };

  const addOrUpdateEvent = (event: Event): void => {
    if (selectedDay === null) return;
    const dateKey = currentMonth.date(selectedDay).format("YYYY-MM-DD");
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), event],
    };
    saveEvents(updatedEvents);
    setModalOpen(false);
  };

  const deleteEvent = (index: number): void => {
    if (selectedDay === null) return;
    const dateKey = currentMonth.date(selectedDay).format("YYYY-MM-DD");
    const updatedEvents = { ...events };
    updatedEvents[dateKey].splice(index, 1);
    if (updatedEvents[dateKey].length === 0) {
      delete updatedEvents[dateKey];
    }
    saveEvents(updatedEvents);
  };

  return (
    <div className="w-full max-w-4xl bg-black shadow-xl rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition hover:scale-125"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          Previous
        </button>
        <h2 className="text-3xl font-semibold text-white">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition hover:scale-125"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4 text-center text-white">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={i} className="font-semibold text-lg  text-white">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={i} className="h-16"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 text-center cursor-pointer hover:scale-125 transition-transform duration-300"
            onClick={() => handleDayClick(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {selectedDay && (
        <EventList
          events={
            events[currentMonth.date(selectedDay).format("YYYY-MM-DD")] || []
          }
          onDelete={deleteEvent}
        />
      )}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <EventForm
          selectedDay={
            selectedDay !== null
              ? currentMonth.date(selectedDay).format("YYYY-MM-DD")
              : ""
          }
          onSave={addOrUpdateEvent}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
