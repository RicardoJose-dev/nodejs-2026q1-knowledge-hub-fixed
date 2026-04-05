import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ArticleService } from 'src/article/article.service';
import { CreateCategoryDto, UpdateCategorydDto } from './dto';
import { Category } from './types';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @HttpCode(200)
  getCategories(): Category[] {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  @HttpCode(200)
  getCategoryById(@Param('id', new ParseUUIDPipe()) id: string): Category {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  @HttpCode(201)
  createCategory(@Body() body: CreateCategoryDto): Category {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  @HttpCode(200)
  updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCategorydDto,
  ): Category {
    const category = this.categoryService.getCategoryById(id);
    return this.categoryService.updateCategory(category, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = this.categoryService.getCategoryById(id);
    this.categoryService.deleteCategory(category);
    this.articleService.removeCategoryFromArticle(category)
  }
}
