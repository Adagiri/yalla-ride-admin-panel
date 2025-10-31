export interface AdminUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT' | 'ANALYST';
  permissions: string[];
  department: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isMFAEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  recipients: string[];
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  scheduledFor?: string;
  createdAt: string;
}

export interface SystemSettings {
  general: {
    appName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    language: string;
    maintenanceMode: boolean;
  };
  pricing: {
    baseFare: number;
    perKmRate: number;
    perMinuteRate: number;
    minimumFare: number;
    maximumFare: number;
    surgeMultiplier: number;
    commissionRate: number;
    cancellationFee: number;
  };
  payment: {
    paystackEnabled: boolean;
    flutterwaveEnabled: boolean;
    cashPaymentsEnabled: boolean;
    walletEnabled: boolean;
    minimumWalletBalance: number;
    autoTopUpEnabled: boolean;
    processingFeeRate: number;
  };
  security: {
    mfaRequired: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPasswords: boolean;
    twoFactorEnabled: boolean;
  };
}


export interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  boundary?: {
    type: "Polygon";
    coordinates: [[[number, number]]];
  };
  locationType: "estate" | "landmark" | "general";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    countryCode: string;
    localNumber: string;
    fullPhone: string;
  };
  isOnline: boolean;
  isAvailable: boolean;
  paymentModel: 'SUBSCRIPTION' | 'COMMISSION';
  stats: {
    totalTrips: number;
    averageRating: number;
    totalEarnings: number;
    completionRate: number;
  };
  profilePhotoSet: boolean;
  profilePhoto?: string;
  personalInfoSet: boolean;
  driverLicenseVerified: boolean;
  vehicleInspectionDone: boolean;
  driverLicenseFront?: string;
  driverLicenseBack?: string;
  vehicleId?: string;
  currentLocation?: {
    coordinates: [number, number];
    heading?: number;
    updatedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VerificationAction {
  success: boolean;
  message: string;
}

export interface FileDownloadResponse {
  url: string;
}