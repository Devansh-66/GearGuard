CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'Technician' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `work_centers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`tag` text,
	`alternative_work_center_ids` text,
	`cost_per_hour` real,
	`capacity` real,
	`time_efficiency` real,
	`oee_target` real
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_maintenance_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`maintenance_scope` text DEFAULT 'Equipment' NOT NULL,
	`equipment_id` text,
	`work_center_id` text,
	`team_id` text NOT NULL,
	`technician_id` text,
	`assigned_to` text,
	`type` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`priority` text DEFAULT 'Low' NOT NULL,
	`scheduled_date` text,
	`duration_hours` real,
	`completion_date` text,
	`description` text,
	`instruction` text,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`work_center_id`) REFERENCES `work_centers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_maintenance_requests`("id", "title", "maintenance_scope", "equipment_id", "work_center_id", "team_id", "technician_id", "assigned_to", "type", "status", "priority", "scheduled_date", "duration_hours", "completion_date", "description", "instruction", "notes", "created_at") SELECT "id", "title", "maintenance_scope", "equipment_id", "work_center_id", "team_id", "technician_id", "assigned_to", "type", "status", "priority", "scheduled_date", "duration_hours", "completion_date", "description", "instruction", "notes", "created_at" FROM `maintenance_requests`;--> statement-breakpoint
DROP TABLE `maintenance_requests`;--> statement-breakpoint
ALTER TABLE `__new_maintenance_requests` RENAME TO `maintenance_requests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;