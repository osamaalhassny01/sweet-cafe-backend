import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
export declare class TablesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTables(): Promise<{
        number: number;
        id: string;
        seats: number;
        area: string;
        qrCode: string;
        status: import(".prisma/client").$Enums.TableStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTableByQrCode(qrCode: string): Promise<{
        number: number;
        id: string;
        seats: number;
        area: string;
        qrCode: string;
        status: import(".prisma/client").$Enums.TableStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTableStatus(id: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING'): Promise<{
        number: number;
        id: string;
        seats: number;
        area: string;
        qrCode: string;
        status: import(".prisma/client").$Enums.TableStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTable(dto: CreateTableDto): Promise<{
        number: number;
        id: string;
        seats: number;
        area: string;
        qrCode: string;
        status: import(".prisma/client").$Enums.TableStatus;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
