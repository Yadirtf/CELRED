import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import CatalogVisitorModel from '@/infrastructure/models/CatalogVisitorModel';

// ── GET: Return visitor analytics for the admin dashboard ──
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

        // Build date filter
        const dateFilter: Record<string, unknown> = {};
        if (from) dateFilter.$gte = new Date(from);
        if (to) dateFilter.$lte = new Date(to);

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
            // Count visits today
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: todayStart } }),

            // Count visits last 7 days
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: sevenDaysAgo } }),

            // Count visits last 30 days
            CatalogVisitorModel.countDocuments({ visitedAt: { $gte: thirtyDaysAgo } }),

            // Device breakdown (last 30 days)
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$device', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),

            // Browser breakdown (last 30 days, top 10)
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),

            // OS breakdown (last 30 days, top 10)
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$os', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),

            // City breakdown (last 30 days, top 15)
            CatalogVisitorModel.aggregate([
                { $match: { visitedAt: { $gte: thirtyDaysAgo }, city: { $ne: 'Desconocido' } } },
                { $group: { _id: { city: '$city', region: '$region', country: '$country' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 15 },
            ]),

            // Unique cities today
            CatalogVisitorModel.distinct('city', {
                visitedAt: { $gte: todayStart },
                city: { $ne: 'Desconocido' },
            }),
        ]);

        return NextResponse.json({
            recentVisitors,
            stats: {
                visitsToday,
                visitsLast7Days,
                visitsLast30Days,
                uniqueCitiesToday: uniqueCitiesToday.length,
            },
            breakdowns: {
                devices: deviceBreakdown.map((d: { _id: string; count: number }) => ({
                    name: d._id || 'Desconocido',
                    count: d.count,
                })),
                browsers: browserBreakdown.map((b: { _id: string; count: number }) => ({
                    name: b._id || 'Desconocido',
                    count: b.count,
                })),
                os: osBreakdown.map((o: { _id: string; count: number }) => ({
                    name: o._id || 'Desconocido',
                    count: o.count,
                })),
                cities: cityBreakdown.map((c: { _id: { city: string; region: string; country: string }; count: number }) => ({
                    city: c._id.city,
                    region: c._id.region,
                    country: c._id.country,
                    count: c.count,
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching visitor analytics:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
