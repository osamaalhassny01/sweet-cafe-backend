import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: {
        sub: string;
        email?: string;
        name: string;
        phone?: string;
        role?: string;
        type?: string;
    }): Promise<{
        id: string;
        email: string | undefined;
        name: string;
        phone: string | undefined;
        role: string | undefined;
        type: string | undefined;
    }>;
}
export {};
