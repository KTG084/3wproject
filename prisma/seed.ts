import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  
  const initialUsers = [
    'Rahul',
    'Kamal',
    'Sanak',
    'Priya',
    'Amit',
    'Sneha',
    'Raj',
    'Anita',
    'Vikash',
    'Ritu'
  ]

  await prisma.claimHistory.deleteMany()
  await prisma.user.deleteMany()


  for (const userName of initialUsers) {
    await prisma.user.create({
      data: {
        name: userName,
        totalPoints: 0
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })