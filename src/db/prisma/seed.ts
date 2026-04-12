import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { ArticleStatus, PrismaClient, UserRole } from './client/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const user1 = await prisma.user.create({
    data: {
      login: 'user1',
      password: 'passuser1',
      role: UserRole.EDITOR,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      login: 'user2',
      password: 'user2pas',
      role: UserRole.EDITOR,
    },
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Tech', description: 'Technology news and articles' },
      { name: 'Health', description: 'Health and wellness' },
      { name: 'Travel', description: 'Travel stories and tips' },
    ],
  });

  const allCategories = await prisma.category.findMany();

  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Opinion' },
      { name: 'Gaming' },
      { name: 'Europe' },
      { name: 'Food' },
      { name: 'Nutrition' },
    ],
  });

  const allTags = await prisma.tag.findMany();

  // Create articles
  const articles = [];
  for (let i = 0; i < 5; i++) {
    const article = await prisma.article.create({
      data: {
        title: `Sample Article ${i + 1}`,
        content: `This is the content for article ${i + 1}.`,
        status: [
          ArticleStatus.DRAFT,
          ArticleStatus.PUBLISHED,
          ArticleStatus.ARCHIVED,
        ][i % 3],
        author: { connect: { id: i % 2 === 0 ? user1.id : user2.id } },
        category: {
          connect: { id: allCategories[i % allCategories.length].id },
        },
        tags: {
          connect: [
            { id: allTags[i % allTags.length].id },
            { id: allTags[(i + 1) % allTags.length].id },
          ],
        },
      },
    });
    articles.push(article);
  }

  await prisma.comment.createMany({
    data: [
      {
        content: 'Great article!',
        articleId: articles[0].id,
        authorId: user1.id,
      },
      {
        content: 'ragebait',
        articleId: articles[1].id,
        authorId: user2.id,
      },
      {
        content: 'Im not sure about this article',
        articleId: articles[2].id,
        authorId: user1.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
