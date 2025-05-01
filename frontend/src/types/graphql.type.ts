export type Maybe<T> = T | null;

export enum DonationStatus {
  DRAFT = "draft",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected"
}

export interface Donation {
  id: string;
  deviceId: string;
  name: string;
  phoneNumber: string;
  amount: number;
  countryName: string;
  stateName: string;
  cityName: string;
  pincode: string;
  screenshotLink?: Maybe<string>;
  status: DonationStatus;
  createdAt: Date;
}

export interface SponsorItem {
  id: string;
  itemName: string;
  price: number;
  count: number;
  sponsoredCount: number;
}

export interface SponsorContribution {
  sponsorId: string;
  sponsor: Sponsor;
  itemId: string;
  sponsorItem: SponsorItem;
  countContributed: number;
}

export interface Sponsor {
  id: string;
  name: string;
  imageLink: string;
  role: string;
  place: string;
  contributions?: Maybe<Array<SponsorContribution>>;
}

export interface Device {
  deviceId: string;
  deviceType: string;
  donations?: Maybe<Array<Donation>>;
  createdAt: Date;
}