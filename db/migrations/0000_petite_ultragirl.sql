CREATE TABLE `permission` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`entity` text NOT NULL,
	`action` text NOT NULL,
	`access` text NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `permissionToRole` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`permission` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`permission`, `role`),
	FOREIGN KEY (`permission`) REFERENCES `permission`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`role`) REFERENCES `role`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plan` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `price` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`planId` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`interval` text NOT NULL,
	FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `role` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roleToUser` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`role` text NOT NULL,
	`user` text NOT NULL,
	PRIMARY KEY(`role`, `user`),
	FOREIGN KEY (`role`) REFERENCES `role`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`planId` text NOT NULL,
	`priceId` text NOT NULL,
	`interval` text NOT NULL,
	`status` text NOT NULL,
	`currentPeriodStart` integer NOT NULL,
	`currentPeriodEnd` integer NOT NULL,
	`cancelAtPeriodEnd` integer DEFAULT false,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`priceId`) REFERENCES `price`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `user` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`customerId` text
);
--> statement-breakpoint
CREATE TABLE `userImage` (
	`createdAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` numeric DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`altText` text,
	`contentType` text NOT NULL,
	`blob` blob NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_name_unique` ON `role` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_userId_unique` ON `subscription` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_customerId_unique` ON `user` (`customerId`);--> statement-breakpoint
CREATE UNIQUE INDEX `userImage_userId_unique` ON `userImage` (`userId`);