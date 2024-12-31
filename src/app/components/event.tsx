"use client";

import React, { useState, useEffect } from "react";

interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

interface EventFormProps {
  selectedDay: string;
  onSave: (event: Event) => void;
  onClose: () => void;
  initialEvent?: Event;
}

const EventForm: React.FC<EventFormProps> = ({
  selectedDay,
  onSave,
  onClose,
  initialEvent,
}) => {
  const [name, setName] = useState<string>(initialEvent?.name || "");
  const [startTime, setStartTime] = useState<string>(
    initialEvent?.startTime || ""
  );
  const [endTime, setEndTime] = useState<string>(initialEvent?.endTime || "");
  const [description, setDescription] = useState<string>(
    initialEvent?.description || ""
  );

  useEffect(() => {
    if (initialEvent) {
      setName(initialEvent.name);
      setStartTime(initialEvent.startTime);
      setEndTime(initialEvent.endTime);
      setDescription(initialEvent.description || "");
    }
  }, [initialEvent]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name || !startTime || !endTime) {
      alert("Event name, start time, and end time are required.");
      return;
    }
    onSave({ name, startTime, endTime, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-black">
        {initialEvent ? "Edit" : "Add"} Event for {selectedDay}
      </h2>
      <div>
        <label className="block mb-1 text-black">Event Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-black"
          required
        />
      </div>
      <div className="flex space-x-2">
        <div>
          <label className="block mb-1 text-black">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full text-black border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-black">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full text-black border px-3 py-2 rounded"
            required
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-black ">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border text-black px-3 py-2 rounded"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm;
