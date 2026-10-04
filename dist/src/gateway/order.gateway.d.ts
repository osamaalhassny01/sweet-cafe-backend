import { Server, Socket } from 'socket.io';
export declare class OrderGateway {
    server: Server;
    handleConnection(client: Socket): void;
    broadcastNewOrder(order: any): void;
    broadcastOrderStatusUpdate(order: any): void;
    handleJoinCustomerRoom(client: Socket, phone: string): {
        joined: boolean;
    };
    handleJoinAdminRoom(client: Socket): {
        joined: boolean;
    };
}
