import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { teams } from '@gearguard/db';

type Bindings = {
    DB: D1Database;
};

export const teamsRouter = new Hono<{ Bindings: Bindings }>();

teamsRouter.get('/', async (c) => {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(teams).all();
    return c.json(result);
});

teamsRouter.post('/', async (c) => {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const id = crypto.randomUUID();

    const newTeam = {
        id,
        name: body.name,
        members: body.members || []
    };

    await db.insert(teams).values(newTeam).run();
    return c.json(newTeam, 201);
});
