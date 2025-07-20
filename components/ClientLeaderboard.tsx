"use client";

import { useMemo, useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  PlusCircle,
  BarChart,
  Crown,
  ChevronUp,
} from "lucide-react";
import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddUser from "@/components/AddUser";
import { Button } from "./ui/button";
import UserSelector from "./UserSelector";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  users: (User & { _count: { claimHistory: number } })[];
};

export default function ClientLeaderboard({ users }: Props) {
  console.log(users);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isRank, setisRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastClaim, setLastClaim] = useState<any>(null);
  const router = useRouter();

  const rankedUsers = useMemo(() => {
    return [...users].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [users]);

  // Separate top 3 and remaining users
  const topThree = rankedUsers.slice(0, 3);
  const remainingUsers = rankedUsers.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">{rank}</span>
          </div>
        );
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUserId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      const result = await response.json();
      if (result.success) {
        setLastClaim({
          userName: rankedUsers.find((u) => u.id === selectedUserId)?.name,
          points: result.data.pointsEarned,
          timestamp: new Date(),
        });
        router.push("/leaderboard");
      } else {
        alert("Failed to claim points: " + result.error);
      }
    } catch (error) {
      console.error("Error claiming points:", error);
      alert("Failed to claim points");
    } finally {
      setIsLoading(false);
    }
  };

  if (rankedUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center p-6">
        <Trophy className="w-16 h-16 text-gray-400 mb-6" />
        <h3 className="text-xl font-medium text-gray-200 mb-3">No Users Yet</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Add users to start tracking points and rankings
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="px-6 py-3 text-white bg-gradient-to-r from-orange-900-600 to-yellow-700 hover:from-orange-900-700 hover:to-yellow-800 transition-all rounded-xl shadow-lg flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add First User
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-gray-700 bg-gray-800 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white text-center">
                Create New User
              </DialogTitle>
            </DialogHeader>
            <AddUser />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Trophy className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">
              Points Leaderboard
            </h1>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Select a User and Claim points and track rankings in real-time
          </p>
        </div>

        {lastClaim && (
          <div className="bg-gradient-to-r from-emerald-900/50 to-teal-800/50 border border-emerald-700/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-800/50 p-2 rounded-lg">
                <BarChart className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-200">
                  Points Claimed Successfully!
                </h3>
                <p className="text-emerald-100 text-sm">
                  <strong>{lastClaim.userName}</strong> earned{" "}
                  <strong className="text-emerald-300">
                    {lastClaim.points} points
                  </strong>
                </p>
              </div>
              <Link
                href="/claimhistory"
                className="ml-auto text-xs bg-emerald-700/50 hover:bg-emerald-600/50 py-1 px-3 rounded-lg transition-colors"
              >
                View History
              </Link>
            </div>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top Performers
          </h2>
          <div className="grid grid-cols-3 gap-6 items-end">
            {topThree[1] && (
              <div
                className="bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-5 pt-10 text-center transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  setSelectedUserId(topThree[1].id);
                  setisRank(2);
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center mb-2">
                    <span className="text-xl font-bold text-slate-300">
                      {getRankIcon(2)}
                    </span>
                  </div>
                </div>
                <div className="h-16 w-16 mx-auto rounded-full bg-slate-600 mb-4 flex items-center justify-center text-white text-lg font-bold">
                  {topThree[1].name.charAt(0)}
                </div>
                <h3 className="font-medium text-gray-100 mb-1">
                  {topThree[1].name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                  <p className="text-2xl font-bold text-white">
                    {topThree[1].totalPoints}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">points</p>
              </div>
            )}

            {topThree[0] && (
              <div
                className="bg-gradient-to-b from-amber-700 to-amber-800 border border-amber-600 rounded-xl p-6 pt-14 text-center shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  setSelectedUserId(topThree[0].id);
                  setisRank(1);
                }}
              >
                <div className="flex justify-center mb-4">
                  <Crown className="w-8 h-8 text-amber-400 mb-3" />
                </div>
                <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-amber-600 to-amber-700 mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {topThree[0].name.charAt(0)}
                </div>
                <h3 className="font-medium text-gray-100 mb-1">
                  {topThree[0].name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                  <p className="text-3xl font-bold text-white">
                    {topThree[0].totalPoints}
                  </p>
                </div>
                <p className="text-xs text-amber-200 mt-1">points</p>
              </div>
            )}

            {topThree[2] && (
              <div
                className="bg-gradient-to-b from-amber-800/80 to-amber-900/90 border border-amber-700 rounded-xl p-5 pt-10 text-center transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={() => {
                  setSelectedUserId(topThree[2].id);
                  setisRank(3);
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-700/80 to-amber-800/90 flex items-center justify-center mb-2">
                    <span className="text-xl font-bold text-amber-300">
                      {getRankIcon(3)}
                    </span>
                  </div>
                </div>
                <div className="h-16 w-16 mx-auto rounded-full bg-amber-700/50 mb-4 flex items-center justify-center text-white text-lg font-bold">
                  {topThree[2].name.charAt(0)}
                </div>
                <h3 className="font-medium text-gray-100 mb-1">
                  {topThree[2].name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                  <p className="text-2xl font-bold text-white">
                    {topThree[2].totalPoints}
                  </p>
                </div>
                <p className="text-xs text-amber-200 mt-1">points</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-400" />
            Full Rankings
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-4 py-2 text-white bg-gradient-to-r from-orange-600 to-yellow-700 hover:from-orange-700 hover:to-yellow-800 transition-all rounded-xl shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-gray-700 bg-gray-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white text-center">
                  Create New User
                </DialogTitle>
              </DialogHeader>
              <AddUser />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 mb-10">
          {remainingUsers.map((user, index) => {
            const rank = index + 4;
            return (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUserId(user.id);
                  setisRank(rank);
                }}
                className="flex cursor-pointer items-center justify-between p-4 rounded-xl bg-gray-800/40 border border-gray-700 transition-all duration-300 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-300">
                      {rank}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100">{user.name}</h3>
                    <p className="text-xs text-gray-400">
                      {user._count?.claimHistory || 0} claims
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                  <div className="text-lg font-bold text-white">
                    {user.totalPoints}
                  </div>
                  <div className="text-xs text-gray-400 w-12 text-right">
                    points
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <UserSelector
          users={rankedUsers}
          rank={isRank}
          isLoading={isLoading}
          handleClaimPoints={handleClaimPoints}
          selectedUserId={selectedUserId}
        />
      </div>
    </div>
  );
}
