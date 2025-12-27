import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { teams, equipment, maintenanceRequests } from '@gearguard/db';

type Bindings = {
    DB: D1Database;
};

export const seedRouter = new Hono<{ Bindings: Bindings }>();

seedRouter.post('/', async (c) => {
    const db = drizzle(c.env.DB);

    // 1. Teams
    const teamMechanicsId = crypto.randomUUID();
    const teamITId = crypto.randomUUID();
    const teamElectricalId = crypto.randomUUID();

    await db.insert(teams).values([
        { id: teamMechanicsId, name: "Heavy Mechanics", members: ["John Doe", "Mike Fixit", "Sarah Wrench"] },
        { id: teamITId, name: "IT Support", members: ["Alice Tech", "Bob Admin"] },
        { id: teamElectricalId, name: "Electrical Systems", members: ["Zap Watts", "Volta Ampere"] }
    ]).onConflictDoNothing().run();

    // 2. Equipment
    const eq1 = crypto.randomUUID();
    const eq2 = crypto.randomUUID();
    const eq3 = crypto.randomUUID();
    const eq4 = crypto.randomUUID();
    const eq5 = crypto.randomUUID();

    await db.insert(equipment).values([
        {
            id: eq1,
            name: "CAT Excavator 320",
            serialNumber: "CAT-320-X99",
            location: "Site A",
            department: "Operations",
            category: "Heavy Machinery",
            assignedTeamId: teamMechanicsId,
            status: "Active",
            purchaseDate: "2023-05-10"
        },
        {
            id: eq2,
            name: "Dell Precision Workstation",
            serialNumber: "DELL-9988",
            location: "Engineering Office",
            department: "Design",
            category: "Computers",
            assignedTeamId: teamITId,
            status: "Active",
            purchaseDate: "2024-01-15"
        },
        {
            id: eq3,
            name: "Siemens CNC Mill",
            serialNumber: "CNC-S-5500",
            location: "Workshop B",
            department: "Production",
            category: "Manufacturing",
            assignedTeamId: teamMechanicsId,
            status: "Active",
            purchaseDate: "2022-11-20"
        },
        {
            id: eq4,
            name: "Hydraulic Press 50T",
            serialNumber: "HP-50T-001",
            location: "Workshop A",
            department: "Production",
            category: "Manufacturing",
            assignedTeamId: teamMechanicsId,
            status: "Scrapped",
            purchaseDate: "2018-03-12"
        },
        {
            id: eq5,
            name: "Site Generator 500kVA",
            serialNumber: "GEN-500-X",
            location: "Power Plant",
            department: "Facilities",
            category: "Electrical",
            assignedTeamId: teamElectricalId,
            status: "Active",
            purchaseDate: "2023-08-01"
        }
    ]).onConflictDoNothing().run();

    // 3. Requests (Rich History for Reports)
    const requests = [];
    const statuses = ["New", "In Progress", "Repaired", "Scrap"];
    const types = ["Corrective", "Preventive"];
    const priorities = ["Low", "Medium", "High"];

    // Generate 25 past requests
    for (let i = 0; i < 25; i++) {
        const isCompleted = Math.random() > 0.4;
        const status = isCompleted ? "Repaired" : statuses[Math.floor(Math.random() * 2)]; // New or In Progress
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(Date.now() - daysAgo * 86400000);

        requests.push({
            id: crypto.randomUUID(),
            title: `Maintenance Request #${i + 100}`,
            description: "Generated mock request for testing reports.",
            equipmentId: [eq1, eq2, eq3, eq4, eq5][Math.floor(Math.random() * 5)],
            teamId: [teamMechanicsId, teamITId, teamElectricalId][Math.floor(Math.random() * 3)],
            type: types[Math.floor(Math.random() * types.length)] as "Corrective" | "Preventive",
            priority: priorities[Math.floor(Math.random() * priorities.length)] as "Low" | "Medium" | "High",
            status: status as "New" | "In Progress" | "Repaired" | "Scrap",
            completionDate: isCompleted ? new Date(createdAt.getTime() + 86400000 * 2).toISOString() : null, // 2 days to fix
            createdAt: createdAt,
            durationHours: isCompleted ? Math.floor(Math.random() * 8) + 1 : null,
            cost: isCompleted ? Math.floor(Math.random() * 500) + 50 : null // Assume we add 'cost' field or just use duration logic in UI
        });
    }

    // Batch inserts to avoid "too many SQL variables" error
    // SQLite limit is often 999 variables. With ~12 fields, batch of 10 should work (120 vars),
    // but D1 or the driver might be overhead-heavy or failing elsewhere.
    // Reducing to 2 to be extremely safe.
    const batchSize = 2;
    for (let i = 0; i < requests.length; i += batchSize) {
        await db.insert(maintenanceRequests).values(requests.slice(i, i + batchSize)).run();
    }

    return c.json({ success: true, message: `Database seeded with 5 Equipment, 3 Teams, and ${requests.length} Requests!` });
});
