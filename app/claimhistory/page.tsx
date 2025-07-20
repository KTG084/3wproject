import ClaimHistory from "@/components/ClaimHistory";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Page() {
  const claims = await prisma.claimHistory.findMany({
    orderBy: { claimedAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const serializedClaims = claims.map(claim => ({
    ...claim,
    claimedAt: claim.claimedAt.toISOString(),
  }));

  return <ClaimHistory initialClaims={serializedClaims} />;
}