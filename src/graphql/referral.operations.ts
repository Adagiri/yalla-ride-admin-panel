/**
 * GraphQL operations for the Referral System
 * This file contains all GraphQL queries and mutations for managing referrals in the admin panel
 */

// Campaign Fragments
export const REFERRAL_CAMPAIGN_FRAGMENT = `
  fragment ReferralCampaignFields on ReferralCampaign {
    id
    name
    description
    type
    status
    startDate
    endDate
    isActive
    minWalletBalance
    referrerRewardType
    referrerRewardValue
    referrerRewardMaxValue
    refereeRewardType
    refereeRewardValue
    refereeRewardMaxValue
    maxTotalRedemptions
    currentRedemptions
    maxRedemptionsPerUser
    eligibleUserTypes
    rewardExpiryDays
    autoApplyReward
    totalReferrals
    qualifiedReferrals
    completedReferrals
    createdBy
    lastModifiedBy
    termsAndConditions
    isCurrentlyActive
    hasReachedLimit
    createdAt
    updatedAt
  }
`;

// Transaction Fragments
export const REFERRAL_TRANSACTION_FRAGMENT = `
  fragment ReferralTransactionFields on ReferralTransaction {
    id
    referrerId
    referrerType
    refereeId
    refereeType
    referralCode
    campaignId
    status
    qualifiedAt
    completedAt
    referrerWalletBalance
    refereeWalletBalance
    requiredWalletBalance
    createdAt
    updatedAt
  }
`;

// Reward Fragments
export const REFERRAL_REWARD_FRAGMENT = `
  fragment ReferralRewardFields on ReferralReward {
    id
    userId
    userType
    rewardType
    rewardValue
    maxValue
    referralTransactionId
    campaignId
    isReferrer
    status
    availableFrom
    expiresAt
    redeemedAt
    tripId
    description
    isUsable
    hasExpired
    createdAt
    updatedAt
  }
`;

// ===============================
// QUERIES
// ===============================

// Constraint Definition Queries
export const LIST_CONSTRAINT_DEFINITIONS = `
  query ListConstraintDefinitions($activeOnly: Boolean) {
    listConstraintDefinitions(activeOnly: $activeOnly) {
      id
      type
      name
      description
      valueType
      defaultValue
      appliesTo
      unit
      minValue
      maxValue
      isActive
      isSystemDefined
      createdBy
      lastModifiedBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONSTRAINT_DEFINITION = `
  query GetConstraintDefinition($id: ID!) {
    getConstraintDefinition(id: $id) {
      id
      type
      name
      description
      valueType
      defaultValue
      appliesTo
      unit
      minValue
      maxValue
      isActive
      isSystemDefined
      createdBy
      lastModifiedBy
      createdAt
      updatedAt
    }
  }
