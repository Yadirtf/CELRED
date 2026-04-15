import dbConnect from '@/infrastructure/database/mongoose';
import CatalogVisitorModel from '@/infrastructure/models/CatalogVisitorModel';

interface AnalyticsFilters {
    from?: string | null;
    to?: string | null;
    limit?: number;
}

export class AnalyticsService {
    /**
     * Gets aggregate analytics and recent visitors for the admin dashboard.
     */
    static async getDashboardAnalytics(filters: AnalyticsFilters) {
        await dbConnect();

        const limit = Math.min(filters.limit || 50, 200);

        // Build date filter
        const dateFilter: Record<string, unknown> = {};
        if (filters.from) dateFilter.$gte = new Date(filters.from);
        if (filters.to) dateFilter.$lte = new Date(filters.to);

        const query = Object.keys(dateFilter).length > 0
            ? { visitedAt: dateFilter }
            : {};

        // Recent visitors list
        const recentVisitors = await CatalogVisitorModel
            .find(query)
            .sort({ visitedAt: -1 })
            .limit(limit)
            .lean();

        // Aggregated stats
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            visitsToday,
            visitsLast7Days,
            visitsLast30Days,
            deviceBreakdown,
            browserBreakdown,
            osBreakdown,
            cityBreakdown,
            uniqueCitiesToday,
        ] = await Promise.all([
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: todayStart } }),
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: sevenDaysAgo } }),
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: thirtyDaysAgo } }),
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$device', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$os', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo }, city: { $ne: 'Desconocido' } } },
                { $group: { _id: { city: '$city', region: '$region', country: '$country' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 15 },
            ]),
            CatalogVisitorModel.distinct('city', {
                visitedAt: { $gte: todayStart },
                city: { $ne: 'Desconocido' },
            }),
        ]);

        return {
            recentVisitors,
            stats: {
                visitsToday,
                visitsLast7Days,
                visitsLast30Days,
                uniqueCitiesToday: uniqueCitiesToday.length,
            },
            breakdowns: {
                devices: deviceBreakdown.map((d: any) => ({
                    name: d._id || 'Desconocido',
                    count: d.count,
                })),
                browsers: browserBreakdown.map((b: any) => ({
                    name: b._id || 'Desconocido',
                    count: b.count,
                })),
                os: osBreakdown.map((o: any) => ({
                    name: o._id || 'Desconocido',
                    count: o.count,
                })),
                cities: cityBreakdown.map((c: any) => ({
                    city: c._id.city,
                    region: c._id.region,
                    country: c._id.country,
                    count: c.count,
                })),
            },
        };
    }
}
