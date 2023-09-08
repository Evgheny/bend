import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.userId, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findActive(@Request() req) {
    return this.postService.findActive(req.user.id, req.user.type);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: number) {
    return this.postService.findOne(id, req.user.id, req.user.type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAll(@Request() req) {
    return this.postService.findAll(req.user.id, req.user.type);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(
      req.user.id,
      req.user.type,
      id,
      updatePostDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number) {
    return this.postService.remove(req.user.id, req.user.type, id);
  }
}
