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
  // Export to JSON
  const exportToJson = () => {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.json";
    link.click();
  };

  // Export to CSV
  const exportToCsv = () => {
    const headers = ["Name", "Start Time", "End Time", "Description"];
    const rows = events.map((event) => [
      event.name,
      event.startTime,
      event.endTime,
      event.description || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "events.csv";
    link.click();
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <button
          onClick={exportToJson}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Export as JSON
        </button>
        <button
          onClick={exportToCsv}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export as CSV
        </button>
      </div>
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
