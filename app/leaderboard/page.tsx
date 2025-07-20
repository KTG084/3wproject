import { prisma } from "@/lib/prisma";


import ClientLeaderboard from "@/components/ClientLeaderboard";

export default async function Leaderboard() {
  const users = await prisma.user.findMany({
    orderBy: { totalPoints: "desc" },
    include: {
      _count: {
        select: { claimHistory: true },
      },
    },
  });

  return <ClientLeaderboard users={users} />;
}
