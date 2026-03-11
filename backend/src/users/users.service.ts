import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async createUser(dto: CreateUserDto) {
    return this.prisma.users.create({
      data: dto,
    });
  }

  async getProfile(id: string) {
    return this.prisma.users.findUnique({
      where: { id }, // UUID correcto
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        role: true,
        created_at: true,
      },
    });
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new Error('No puedes seguirte a ti mismo');

    return this.prisma.followers.create({
      data: {
        follower_id: userId,
        following_id: targetId,
      },
    });
  }

  async unfollow(userId: string, targetId: string) {
    return this.prisma.followers.delete({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetId,
        },
      },
    });
  }

  async getFollowers(userId: string) {
    const followers = await this.prisma.followers.findMany({
      where: { following_id: userId },
      include: { users_followers_follower_idTousers: true },
    });

    return followers.map((f) => ({
      id: f.follower_id,
      username: f.users_followers_follower_idTousers.username,
    }));
  }

  async getFollowing(userId: string) {
    const following = await this.prisma.followers.findMany({
      where: { follower_id: userId },
      include: { users_followers_following_idTousers: true },
    });

    return following.map((f) => ({
      id: f.following_id,
      username: f.users_followers_following_idTousers.username,
    }));
  }

  async findById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        role: true,
        created_at: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        role: true,
        created_at: true,
      },
    });
  }
}
