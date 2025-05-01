
/**
 * Generate cache keys for various entities
 */
export const cacheKeys = {
  user: (id: number) => `user:id-${id}`,
  // users: (
  //   search = '',
  //   take = 10,
  //   skip = 0,
  //   field = 'id',
  //   direction = 'ASC',
  //   filter?: UserFilter,
  // ) =>
  //   `users:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  // userCount: (filter?: UserFilter) => `user:count:${JSON.stringify(filter)}`,
  // admin: (id: number) => `admin:id-${id}`,
  // admins: (
  //   search = '',
  //   take = 10,
  //   skip = 0,
  //   field = 'id',
  //   direction = 'ASC',
  //   filter?: any,
  // ) =>
  //   `admins:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  // adminCount: (filter?: any) => `admin:count:${JSON.stringify(filter)}`,
  // role: (id: number) => `role:id-${id}`,
  // roles: (
  //   search: string,
  //   take: number,
  //   skip: number,
  //   field: string,
  //   direction: string,
  // ) =>
  //   `roles:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}`,
  // pendingVerification: (email: string) => `pending-verification:${email}`,
  // passwordReset: (token: string) => `password-reset:${token}`,
  // adminPasswordReset: (token: string) => `admin-password-reset:${token}`,

  
};