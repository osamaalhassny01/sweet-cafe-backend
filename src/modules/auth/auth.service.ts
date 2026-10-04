import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomerLoginDto, CustomerRegisterDto } from './dto/customer-auth.dto';
import { AdminRole } from '@prisma/client';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      type: 'admin',
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role ?? AdminRole.ORDERS_STAFF,
        isActive: true,
      },
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async listAdminUsers() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAdminUser(id: string, dto: UpdateAdminUserDto) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('المستخدم غير موجود');

    const data: any = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      isActive: dto.isActive,
    };
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data,
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    };
  }

  async deactivateAdminUser(id: string) {
    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: { isActive: false },
    });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    };
  }

  async registerCustomer(dto: CustomerRegisterDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new ConflictException('رقم الهاتف مسجل بالفعل، سجّل الدخول بكلمة السر');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const customer = await this.prisma.customer.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone,
        passwordHash,
        isActive: true,
      },
    });

    return this.createCustomerSession(customer);
  }

  async loginCustomer(dto: CustomerLoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { phone: dto.phone },
    });
    if (!customer || !customer.isActive) {
      throw new UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
    }

    const isValid = await bcrypt.compare(dto.password, customer.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
    }

    return this.createCustomerSession(customer);
  }

  private async createCustomerSession(customer: {
    id: string;
    name: string;
    phone: string;
    isActive: boolean;
  }) {
    const payload = {
      sub: customer.id,
      name: customer.name,
      phone: customer.phone,
      type: 'customer',
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        isActive: customer.isActive,
      },
    };
  }
}
