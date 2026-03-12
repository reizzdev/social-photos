import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateDto) {
    return this.prisma.photos.create({
      data: {
        user_id: userId,
        image_url: dto.image_url,
      },
    });
  }

  async createPhoto(userId: string, dto: CreateDto) {
    const photo = await this.prisma.photos.create({
      data: {
        user_id: userId,
        image_url: dto.image_url,
      },
    });

    if (dto.tags && dto.tags.length > 0) {
      for (const tagName of dto.tags) {
        const tag = await this.prisma.tags.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });

        await this.prisma.photo_tags.create({
          data: {
            photo_id: photo.id,
            tag_id: tag.id,
          },
        });
      }
    }

    return photo;
  }

  async findAll() {
    return this.prisma.photos.findMany({
      select: {
        id: true,
        user_id: true, // 👈 ESTA ES LA SOLUCIÓN
        image_url: true,
        like_count: true,
        censored: true,
        created_at: true,

        users: {
          select: {
            id: true,
            username: true,
          },
        },

        photo_tags: {
          include: {
            tags: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.photos.findMany({
      where: { user_id: userId },

      select: {
        id: true,
        image_url: true,
        like_count: true,
        censored: true,
        created_at: true,

        photo_tags: {
          include: {
            tags: true,
          },
        },
      },

      orderBy: { created_at: 'desc' },
    });
  }

  async delete(userId: string, photoId: string) {
    const photo = await this.prisma.photos.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new Error('Foto no encontrada');

    if (photo.user_id !== userId) throw new Error('No autorizado');

    return this.prisma.photos.delete({
      where: { id: photoId },
    });
  }

  async toggleCensor(id: string) {
    const photo = await this.prisma.photos.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new Error('Photo not found');
    }

    return this.prisma.photos.update({
      where: { id },
      data: {
        censored: !photo.censored,
      },
    });
  }

async getByTag(name: string) {
  return this.prisma.photos.findMany({
    where: {
      photo_tags: {
        some: {
          tags: {
            name: name,
          },
        },
      },
    },

    select: {
      id: true,
      user_id: true, // 👈 SOLUCIÓN
      image_url: true,
      like_count: true,
      censored: true,
      created_at: true,

      users: {
        select: {
          id: true,
          username: true,
        },
      },

      photo_tags: {
        include: {
          tags: true,
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });
}

  async toggleLike(photoId: string, userId: string) {
    const existing = await this.prisma.likes.findUnique({
      where: {
        user_id_photo_id: {
          user_id: userId,
          photo_id: photoId,
        },
      },
    });

    if (existing) {
      await this.prisma.likes.delete({
        where: {
          user_id_photo_id: {
            user_id: userId,
            photo_id: photoId,
          },
        },
      });

      const photo = await this.prisma.photos.update({
        where: { id: photoId },
        data: {
          like_count: {
            decrement: 1,
          },
        },
      });

      return {
        liked: false,
        likes: photo.like_count,
      };
    } else {
      await this.prisma.likes.create({
        data: {
          user_id: userId,
          photo_id: photoId,
        },
      });

      const photo = await this.prisma.photos.update({
        where: { id: photoId },
        data: {
          like_count: {
            increment: 1,
          },
        },
      });

      return {
        liked: true,
        likes: photo.like_count,
      };
    }
  }
}
