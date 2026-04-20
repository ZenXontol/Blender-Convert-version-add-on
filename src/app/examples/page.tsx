'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for conversion examples
const examplesData = [
  {
    id: 1,
    title: 'Simple Operator: Accessing active object',
    description: 'How to access the active object in different Blender versions',
    fromVersion: '2.79b',
    toVersion: '2.80',
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
    explanation: 'In Blender 2.80+, the active object is accessed through view_layer instead of scene.objects. This is one of the most common changes when migrating from 2.79b.',
    tags: ['operator', 'context', 'active_object'],
  },
  {
    id: 2,
    title: 'Object Selection',
    description: 'Selecting objects in the 3D view',
    fromVersion: '2.79b',
    toVersion: '2.80',
    originalCode: `import bpy

# Select an object (2.79b way)
obj = bpy.data.objects["Cube"]
obj.select = True
obj.hide = False

# Deselect all objects
for obj in bpy.context.scene.objects:
    obj.select = False`,
    convertedCode: `import bpy

# Select an object (2.80+ way)
obj = bpy.data.objects["Cube"]
obj.select_set(state=True)
obj.hide_set(False)

# Deselect all objects
for obj in bpy.context.scene.objects:
    obj.select_set(state=False)`,
    explanation: 'Selection and visibility are now methods instead of properties. This change affects all object selection and visibility operations.',
    tags: ['selection', 'object', 'property_to_method'],
  },
  {
    id: 3,
    title: 'Creating a new vertex group',
    description: 'Creating vertex groups with proper naming',
    fromVersion: '2.79b',
    toVersion: '2.80',
    originalCode: `import bpy

obj = bpy.context.active_object
if obj.type == 'MESH':
    # Create vertex group (2.79b way)
    vgroup = obj.vertex_groups.new("MyGroup")
    
    # Add vertices to group
    vgroup.add([0, 1, 2], 1.0, 'ADD')`,
    convertedCode: `import bpy

obj = bpy.context.view_layer.objects.active
if obj.type == 'MESH':
    # Create vertex group (2.80+ way)
    vgroup = obj.vertex_groups.new(name="MyGroup")
    
    # Add vertices to group
    vgroup.add([0, 1, 2], 1.0, 'ADD')`,
    explanation: 'The new() method for vertex groups now requires the name parameter as a keyword argument. Also note the active object access change.',
    tags: ['vertex_group', 'mesh', 'keyword_argument'],
  },
  {
    id: 4,
    title: 'Working with UV maps',
    description: 'Accessing and modifying UV layers',
    fromVersion: '2.79b',
    toVersion: '2.80',
    originalCode: `import bpy

obj = bpy.context.active_object
if obj.type == 'MESH':
    mesh = obj.data
    
    # Access UV textures (2.79b way)
    if mesh.uv_textures:
        uv_tex = mesh.uv_textures.active
        print(f"Active UV: {uv_tex.name}")
    
    # Create new UV texture
    new_uv = mesh.uv_textures.new("UVMap")`,
    convertedCode: `import bpy

obj = bpy.context.view_layer.objects.active
if obj.type == 'MESH':
    mesh = obj.data
    
    # Access UV layers (2.80+ way)
    if mesh.uv_layers:
        uv_layer = mesh.uv_layers.active
        print(f"Active UV: {uv_layer.name}")
    
    # Create new UV layer
    new_uv = mesh.uv_layers.new(name="UVMap")`,
    explanation: 'UV textures are now called UV layers. The API is similar but uses different property names.',
    tags: ['uv', 'mesh', 'texture', 'layer'],
  },
  {
    id: 5,
    title: 'Material color assignment',
    description: 'Setting material colors with alpha channel',
    fromVersion: '2.79b',
    toVersion: '2.80',
    originalCode: `import bpy

# Create material (2.79b way)
mat = bpy.data.materials.new("MyMaterial")
mat.diffuse_color = (0.8, 0.2, 0.2)  # RGB only
mat.specular_color = (1.0, 1.0, 1.0)`,
    convertedCode: `import bpy

# Create material (2.80+ way)
mat = bpy.data.materials.new("MyMaterial")
mat.diffuse_color = (0.8, 0.2, 0.2, 1.0)  # RGBA required
mat.specular_color = (1.0, 1.0, 1.0, 1.0)`,
    explanation: 'Color properties now require 4 values (RGBA) instead of 3 (RGB). The alpha value is typically 1.0 for opaque materials.',
    tags: ['material', 'color', 'rgba'],
  },
  {
    id: 6,
    title: 'Version-compatible add-on',
    description: 'Writing add-ons that work in both 2.79b and 2.80+',
    fromVersion: '2.79b',
    toVersion: '2.80',
    originalCode: `import bpy

class MyOperator(bpy.types.Operator):
    bl_idname = "object.my_operator"
    bl_label = "My Operator"
    
    def execute(self, context):
        # This only works in 2.79b
        active_obj = context.scene.objects.active
        return {'FINISHED'}`,
    convertedCode: `import bpy

class MyOperator(bpy.types.Operator):
    bl_idname = "object.my_operator"
    bl_label = "My Operator"
    
    def execute(self, context):
        # Version-compatible active object access
        if bpy.app.version >= (2, 80, 0):
            # 2.80+ code
            active_obj = context.view_layer.objects.active
        else:
            # 2.79b code
            active_obj = context.scene.objects.active
        
        print(f"Active: {active_obj.name}")
        return {'FINISHED'}`,
    explanation: 'Use bpy.app.version to write add-ons that work across multiple Blender versions. This is especially useful during transition periods.',
    tags: ['compatibility', 'version_check', 'cross_version'],
  },
];

