import { z } from 'zod';

const PlatformConfig = z.object({
    invite: z.httpUrl().describe('The bot invite URL.'),
    guild: z.httpUrl().describe('The invite link for the support community.'),
});

export const ConfigPublicType = z.object({
    api_url: z.url().describe('The domain that the FishingBucket API is hosted on.'),
    name: z.string().describe('The name of the FishingBucket instance.'),
    fluxer: PlatformConfig.describe('Information related to the Fluxer bot.'),
    discord: PlatformConfig.optional().describe('Information related to the Discord bot.'),
    github: z.httpUrl().describe('The source code repository of the FishingBucket bot.'),
});
