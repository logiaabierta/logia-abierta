import type { Block } from 'payload'

export const MermaidBlock: Block = {
  slug: 'mermaidChart',
  interfaceName: 'MermaidChartBlock',
  labels: {
    singular: 'Mermaid chart',
    plural: 'Mermaid charts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Internal label for the chart in the editor.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional public caption below the chart.',
      },
    },
    {
      name: 'code',
      type: 'textarea',
      required: true,
      defaultValue: `flowchart TD
  A[Logia Abierta] --> B[Historia]
  A --> C[Ritos]
  A --> D[Investigacion]`,
      admin: {
        description: 'Paste Mermaid syntax here. Example: flowchart, sequenceDiagram, timeline, mindmap.',
        rows: 12,
      },
    },
  ],
}