export default function ExamplesPage() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [filterFrom, setFilterFrom] = useState('all');
  const [filterTo, setFilterTo] = useState('all');
  const [filterTag, setFilterTag] = useState('all');

  const filteredExamples = examplesData.filter(example => {
    if (filterFrom !== 'all' && example.fromVersion !== filterFrom) return false;
    if (filterTo !== 'all' && example.toVersion !== filterTo) return false;
    if (filterTag !== 'all' && !example.tags.includes(filterTag)) return false;
    return true;
  });

  const uniqueFromVersions = [...new Set(examplesData.map(e => e.fromVersion))];
  const uniqueToVersions = [...new Set(examplesData.map(e => e.toVersion))];
  const allTags = [...new Set(examplesData.flatMap(e => e.tags))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Conversion Examples</h1>
          <p className="mt-2 text-gray-600">
            Real-world examples of Blender add-on conversions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Filter Examples</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">From Version</label>
              <select 
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="all">All Versions</option>
                {uniqueFromVersions.map(version => (
                  <option key={version} value={version}>Blender {version}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">To Version</label>
              <select 
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="all">All Versions</option>
                {uniqueToVersions.map(version => (
                  <option key={version} value={version}>Blender {version}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tag</label>
              <select 
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredExamples.length} of {examplesData.length} examples
            </span>
            <button
              onClick={() => {
                setFilterFrom('all');
                setFilterTo('all');
                setFilterTag('all');
                setSelectedExample(0);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Examples List */}
        <div className="space-y-6">
          {filteredExamples.map((example, index) => (
            <div key={example.id} className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                      {example.fromVersion} → {example.toVersion}
                    </span>
                    {example.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{example.title}</h3>
                  <p className="mt-2 text-gray-600">{example.description}</p>
                </div>
                <button
                  onClick={() => setSelectedExample(selectedExample === index ? -1 : index)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {selectedExample === index ? 'Hide Code' : 'Show Code'}
                </button>
              </div>

              {selectedExample === index && (
                <div className="mt-6 space-y-6">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Original Code (Blender {example.fromVersion})</h4>
                      <button
                        onClick={() => navigator.clipboard.writeText(example.originalCode)}
                        className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="rounded-lg bg-gray-900 p-4">
                      <pre className="overflow-x-auto font-mono text-sm text-green-400">
                        {example.originalCode}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Converted Code (Blender {example.toVersion})</h4>
                      <button
                        onClick={() => navigator.clipboard.writeText(example.convertedCode)}
                        className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="rounded-lg bg-gray-900 p-4">
                      <pre className="overflow-x-auto font-mono text-sm text-green-400">
                        {example.convertedCode}
                      </pre>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Explanation</h4>
                    <p className="text-gray-700">{example.explanation}</p>
                  </div>

                  <div className="flex justify-center">
                    <Link
                      href="/converter"
                      className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      Try This in Converter
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExamples.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">No examples found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more examples
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 rounded-2xl bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Using These Examples</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Learning from Examples</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Compare the original and converted code side by side</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Look for patterns that appear in your own add-ons</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Copy and paste examples into the converter to see how they work</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Use the "Try This in Converter" button to experiment with the code</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Next Steps</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    <Link href="/converter" className="text-blue-600 hover:underline">
                      Try the converter
                    </Link> with your own add-on code
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    Check the{' '}
                    <Link href="/api-changes" className="text-blue-600 hover:underline">
                      API changes
                    </Link> for complete reference
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    Visit the{' '}
                    <a href="https://docs.blender.org/api/current/" className="text-blue-600 hover:underline" target="_blank">
                      official Blender Python API docs
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Join Blender community forums for help with specific issues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}