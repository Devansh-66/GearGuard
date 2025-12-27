import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const teams = sqliteTable('teams', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    members: text('members', { mode: 'json' }).$type<string[]>().notNull(),
});

export const equipment = sqliteTable('equipment', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    serialNumber: text('serial_number').notNull(),
    location: text('location').notNull(),
    department: text('department').notNull(),
    assignedTeamId: text('assigned_team_id').references(() => teams.id),
    status: text('status').$type<"Active" | "Scrapped">().notNull().default("Active"),
    // New Fields
    purchaseDate: text('purchase_date'),
    warrantyExpiration: text('warranty_expiration'),
    assignee: text('assignee'), // Employee/User
    category: text('category'), // e.g. "Monitors", "CNC" (Default: equipment type)
    notes: text('notes'),
});

export const workCenters = sqliteTable('work_centers', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull(),
    tag: text('tag'),
    alternativeWorkCenterIds: text('alternative_work_center_ids'), // JSON string of IDs
    costPerHour: real('cost_per_hour'),
    capacity: real('capacity'),
    timeEfficiency: real('time_efficiency'),
    oeeTarget: real('oee_target'),
});

export const maintenanceRequests = sqliteTable('maintenance_requests', {
    id: text('id').primaryKey(),
    title: text('title').notNull(), // Subject

    // Scoping
    maintenanceScope: text('maintenance_scope').$type<"Equipment" | "WorkCenter">().notNull().default("Equipment"),
    equipmentId: text('equipment_id').references(() => equipment.id), // Nullable if scope is WorkCenter
    workCenterId: text('work_center_id').references(() => workCenters.id), // New

    // Assignment
    teamId: text('team_id').references(() => teams.id).notNull(),
    technicianId: text('technician_id'), // Renamed from assignedTo to be clearer or just alias
    // actually schema had assignedTo, let's keep it or migrate. Ideally keep assignedTo for now to avoid break if convenient, but plan said "Technician".
    // I will map `assignedTo` to technician in UI or rename here if I can. Let's start with `assignedTo` as the technician field.
    assignedTo: text('assigned_to'),

    type: text('type').$type<"Corrective" | "Preventive">().notNull(),
    status: text('status').$type<"New" | "In Progress" | "Repaired" | "Scrap">().notNull().default("New"),
    priority: text('priority').$type<"Low" | "Medium" | "High">().notNull().default("Low"),

    // Scheduling & Details
    scheduledDate: text('scheduled_date'),
    durationHours: real('duration_hours'),
    completionDate: text('completion_date'),

    description: text('description'),
    instruction: text('instruction'), // New
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    role: text('role').$type<"Admin" | "Manager" | "Technician">().notNull().default("Technician"),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
