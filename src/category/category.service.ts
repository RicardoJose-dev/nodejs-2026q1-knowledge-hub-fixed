import { Injectable, NotFoundException } from '@nestjs/common';
import dbClient from 'src/db/prisma/dbClient';
import { CreateCategoryDto, UpdateCategorydDto } from './dto';
import { Category } from 'src/db/prisma/client/client';

@Injectable()
export class CategoryService {
  getCategories(): Promise<Category[]> {
    return dbClient.category.findMany();
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const category = await dbClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async createCategory(body: CreateCategoryDto): Promise<Category> {
    const { name, description } = body;

    const newCategory = await dbClient.category.create({
      data: {
        name,
        description,
      },
    });

    return newCategory;
  }

  async updateCategory(
    category: Category,
    body: UpdateCategorydDto,
  ): Promise<Category> {
    const updateCategory = await dbClient.category.update({
      where: {
        id: category.id,
      },
      data: {
        ...body,
      },
    });

    return updateCategory;
  }

  deleteCategory(category: Category) {
    dbClient.category.delete({ where: { id: category.id } });
  }
}
