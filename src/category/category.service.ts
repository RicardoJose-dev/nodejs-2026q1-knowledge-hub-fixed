import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { categories } from 'src/db/categories';
import { CreateCategoryDto, UpdateCategorydDto } from './dto';
import { Category } from './types';

@Injectable()
export class CategoryService {
  getCategories(): Category[] {
    return categories;
  }

  getCategoryById(categoryId: string): Category {
    const category = categories.find(({ id }) => id === categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  createCategory(body: CreateCategoryDto): Category {
    const { name, description } = body;

    const newCategory: Category = {
      id: randomUUID(),
      name,
      description,
    };

    categories.push(newCategory);

    return newCategory;
  }

  updateCategory(category: Category, body: UpdateCategorydDto) {
    const updateCategory = {
      ...category,
      ...body,
    };

    categories.map((dbCategory) =>
      dbCategory.id !== category.id ? dbCategory : updateCategory,
    );
    return updateCategory;
  }

  deleteCategory(category: Category) {
    categories.filter(({ id }) => id !== category.id);
  }
}
