CREATE TABLE `equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`serial_number` text NOT NULL,
	`location` text NOT NULL,
	`department` text NOT NULL,
	`assigned_team_id` text,
	`status` text DEFAULT 'Active' NOT NULL,
	FOREIGN KEY (`assigned_team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `maintenance_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`equipment_id` text NOT NULL,
	`team_id` text NOT NULL,
	`assigned_to` text,
	`type` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`priority` text DEFAULT 'Low' NOT NULL,
	`scheduled_date` text,
	`duration_hours` real,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`members` text NOT NULL
);
