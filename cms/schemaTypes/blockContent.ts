import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',

  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',

      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'H5', value: 'h5'},
        {title: 'H6', value: 'h6'},
        {title: 'Blockquote', value: 'blockquote'},
        {title: 'Citation', value: 'cite'},
      ],

      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],

      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
          {title: 'Strike', value: 'strike-through'},
        ],

        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',

            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },

              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),

    // Image
    defineArrayMember({
      type: 'image',

      options: {
        hotspot: true,
      },

      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },

        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),

    // Table
    defineArrayMember({
      title: 'Table',
      name: 'table',
      type: 'table',
    }),

    defineArrayMember({
      title: 'Mermaid chart',
      name: 'mermaidChart',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'chart',
          title: 'Mermaid code',
          type: 'text',
          rows: 12,
          validation: (Rule) => Rule.required(),
        },
        {name: 'caption', title: 'Caption', type: 'string'},
      ],
      preview: {
        select: {
          title: 'title',
          subtitle: 'chart',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Mermaid chart',
            subtitle,
          }
        },
      },
    }),

    defineArrayMember({
      title: 'Impress deck',
      name: 'impressDeck',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'height',
          title: 'Height',
          type: 'string',
          initialValue: '70vh',
        },
        {
          name: 'slides',
          title: 'Slides',
          type: 'array',
          validation: (Rule) => Rule.required().min(1),
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Title', type: 'string'},
                {
                  name: 'body',
                  title: 'Body',
                  type: 'text',
                  rows: 8,
                  description: 'Markdown-style plain text. Mermaid/code blocks can live in adjacent blocks.',
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'body',
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: {
          title: 'title',
          slides: 'slides',
        },
        prepare({title, slides}) {
          return {
            title: title || 'Impress deck',
            subtitle: `${slides?.length || 0} slides`,
          }
        },
      },
    }),

    defineArrayMember({
      title: 'Code block',
      name: 'codeBlock',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'language', title: 'Language', type: 'string'},
        {
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 12,
          validation: (Rule) => Rule.required(),
        },
        {name: 'caption', title: 'Caption', type: 'string'},
      ],
      preview: {
        select: {
          title: 'title',
          language: 'language',
        },
        prepare({title, language}) {
          return {
            title: title || 'Code block',
            subtitle: language,
          }
        },
      },
    }),

    defineArrayMember({
      title: 'Raw Markdown / MDX note',
      name: 'rawMdx',
      type: 'object',
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {
          name: 'content',
          title: 'Raw Markdown / MDX',
          type: 'text',
          rows: 14,
          description: 'Stored as raw text for advanced editorial snippets. Rendered as preformatted text on the site.',
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: {
          title: 'title',
          subtitle: 'content',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Raw Markdown / MDX',
            subtitle,
          }
        },
      },
    }),
  ],
})
