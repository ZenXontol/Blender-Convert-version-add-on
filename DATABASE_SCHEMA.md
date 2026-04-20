# Database Schema Documentation

## Overview

The Blender Add-on Converter uses a PostgreSQL database with the following tables to store version information, API changes, conversion examples, and user submissions.

## Tables

### 1. `blender_versions`
Stores information about different Blender versions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `version` | `text` | Version string (e.g., '2.79b', '2.80', '4.1') |
| `release_date` | `timestamp` | Release date of the version |
| `api_version` | `text` | API version identifier |
| `is_legacy` | `boolean` | Whether this is a legacy version |
| `created_at` | `timestamp` | Record creation timestamp |

### 2. `api_changes`
Tracks API changes between Blender versions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `from_version_id` | `integer` | Foreign key to `blender_versions.id` (source version) |
| `to_version_id` | `integer` | Foreign key to `blender_versions.id` (target version) |
| `change_type` | `text` | Type of change: 'renamed', 'removed', 'added', 'modified', 'deprecated' |
| `class_name` | `text` | Python class name (e.g., 'bpy.types.Operator') |
| `old_name` | `text` | Old API name or signature |
| `new_name` | `text` | New API name or signature |
| `description` | `text` | Description of the change |
| `example_old` | `text` | Example of old API usage |
| `example_new` | `text` | Example of new API usage |
| `severity` | `text` | Severity: 'critical', 'high', 'medium', 'low' |
| `created_at` | `timestamp` | Record creation timestamp |

### 3. `conversion_examples`
Stores example conversions with before/after code.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `title` | `text` | Example title |
| `description` | `text` | Example description |
| `from_version_id` | `integer` | Foreign key to `blender_versions.id` |
| `to_version_id` | `integer` | Foreign key to `blender_versions.id` |
| `original_code` | `text` | Original (old version) code |
| `converted_code` | `text` | Converted (new version) code |
| `explanation` | `text` | Detailed explanation of the conversion |
| `tags` | `text[]` | Array of tags for filtering |
| `created_at` | `timestamp` | Record creation timestamp |

### 4. `addon_submissions`
Stores user submissions for conversion.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `user_id` | `text` | User or session identifier |
| `addon_name` | `text` | Name of the add-on |
| `original_code` | `text` | Original add-on code |
| `from_version` | `text` | Source Blender version |
| `to_version` | `text` | Target Blender version |
| `converted_code` | `text` | Converted code (output) |
| `conversion_issues` | `jsonb` | Array of conversion issues found |
| `status` | `text` | Status: 'pending', 'processing', 'completed', 'failed' |
| `created_at` | `timestamp` | Record creation timestamp |
| `updated_at` | `timestamp` | Last update timestamp |

### 5. `conversion_patterns`
Stores regex patterns for automatic code conversion.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `pattern_name` | `text` | Name of the pattern |
| `description` | `text` | Pattern description |
| `from_version_id` | `integer` | Foreign key to `blender_versions.id` |
| `to_version_id` | `integer` | Foreign key to `blender_versions.id` |
| `search_pattern` | `text` | Regex pattern to search for |
| `replacement_pattern` | `text` | Replacement pattern |
| `example_before` | `text` | Example before conversion |
| `example_after` | `text` | Example after conversion |
| `created_at` | `timestamp` | Record creation timestamp |

## Relationships

```
blender_versions (1) ──── (many) api_changes (many) ──── (1) blender_versions
                            │
                            ├─── (1) conversion_examples (1) ────┐
                            │                                    │
                            └─── (1) conversion_patterns (1) ────┘
```

## Sample Data

### Blender Versions
The database is seeded with versions from 2.79b to 4.1, marking 2.79b-2.93 as legacy and 3.0+ as modern.

### API Changes
Critical changes include:
- `context.scene.objects.active` → `context.view_layer.objects.active`
- `obj.select = True` → `obj.select_set(state=True)`
- Blender Internal render engine removal

### Conversion Patterns
Regex patterns for automatic conversion of common API changes.

## Indexes

Primary keys are automatically indexed. Additional indexes could be added for:
- `api_changes(from_version_id, to_version_id)` for faster filtering
- `conversion_examples(tags)` for tag-based searches
- `addon_submissions(status, created_at)` for monitoring submissions

## Maintenance

### Resetting the Database
```bash
# Push schema changes
npx drizzle-kit push

# Seed with initial data
npm run seed
```

### Adding New Versions
Add new versions to the `scripts/simple-seed.ts` file and rerun the seed script.

### Adding New Conversion Patterns
Add patterns to both:
1. `src/app/api/convert/route.ts` for the API endpoint
2. `scripts/simple-seed.ts` for database storage (optional)

## Performance Considerations

- The `conversion_issues` column in `addon_submissions` uses `jsonb` for flexible storage
- Large code submissions are stored as text (consider compression for very large add-ons)
- Regular expressions in `conversion_patterns` should be optimized for performance

## Security Considerations

- User submissions are stored but not publicly accessible
- No authentication required for basic conversion (session-based tracking)
- Code is not executed, only analyzed for patterns
- Input validation happens at the API level