import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomerLoginDto, CustomerRegisterDto } from './dto/customer-auth.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
export declare class AdminAuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    listUsers(): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
    }[]>;
    updateUser(id: string, dto: UpdateAdminUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    }>;
    deactivateUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.AdminRole;
        isActive: boolean;
    } | null>;
}
export declare class CustomerAuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CustomerRegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            isActive: boolean;
        };
    }>;
    login(dto: CustomerLoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            isActive: boolean;
        };
    }>;
}
