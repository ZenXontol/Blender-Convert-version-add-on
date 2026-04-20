import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:5432/app_db'
});

async function seedDatabase() {
  console.log('Seeding database...');

  const client = await pool.connect();

  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE conversion_patterns CASCADE');
    await client.query('TRUNCATE TABLE conversion_examples CASCADE');
    await client.query('TRUNCATE TABLE api_changes CASCADE');
    await client.query('TRUNCATE TABLE blender_versions CASCADE');

    // Insert Blender versions
    const versions = [
      ['2.79b', '2017-09-11', '2.79', true],
      ['2.80', '2019-07-30', '2.80', true],
      ['2.81', '2019-11-21', '2.81', true],
      ['2.82', '2020-02-14', '2.82', true],
      ['2.83', '2020-06-03', '2.83', true],
      ['2.90', '2020-08-31', '2.90', true],
      ['2.91', '2020-11-25', '2.91', true],
      ['2.92', '2021-02-25', '2.92', true],
      ['2.93', '2021-06-02', '2.93', true],
      ['3.0', '2021-12-03', '3.0', false],
      ['3.1', '2022-03-09', '3.1', false],
      ['3.2', '2022-06-08', '3.2', false],
      ['3.3', '2022-09-07', '3.3', false],
      ['3.4', '2022-12-07', '3.4', false],
      ['3.5', '2023-03-29', '3.5', false],
      ['3.6', '2023-06-28', '3.6', false],
      ['4.0', '2023-11-14', '4.0', false],
      ['4.1', '2024-03-26', '4.1', false],
    ];

    const versionIds: Record<string, number> = {};

    for (const row of versions) {
      const version = row[0] as string;
      const releaseDate = row[1] as string;
      const apiVersion = row[2] as string;
      const isLegacy = row[3] as boolean;
      
      const result = await client.query(
        'INSERT INTO blender_versions (version, release_date, api_version, is_legacy) VALUES ($1, $2, $3, $4) RETURNING id',
        [version, releaseDate, apiVersion, isLegacy]
      );
      versionIds[version] = result.rows[0].id;
    }

    console.log(`Inserted ${versions.length} Blender versions`);

    // Insert API changes (2.79b to 2.80)
    const apiChangesData = [
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.context', 'bpy.context.scene.objects.active', 'bpy.context.view_layer.objects.active', 'Active object access moved from scene to view_layer', 'bpy.context.scene.objects.active = obj', 'bpy.context.view_layer.objects.active = obj', 'critical'],
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.types.Object', '.select', '.select_set(state=True)', 'Object selection API changed from property to method', 'obj.select = True', 'obj.select_set(state=True)', 'critical'],
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.types.Object', '.hide', '.hide_set()', 'Object visibility API changed from property to method', 'obj.hide = True', 'obj.hide_set(True)', 'critical'],
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.types.Mesh', '.uv_textures', '.uv_layers', 'UV texture access renamed to uv_layers', 'mesh.uv_textures', 'mesh.uv_layers', 'high'],
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.types.Material', '.diffuse_color', '.diffuse_color (4 values)', 'Color properties now require 4 values (RGBA) instead of 3 (RGB)', 'mat.diffuse_color = (0.5, 0.5, 0.5)', 'mat.diffuse_color = (0.5, 0.5, 0.5, 1.0)', 'high'],
      [versionIds['2.79b'], versionIds['2.80'], 'renamed', 'bpy.types.VertexGroup', 'vertex_groups.new()', 'vertex_groups.new(name="")', 'vertex_groups.new() now requires name as keyword argument', 'vertex_groups.new("Group")', 'vertex_groups.new(name="Group")', 'medium'],
      [versionIds['2.79b'], versionIds['2.80'], 'removed', 'bpy.types.Scene', 'Blender Internal render engine', 'EEVEE/Cycles', 'Blender Internal render engine completely removed, replaced by EEVEE', 'scene.render.engine = "BLENDER_RENDER"', 'scene.render.engine = "BLENDER_EEVEE"', 'critical'],
    ];

    for (const data of apiChangesData) {
      await client.query(
        `INSERT INTO api_changes (
          from_version_id, to_version_id, change_type, class_name, old_name, new_name, 
          description, example_old, example_new, severity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        data
      );
    }

    console.log(`Inserted ${apiChangesData.length} API changes`);

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();