import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { equipmentRouter } from './routes/equipment';
import { teamsRouter } from './routes/teams';
import { requestsRouter } from './routes/requests';
import { seedRouter } from './routes/seed';
import { reportsRouter } from './routes/reports';
import { authRouter } from './routes/auth';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.get('/', (c) => c.text('GearGuard API is Running 🚀'));

app.route('/equipment', equipmentRouter);
app.route('/teams', teamsRouter);
app.route('/requests', requestsRouter);
app.route('/seed', seedRouter);
app.route('/reports', reportsRouter);
app.route('/auth', authRouter);

export default app;
