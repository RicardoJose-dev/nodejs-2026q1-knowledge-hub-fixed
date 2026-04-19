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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Category } from 'src/db/prisma/client/client';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategorydDto } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  @HttpCode(200)
  getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get category by id' })
  @HttpCode(200)
  getCategoryById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create category' })
  @HttpCode(201)
  createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Update category' })
  @HttpCode(200)
  async updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCategorydDto,
  ): Promise<Category> {
    const category = await this.categoryService.getCategoryById(id);
    return this.categoryService.updateCategory(category, body);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete category' })
  @HttpCode(204)
  async deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryService.getCategoryById(id);
    this.categoryService.deleteCategory(category);
  }
}
