import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomerLoginDto, CustomerRegisterDto } from './dto/customer-auth.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator';

@ApiTags('Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('users')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  async listUsers() {
    return this.authService.listAdminUsers();
  }

  @Patch('users/:id')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.authService.updateAdminUser(id, dto);
  }

  @Delete('users/:id')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  async deactivateUser(@Param('id') id: string) {
    return this.authService.deactivateAdminUser(id);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}

@ApiTags('Customer Auth')
@Controller('auth')
export class CustomerAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CustomerRegisterDto) {
    return this.authService.registerCustomer(dto);
  }

  @Post('login')
  async login(@Body() dto: CustomerLoginDto) {
    return this.authService.loginCustomer(dto);
  }
}
