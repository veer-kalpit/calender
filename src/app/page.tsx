// /app/page.tsx
import React from "react";
import Calendar from "./components/calender";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-lime-300 flex flex-col items-center py-6">
      <h1 className="text-3xl text-black font-bold mb-6">Dynamic Event Calendar</h1>
      <Calendar />
    </div>
  );
};

export default Page;
