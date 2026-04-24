import 'dotenv/config';
import { PrismaClient } from '../../src/db/prisma/client/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL_FROM_OUTSIDE_CONTAINERS,
  }),
});

export default prisma;
