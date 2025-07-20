import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

  
    const pointsEarned = Math.floor(Math.random() * 10) + 1

    
    const result = await prisma.$transaction(async (tx) => {
    
      const claimRecord = await tx.claimHistory.create({
        data: {
          userId,
          points: pointsEarned
        },
        include: {
          user: true
        }
      })

   
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          totalPoints: {
            increment: pointsEarned
          }
        }
      })

      return {
        claimRecord,
        updatedUser,
        pointsEarned
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        user: result.updatedUser,
        pointsEarned: result.pointsEarned,
        claimId: result.claimRecord.id
      }
    })
  } catch (error) {
    console.error('Error claiming points:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to claim points' },
      { status: 500 }
    )
  }
}