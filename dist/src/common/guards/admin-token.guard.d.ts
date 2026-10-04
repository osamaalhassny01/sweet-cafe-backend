import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminTokenGuard implements CanActivate {
    private readonly configService;
    private readonly jwtService;
    private readonly reflector;
    private readonly prisma;
    private readonly logger;
    constructor(configService: ConfigService, jwtService: JwtService, reflector: Reflector, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private roleAllowed;
}
