import { db } from '@/db';
import { blenderVersions, apiChanges, conversionExamples, conversionPatterns } from '@/db/schema';
import { sql } from 'drizzle-orm';

async function seedDatabase() {
  console.log('Seeding database...');

  // Clear existing data
  await db.execute(sql`TRUNCATE TABLE ${conversionPatterns} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${conversionExamples} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${apiChanges} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${blenderVersions} CASCADE`);

  // Insert Blender versions
  const versions = [
    { version: '2.79b', releaseDate: new Date('2017-09-11'), apiVersion: '2.79', isLegacy: true },
    { version: '2.80', releaseDate: new Date('2019-07-30'), apiVersion: '2.80', isLegacy: true },
    { version: '2.81', releaseDate: new Date('2019-11-21'), apiVersion: '2.81', isLegacy: true },
    { version: '2.82', releaseDate: new Date('2020-02-14'), apiVersion: '2.82', isLegacy: true },
    { version: '2.83', releaseDate: new Date('2020-06-03'), apiVersion: '2.83', isLegacy: true },
    { version: '2.90', releaseDate: new Date('2020-08-31'), apiVersion: '2.90', isLegacy: true },
    { version: '2.91', releaseDate: new Date('2020-11-25'), apiVersion: '2.91', isLegacy: true },
    { version: '2.92', releaseDate: new Date('2021-02-25'), apiVersion: '2.92', isLegacy: true },
    { version: '2.93', releaseDate: new Date('2021-06-02'), apiVersion: '2.93', isLegacy: true },
    { version: '3.0', releaseDate: new Date('2021-12-03'), apiVersion: '3.0', isLegacy: false },
    { version: '3.1', releaseDate: new Date('2022-03-09'), apiVersion: '3.1', isLegacy: false },
    { version: '3.2', releaseDate: new Date('2022-06-08'), apiVersion: '3.2', isLegacy: false },
    { version: '3.3', releaseDate: new Date('2022-09-07'), apiVersion: '3.3', isLegacy: false },
    { version: '3.4', releaseDate: new Date('2022-12-07'), apiVersion: '3.4', isLegacy: false },
    { version: '3.5', releaseDate: new Date('2023-03-29'), apiVersion: '3.5', isLegacy: false },
    { version: '3.6', releaseDate: new Date('2023-06-28'), apiVersion: '3.6', isLegacy: false },
    { version: '4.0', releaseDate: new Date('2023-11-14'), apiVersion: '4.0', isLegacy: false },
    { version: '4.1', releaseDate: new Date('2024-03-26'), apiVersion: '4.1', isLegacy: false },
  ];

  const versionIds: Record<string, number> = {};

  for (const version of versions) {
    const result = await db.insert(blenderVersions).values(version).returning({ id: blenderVersions.id });
    versionIds[version.version] = result[0].id;
  }

  console.log(`Inserted ${versions.length} Blender versions`);

  // Insert API changes (2.79b to 2.80)
  const apiChangesData = [
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'renamed',
      className: 'bpy.context',
      oldName: 'bpy.context.scene.objects.active',
      newName: 'bpy.context.view_layer.objects.active',
      description: 'Active object access moved from scene to view_layer',
      exampleOld: 'bpy.context.scene.objects.active = obj',
      exampleNew: 'bpy.context.view_layer.objects.active = obj',
      severity: 'critical',
    },
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'renamed',
      className: 'bpy.types.Object',
      oldName: '.select',
      newName: '.select_set(state=True)',
      description: 'Object selection API changed from property to method',
      exampleOld: 'obj.select = True',
      exampleNew: 'obj.select_set(state=True)',
      severity: 'critical',
    },
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'renamed',
      className: 'bpy.types.Mesh',
      oldName: '.uv_textures',
      newName: '.uv_layers',
      description: 'UV texture access renamed to uv_layers',
      exampleOld: 'mesh.uv_textures',
      exampleNew: 'mesh.uv_layers',
      severity: 'high',
    },
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'renamed',
      className: 'bpy.types.Material',
      oldName: '.diffuse_color',
      newName: '.diffuse_color (now requires 4 values)',
      description: 'Color properties now require 4 values (RGBA) instead of 3 (RGB)',
      exampleOld: 'mat.diffuse_color = (0.5, 0.5, 0.5)',
      exampleNew: 'mat.diffuse_color = (0.5, 0.5, 0.5, 1.0)',
      severity: 'high',
    },
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'renamed',
      className: 'bpy.types.VertexGroup',
      oldName: 'vertex_groups.new()',
      newName: 'vertex_groups.new(name="")',
      description: 'vertex_groups.new() now requires name as keyword argument',
      exampleOld: 'vertex_groups.new("Group")',
      exampleNew: 'vertex_groups.new(name="Group")',
      severity: 'medium',
    },
    {
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      changeType: 'removed',
      className: 'bpy.types.Scene',
      oldName: 'Blender Internal render engine',
      newName: 'EEVEE/Cycles',
      description: 'Blender Internal render engine completely removed, replaced by EEVEE',
      exampleOld: 'scene.render.engine = "BLENDER_RENDER"',
      exampleNew: 'scene.render.engine = "BLENDER_EEVEE"',
      severity: 'critical',
    },
  ];

  await db.insert(apiChanges).values(apiChangesData);
  console.log(`Inserted ${apiChangesData.length} API changes`);

  // Insert conversion examples
  const examplesData = [
    {
      title: 'Simple Operator: Accessing active object',
      description: 'How to access the active object in different Blender versions',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      originalCode: `import bpy

class SimpleOperator(bpy.types.Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"
    
    def execute(self, context):
        # Access active object (2.79b way)
        active_obj = context.scene.objects.active
        print(f"Active object: {active_obj.name}")
        return {'FINISHED'}`,
      convertedCode: `import bpy

class SimpleOperator(bpy.types.Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"
    
    def execute(self, context):
        # Access active object (2.80+ way)
        active_obj = context.view_layer.objects.active
        print(f"Active object: {active_obj.name}")
        return {'FINISHED'}`,
      explanation: 'In Blender 2.80+, the active object is accessed through view_layer instead of scene.objects',
      tags: ['operator', 'context', 'active_object'],
    },
    {
      title: 'Object Selection',
      description: 'Selecting objects in the 3D view',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      originalCode: `import bpy

# Select an object (2.79b way)
obj = bpy.data.objects["Cube"]
obj.select = True
obj.hide = False`,
      convertedCode: `import bpy

# Select an object (2.80+ way)
obj = bpy.data.objects["Cube"]
obj.select_set(state=True)
obj.hide_set(False)`,
      explanation: 'Selection and visibility are now methods instead of properties',
      tags: ['selection', 'object', 'property_to_method'],
    },
    {
      title: 'Creating a new vertex group',
      description: 'Creating vertex groups with proper naming',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      originalCode: `import bpy

obj = bpy.context.active_object
if obj.type == 'MESH':
    # Create vertex group (2.79b way)
    vgroup = obj.vertex_groups.new("MyGroup")`,
      convertedCode: `import bpy

obj = bpy.context.active_object
if obj.type == 'MESH':
    # Create vertex group (2.80+ way)
    vgroup = obj.vertex_groups.new(name="MyGroup")`,
      explanation: 'The new() method for vertex groups now requires the name parameter as a keyword argument',
      tags: ['vertex_group', 'mesh', 'keyword_argument'],
    },
  ];

  await db.insert(conversionExamples).values(examplesData);
  console.log(`Inserted ${examplesData.length} conversion examples`);

  // Insert conversion patterns
  const patternsData = [
    {
      patternName: 'Active object access',
      description: 'Convert scene.objects.active to view_layer.objects.active',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      searchPattern: 'context\\.scene\\.objects\\.active',
      replacementPattern: 'context.view_layer.objects.active',
      exampleBefore: 'context.scene.objects.active',
      exampleAfter: 'context.view_layer.objects.active',
    },
    {
      patternName: 'Object selection property to method',
      description: 'Convert obj.select = True to obj.select_set(state=True)',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      searchPattern: '(\\.select)\\s*=\\s*(True|False)',
      replacementPattern: '.select_set(state=$2)',
      exampleBefore: 'obj.select = True',
      exampleAfter: 'obj.select_set(state=True)',
    },
    {
      patternName: 'Object hide property to method',
      description: 'Convert obj.hide = True to obj.hide_set(True)',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      searchPattern: '(\\.hide)\\s*=\\s*(True|False)',
      replacementPattern: '.hide_set($2)',
      exampleBefore: 'obj.hide = True',
      exampleAfter: 'obj.hide_set(True)',
    },
    {
      patternName: 'UV textures to UV layers',
      description: 'Convert mesh.uv_textures to mesh.uv_layers',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      searchPattern: '(\\.uv_textures)',
      replacementPattern: '.uv_layers',
      exampleBefore: 'mesh.uv_textures',
      exampleAfter: 'mesh.uv_layers',
    },
    {
      patternName: 'Vertex group new method',
      description: 'Add name keyword argument to vertex_groups.new()',
      fromVersionId: versionIds['2.79b'],
      toVersionId: versionIds['2.80'],
      searchPattern: 'vertex_groups\\.new\\(["\']([^"\']+)["\']\\)',
      replacementPattern: 'vertex_groups.new(name="$1")',
      exampleBefore: 'vertex_groups.new("GroupName")',
      exampleAfter: 'vertex_groups.new(name="GroupName")',
    },
  ];

  await db.insert(conversionPatterns).values(patternsData);
  console.log(`Inserted ${patternsData.length} conversion patterns`);

  console.log('Database seeding completed!');
}

seedDatabase().catch(console.error);