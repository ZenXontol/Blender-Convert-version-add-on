'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConverterPage() {
  const [originalCode, setOriginalCode] = useState(`import bpy

class SimpleOperator(bpy.types.Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"
    
    def execute(self, context):
        # Access active object (2.79b way)
        active_obj = context.scene.objects.active
        print(f"Active object: {active_obj.name}")
        
        # Select object
        obj = bpy.data.objects["Cube"]
        obj.select = True
        
        return {'FINISHED'}`);
  
  const [convertedCode, setConvertedCode] = useState('');
  const [fromVersion, setFromVersion] = useState('2.79b');
  const [toVersion, setToVersion] = useState('2.80');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionIssues, setConversionIssues] = useState<any[]>([]);

  const handleConvert = async () => {
    setIsConverting(true);
    setConversionIssues([]);
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: originalCode,
          fromVersion,
          toVersion
        }),
      });
      
      if (!response.ok) {
        throw new Error('Conversion failed');
      }
      
      const data = await response.json();
      setConvertedCode(data.convertedCode);
      setConversionIssues(data.issues || []);
      
    } catch (error) {
      console.error('Conversion error:', error);
      // Fallback to simple conversion if API fails
      let converted = originalCode;
      converted = converted.replace(/context\.scene\.objects\.active/g, 'context.view_layer.objects.active');
      converted = converted.replace(/\.select\s*=\s*True/g, '.select_set(state=True)');
      converted = converted.replace(/\.select\s*=\s*False/g, '.select_set(state=False)');
      converted = converted.replace(/\.hide\s*=\s*True/g, '.hide_set(True)');
      converted = converted.replace(/\.hide\s*=\s*False/g, '.hide_set(False)');
      setConvertedCode(converted);
      
      // Show basic issues
      const issues = [];
      if (originalCode.includes('context.scene.objects.active')) {
        issues.push({
          line: originalCode.split('\n').findIndex(line => line.includes('context.scene.objects.active')) + 1,
          type: 'critical',
          message: 'Active object access needs to be updated',
          oldCode: 'context.scene.objects.active',
          newCode: 'context.view_layer.objects.active',
          explanation: 'In Blender 2.80+, active object is accessed through view_layer instead of scene'
        });
      }
      
      if (originalCode.includes('.select =')) {
        issues.push({
          line: originalCode.split('\n').findIndex(line => line.includes('.select =')) + 1,
          type: 'critical',
          message: 'Object selection API changed',
          oldCode: 'obj.select = True',
          newCode: 'obj.select_set(state=True)',
          explanation: 'Selection is now a method instead of a property'
        });
      }
      
      setConversionIssues(issues);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setOriginalCode(`import bpy

class SimpleOperator(bpy.types.Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"
    
    def execute(self, context):
        # Access active object (2.79b way)
        active_obj = context.scene.objects.active
        print(f"Active object: {active_obj.name}")
        
        # Select object
        obj = bpy.data.objects["Cube"]
        obj.select = True
        
        return {'FINISHED'}`);
    setConvertedCode('');
    setConversionIssues([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Blender Add-on Converter</h1>
          <p className="mt-2 text-gray-600">
            Convert your Blender 2.79b add-ons to newer versions (2.80-4.1)
          </p>
        </div>

        {/* Version Selection */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Select Versions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Convert From</label>
              <select 
                value={fromVersion}
                onChange={(e) => setFromVersion(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="2.79b">Blender 2.79b (Legacy)</option>
                <option value="2.80">Blender 2.80</option>
                <option value="2.90">Blender 2.90</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700">Convert To</label>
              <select 
                value={toVersion}
                onChange={(e) => setToVersion(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="2.80">Blender 2.80</option>
                <option value="3.0">Blender 3.0</option>
                <option value="3.6">Blender 3.6</option>
                <option value="4.0">Blender 4.0</option>
                <option value="4.1">Blender 4.1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Original Code */}
          <div className="rounded-2xl bg-white shadow-lg">
            <div className="rounded-t-2xl bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="font-mono text-sm text-white">Original Code ({fromVersion})</span>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={originalCode}
                onChange={(e) => setOriginalCode(e.target.value)}
                className="h-96 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm"
                placeholder="Paste your Blender 2.79b add-on code here..."
                spellCheck="false"
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Reset to Example
                </button>
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isConverting ? 'Converting...' : 'Convert Code'}
                </button>
              </div>
            </div>
          </div>

          {/* Converted Code */}
          <div className="rounded-2xl bg-white shadow-lg">
            <div className="rounded-t-2xl bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="font-mono text-sm text-white">Converted Code ({toVersion})</span>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={convertedCode}
                readOnly
                className="h-96 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm"
                placeholder="Converted code will appear here..."
                spellCheck="false"
              />
              {convertedCode && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => navigator.clipboard.writeText(convertedCode)}
                    className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversion Issues */}
        {conversionIssues.length > 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Conversion Issues Found</h2>
            <div className="space-y-4">
              {conversionIssues.map((issue, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.type === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">Line {issue.line}</span>
                      </div>
                      <h3 className="mt-2 font-medium text-gray-900">{issue.message}</h3>
                      <p className="mt-1 text-sm text-gray-600">{issue.explanation}</p>
                      <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <div className="rounded bg-red-50 p-3">
                          <div className="font-medium text-red-700">Old Code:</div>
                          <code className="mt-1 block text-red-600">{issue.oldCode}</code>
                        </div>
                        <div className="rounded bg-green-50 p-3">
                          <div className="font-medium text-green-700">New Code:</div>
                          <code className="mt-1 block text-green-600">{issue.newCode}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 rounded-2xl bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Conversion Tips</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Common Changes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• context.scene.objects.active → context.view_layer.objects.active</li>
                <li>• obj.select = True → obj.select_set(state=True)</li>
                <li>• mesh.uv_textures → mesh.uv_layers</li>
                <li>• vertex_groups.new("name") → vertex_groups.new(name="name")</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Testing</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Test in Blender 2.80 first before moving to newer versions</li>
                <li>• Check for deprecated warnings in the console</li>
                <li>• Verify UI elements still work correctly</li>
                <li>• Test with different scene setups</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/api-changes" className="text-blue-600 hover:underline">
                    View complete API changes list
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="text-blue-600 hover:underline">
                    Browse conversion examples
                  </Link>
                </li>
                <li>
                  <a href="https://docs.blender.org/api/current/" className="text-blue-600 hover:underline" target="_blank">
                    Blender Python API Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}