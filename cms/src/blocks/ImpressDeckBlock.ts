import type { Block } from 'payload'

export const ImpressDeckBlock: Block = {
  slug: 'impressDeck',
  interfaceName: 'ImpressDeckBlock',
  labels: {
    singular: 'Impress.js deck',
    plural: 'Impress.js decks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'New presentation',
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional public caption below the deck.',
      },
    },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'slides',
      options: [
        {
          label: 'Visual slides',
          value: 'slides',
        },
        {
          label: 'Custom impress.js markup',
          value: 'markup',
        },
      ],
      required: true,
    },
    {
      name: 'slides',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.mode !== 'markup',
        description: 'Create normal slides. Astro can later render these as impress.js steps.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            rows: 8,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'x',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'y',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'z',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'rotate',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'scale',
              type: 'number',
              defaultValue: 1,
              admin: {
                width: '20%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'markup',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'markup',
        description: 'Advanced: paste raw impress.js step markup here.',
        rows: 16,
      },
      defaultValue: `<div id="impress">
  <section class="step" data-x="0" data-y="0">
    <h1>Logia Abierta</h1>
    <p>Primer punto del trazado.</p>
  </section>
</div>`,
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Private presenter notes.',
        rows: 5,
      },
    },
  ],
}
