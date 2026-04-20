'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for API changes
const apiChangesData = [
  {
    id: 1,
    fromVersion: '2.79b',
    toVersion: '2.80',
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
    id: 2,
    fromVersion: '2.79b',
    toVersion: '2.80',
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
    id: 3,
    fromVersion: '2.79b',
    toVersion: '2.80',
    changeType: 'renamed',
    className: 'bpy.types.Object',
    oldName: '.hide',
    newName: '.hide_set()',
    description: 'Object visibility API changed from property to method',
    exampleOld: 'obj.hide = True',
    exampleNew: 'obj.hide_set(True)',
    severity: 'critical',
  },
  {
    id: 4,
    fromVersion: '2.79b',
    toVersion: '2.80',
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
    id: 5,
    fromVersion: '2.79b',
    toVersion: '2.80',
    changeType: 'renamed',
    className: 'bpy.types.Material',
    oldName: '.diffuse_color',
    newName: '.diffuse_color (4 values)',
    description: 'Color properties now require 4 values (RGBA) instead of 3 (RGB)',
    exampleOld: 'mat.diffuse_color = (0.5, 0.5, 0.5)',
    exampleNew: 'mat.diffuse_color = (0.5, 0.5, 0.5, 1.0)',
    severity: 'high',
  },
  {
    id: 6,
    fromVersion: '2.79b',
    toVersion: '2.80',
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
    id: 7,
    fromVersion: '2.79b',
    toVersion: '2.80',
    changeType: 'removed',
    className: 'bpy.types.Scene',
    oldName: 'Blender Internal render engine',
    newName: 'EEVEE/Cycles',
    description: 'Blender Internal render engine completely removed, replaced by EEVEE',
    exampleOld: 'scene.render.engine = "BLENDER_RENDER"',
    exampleNew: 'scene.render.engine = "BLENDER_EEVEE"',
    severity: 'critical',
  },
  {
    id: 8,
    fromVersion: '2.80',
    toVersion: '3.0',
    changeType: 'deprecated',
    className: 'bpy.types.Object',
    oldName: '.dimensions',
    newName: '.dimensions (behavior change)',
    description: 'Object dimensions calculation changed for non-uniform scaling',
    exampleOld: 'obj.dimensions',
    exampleNew: 'obj.dimensions (check scaling)',
    severity: 'medium',
  },
  {
    id: 9,
    fromVersion: '3.6',
    toVersion: '4.0',
    changeType: 'added',
    className: 'bpy.types.Scene',
    oldName: 'N/A',
    newName: 'scene.render.use_persistent_data',
    description: 'New setting for persistent render data',
    exampleOld: 'N/A',
    exampleNew: 'scene.render.use_persistent_data = True',
    severity: 'low',
  },
];

const severityColors = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const changeTypeColors = {
  renamed: 'bg-purple-100 text-purple-800',
  removed: 'bg-red-100 text-red-800',
  added: 'bg-green-100 text-green-800',
  deprecated: 'bg-yellow-100 text-yellow-800',
  modified: 'bg-blue-100 text-blue-800',
};

export default function ApiChangesPage() {
  const [filterFrom, setFilterFrom] = useState('all');
  const [filterTo, setFilterTo] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterChangeType, setFilterChangeType] = useState('all');

  const filteredChanges = apiChangesData.filter(change => {
    if (filterFrom !== 'all' && change.fromVersion !== filterFrom) return false;
    if (filterTo !== 'all' && change.toVersion !== filterTo) return false;
    if (filterSeverity !== 'all' && change.severity !== filterSeverity) return false;
    if (filterChangeType !== 'all' && change.changeType !== filterChangeType) return false;
    return true;
  });

  const uniqueFromVersions = [...new Set(apiChangesData.map(c => c.fromVersion))];
  const uniqueToVersions = [...new Set(apiChangesData.map(c => c.toVersion))];
  const uniqueSeverities = [...new Set(apiChangesData.map(c => c.severity))];
  const uniqueChangeTypes = [...new Set(apiChangesData.map(c => c.changeType))];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Blender API Changes</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive list of API changes between Blender versions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Filter Changes</h2>
          <div className="grid gap-4 md:grid-cols-4">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">Severity</label>
              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="all">All Severities</option>
                {uniqueSeverities.map(severity => (
                  <option key={severity} value={severity}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Change Type</label>
              <select 
                value={filterChangeType}
                onChange={(e) => setFilterChangeType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="all">All Types</option>
                {uniqueChangeTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredChanges.length} of {apiChangesData.length} changes
            </span>
            <button
              onClick={() => {
                setFilterFrom('all');
                setFilterTo('all');
                setFilterSeverity('all');
                setFilterChangeType('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-3 font-semibold text-gray-900">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors.critical}`}>
                Critical
              </span>
              <span className="text-sm text-gray-600">Will break your add-on</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors.high}`}>
                High
              </span>
              <span className="text-sm text-gray-600">Major changes needed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors.medium}`}>
                Medium
              </span>
              <span className="text-sm text-gray-600">Minor changes needed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors.low}`}>
                Low
              </span>
              <span className="text-sm text-gray-600">Optional improvements</span>
            </div>
          </div>
        </div>

        {/* API Changes List */}
        <div className="space-y-6">
          {filteredChanges.map((change) => (
            <div key={change.id} className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex flex-col justify-between md:flex-row md:items-start">
                <div className="mb-4 md:mb-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColors[change.severity as keyof typeof severityColors]}`}>
                      {change.severity.toUpperCase()}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${changeTypeColors[change.changeType as keyof typeof changeTypeColors]}`}>
                      {change.changeType.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                      {change.fromVersion} → {change.toVersion}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                      {change.className}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{change.description}</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-700">Old API</span>
                        <span className="text-sm text-gray-500">Blender {change.fromVersion}</span>
                      </div>
                      <div className="rounded-lg bg-red-50 p-4">
                        <code className="font-mono text-sm text-red-700">{change.oldName}</code>
                        {change.exampleOld && change.exampleOld !== 'N/A' && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">Example:</div>
                            <code className="mt-1 block font-mono text-sm text-red-600">{change.exampleOld}</code>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-700">New API</span>
                        <span className="text-sm text-gray-500">Blender {change.toVersion}</span>
                      </div>
                      <div className="rounded-lg bg-green-50 p-4">
                        <code className="font-mono text-sm text-green-700">{change.newName}</code>
                        {change.exampleNew && change.exampleNew !== 'N/A' && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">Example:</div>
                            <code className="mt-1 block font-mono text-sm text-green-600">{change.exampleNew}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChanges.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">No changes found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 rounded-2xl bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Working with API Changes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Migration Strategy</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Start with critical severity changes first - these will break your add-on</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Test each change individually before moving to the next</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Use version checks for add-ons that need to support multiple Blender versions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Version Checking</h3>
              <div className="rounded-lg bg-gray-900 p-4">
                <code className="block font-mono text-sm text-green-400">
                  import bpy<br />
                  <br />
                  # Check Blender version<br />
                  if bpy.app.version &gt;= (2, 80, 0):<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;# 2.80+ code<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;active_obj = context.view_layer.objects.active<br />
                  else:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;# 2.79b code<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;active_obj = context.scene.objects.active
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}