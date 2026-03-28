import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    dto: {
      title: string;
      description?: string;
      goal_amount?: number;
      deadline_hours?: number;
      min_contribution?: number;
    },
  ) {
    const deadlineAt = dto.deadline_hours
      ? new Date(Date.now() + dto.deadline_hours * 60 * 60 * 1000)
      : null;

    return this.prisma.collections.create({
      data: {
        user_id: userId,
        title: dto.title,
        description: dto.description,
        goal_amount: dto.goal_amount ?? 0,
        deadline_hours: dto.deadline_hours ?? 24,
        deadline_at: deadlineAt,
        min_contribution: dto.min_contribution ?? 2,
      },
    });
  }

  async findAll(requesterId?: string) {
    const collections = await this.prisma.collections.findMany({
      where: { is_private: false },
      include: {
        users: {
          select: { id: true, username: true, avatar_url: true },
        },
        photos: {
          select: {
            id: true,
            image_url: true,
            access_type: true,
            censored: true,
            like_count: true,
            user_id: true,
            photo_tags: { include: { tags: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!requesterId) return collections.map(c => ({ ...c, has_contributed: false }));

    const contributions = await this.prisma.contributions.findMany({
      where: { user_id: requesterId },
      select: { collection_id: true },
    });

    const contributedIds = new Set(contributions.map(c => c.collection_id));

    return collections.map(c => ({
      ...c,
      has_contributed: contributedIds.has(c.id),
    }));
  }

  async findByUser(userId: string, requesterId?: string) {
    const collections = await this.prisma.collections.findMany({
      where: {
        user_id: userId,
        ...(requesterId !== userId && { is_private: false }),
      },
      include: {
        photos: {
          select: {
            id: true,
            image_url: true,
            access_type: true,
            censored: true,
            like_count: true,
            user_id: true,
            photo_tags: { include: { tags: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!requesterId) return collections.map(c => ({ ...c, has_contributed: false }));

    const contributions = await this.prisma.contributions.findMany({
      where: { user_id: requesterId },
      select: { collection_id: true },
    });

    const contributedIds = new Set(contributions.map(c => c.collection_id));

    return collections.map(c => ({
      ...c,
      has_contributed: contributedIds.has(c.id),
    }));
  }

  async findOne(id: string) {
    return this.prisma.collections.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, username: true, avatar_url: true },
        },
        photos: {
          select: {
            id: true,
            image_url: true,
            access_type: true,
            censored: true,
            like_count: true,
            user_id: true,
            photo_tags: { include: { tags: true } },
          },
        },
      },
    });
  }

  async delete(userId: string, collectionId: string) {
    const collection = await this.prisma.collections.findUnique({
      where: { id: collectionId },
    });

    if (!collection) throw new NotFoundException('Colección no encontrada');
    if (collection.user_id !== userId)
      throw new ForbiddenException('No autorizado');

    return this.prisma.collections.delete({ where: { id: collectionId } });
  }

  async togglePrivacy(userId: string, id: string) {
    const collection = await this.prisma.collections.findUnique({
      where: { id },
    });
    if (!collection) throw new NotFoundException('Colección no encontrada');
    if (collection.user_id !== userId)
      throw new ForbiddenException('No autorizado');

    return this.prisma.collections.update({
      where: { id },
      data: { is_private: !collection.is_private },
    });
  }
}