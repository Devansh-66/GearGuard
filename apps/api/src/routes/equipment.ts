import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { equipment } from '@gearguard/db';

type Bindings = {
    DB: D1Database;
};

export const equipmentRouter = new Hono<{ Bindings: Bindings }>();

equipmentRouter.get('/', async (c) => {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(equipment).all();
    return c.json(result);
});

equipmentRouter.post('/', async (c) => {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const id = crypto.randomUUID();

    const newEquipment = {
        id,
        name: body.name,
        serialNumber: body.serialNumber,
        location: body.location, // Work Center
        department: body.department,
        assignedTeamId: body.assignedTeamId,
        status: body.status || "Active",
        purchaseDate: body.purchaseDate,
        warrantyExpiration: body.warrantyExpiration,
        assignee: body.assignee,
        category: body.category,
        notes: body.notes
    };

    // Minimal validation
    if (!newEquipment.name || !newEquipment.serialNumber) {
        return c.json({ error: "Missing fields" }, 400);
    }

    await db.insert(equipment).values(newEquipment).run();
    return c.json(newEquipment, 201);
});
