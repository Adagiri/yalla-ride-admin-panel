// src/graphql/settings.operations.ts
import { gql } from "@urql/core";

// ===== GENERAL SETTINGS =====
export const GET_GENERAL_SETTINGS = gql`
  query GetGeneralSettings {
    getGeneralSettings {
      id
      applicationName
      supportPhone
      defaultCurrency
      supportEmail
      timeZone
      defaultLanguage
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_GENERAL_SETTING = gql`
  query GetActiveGeneralSetting {
    getActiveGeneralSetting {
      id
      applicationName
      supportPhone
      defaultCurrency
      supportEmail
      timeZone
      defaultLanguage
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_GENERAL_SETTING = gql`
  mutation CreateGeneralSetting($input: CreateGeneralSettingInput!) {
    createGeneralSetting(input: $input) {
      id
      applicationName
      supportPhone
      defaultCurrency
      supportEmail
      timeZone
      defaultLanguage
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_GENERAL_SETTING = gql`
  mutation UpdateGeneralSetting($id: ID!, $input: UpdateGeneralSettingInput!) {
    updateGeneralSetting(id: $id, input: $input) {
      id
      applicationName
      supportPhone
      defaultCurrency
      supportEmail
      timeZone
      defaultLanguage
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const ACTIVATE_GENERAL_SETTING = gql`
  mutation ActivateGeneralSetting($id: ID!) {
    activateGeneralSetting(id: $id) {
      id
      applicationName
      supportPhone
      defaultCurrency
      supportEmail
      timeZone
      defaultLanguage
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ===== PRICING SETTINGS =====
export const GET_PRICING_SETTINGS = gql`
  query GetPricingSettings {
    getPricingSettings {
      id
      baseFare
      perKmRate
      perMinuteRate
      minimumFare
      maximumFare
      surgeMultiplier
      commissionRate
      cancellationFee
      currency
      isActive
      effectiveFrom
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRICING_SETTING = gql`
  mutation CreatePricingSetting($input: CreatePricingSettingInput!) {
    createPricingSetting(input: $input) {
      id
      baseFare
      perKmRate
      perMinuteRate
      minimumFare
      maximumFare
      surgeMultiplier
      commissionRate
      cancellationFee
      currency
      isActive
      effectiveFrom
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRICING_SETTING = gql`
  mutation UpdatePricingSetting($id: ID!, $input: UpdatePricingSettingInput!) {
    updatePricingSetting(id: $id, input: $input) {
      id
      baseFare
      perKmRate
      perMinuteRate
      minimumFare
      maximumFare
      surgeMultiplier
      commissionRate
      cancellationFee
      currency
      isActive
      effectiveFrom
      createdAt
      updatedAt
    }
  }
`;

export const ACTIVATE_PRICING_SETTING = gql`
  mutation ActivatePricingSetting($id: ID!) {
    activatePricingSetting(id: $id) {
      id
      baseFare
      perKmRate
      perMinuteRate
      minimumFare
      maximumFare
      surgeMultiplier
      commissionRate
      cancellationFee
      currency
      isActive
      effectiveFrom
      createdAt
      updatedAt
    }
  }
`;

// ===== PAYMENT SETTINGS =====
export const GET_PAYMENT_SETTINGS = gql`
  query GetPaymentSettings {
    getPaymentSettings {
      id
      cashPaymentsEnabled
      walletPaymentsEnabled
      paystackEnabled
      flutterwaveEnabled
      minimumWalletBalance
      processingFeeRate
      autoTopupEnabled
      autoTopupThreshold
      autoTopupAmount
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PAYMENT_SETTING = gql`
  mutation CreatePaymentSetting($input: CreatePaymentSettingInput!) {
    createPaymentSetting(input: $input) {
      id
      cashPaymentsEnabled
      walletPaymentsEnabled
      paystackEnabled
      flutterwaveEnabled
      minimumWalletBalance
      processingFeeRate
      autoTopupEnabled
      autoTopupThreshold
      autoTopupAmount
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_SETTING = gql`
  mutation UpdatePaymentSetting($id: ID!, $input: UpdatePaymentSettingInput!) {
    updatePaymentSetting(id: $id, input: $input) {
      id
      cashPaymentsEnabled
      walletPaymentsEnabled
      paystackEnabled
      flutterwaveEnabled
      minimumWalletBalance
      processingFeeRate
      autoTopupEnabled
      autoTopupThreshold
      autoTopupAmount
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const ACTIVATE_PAYMENT_SETTING = gql`
  mutation ActivatePaymentSetting($id: ID!) {
    activatePaymentSetting(id: $id) {
      id
      cashPaymentsEnabled
      walletPaymentsEnabled
      paystackEnabled
      flutterwaveEnabled
      minimumWalletBalance
      processingFeeRate
      autoTopupEnabled
      autoTopupThreshold
      autoTopupAmount
      currency
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ===== SECURITY SETTINGS =====
export const GET_SECURITY_SETTINGS = gql`
  query GetSecuritySettings {
    getSecuritySettings {
      id
      sessionTimeoutHours
      maxLoginAttempts
      minimumPasswordLength
      requireStrongPasswords
      requireMfaForAdmins
      enable2faForAllUsers
      enableIpWhitelisting
      allowedIps
      enableAuditLogging
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SECURITY_SETTING = gql`
  mutation CreateSecuritySetting($input: CreateSecuritySettingInput!) {
    createSecuritySetting(input: $input) {
      id
      sessionTimeoutHours
      maxLoginAttempts
      minimumPasswordLength
      requireStrongPasswords
      requireMfaForAdmins
      enable2faForAllUsers
      enableIpWhitelisting
      allowedIps
      enableAuditLogging
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SECURITY_SETTING = gql`
  mutation UpdateSecuritySetting($id: ID!, $input: UpdateSecuritySettingInput!) {
    updateSecuritySetting(id: $id, input: $input) {
      id
      sessionTimeoutHours
      maxLoginAttempts
      minimumPasswordLength
      requireStrongPasswords
      requireMfaForAdmins
      enable2faForAllUsers
      enableIpWhitelisting
      allowedIps
      enableAuditLogging
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const ACTIVATE_SECURITY_SETTING = gql`
  mutation ActivateSecuritySetting($id: ID!) {
    activateSecuritySetting(id: $id) {
      id
      sessionTimeoutHours
      maxLoginAttempts
      minimumPasswordLength
      requireStrongPasswords
      requireMfaForAdmins
      enable2faForAllUsers
      enableIpWhitelisting
      allowedIps
      enableAuditLogging
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ===== SYSTEM HEALTH =====
export const GET_SYSTEM_HEALTH = gql`
  query GetSystemHealth {
    getSystemHealth {
      id
      totalRecords
      databaseUsagePercent
      usedSpaceGB
      storageUsagePercent
      activeUsersOnline
      peakUsersToday
      userUtilizationPercent
      serverUptimeHours
      averageResponseTime
      errorRate
      lastUpdated
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SYSTEM_HEALTH_STATS = gql`
  query GetSystemHealthStats {
    getSystemHealthStats {
      database {
        totalRecords
        usagePercent
        growthRate
      }
      storage {
        usedSpaceGB
        usagePercent
        availableSpaceGB
      }
      users {
        activeOnline
        peakToday
        utilizationPercent
        totalUsers
      }
      system {
        uptimeHours
        averageResponseTime
        errorRate
        lastBackup
      }
    }
  }
`;

export const REFRESH_SYSTEM_HEALTH = gql`
  mutation RefreshSystemHealth {
    refreshSystemHealth {
      id
      totalRecords
      databaseUsagePercent
      usedSpaceGB
      storageUsagePercent
      activeUsersOnline
      peakUsersToday
      userUtilizationPercent
      serverUptimeHours
      averageResponseTime
      errorRate
      lastUpdated
      isActive
      createdAt
      updatedAt
    }
  }
`;