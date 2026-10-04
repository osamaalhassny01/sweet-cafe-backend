import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: string): Promise<string | null> {
    const setting = await this.prisma.settings.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getAll(): Promise<Record<string, string>> {
    const settings = await this.prisma.settings.findMany();
    return Object.fromEntries(settings.map(s => [s.key, s.value]));
  }

  async getPublic(): Promise<Record<string, string>> {
    const publicKeys = ['business_hours', 'contact_phone', 'contact_email', 'address', 'whatsapp_number'];
    const settings = await this.prisma.settings.findMany({ where: { key: { in: publicKeys } } });
    return Object.fromEntries(settings.map(s => [s.key, s.value]));
  }
}
