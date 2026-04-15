import dbConnect from '@/infrastructure/database/mongoose';
import CatalogStatsModel from '@/infrastructure/models/CatalogStatsModel';
import CatalogVisitorModel from '@/infrastructure/models/CatalogVisitorModel';
import CustomerEventModel from '@/infrastructure/models/CustomerEventModel';
import { geolocateIp } from '@/lib/geolocateIp';
import { parseUserAgent } from '@/lib/parseUserAgent';

export interface RegisterVisitPayload {
    visitorId: string;
    customerUUID?: string;
    isNewSession: boolean;
    referrer?: string;
    screenResolution?: string;
    exactLocation?: { city: string, region: string, country: string, device?: string };
    ip: string;
    userAgent: string;
}

export interface TrackEventPayload {
    customerUUID: string;
    eventType: 'PRODUCT_VIEW' | 'WHATSAPP_START' | 'CATALOG_VISIT';
    productId?: string;
    productName?: string;
    preference?: 'CONTADO' | 'FINANCIADO';
    metadata?: Record<string, any>;
}

export class TrackingService {
    
    /**
     * Updates an existing session with exact GPS location
     */
    static async updateExactLocation(visitorId: string, exactLocation: any) {
        await dbConnect();
        await CatalogVisitorModel.findOneAndUpdate(
            { visitorId },
            {
                $set: {
                    city: exactLocation.city,
                    region: exactLocation.region,
                    country: exactLocation.country,
                    device: exactLocation.device || undefined
                }
            }
        );
    }

    /**
     * Registers a completely new unique visit (for the current session)
     */
    static async registerNewVisit(payload: RegisterVisitPayload) {
        await dbConnect();

        // 1. Increment total overall catalog visits
        await CatalogStatsModel.findOneAndUpdate(
            {},
            { $inc: { totalVisits: 1 } },
            { upsert: true, new: true }
        );

        // 2. Parse User Agent
        const parsed = parseUserAgent(payload.userAgent);

        // 3. Geolocate via IP (Async/Await safely)
        let geo = { city: 'Desconocido', region: 'Desconocido', country: 'Desconocido' };
        try {
            geo = await geolocateIp(payload.ip);
        } catch { /* proceed with defaults */ }

        // 4. Save Visitor Record Session
        try {
            await CatalogVisitorModel.create({
                visitorId: payload.visitorId,
                customerUUID: payload.customerUUID,
                ip: payload.ip,
                device: parsed.device,
                browser: parsed.browser,
                os: parsed.os,
                city: geo.city,
                region: geo.region,
                country: geo.country,
                referrer: payload.referrer || 'Directo',
                screenResolution: payload.screenResolution || 'Desconocido',
                visitedAt: new Date(),
            });
        } catch (err) {
            console.error('Error saving visitor record:', err);
        }

        // 5. Track Visit Event to History
        if (payload.customerUUID) {
            await this.trackEvent({
                customerUUID: payload.customerUUID,
                eventType: 'CATALOG_VISIT',
                metadata: {
                    referrer: payload.referrer,
                    device: parsed.device
                }
            });
        }
    }

    /**
     * Generic interaction tracker for retargeting
     */
    static async trackEvent(payload: TrackEventPayload) {
        if (!payload.customerUUID) return;
        
        await dbConnect();
        
        // Anti-spam: Do not track same product view twice in the exact same minute
        if (payload.eventType === 'PRODUCT_VIEW' && payload.productId) {
            const oneMinuteAgo = new Date(Date.now() - 60000);
            const recentDuplicate = await CustomerEventModel.findOne({
                customerUUID: payload.customerUUID,
                eventType: 'PRODUCT_VIEW',
                productId: payload.productId,
                createdAt: { $gt: oneMinuteAgo }
            });
            if (recentDuplicate) return; 
        }

        await CustomerEventModel.create(payload);
    }

    /**
     * Gets the latest unique product IDs interacted by the user for Retargeting.
     */
    static async getRecommendations(customerUUID: string, limit: number = 4): Promise<string[]> {
        if (!customerUUID) return [];
        
        await dbConnect();

        // 1. Group by product to eliminate duplicates
        // 2. Sort by the most recent timestamp to show freshest first
        const recentInteractions = await CustomerEventModel.aggregate([
            { 
                $match: { 
                    customerUUID, 
                    productId: { $exists: true, $ne: null },
                    eventType: { $in: ['PRODUCT_VIEW', 'WHATSAPP_START'] }
                } 
            },
            // Sort all raw events by descending date
            { $sort: { createdAt: -1 } },
            // Group by productId, capturing the absolute latest date they saw it
            { 
                $group: { 
                    _id: '$productId', 
                    lastSeen: { $first: '$createdAt' } 
                } 
            },
            // Sort the final unique list by descending date
            { $sort: { lastSeen: -1 } },
            { $limit: limit }
        ]);

        return recentInteractions.map(r => r._id);
    }
}
