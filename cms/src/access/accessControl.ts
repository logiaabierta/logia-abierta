import type { Access, Where } from 'payload'

export const roles = ['admin', 'editor', 'author', 'contributor', 'viewer'] as const

export type Role = (typeof roles)[number]

type UserLike = {
  id?: number | string
  role?: Role | null
  authorProfiles?: Array<number | string | { id?: number | string }> | null
}

type AccessArgs = Parameters<Access>[0]

export function getUserRole(user?: UserLike | null): Role | undefined {
  // Migration bridge: the first production user existed before roles were added.
  // The seed assigns an explicit admin role, then this fallback becomes inert.
  return user?.role || (user ? 'admin' : undefined)
}

export function isAdmin(user?: UserLike | null) {
  return getUserRole(user) === 'admin'
}

export function hasRole(user: UserLike | null | undefined, allowedRoles: Role[]) {
  const role = getUserRole(user)

  return Boolean(role && allowedRoles.includes(role))
}

export function getAuthorProfileIds(user?: UserLike | null) {
  if (!Array.isArray(user?.authorProfiles)) return []

  return user.authorProfiles
    .map((profile) => (typeof profile === 'object' ? profile.id : profile))
    .filter((id): id is number | string => Boolean(id))
}

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

export const adminFieldOnly = ({ req: { user } }: { req: { user?: UserLike | null } }) => isAdmin(user)

export const adminOrSelf: Access = ({ id, req: { user } }) => {
  if (isAdmin(user)) return true
  if (!user?.id || !id) return false

  return {
    id: {
      equals: user.id,
    },
  }
}

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export function canManageContent(user?: UserLike | null) {
  return hasRole(user, ['admin', 'editor'])
}

export function canCreateContent(user?: UserLike | null) {
  return hasRole(user, ['admin', 'editor', 'author', 'contributor'])
}

export const canReadDraftableContent: Access = ({ req: { user } }) => {
  if (canManageContent(user)) return true

  const authorProfileIds = getAuthorProfileIds(user)

  if (authorProfileIds.length > 0) {
    const published: Where = {
      status: {
        equals: 'published',
      },
    }
    const authored: Where = {
      author: {
        in: authorProfileIds,
      },
    }

    const where: Where = {
      or: [published, authored],
    }

    return where
  }

  const publishedOnly: Where = {
    status: {
      equals: 'published',
    },
  }

  return publishedOnly
}

export const canEditAuthoredContent: Access = ({ req: { user } }) => {
  if (canManageContent(user)) return true

  const authorProfileIds = getAuthorProfileIds(user)

  if (hasRole(user, ['author', 'contributor']) && authorProfileIds.length > 0) {
    return {
      author: {
        in: authorProfileIds,
      },
    } satisfies Where
  }

  return false
}

export const canCreateEditorialContent: Access = ({ req: { user } }) => canCreateContent(user)

export const canManageEditorialContent: Access = ({ req: { user } }) => canManageContent(user)

export function publicPublishedWhere(): Where {
  return {
    status: {
      equals: 'published',
    },
  }
}

export function userOwnsAuthor(user: UserLike | null | undefined, authorId?: number | string) {
  if (!authorId) return false

  return getAuthorProfileIds(user).some((id) => String(id) === String(authorId))
}

export function selectedAuthorId(data?: Record<string, unknown>) {
  const author = data?.author

  if (!author) return undefined

  return typeof author === 'object' && 'id' in author
    ? String((author as { id?: number | string }).id)
    : String(author)
}

export function isContentCreateAllowedForSelectedAuthor({ data, req }: AccessArgs) {
  if (canManageContent(req.user)) return true
  if (!canCreateContent(req.user)) return false

  const authorId = selectedAuthorId(data as Record<string, unknown> | undefined)

  return authorId ? userOwnsAuthor(req.user, authorId) : getAuthorProfileIds(req.user).length > 0
}
