import { AdminRole } from '@prisma/client';
export declare class UpdateAdminUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: AdminRole;
    isActive?: boolean;
}
