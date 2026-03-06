import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, imageUrl: string) {
    return this.prisma.photos.create({
      data: {
        user_id: userId,
        image_url: imageUrl,
      },
    });
  }

  async createPhoto(userId: string, imageUrl: string, tags: string[]) {

    const photo = await this.prisma.photos.create({
      data: {
        user_id: userId,
        image_url: imageUrl
      }
    });

    for (const tagName of tags) {

      const tag = await this.prisma.tags.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });

      await this.prisma.photo_tags.create({
        data: {
          photo_id: photo.id,
          tag_id: tag.id
        }
      });

    }

    return photo;
  }

  async findAll() {
    return this.prisma.photos.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },

        photo_tags: {
          include: {
            tags: true
          }
        }

      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.photos.findMany({
      where: { user_id: userId },
      include: {
        photo_tags: {
          include: {
            tags: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async delete(userId: string, photoId: string) {

    const photo = await this.prisma.photos.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new Error("Foto no encontrada");

    if (photo.user_id !== userId) throw new Error("No autorizado");

    return this.prisma.photos.delete({
      where: { id: photoId },
    });
  }
}