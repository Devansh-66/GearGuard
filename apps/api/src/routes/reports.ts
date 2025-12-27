import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, sql, desc } from 'drizzle-orm';
import { maintenanceRequests, equipment } from '@gearguard/db';

type Bindings = {
    DB: D1Database;
};

export const reportsRouter = new Hono<{ Bindings: Bindings }>();

reportsRouter.get('/stats', async (c) => {
    const db = drizzle(c.env.DB);

    // Total Requests
    const totalRequests = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRequests).get();

    // By Status
    const byStatus = await db.select({
        status: maintenanceRequests.status,
        count: sql<number>`count(*)`
    })
        .from(maintenanceRequests)
        .groupBy(maintenanceRequests.status)
        .all();

    // Pending vs Completed (Simpler metric)
    const completedCount = byStatus.find(s => s.status === 'Repaired')?.count || 0;
    const pendingCount = (totalRequests?.count || 0) - completedCount;

    // By Priority (High Interest)
    const urgentRequests = await db.select({ count: sql<number>`count(*)` })
        .from(maintenanceRequests)
        .where(eq(maintenanceRequests.priority, 'High'))
        .get();

    // Recent Activity (Last 5)
    const recent = await db.select()
        .from(maintenanceRequests)
        .orderBy(desc(maintenanceRequests.createdAt))
        .limit(5)
        .all();

    return c.json({
        overview: {
            total: totalRequests?.count || 0,
            pending: pendingCount,
            completed: completedCount,
            urgent: urgentRequests?.count || 0
        },
        statusDistribution: byStatus,
        recentActivity: recent
    });
});
