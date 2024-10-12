import type { Cycle } from '@prisma/client';
export type Subscription = {
  id: number;
  name: string;
  cost: number;
  billingCycle: Cycle;
  dueDate: Date;
  icon?: string;
};

type BrandColor = {
  hex: string;
  name: string;
};

type Logo = {
  url: string;
  mode: string;
  group: number;
  colors: BrandColor[];
  resolution: {
    width: number;
    height: number;
  };
};

type Backdrop = {
  url: string;
  colors: BrandColor[];
  resolution: {
    width: number;
    height: number;
  };
};

type Address = {
  street: string;
  city: string;
  country: string;
  country_code: string;
  state_province: string;
  state_code: string;
};

type SocialLink = {
  type: string;
  url: string;
};

type Brand = {
  domain: string;
  title: string;
  description: string;
  slogan: string;
  colors: BrandColor[];
  logos: Logo[];
  backdrops: Backdrop[];
  address: Address;
  socials: SocialLink[];
  verified: boolean;
};

export type LogoApiResponse = {
  status: string;
  brand: Brand;
  code: number;
};
