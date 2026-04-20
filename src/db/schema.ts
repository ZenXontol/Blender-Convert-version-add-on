import { pgTable, text, integer, serial, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Table for storing Blender version information
export const blenderVersions = pgTable('blender_versions', {
  id: serial('id').primaryKey(),
  version: text('version').notNull().unique(), // e.g., '2.79b', '2.80', '3.0', '4.0', '4.1'
  releaseDate: timestamp('release_date'),
  apiVersion: text('api_version'),
  isLegacy: boolean('is_legacy').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for storing API changes between versions
export const apiChanges = pgTable('api_changes', {
  id: serial('id').primaryKey(),
  fromVersionId: integer('from_version_id').references(() => blenderVersions.id),
  toVersionId: integer('to_version_id').references(() => blenderVersions.id),
  changeType: text('change_type').notNull(), // 'renamed', 'removed', 'added', 'modified', 'deprecated'
  className: text('class_name'), // e.g., 'bpy.types.Operator'
  oldName: text('old_name'), // e.g., 'bpy.context.scene.objects.active'
  newName: text('new_name'), // e.g., 'bpy.context.view_layer.objects.active'
  description: text('description'),
  exampleOld: text('example_old'),
  exampleNew: text('example_new'),
  severity: text('severity').notNull(), // 'critical', 'high', 'medium', 'low'
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for storing conversion examples
export const conversionExamples = pgTable('conversion_examples', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  fromVersionId: integer('from_version_id').references(() => blenderVersions.id),
  toVersionId: integer('to_version_id').references(() => blenderVersions.id),
  originalCode: text('original_code').notNull(),
  convertedCode: text('converted_code').notNull(),
  explanation: text('explanation'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for storing user submissions (add-on code to convert)
export const addonSubmissions = pgTable('addon_submissions', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // Could be session ID or actual user ID
  addonName: text('addon_name'),
  originalCode: text('original_code').notNull(),
  fromVersion: text('from_version').notNull(),
  toVersion: text('to_version').notNull(),
  convertedCode: text('converted_code'),
  conversionIssues: jsonb('conversion_issues'), // Array of issues found
  status: text('status').default('pending'), // 'pending', 'processing', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table for storing common patterns and their conversions
export const conversionPatterns = pgTable('conversion_patterns', {
  id: serial('id').primaryKey(),
  patternName: text('pattern_name').notNull(),
  description: text('description'),
  fromVersionId: integer('from_version_id').references(() => blenderVersions.id),
  toVersionId: integer('to_version_id').references(() => blenderVersions.id),
  searchPattern: text('search_pattern').notNull(), // Regex pattern to search for
  replacementPattern: text('replacement_pattern').notNull(), // Replacement pattern
  exampleBefore: text('example_before'),
  exampleAfter: text('example_after'),
  createdAt: timestamp('created_at').defaultNow(),
});
