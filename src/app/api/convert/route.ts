import { NextRequest, NextResponse } from 'next/server';

// Simple conversion patterns for demonstration
const conversionPatterns = [
  {
    pattern: /context\.scene\.objects\.active/g,
    replacement: 'context.view_layer.objects.active',
    description: 'Active object access moved from scene to view_layer',
    severity: 'critical'
  },
  {
    pattern: /\.select\s*=\s*True/g,
    replacement: '.select_set(state=True)',
    description: 'Object selection API changed from property to method',
    severity: 'critical'
  },
  {
    pattern: /\.select\s*=\s*False/g,
    replacement: '.select_set(state=False)',
    description: 'Object selection API changed from property to method',
    severity: 'critical'
  },
  {
    pattern: /\.hide\s*=\s*True/g,
    replacement: '.hide_set(True)',
    description: 'Object visibility API changed from property to method',
    severity: 'critical'
  },
  {
    pattern: /\.hide\s*=\s*False/g,
    replacement: '.hide_set(False)',
    description: 'Object visibility API changed from property to method',
    severity: 'critical'
  },
  {
    pattern: /\.uv_textures/g,
    replacement: '.uv_layers',
    description: 'UV texture access renamed to uv_layers',
    severity: 'high'
  },
  {
    pattern: /vertex_groups\.new\(["']([^"']+)["']\)/g,
    replacement: 'vertex_groups.new(name="$1")',
    description: 'vertex_groups.new() now requires name as keyword argument',
    severity: 'medium'
  },
  {
    pattern: /bpy\.types\.Panel/g,
    replacement: 'bpy.types.Panel',
    check: (code: string) => {
      // Check if panel classes need bl_space_type and bl_region_type
      const panelMatches = code.match(/class\s+\w+\(bpy\.types\.Panel\)/g);
      return panelMatches ? panelMatches.length > 0 : false;
    },
    description: 'Panels now require bl_space_type and bl_region_type properties',
    severity: 'high'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, fromVersion, toVersion } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    let convertedCode = code;
    const issues: any[] = [];

    // Apply conversion patterns
    conversionPatterns.forEach((pattern, index) => {
      const matches = code.match(pattern.pattern);
      if (matches) {
        // Apply the replacement
        convertedCode = convertedCode.replace(pattern.pattern, pattern.replacement);
        
        // Add issue for each match
        matches.forEach((match: string, matchIndex: number) => {
          // Find line number
          const lines = code.split('\n');
          let lineNumber = 1;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(match)) {
              lineNumber = i + 1;
              break;
            }
          }
          
          issues.push({
            id: `${index}-${matchIndex}`,
            line: lineNumber,
            type: pattern.severity,
            message: pattern.description,
            oldCode: match,
            newCode: match.replace(pattern.pattern, pattern.replacement),
            explanation: getExplanation(pattern.description, fromVersion, toVersion)
          });
        });
      }
      
      // Check for special patterns
      if (pattern.check && pattern.check(code)) {
        issues.push({
          id: `check-${index}`,
          line: 1,
          type: pattern.severity,
          message: pattern.description,
          oldCode: 'Panel class definition',
          newCode: 'Add bl_space_type and bl_region_type properties',
          explanation: 'In Blender 2.80+, Panel classes must define bl_space_type and bl_region_type'
        });
      }
    });

    // Check for common issues that don't have simple regex patterns
    if (code.includes('Blender Internal') || code.includes('BLENDER_RENDER')) {
      issues.push({
        id: 'render-engine',
        line: 1,
        type: 'critical',
        message: 'Blender Internal render engine removed',
        oldCode: 'BLENDER_RENDER',
        newCode: 'BLENDER_EEVEE or CYCLES',
        explanation: 'Blender Internal was completely removed in 2.80. Use EEVEE or Cycles instead.'
      });
    }

    if (code.includes('.diffuse_color = (') && !code.includes('.diffuse_color = (.*,.*,.*,.*)')) {
      const colorMatches = code.match(/\.diffuse_color\s*=\s*\([^)]+\)/g);
      if (colorMatches) {
        colorMatches.forEach((match: string, index: number) => {
          if (!match.includes(', 1.0') && match.split(',').length === 3) {
            issues.push({
              id: `color-${index}`,
              line: 1,
              type: 'high',
              message: 'Color properties now require 4 values (RGBA)',
              oldCode: match,
              newCode: match.replace(/\)$/, ', 1.0)'),
              explanation: 'Color properties in Blender 2.80+ require 4 values (RGBA) instead of 3 (RGB)'
            });
          }
        });
      }
    }

    return NextResponse.json({
      convertedCode,
      issues,
      summary: {
        totalIssues: issues.length,
        criticalIssues: issues.filter(i => i.type === 'critical').length,
        highIssues: issues.filter(i => i.type === 'high').length,
        mediumIssues: issues.filter(i => i.type === 'medium').length
      }
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert code' },
      { status: 500 }
    );
  }
}

function getExplanation(description: string, fromVersion: string, toVersion: string): string {
  const baseExplanations: Record<string, string> = {
    'Active object access moved from scene to view_layer': `In Blender ${fromVersion}, active objects were accessed through scene.objects.active. In ${toVersion}+, this was moved to view_layer.objects.active to support multiple view layers.`,
    'Object selection API changed from property to method': `In Blender ${fromVersion}, object selection was a simple property. In ${toVersion}+, it was changed to a method to support more complex selection logic.`,
    'Object visibility API changed from property to method': `Similar to selection, object visibility was changed from a property to a method in ${toVersion}+.`,
    'UV texture access renamed to uv_layers': `The terminology was updated in ${toVersion}+ to better reflect that UV data is stored in layers, not textures.`,
    'vertex_groups.new() now requires name as keyword argument': `In ${toVersion}+, many API methods were updated to use keyword arguments for better clarity and future extensibility.`,
    'Panels now require bl_space_type and bl_region_type properties': `In ${toVersion}+, Panel classes must explicitly define where they appear in the UI using these properties.`
  };
  
  return baseExplanations[description] || `This API was changed between Blender ${fromVersion} and ${toVersion}.`;
}