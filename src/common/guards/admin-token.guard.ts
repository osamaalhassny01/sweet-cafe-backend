import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ADMIN_ROLES_KEY } from '../decorators/admin-roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  private readonly logger = new Logger(AdminTokenGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const requiredRoles =
      this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    
    // Strategy 1: Check x-admin-key header (legacy)
    const expectedKey = this.configService.get<string>('app.adminApiKey');
    const adminKey = request.headers['x-admin-key'];
    
    if (expectedKey && adminKey === expectedKey) {
      (request as any).user = {
        type: 'admin',
        role: AdminRole.ADMIN,
        authMode: 'apiKey',
      };
      return true;
    }
    
    // Strategy 2: Check JWT Bearer token (new)
    const authHeader = request.headers['authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = await this.jwtService.verifyAsync(token);
        if (payload && payload.sub && payload.type === 'admin') {
          const user = await this.prisma.adminUser.findUnique({
            where: { id: payload.sub },
          });
          if (!user || !user.isActive) {
            throw new UnauthorizedException('حساب الإدارة غير نشط');
          }
          if (!this.roleAllowed(user.role, requiredRoles)) {
            throw new ForbiddenException('لا تملك صلاحية تنفيذ هذه العملية');
          }
          (request as any).user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'admin',
          };
          return true;
        }
      } catch (error) {
        if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
          throw error;
        }
        // Token invalid, fall through to rejection
      }
    }
    
    // If no admin key is configured at all, DENY access (fail-closed)
    if (!expectedKey) {
      this.logger.error('ADMIN_API_KEY is not configured! Admin endpoints are BLOCKED. Set the ADMIN_API_KEY environment variable.');
    }
    
    throw new UnauthorizedException('مفتاح المصادقة غير صالح');
  }

  private roleAllowed(role: AdminRole, requiredRoles: AdminRole[]) {
    if (role === AdminRole.ADMIN) return true;
    if (!requiredRoles.length) return true;
    return requiredRoles.includes(role);
  }
}
