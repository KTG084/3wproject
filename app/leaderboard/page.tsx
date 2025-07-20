import { prisma } from "@/lib/prisma";

import ClientLeaderboard from "@/components/ClientLeaderboard";
export const dynamic = "force-dynamic";
export default async function Leaderboard() {
  const users = await prisma.user.findMany({
    orderBy: { totalPoints: "desc" },
    include: {
      _count: {
        select: { claimHistory: true },
      },
    },
  });

  console.log(users);
  console.log("its working");

  return <ClientLeaderboard users={users} />;
}
