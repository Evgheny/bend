import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { UserRoles } from '../constants/user.roles';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,
  ) {}

  async create(userId: number, postDto: CreatePostDto): Promise<Post> {
    return await this.postModel.create({
      ...postDto,
      userId,
    });
  }

  async update(
    userId: number,
    userType: UserRoles,
    postId: number,
    postDto: UpdatePostDto,
  ): Promise<Post> {
    let post;
    if (userType === UserRoles.ADMIN) {
      post = await this.postModel.findOne({
        where: { id: postId },
      });
    } else {
      post = await this.postModel.findOne({
        where: {
          id: postId,
          userId,
        },
      });
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.title = postDto.title;
    post.content = postDto.content;
    post.isHidden = postDto.isHidden;

    await post.save();
    return post;
  }

  async remove(
    userId: number,
    userType: UserRoles,
    postId: number,
  ): Promise<void> {
    let post;
    if (userType === UserRoles.ADMIN) {
      post = await this.postModel.findOne({
        where: { id: postId },
      });
    } else {
      post = await this.postModel.findOne({
        where: {
          id: postId,
          userId,
        },
      });
    }

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await post.destroy();
  }

  async findOne(
    postId: number,
    userId: number,
    userType: UserRoles,
  ): Promise<Post | null> {
    if (userType === UserRoles.ADMIN) {
      return await this.postModel.findByPk(postId);
    }

    return await this.postModel.findOne({
      where: {
        id: postId,
        userId,
      },
    });
  }

  async findAll(userId: number, userType: UserRoles): Promise<Post[]> {
    if (userType === UserRoles.ADMIN) {
      return await this.postModel.findAll();
    }

    const posts = await this.postModel.findAll({
      where: {
        userId,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }

    return posts;
  }

  async findActive(userId: number, userType: UserRoles): Promise<Post[]> {
    if (userType === UserRoles.ADMIN) {
      return await this.postModel.findAll({
        where: {
          isHidden: false,
        },
      });
    }

    return await this.postModel.findAll({
      where: {
        userId,
        isHidden: false,
      },
    });
  }
}
