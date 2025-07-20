"use client";

import { Award } from "lucide-react";

type User = {
  id: string;
  name: string;
  totalPoints: number;
};

type UserSelectorProps = {
  users: User[];
  rank: number;
  selectedUserId: string | null;
  handleClaimPoints: () => void;
  isLoading: boolean;
};

export default function UserSelector({
  users,
  rank,
  selectedUserId,
  handleClaimPoints,
  isLoading,
}: UserSelectorProps) {
  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div>
      {selectedUser && (
        <div className="mt-4 p-1 bg-gradient-to-br from-gray-800 to-blue-900 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 p-6 rounded-lg backdrop-blur-sm border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-light tracking-wider text-blue-300/80 uppercase">
                  Member
                </span>
                <h3 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
                  {selectedUser.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-light text-blue-300/70">
                  Current Points
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">
                  {selectedUser.totalPoints}
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimPoints}
              disabled={!selectedUserId || isLoading}
              className={`w-full mt-6 py-3 px-6 rounded-lg transition-all duration-300 ${
                isLoading
                  ? "bg-gray-500/20 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-emerald-500/20"
              } text-white font-medium flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 text-amber-200" />
                  <span>Claim Random Points</span>
                </>
              )}
            </button>

            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <div className="text-sm font-light text-blue-300/80">
                Current Rank:{" "}
                <span className="font-medium text-blue-100">#{rank}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
