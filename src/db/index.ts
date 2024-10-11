import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// async function main() {

// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
