"use client";

import { useMemo } from "react";
import { Calendar, User, Award, Clock, Trophy } from "lucide-react";

type Claim = {
  id: string;
  points: number;
  claimedAt: string;
  user: {
    name: string;
  };
};

export default function ClaimHistory({ initialClaims }: { initialClaims: Claim[] }) {
  const formattedClaims = useMemo(() => {
    return initialClaims.map((claim) => {
      const date = new Date(claim.claimedAt);
      return {
        ...claim,
        formattedDate: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        formattedTime: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [initialClaims]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">
            Claim History
          </h1>
        </div>

        {formattedClaims.length === 0 ? (
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-5">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No Claims Recorded</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Claim points to see your reward history displayed here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formattedClaims.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between p-5 bg-gray-800/40 rounded-xl border border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-800/30 border border-amber-600/30">
                    <User className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-100 text-lg">{claim.user.name}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{claim.formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{claim.formattedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-700/40 to-teal-700/40 px-4 py-2.5 rounded-lg border border-emerald-600/30">
                  <Award className="w-5 h-5 text-emerald-300" />
                  <span className="font-bold text-emerald-300 text-xl">+{claim.points}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}