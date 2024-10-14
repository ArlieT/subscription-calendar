import type { Cycle } from '@prisma/client';
export type Subscription = {
  id?: number;
  name: string;
  cost: number;
  cycle: Cycle;
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

export type CreateUserEvent = {
  data: {
    birthday: string;
    created_at: number;
    email_addresses: {
      email_address: string;
      id: string;
      linked_to: any[];
      object: string;
      verification: {
        status: string;
        strategy: string;
      };
    }[];
    external_accounts: any[];
    external_id: string;
    first_name: string;
    gender: string;
    id: string;
    image_url: string;
    last_name: string;
    last_sign_in_at: number;
    object: string;
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string;
    primary_phone_number_id: string | null;
    primary_web3_wallet_id: string | null;
    private_metadata: Record<string, unknown>;
    profile_image_url: string;
    public_metadata: Record<string, unknown>;
    two_factor_enabled: boolean;
    unsafe_metadata: Record<string, unknown>;
    updated_at: number;
    username: string | null;
    web3_wallets: any[];
  };
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: string;
  timestamp: number;
  type: string;
};
