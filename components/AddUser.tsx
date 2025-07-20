"use client";

import React, { useState } from "react";
import { User, Plus } from "lucide-react";
import { DialogClose } from "./ui/dialog";
import { useRouter } from "next/navigation";

const AddUser = () => {
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName.trim()) {
      setError("Please enter a user name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setUserName("");
        router.push('/leaderboard');
        
      } else {
        setError(result.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-1 shadow-2xl">
        <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Add New User
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-blue-200"
              >
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                  placeholder="Enter user name..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <DialogClose asChild>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700/80 text-gray-300 text-sm font-medium rounded-xl transition-all border border-gray-700 flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </DialogClose>

              <button
                type="submit"
                disabled={isSubmitting || !userName.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                      Adding...
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                      Add User
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;