`;

// Reward Definition Queries
export const LIST_REWARD_DEFINITIONS = `
  query ListRewardDefinitions($activeOnly: Boolean) {
    listRewardDefinitions(activeOnly: $activeOnly) {
      id
      type
      name
      description
      valueType
      defaultValue
      unit
      minValue
      maxValue
      requiresMaxValue
      isActive
      isSystemDefined
      createdBy
      lastModifiedBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_REWARD_DEFINITION = `
  query GetRewardDefinition($id: ID!) {
    getRewardDefinition(id: $id) {
      id
      type
      name
      description
      valueType
      defaultValue
      unit
      minValue
      maxValue
      requiresMaxValue
      isActive
      isSystemDefined
      createdBy
      lastModifiedBy
      createdAt
      updatedAt
    }
  }
`;

export const LIST_REFERRAL_CAMPAIGNS = `
  query ListReferralCampaigns($filter: CampaignStatusEnum, $pagination: PaginationInput) {
    listReferralCampaigns(filter: $filter, pagination: $pagination) {
      id
      name
      description
      type
      status
      startDate
      endDate
      isActive
      minWalletBalance
      referrerRewardType
      referrerRewardValue
      refereeRewardType
      refereeRewardValue
      totalReferrals
      qualifiedReferrals
      completedReferrals
      currentRedemptions
      maxTotalRedemptions
      isCurrentlyActive
      hasReachedLimit
      createdAt
      updatedAt
    }
  }
`;

export const GET_REFERRAL_CAMPAIGN = `
  query GetReferralCampaign($id: ID!) {
    getReferralCampaign(id: $id) {
      id
      name
      description
      type
      status
      startDate
      endDate
      isActive
      constraints {
        constraintType
        appliesTo
        value
        userTypes
      }
      referrerRewards {
        rewardType
        value
        maxValue
      }
      refereeRewards {
        rewardType
        value
        maxValue
      }
      minWalletBalance
      referrerRewardType
      referrerRewardValue
      referrerRewardMaxValue
      refereeRewardType
      refereeRewardValue
      refereeRewardMaxValue
      maxTotalRedemptions
      currentRedemptions
      maxRedemptionsPerUser
      eligibleUserTypes
      rewardExpiryDays
      autoApplyReward
      totalReferrals
      qualifiedReferrals
      completedReferrals
      createdBy
      lastModifiedBy
      termsAndConditions
      isCurrentlyActive
      hasReachedLimit
      createdAt
      updatedAt
    }
  }
`;

export const LIST_REFERRAL_TRANSACTIONS = `
  query ListReferralTransactions($filter: ReferralFilterInput, $pagination: PaginationInput) {
    listReferralTransactions(filter: $filter, pagination: $pagination) {
      id
      referrerId
      referrerType
      refereeId
      refereeType
      referralCode
      campaignId
      status
      qualifiedAt
      completedAt
      referrerWalletBalance
      refereeWalletBalance
      requiredWalletBalance
      createdAt
      updatedAt
      campaign {
        id
        name
        type
      }
    }
  }
`;

export const GET_REFERRAL_TRANSACTION = `
  query GetReferralTransaction($id: ID!) {
    getReferralTransaction(id: $id) {
      id
      referrerId
      referrerType
      refereeId
      refereeType
      referralCode
      campaignId
      status
      qualifiedAt
      completedAt
      referrerWalletBalance
      refereeWalletBalance
      requiredWalletBalance
      createdAt
      updatedAt
      campaign {
        id
        name
        description
        type
        referrerRewardType
        referrerRewardValue
        refereeRewardType
        refereeRewardValue
      }
      referrerReward {
        id
        rewardType
        rewardValue
        status
        description
        expiresAt
      }
      refereeReward {
        id
        rewardType
        rewardValue
        status
        description
        expiresAt
      }
    }
  }
`;

export const LIST_REFERRAL_REWARDS = `
  query ListReferralRewards($filter: RewardFilterInput, $pagination: PaginationInput) {
    listReferralRewards(filter: $filter, pagination: $pagination) {
      id
      userId
      userType
      rewardType
      rewardValue
      maxValue
      referralTransactionId
      campaignId
      isReferrer
      status
      availableFrom
      expiresAt
      redeemedAt
      tripId
      description
      isUsable
      hasExpired
      createdAt
      updatedAt
      campaign {
        id
        name
        type
      }
    }
  }
`;

export const GET_REFERRAL_ANALYTICS = `
  query GetReferralAnalytics($startDate: DateTime, $endDate: DateTime) {
    getReferralAnalytics(startDate: $startDate, endDate: $endDate) {
      totalReferrals
      totalQualified
      totalCompleted
      totalPending
      totalRewardsIssued
      totalRewardsRedeemed
      conversionRate
      averageTimeToQualification
    }
  }
`;

export const GET_CAMPAIGN_ANALYTICS = `
  query GetCampaignAnalytics($campaignId: ID!) {
    getCampaignAnalytics(campaignId: $campaignId) {
      campaignId
      campaignName
      totalReferrals
      qualifiedReferrals
      completedReferrals
      conversionRate
    }
  }
`;

export const GET_ACTIVE_CAMPAIGNS = `
  query GetActiveCampaigns {
    getActiveCampaigns {
      id
      name
      description
      type
      startDate
      endDate
      referrerRewardType
      referrerRewardValue
      refereeRewardType
      refereeRewardValue
      minWalletBalance
      termsAndConditions
    }
  }
`;

// ===============================
// MUTATIONS
// ===============================

export const CREATE_REFERRAL_CAMPAIGN = `
  mutation CreateReferralCampaign($input: CreateCampaignInput!) {
    createReferralCampaign(input: $input) {
      id
      name
      description
      type
      status
      startDate
      endDate
      isActive
      minWalletBalance
      referrerRewardType
      referrerRewardValue
      referrerRewardMaxValue
      refereeRewardType
      refereeRewardValue
      refereeRewardMaxValue
      maxTotalRedemptions
      maxRedemptionsPerUser
      eligibleUserTypes
      rewardExpiryDays
      autoApplyReward
      termsAndConditions
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_REFERRAL_CAMPAIGN = `
  mutation UpdateReferralCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateReferralCampaign(id: $id, input: $input) {
      id
      name
      description
      type
      status
      startDate
      endDate
      isActive
      minWalletBalance
      referrerRewardType
      referrerRewardValue
      referrerRewardMaxValue
      refereeRewardType
      refereeRewardValue
      refereeRewardMaxValue
      maxTotalRedemptions
      maxRedemptionsPerUser
      eligibleUserTypes
      rewardExpiryDays
      autoApplyReward
      termsAndConditions
      updatedAt
    }
  }
`;

export const DELETE_REFERRAL_CAMPAIGN = `
  mutation DeleteReferralCampaign($id: ID!) {
    deleteReferralCampaign(id: $id)
  }
`;

export const TOGGLE_CAMPAIGN_STATUS = `
  mutation ToggleCampaignStatus($id: ID!, $isActive: Boolean!) {
    toggleCampaignStatus(id: $id, isActive: $isActive) {
      id
      isActive
      status
      updatedAt
    }
  }
`;

export const CHANGE_CAMPAIGN_STATUS = `
  mutation ChangeCampaignStatus($id: ID!, $status: CampaignStatusEnum!) {
    changeCampaignStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CHECK_PENDING_REFERRALS = `
  mutation CheckPendingReferrals {
    checkPendingReferrals
  }
`;

export const EXPIRE_OLD_REWARDS = `
  mutation ExpireOldRewards {
    expireOldRewards
  }
`;

export const CANCEL_REFERRAL_TRANSACTION = `
  mutation CancelReferralTransaction($id: ID!, $reason: String) {
    cancelReferralTransaction(id: $id, reason: $reason) {
      id
      status
      updatedAt
    }
  }
`;

export const CANCEL_REWARD = `
  mutation CancelReward($id: ID!, $reason: String) {
    cancelReward(id: $id, reason: $reason) {
      id
      status
      updatedAt
    }
  }
`;

// Constraint Definition Mutations
export const CREATE_CONSTRAINT_DEFINITION = `
  mutation CreateConstraintDefinition($input: CreateConstraintDefinitionInput!) {
    createConstraintDefinition(input: $input) {
      id
      type
      name
      description
      valueType
      defaultValue
      appliesTo
      unit
      minValue
      maxValue
      isActive
      isSystemDefined
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CONSTRAINT_DEFINITION = `
  mutation UpdateConstraintDefinition($id: ID!, $input: CreateConstraintDefinitionInput!) {
    updateConstraintDefinition(id: $id, input: $input) {
      id
      type
      name
      description
      valueType
      defaultValue
      appliesTo
      unit
      minValue
      maxValue
      isActive
      isSystemDefined
      updatedAt
    }
  }
`;

export const TOGGLE_CONSTRAINT_DEFINITION = `
  mutation ToggleConstraintDefinition($id: ID!, $isActive: Boolean!) {
    toggleConstraintDefinition(id: $id, isActive: $isActive) {
      id
      isActive
      updatedAt
    }
  }
`;

export const DELETE_CONSTRAINT_DEFINITION = `
  mutation DeleteConstraintDefinition($id: ID!) {
    deleteConstraintDefinition(id: $id)
  }
`;

// Reward Definition Mutations
export const CREATE_REWARD_DEFINITION = `
  mutation CreateRewardDefinition($input: CreateRewardDefinitionInput!) {
    createRewardDefinition(input: $input) {
      id
      type
      name
      description
      valueType
      defaultValue
      unit
      minValue
      maxValue
      requiresMaxValue
      isActive
      isSystemDefined
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_REWARD_DEFINITION = `
  mutation UpdateRewardDefinition($id: ID!, $input: CreateRewardDefinitionInput!) {
    updateRewardDefinition(id: $id, input: $input) {
      id
      type
      name
      description
      valueType
      defaultValue
      unit
      minValue
      maxValue
      requiresMaxValue
      isActive
      isSystemDefined
      updatedAt
    }
  }
`;

export const TOGGLE_REWARD_DEFINITION = `
  mutation ToggleRewardDefinition($id: ID!, $isActive: Boolean!) {
    toggleRewardDefinition(id: $id, isActive: $isActive) {
      id
      isActive
      updatedAt
    }
  }
`;

export const DELETE_REWARD_DEFINITION = `
  mutation DeleteRewardDefinition($id: ID!) {
    deleteRewardDefinition(id: $id)
  }
`;

export const SEED_REFERRAL_DEFINITIONS = `
  mutation SeedReferralDefinitions {
    seedReferralDefinitions
  }
`;
