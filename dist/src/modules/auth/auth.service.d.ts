import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomerLoginDto, CustomerRegisterDto } from './dto/customer-auth.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.AdminRole;
    } | null>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.AdminRole;
            isActive: boolean;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    } | null>;
    listAdminUsers(): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }[]>;
    updateAdminUser(id: string, dto: UpdateAdminUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    }>;
    deactivateAdminUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    }>;
    registerCustomer(dto: CustomerRegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            isActive: boolean;
        };
    }>;
    loginCustomer(dto: CustomerLoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            isActive: boolean;
        };
    }>;
    private createCustomerSession;
}
