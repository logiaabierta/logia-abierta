import type { CollectionConfig } from 'payload'

import { adminFieldOnly, adminOnly, adminOrSelf, roles } from '../access/accessControl'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'authorProfiles'],
    group: 'System',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'contributor',
      options: roles.map((role) => ({
        label: role[0].toUpperCase() + role.slice(1),
        value: role,
      })),
      required: true,
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        description:
          'Admin manages settings/users. Editor publishes all content. Author publishes assigned profiles. Contributor drafts. Viewer reads only.',
      },
    },
    {
      name: 'authorProfiles',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        description: 'Perfiles de autor que este usuario puede usar al publicar.',
      },
    },
  ],
}
