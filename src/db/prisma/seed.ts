import { ArticleStatus, UserRole } from './client/client';
import dbClient from './dbClient';

async function main() {
  const user1 = await dbClient.user.create({
    data: {
      login: 'admin',
      password: '$2b$10$vZsjLv8pgin3zc8Pa5p5r.xnpZXmgHWOUOkOSZQNo6VJP7tEro5FW', //hashed password "admin"
      role: UserRole.ADMIN,
    },
  });

  const user2 = await dbClient.user.create({
    data: {
      login: 'user2',
      password: 'user2pas',
      role: UserRole.EDITOR,
    },
  });

  await dbClient.category.createMany({
    data: [
      { name: 'Tech', description: 'Technology news and articles' },
      { name: 'Health', description: 'Health and wellness' },
      { name: 'Travel', description: 'Travel stories and tips' },
    ],
  });

  const allCategories = await dbClient.category.findMany();

  await dbClient.tag.createMany({
    data: [
      { name: 'Opinion' },
      { name: 'Gaming' },
      { name: 'Europe' },
      { name: 'Food' },
      { name: 'Nutrition' },
    ],
  });

  const allTags = await dbClient.tag.findMany();

  // Create articles
  const articles = [];
  for (let i = 0; i < 5; i++) {
    const article = await dbClient.article.create({
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

  await dbClient.comment.createMany({
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
    await dbClient.$disconnect();
  });
