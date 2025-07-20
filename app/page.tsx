import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-900 mb-4">
          Welcome to the Leaderboard App
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Track users, claim random points, and see whos on top of the
          leaderboard!
        </p>
        <Link href="/leaderboard">
          <button className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium text-lg rounded-xl shadow-md transition-all duration-300">
            Go to Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default page;
