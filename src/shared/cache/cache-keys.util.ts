
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

  admin: (id: string) => `admin:id-${id}`,
  admins: (
    search = '',
    take = 10,
    skip = 0,
    field = 'id',
    direction = 'ASC',
    filter?: any,
  ) =>
    `admins:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  adminCount: (filter?: any) => `admin:count:${JSON.stringify(filter)}`,

  device: (id: string) => `device:id-${id}`,
  devices: (
    search = '',
    take = 10,
    skip = 0,
    field = 'id',
    direction = 'ASC',
    filter?: any,
  ) =>
    `devices:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  deviceCount: (filter?: any) => `device:count:${JSON.stringify(filter)}`,
  
  donation: (id: string) => `donation:id-${id}`,
  donations: (
    search = '',
    take = 10,
    skip = 0,
    field = 'id',
    direction = 'ASC',
    filter?: any,
  ) =>
    `donations:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  donationCount: (filter?: any) => `donation:count:${JSON.stringify(filter)}`,
  donationCountByDevice: (deviceId: string) =>
    `donation:count:deviceId:${deviceId}`,
  donationCountByStatus: (status: string) =>
    `donation:count:status:${status}`,
  donationCountByStatusAndDevice: (status: string, deviceId: string) =>
    `donation:count:status:${status}:deviceId:${deviceId}`,
  donationsByDevice: (deviceId: string) =>
    `donations:deviceId:${deviceId}`,
  donationsByStatus: (status: string) =>
    `donations:status:${status}`,
  donationsByStatusAndDevice: (status: string, deviceId: string) =>
    `donations:status:${status}:deviceId:${deviceId}`,
  donationsByDeviceAndStatus: (deviceId: string, status: string) =>
    `donations:deviceId:${deviceId}:status:${status}`,

  sponsorItem: (id: string) => `sponsor-item:id-${id}`,
  sponsorItems: (
    search = '',
    take = 10,
    skip = 0,
    field = 'id',
    direction = 'ASC',
    filter?: any,
  ) =>
    `sponsor-items:search:${search}:take:${take}:skip:${skip}:field:${field}:direction:${direction}:filter:${JSON.stringify(filter)}`,
  sponsorItemCount: (filter?: any) => `sponsor-item:count:${JSON.stringify(filter)}`,
  sponsorItemCountByStatus: (status: string) =>
    `sponsor-item:count:status:${status}`,
  allSponsorItems: () => `sponsor-items:all`,
  allSponsorItemsByStatus: (status: string) =>
    `sponsor-items:all:status:${status}`,
  allSponsorItemsByDevice: (deviceId: string) =>
    `sponsor-items:all:deviceId:${deviceId}`,
};