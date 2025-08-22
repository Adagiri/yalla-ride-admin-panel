import { DataProvider } from '@refinedev/core';
import { Client, gql } from '@urql/core';

const GET_TRIPS = gql`
  query ListTrips(
    $pagination: PaginationInput
    $filter: TripFilterInput
    $sort: TripSortInput
  ) {
    listTrips(pagination: $pagination, filter: $filter, sort: $sort) {
      id
      tripNumber
      status
      customer {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      driver {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      pickup {
        address
        location {
          coordinates
        }
      }
      destination {
        address
        location {
          coordinates
        }
      }
      pricing {
        finalAmount
        baseAmount
        surgeMultiplier

        breakdown {
          baseFare
          distanceCharge
          timeCharge
          surgeFee
          discount
        }
      }
      paymentMethod
      requestedAt
      startedAt
      completedAt
      cancelledAt
    }
  }
`;

const GET_TRIP = gql`
  query GetTrip($id: ID!) {
    getTrip(id: $id) {
      id
      tripNumber
      status
      customer {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      driver {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      pickup {
        address
        coordinates
      }
      destination {
        address
        coordinates
      }
      pricing {
        finalAmount
        baseAmount
        surgeMultiplier

        breakdown {
          baseFare
          distanceCharge
          timeCharge
          surgeFee
          discount
        }
      }
      paymentMethod
      paymentStatus
      requestedAt
      startedAt
      completedAt
      cancelledAt
      timeline {
        event
        timestamp
        metadata
      }
    }
  }
`;

const GET_DRIVERS = gql`
  query ListDrivers(
    $pagination: PaginationInput
    $filter: DriverFilter
    $sort: DriverSort
  ) {
    listDrivers(pagination: $pagination, filter: $filter, sort: $sort) {
      id
      firstname
      lastname
      email
      phone {
        fullPhone
      }
      isOnline
      isAvailable
      paymentModel
      stats {
        totalTrips
        averageRating
        totalEarnings
      }
      profilePhotoSet
      profilePhoto
      personalInfoSet
      driverLicenseVerified
      vehicleInspectionDone
      createdAt
      updatedAt
      currentLocation {
        coordinates
      }
    }
  }
`;

const GET_DRIVER = gql`
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      firstname
      lastname
      email
      phone {
        fullPhone
      }
      isOnline
      isAvailable
      paymentModel
      stats {
        totalTrips
        averageRating
        totalEarnings
      }
      profilePhotoSet
      profilePhoto
      personalInfoSet
      driverLicenseVerified
      vehicleInspectionDone
      createdAt
      updatedAt
      currentLocation {
        coordinates
      }
      vehicleId
      walletBalance
    }
  }
`;

const CREATE_DRIVER = gql`
  mutation RegisterDriver($input: RegisterDriverInput!) {
    registerDriver(input: $input) {
      entity {
        id
        firstname
        lastname
        email
        phone {
          fullPhone
        }
      }
      token
    }
  }
`;

const UPDATE_DRIVER = gql`
  mutation UpdateDriverPersonalInfo($input: UpdateDriverPersonalInfoInput!) {
    updateDriverPersonalInfo(input: $input) {
      id
      firstname
      lastname
      email
      locationId
    }
  }
`;

const GET_CUSTOMERS = gql`
  query ListCustomers(
    $pagination: PaginationInput
    $filter: CustomerFilter
    $sort: CustomerSort
  ) {
    listCustomers(pagination: $pagination, filter: $filter, sort: $sort) {
      id
      firstname
      lastname
      email
      phone {
        fullPhone
      }
      isEmailVerified
      isPhoneVerified
      profilePhotoSet
      personalInfoSet
      totalSpentAllTime
      createdAt
      updatedAt
    }
  }
`;

const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      firstname
      lastname
      email
      phone {
        fullPhone
      }
      isEmailVerified
      isPhoneVerified
      profilePhoto
      profilePhotoSet
      personalInfoSet
      walletId
      paymentPpaymentReferences {
        preferredMethod
        autoTopUp
        autoTopUpThreshold
        autoTopUpAmount
      }
      totalSpentAllTime
      totalWalletTopUps
      averageSpendPerTrip
      lastPaymentAt
      createdAt
      updatedAt
    }
  }
