import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('admin/settings')
@UseGuards(AdminTokenGuard)
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @Patch()
  @AdminRoles(AdminRole.ADMIN)
  async updateSettings(@Body() dto: Record<string, string>) {
    for (const [key, value] of Object.entries(dto)) {
      await this.settingsService.set(key, value);
    }
    return this.settingsService.getAll();
  }
}

@ApiTags('Settings')
@Controller('settings')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getPublic() {
    return this.settingsService.getPublic();
  }
}
