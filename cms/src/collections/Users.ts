import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    defaultColumns: ['name', 'email', 'authorProfiles'],
    group: 'System',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'authorProfiles',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: {
        description: 'Perfiles de autor que este usuario puede usar al publicar.',
      },
    },
  ],
}