`;

// Vehicle Operations
const GET_VEHICLES = gql`
  query ListVehicles(
    $pagination: PaginationInput
    $filter: VehicleFilter
    $sort: VehicleSort
  ) {
    listVehicles(pagination: $pagination, filter: $filter, sort: $sort) {
      id
      brand
      modelName
      manufactureYear
      color
      identificationNumber
      plateNumber
      createdAt
      updatedAt
    }
  }
`;

const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
      brand
      modelName
      manufactureYear
      color
      identificationNumber
      plateNumber
      createdAt
      updatedAt
    }
  }
`;

const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: VehicleInput!) {
    createVehicle(input: $input) {
      id
      brand
      modelName
      manufactureYear
      color
      identificationNumber
      plateNumber
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $input: VehicleInput!) {
    updateVehicle(id: $id, input: $input) {
      id
      brand
      modelName
      manufactureYear
      color
      identificationNumber
      plateNumber
      createdAt
      updatedAt
    }
  }
`;

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

const GET_SUBSCRIPTION_PLANS = gql`
  query ListSubscriptionPlans(
    $pagination: PaginationInput
    $filter: SubscriptionPlanFilter
  ) {
    listSubscriptionPlans(pagination: $pagination, filter: $filter) {
      id
      name
      description
      price
      features
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_SUBSCRIPTION_PLAN = gql`
  query GetSubscriptionPlan($id: ID!) {
    getSubscriptionPlan(id: $id) {
      id
      name
      description
      price
      features
      isActive
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SUBSCRIPTION_PLAN = gql`
  mutation CreateSubscriptionPlan($input: CreateSubscriptionPlanInput!) {
    createSubscriptionPlan(input: $input) {
      id
      name
      description
      price
      currency
      duration
      features
      isActive
      maxTripsPerDay
      commissionRate
    }
  }
`;

const UPDATE_SUBSCRIPTION_PLAN = gql`
  mutation UpdateSubscriptionPlan(
    $id: ID!
    $input: UpdateSubscriptionPlanInput!
  ) {
    updateSubscriptionPlan(id: $id, input: $input) {
      id
      name
      description
      price
      currency
      duration
      features
      isActive
    }
  }
`;

const GET_SUBSCRIPTIONS = gql`
  query ListDriverSubscriptions(
    $pagination: PaginationInput
    $filter: DriverSubscriptionFilter
  ) {
    listDriverSubscriptions(pagination: $pagination, filter: $filter) {
      id
      driver {
        id
        firstname
        lastname
        email
      }
      plan {
        id
        name
        price
      }
      status
      startDate
      endDate
      autoRenew
      createdAt
    }
  }
`;

const GET_PAYMENTS = gql`
  query ListPayments($pagination: PaginationInput, $filter: PaymentFilter) {
    listPayments(pagination: $pagination, filter: $filter) {
      id
      amount
      currency
      status
      paymentMethod
      paymentReference
      trip {
        id
        tripNumber
        customer {
          firstname
          lastname
        }
        driver {
          firstname
          lastname
        }
      }
      # customer {
      #   id
      #   firstname
      #   lastname
      # }
      createdAt
      completedAt
    }
  }
`;

const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    getDashboardMetrics {
      overview {
        totalDrivers
        activeDrivers
        totalCustomers
        activeCustomers
        totalTrips
        completedTrips
        totalRevenue
        platformCommission
      }
      todayStats {
        tripsToday
        revenueToday
        newDriversToday
        newCustomersToday
        activeDriversToday
      }
      trends {
        tripsGrowth
        revenueGrowth
        driversGrowth
        customersGrowth
      }
      tripsByStatus {
        pending
        active
        completed
        cancelled
      }
      recentActivity {
        type
        description
        timestamp
        amount
      }
    }
  }
`;

// Admin GraphQL Operations
const GET_ADMINS = gql`
  query GetAllAdmins($page: Int, $limit: Int) {
    getAllAdmins(page: $page, limit: $limit) {
      admins {
        id
        firstname
        lastname
        email
        role
        permissions
        department
        employeeId
        phone
        isEmailVerified
        isMFAEnabled
        isActive
        accessLevel
        profilePhoto
        timezone
        language
        lastLoginAt
        lastActiveAt
        totalLogins
        totalActions
        createdAt
        updatedAt
      }
      total
      page
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

const GET_ADMIN = gql`
  query GetAdminById($id: ID!) {
    getAdminById(id: $id) {
      id
      firstname
      lastname
      email
      role
      permissions
      department
      employeeId
      phone
      isEmailVerified
      isMFAEnabled
      isActive
      accessLevel
      profilePhoto
      timezone
      language
      lastLoginAt
      lastActiveAt
      totalLogins
      totalActions
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: CreateAdminInput!) {
    createAdmin(input: $input) {
      id
      firstname
      lastname
      email
      role
      department
      employeeId
      isActive
      createdAt
    }
  }
`;

const UPDATE_ADMIN = gql`
  mutation UpdateAdmin($id: ID!, $input: UpdateAdminInput!) {
    updateAdmin(id: $id, input: $input) {
      id
      firstname
      lastname
      email
      role
      department
      employeeId
      phone
      permissions
      isActive
      updatedAt
    }
  }
`;

const DELETE_ADMIN = gql`
  mutation DeleteAdmin($id: ID!) {
    deleteAdmin(id: $id) {
      success
      message
    }
  }
`;

const ACTIVATE_ADMIN = gql`
  mutation ActivateAdmin($id: ID!) {
    activateAdmin(id: $id) {
      id
      isActive
    }
  }
`;

const DEACTIVATE_ADMIN = gql`
  mutation DeactivateAdmin($id: ID!) {
    deactivateAdmin(id: $id) {
      id
      isActive
    }
  }
`;

// Audit Logs Operations
const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($filters: AuditLogFiltersInput) {
    getAuditLogs(filters: $filters) {
      logs {
        id
        adminId
        adminEmail
        adminRole
        action
        resource
        resourceId
        success
        timestamp
        ipAddress
        userAgent
        errorMessage
        metadata
      }
      total
      page
      totalPages
    }
  }
`;

const GET_AUDIT_STATS = gql`
  query GetAuditStats($days: Int) {
    getAuditStats(days: $days) {
      topActions {
        action
        count
      }
      topAdmins {
        adminEmail
        # count
      }
    }
  }
`;

// Updated Data Provider
export const createCustomDataProvider = (client: Client): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};

    try {
      let query;
      let variables: any = {
        pagination: {
          page: current,
          limit: pageSize,
        },
      };

      // Add filters if they exist
      if (filters && filters.length > 0) {
        const filter: any = {};
        filters.forEach((f) => {
          if (f.field && f.value !== undefined) {
            filter[f.field] = f.value;
          }
        });
        variables.filter = filter;
      }

      // Add sorting if it exists
      if (sorters && sorters.length > 0) {
        variables.sort = {
          field: sorters[0].field,
          direction: sorters[0].order?.toUpperCase() || 'DESC',
        };
      }

      switch (resource) {
        case 'admins':
          query = GET_ADMINS;
          variables = { page: current, limit: pageSize };
          break;
        case 'trips':
          query = GET_TRIPS;
          break;
        case 'drivers':
          query = GET_DRIVERS;
          break;
        case 'customers':
          query = GET_CUSTOMERS;
          break;
        case 'vehicles':
          query = GET_VEHICLES;
          break;
        case 'subscriptions':
          query = GET_SUBSCRIPTIONS;
          break;
        case 'subscription-plans':
          query = GET_SUBSCRIPTION_PLANS;
          break;
        case 'payments':
          query = GET_PAYMENTS;
          break;
        case 'audit-logs':
          query = GET_AUDIT_LOGS;
          variables = { filters: variables.filter };
          break;
        default:
          throw new Error(`Resource ${resource} not supported`);
      }

      const result = await client.query(query, variables).toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      let data, total;

      if (resource === 'admins') {
        const adminData = result.data?.getAllAdmins;
        data = adminData?.admins || [];
        total = adminData?.total || 0;
      } else if (resource === 'audit-logs') {
        const auditData = result.data?.getAuditLogs;
        data = auditData?.logs || [];
        total = auditData?.total || 0;
      } else {
        const dataKey = `list${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }`;
        data = result.data?.[dataKey] || [];
        total = data.length;
      }

      return {
        data,
        total,
      };
    } catch (error: any) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },

  getOne: async ({ resource, id }) => {
    try {
      let query;
      let dataKey;

      switch (resource) {
        case 'admins':
          query = GET_ADMIN;
          dataKey = 'getAdminById';
          break;
        case 'trips':
          query = GET_TRIP;
          dataKey = 'getTrip';
          break;
        case 'drivers':
          query = GET_DRIVER;
          dataKey = 'getDriver';
          break;
        case 'customers':
          query = GET_CUSTOMER;
          dataKey = 'getCustomer';
          break;
        case 'vehicles':
          query = GET_VEHICLE;
          dataKey = 'getVehicle';
          break;
        case 'subscription-plans':
          query = GET_SUBSCRIPTION_PLAN;
          dataKey = 'getSubscriptionPlan';
          break;
        default:
          throw new Error(`Resource ${resource} not supported for getOne`);
      }

      const result = await client.query(query, { id }).toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        data: result.data?.[dataKey],
      };
    } catch (error: any) {
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw error;
    }
  },

  create: async ({ resource, variables }) => {
    try {
      let mutation;
      let dataKey;

      switch (resource) {
        case 'admins':
          mutation = CREATE_ADMIN;
          dataKey = 'createAdmin';
          break;
        case 'drivers':
          mutation = CREATE_DRIVER;
          dataKey = 'registerDriver';
          break;
        case 'vehicles':
          mutation = CREATE_VEHICLE;
          dataKey = 'createVehicle';
          break;
        case 'subscription-plans':
          mutation = CREATE_SUBSCRIPTION_PLAN;
          dataKey = 'createSubscriptionPlan';
          break;
        default:
          throw new Error(`Resource ${resource} not supported for create`);
      }

      const result = await client
        .mutation(mutation, { input: variables })
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const responseData = result.data?.[dataKey];

      return {
        data: responseData?.entity || responseData,
      };
    } catch (error: any) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      let mutation;
      let dataKey;

      switch (resource) {
        case 'admins':
          mutation = UPDATE_ADMIN;
          dataKey = 'updateAdmin';
          break;
        case 'drivers':
          mutation = UPDATE_DRIVER;
          dataKey = 'updateDriverPersonalInfo';
          break;
        case 'vehicles':
          mutation = UPDATE_VEHICLE;
          dataKey = 'updateVehicle';
          break;
        case 'subscription-plans':
          mutation = UPDATE_SUBSCRIPTION_PLAN;
          dataKey = 'updateSubscriptionPlan';
          break;
        default:
          throw new Error(`Resource ${resource} not supported for update`);
      }

      const result = await client
        .mutation(mutation, { id, input: variables })
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        data: result.data?.[dataKey],
      };
    } catch (error: any) {
      console.error(`Error updating ${resource} with id ${id}:`, error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id }) => {
    try {
      let mutation;

      switch (resource) {
        case 'admins':
          mutation = DELETE_ADMIN;
          break;
        case 'vehicles':
          mutation = DELETE_VEHICLE;
          break;
        default:
          throw new Error(`Delete not implemented for ${resource} yet`);
      }

      const result = await client.mutation(mutation, { id }).toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        data: { id },
      };
    } catch (error: any) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw error;
    }
  },

  getApiUrl: () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql';
  },

  // Custom method for special operations
  custom: async ({ url, method, headers, meta }) => {
    if (url === 'dashboard-metrics') {
      try {
        const result = await client.query(GET_DASHBOARD_METRICS).toPromise();

        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          data: result.data?.getDashboardMetrics,
        };
      } catch (error: any) {
        console.error('Error fetching dashboard metrics:', error);
        throw error;
      }
    }

    if (url === 'audit-stats') {
      try {
        const result = await client.query(GET_AUDIT_STATS, meta).toPromise();

        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          data: result.data?.getAuditStats,
        };
      } catch (error: any) {
        console.error('Error fetching audit stats:', error);
        throw error;
      }
    }

    // ADD THIS NEW CASE - This was missing!
    if (url === 'audit-logs') {
      try {
        const result = await client
          .query(GET_AUDIT_LOGS, {
            filters: meta?.query || {},
          })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          data: result.data?.getAuditLogs,
        };
      } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }
    }

    if (url === 'activate-admin' && meta?.id) {
      try {
        const result = await client
          .mutation(ACTIVATE_ADMIN, { id: meta.id })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          data: result.data?.activateAdmin,
        };
      } catch (error: any) {
        console.error('Error activating admin:', error);
        throw error;
      }
    }

    if (url === 'deactivate-admin' && meta?.id) {
      try {
        const result = await client
          .mutation(DEACTIVATE_ADMIN, { id: meta.id })
          .toPromise();

        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          data: result.data?.deactivateAdmin,
        };
      } catch (error: any) {
        console.error('Error deactivating admin:', error);
        throw error;
      }
    }

    throw new Error(`Custom method for ${url} not implemented`);
  },
});
