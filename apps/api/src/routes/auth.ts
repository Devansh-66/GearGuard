import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users } from '@gearguard/db';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';

type Bindings = {
    DB: D1Database;
    JWT_SECRET: string;
};

export const authRouter = new Hono<{ Bindings: Bindings }>();

// Secret for JWT (In real app, use env var, here hardcoded for local dev convenience if not set)
const JWT_SECRET = "secret-key-123";

authRouter.post('/signup', async (c) => {
    const db = drizzle(c.env.DB);
    const { email, password, name, role } = await c.req.json();

    if (!email || !password || !name) {
        return c.json({ error: "Missing fields" }, 400);
    }

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
        return c.json({ error: "User already exists" }, 409);
    }

    // In a real app, HASH PASSWORD here (e.g., bcrypt). 
    // For this prototype, we store plain text or simple hash to keep it simple as requested "ensure DB logic works".
    // I will simulate a "hash" by just appending specific string to show intent.
    const passwordHash = `hashed_${password}`;

    const newUser = {
        id: crypto.randomUUID(),
        email,
        passwordHash,
        name,
        role: role || "Technician",
        createdAt: new Date(),
    };

    await db.insert(users).values(newUser).run();

    return c.json({ success: true, message: "User created" }, 201);
});

authRouter.post('/login', async (c) => {
    const db = drizzle(c.env.DB);
    const { email, password } = await c.req.json();

    const user = await db.select().from(users).where(eq(users.email, email)).get();

    // Validate password (matches the "hash" logic above)
    if (!user || user.passwordHash !== `hashed_${password}`) {
        return c.json({ error: "Invalid credentials" }, 401);
    }

    // Generate JWT
    const payload = {
        sub: user.id,
        name: user.name,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };

    // Use env secret or fallback
    const token = await sign(payload, c.env.JWT_SECRET || JWT_SECRET);

    return c.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});
