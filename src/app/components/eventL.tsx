"use client";

import React from "react";

interface Event {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

interface EventListProps {
  events: Event[];
  onDelete: (index: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onDelete }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Events</h3>
      {events.length === 0 ? (
        <p>No events for this day.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index} className="border-b py-2 flex justify-between">
              <span>
                <strong>{event.name}</strong> ({event.startTime} -{" "}
                {event.endTime})
              </span>
              <button
                onClick={() => onDelete(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
