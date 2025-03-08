export enum HotelStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    MAINTENANCE = "MAINTENANCE",
    UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
  }
export type HotelInput = {
    name: string;
    description?: string; // Optional
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    latitude?: number; // Optional
    longitude?: number; // Optional
    contactPhone: string;
    contactEmail: string;
    website?: string; // Optional
    adminId: string;
    amenities: string[];
    roomCount: number;
    floorCount: number;
    starRating?: number; // Optional
    policies?: HotelPolicyInput;
    images: string[];
  };
  
export type HotelUpdateInput = {
    name?: string | null;
    description?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipcode?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    website?: string | null;
    status?: HotelStatus | null;
    amenities?: string[] | null;
    starRating?: number | null;
    floorCount?: number | null;
    policies?: HotelPolicyInput | null;
  };

export type HotelPolicyInput = {
    checkInTime: string;  // Required, default: "14:00"
    checkOutTime: string; // Required, default: "11:00"
    cancellationHours: number; // Required, default: 24
    paymentMethods: string[]; // Required, must contain at least one value
    petPolicy: string; // Required, default: "not_allowed"
    extraBedPolicy?: string | null; // Optional, default: null
  };
  