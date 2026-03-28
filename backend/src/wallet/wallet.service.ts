import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallets.findUnique({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallets.create({
        data: { user_id: userId, balance: 0 },
      });
    }

    return wallet;
  }

  async addFanblys(userId: string, amount: number, description: string) {
    const wallet = await this.getWallet(userId);

    const updated = await this.prisma.wallets.update({
      where: { user_id: userId },
      data: { balance: { increment: amount } },
    });

    await this.prisma.transactions.create({
      data: {
        user_id: userId,
        type: 'credit',
        amount,
        description,
      },
    });

    return updated;
  }

  async contribute(userId: string, collectionId: string, amount: number) {
    const wallet = await this.getWallet(userId);

    if ((wallet.balance ?? 0) < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const collection = await this.prisma.collections.findUnique({
      where: { id: collectionId },
    });

    if (!collection) throw new BadRequestException('Colección no encontrada');
    if (collection.completed) throw new BadRequestException('La meta ya fue completada');
    if (collection.deadline_at && new Date() > collection.deadline_at) {
      throw new BadRequestException('La meta ha expirado');
    }
    if (amount < (collection.min_contribution ?? 2)) {
  throw new BadRequestException(`El aporte mínimo es ${collection.min_contribution ?? 2} fanblys`);
}

    // Descontar fanblys del usuario
    await this.prisma.wallets.update({
      where: { user_id: userId },
      data: { balance: { decrement: amount } },
    });

    // Registrar transacción
    await this.prisma.transactions.create({
      data: {
        user_id: userId,
        type: 'contribution',
        amount,
        description: `Aporte a colección ${collection.title}`,
      },
    });

    // Registrar aporte
    await this.prisma.contributions.create({
      data: { user_id: userId, collection_id: collectionId, amount },
    });

    // Actualizar monto actual de la colección
    const updatedCollection = await this.prisma.collections.update({
      where: { id: collectionId },
      data: { current_amount: { increment: amount } },
    });

    // Verificar si se cumplió la meta
    if ((updatedCollection.current_amount ?? 0) >= (updatedCollection.goal_amount ?? 0)) {
      await this.completeMeta(collectionId, updatedCollection);
    }

    return { success: true, new_balance: (wallet.balance ?? 0) - amount };
  }

  private async completeMeta(collectionId: string, collection: any) {
    const total = collection.current_amount;
    //const creatorShare = Math.floor(total * 0.8);
    //const appShare = total - total;

    // Marcar colección como completada
    await this.prisma.collections.update({
      where: { id: collectionId },
      data: { completed: true },
    });

    // Pagar al creador
    await this.prisma.wallets.upsert({
      where: { user_id: collection.user_id },
      update: { balance: { increment: total } },
      create: { user_id: collection.user_id, balance: total },
    });

    await this.prisma.transactions.create({
      data: {
        user_id: collection.user_id,
        type: 'earning',
        amount: total,
        description: `Ganancia por meta completada: ${collection.title}`,
      },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.transactions.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getContributions(userId: string) {
    return this.prisma.contributions.findMany({
      where: { user_id: userId },
      include: {
        collections: {
          select: { id: true, title: true, completed: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async refundExpired() {
    const expired = await this.prisma.collections.findMany({
      where: {
        completed: false,
        deadline_at: { lt: new Date() },
      },
    });

    for (const collection of expired) {
      const contributions = await this.prisma.contributions.findMany({
        where: { collection_id: collection.id },
      });

      for (const contribution of contributions) {
        await this.prisma.wallets.update({
          where: { user_id: contribution.user_id },
          data: { balance: { increment: contribution.amount } },
        });

        await this.prisma.transactions.create({
          data: {
            user_id: contribution.user_id,
            type: 'refund',
            amount: contribution.amount,
            description: `Reembolso por meta no cumplida: ${collection.title}`,
          },
        });
      }

      await this.prisma.collections.update({
        where: { id: collection.id },
        data: { completed: true },
      });
    }
  }
}