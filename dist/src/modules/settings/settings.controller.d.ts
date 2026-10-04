import { SettingsService } from './settings.service';
export declare class AdminSettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<Record<string, string>>;
    updateSettings(dto: Record<string, string>): Promise<Record<string, string>>;
}
export declare class PublicSettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublic(): Promise<Record<string, string>>;
}
