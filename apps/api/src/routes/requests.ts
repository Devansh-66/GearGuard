import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { maintenanceRequests, equipment } from '@gearguard/db';

type Bindings = {
    DB: D1Database;
};

export const requestsRouter = new Hono<{ Bindings: Bindings }>();

requestsRouter.get('/', async (c) => {
    const db = drizzle(c.env.DB);
    // Join with equipment to get name
    const result = await db.select({
        id: maintenanceRequests.id,
        title: maintenanceRequests.title,
        description: maintenanceRequests.description,
        status: maintenanceRequests.status,
        priority: maintenanceRequests.priority,
        type: maintenanceRequests.type,
        equipmentId: maintenanceRequests.equipmentId,
        equipmentName: equipment.name, // Fetched from join
        createdAt: maintenanceRequests.createdAt
    })
        .from(maintenanceRequests)
        .leftJoin(equipment, eq(maintenanceRequests.equipmentId, equipment.id))
        .all();

    return c.json(result);
});

requestsRouter.post('/', async (c) => {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const id = crypto.randomUUID();

    const newRequest = {
        id,
        title: body.title,
        description: body.description,
        equipmentId: body.equipmentId,
        teamId: body.teamId,
        type: body.type, // "Corrective" | "Preventive"
        priority: body.priority || "Low",
        status: "New" as const,
        scheduledDate: body.scheduledDate,
        createdAt: new Date(),
        assignedTo: body.assignedTo
    };

    await db.insert(maintenanceRequests).values(newRequest).run();
    return c.json(newRequest, 201);
});

requestsRouter.patch('/:id', async (c) => {
    const db = drizzle(c.env.DB);
    const id = c.req.param('id');
    const body = await c.req.json();

    // Generic update based on body
    // In a real app, strict validation here
    await db.update(maintenanceRequests)
        .set({ ...body })
        .where(eq(maintenanceRequests.id, id))
        .run();

    return c.json({ success: true, id, ...body });
});
