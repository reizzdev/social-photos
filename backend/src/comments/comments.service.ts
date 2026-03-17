import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getByPhoto(photoId: string) {
    return this.prisma.comments.findMany({
      where: { photo_id: photoId },
      select: {
        id: true,
        content: true,
        created_at: true,
        users: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async create(userId: string, photoId: string, content: string) {
    return this.prisma.comments.create({
      data: {
        user_id: userId,
        photo_id: photoId,
        content,
      },
      select: {
        id: true,
        content: true,
        created_at: true,
        users: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    });
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.user_id !== userId) throw new ForbiddenException('No autorizado');

    return this.prisma.comments.delete({ where: { id: commentId } });
  }
}