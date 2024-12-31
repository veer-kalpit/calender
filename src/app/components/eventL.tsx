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
  onEdit: (index: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onDelete, onEdit }) => {
  return (
    <div className="mt-4">
      {events.length === 0 ? (
        <p className="text-black">No events for this day.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li
              key={index}
              className="border-b py-2 flex justify-between text-black"
            >
              <span>
                <strong>{event.name}</strong> ({event.startTime} -{" "}
                {event.endTime})
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(index)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
