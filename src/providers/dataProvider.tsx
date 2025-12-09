import {
  BaseRecord,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  UpdateParams,
} from '@refinedev/core';
import { Client, gql } from '@urql/core';
import {
  FileDownloadPayload,
  VerificationPayload,
  VehicleInspectionPayload,
  SettingsUpdatePayload,
} from '../types/index';
import * as SETTINGS_OPERATIONS from '../graphql/settings.operations';

// DRIVER QUERIES
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
      driverLicenseFront
      driverLicenseBack
      createdAt
      updatedAt
      currentLocation {
        coordinates
      }
      vehicleId
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
      driverLicenseFront
      driverLicenseBack
      createdAt
      updatedAt
      currentLocation {
        coordinates
      }
      vehicleId
    }
  }
`;

// TRIP QUERIES
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

// CUSTOMER QUERIES
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
      paymentPreferences {
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

// VEHICLE QUERIES
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
      vehicleInspectionDone
      identificationNumber
      inspectionStatus
      driverId
      plateNumber
      driver {
        firstname
        lastname
        email
        profilePhoto
        id
        phone {
          countryCode
          fullPhone
          localNumber
        }
        vehicleInspectionDone
        isOnline
        isAvailable
        isEmailVerified
      }
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
      driverId
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
      driverId
      identificationNumber
      vehicleInspectionDone
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

// SUBSCRIPTION QUERIES
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

// PAYMENT QUERIES
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
      createdAt
      completedAt
    }
  }
`;

// ADMIN QUERIES
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
        phone {
          countryCode
          fullPhone
          localNumber
        }
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
      phone {
        countryCode
        fullPhone
        localNumber
      }
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
      permissions
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
      phone {
        countryCode
        fullPhone
        localNumber
      }
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

// AUDIT LOG QUERIES
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
      }
    }
  }
`;

// LOCATION QUERIES
const GET_LOCATIONS = gql`
  query ListLocations(
    $pagination: PaginationInput
    $filter: LocationFilter
    $sort: LocationSort
  ) {
    listLocations(pagination: $pagination, filter: $filter, sort: $sort) {
      data {
        id
        name
        description
        address
        location {
          type
          coordinates
        }
        boundary {
          type
          coordinates
        }
        locationType
        isActive
        createdAt
        updatedAt
      }
      paginationResult {
        totalDocs
        docsRetrieved
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`;

const GET_LOCATION = gql`
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      boundary {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

const CREATE_LOCATION = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      boundary {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LOCATION = gql`
  mutation UpdateLocation($id: ID!, $input: UpdateLocationInput!) {
    updateLocation(id: $id, input: $input) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      boundary {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id)
  }
`;

const TOGGLE_LOCATION_STATUS = gql`
  mutation ToggleLocationStatus($id: ID!) {
    toggleLocationStatus(id: $id) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      boundary {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

const FIND_NEARBY_LOCATIONS = gql`
  query FindNearbyLocations(
    $longitude: Float!
    $latitude: Float!
    $maxDistance: Float
    $locationType: LocationType
  ) {
    findNearbyLocations(
      longitude: $longitude
      latitude: $latitude
      maxDistance: $maxDistance
      locationType: $locationType
    ) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

const FIND_LOCATIONS_BY_POINT = gql`
  query FindLocationsByPoint($longitude: Float!, $latitude: Float!) {
    findLocationsByPoint(longitude: $longitude, latitude: $latitude) {
      id
      name
      description
      address
      location {
        type
        coordinates
      }
      locationType
      isActive
      createdAt
      updatedAt
    }
  }
`;

// DASHBOARD QUERIES
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

const TOGGLE_DRIVER_LICENSE_VERIFICATION = gql`
  mutation ToggleDriverLicenseVerification($userId: ID!, $verified: Boolean!) {
    toggleDriverLicenseVerification(userId: $userId, verified: $verified) {
      success
      message
    }
  }
`;

const TOGGLE_VEHICLE_INSPECTION = gql`
  mutation ToggleVehicleInspection($userId: ID!, $inspected: Boolean!) {
    toggleVehicleInspection(userId: $userId, inspected: $inspected) {
      success
      message
    }
  }
`;
const UPDATE_DRIVER_VEHICLE_INFO = gql`
  mutation UpdateDriverVehicleInfo($input: UpdateDriverVehicleInfo) {
    updateDriverVehicleInfo(input: $input) {
      id
      vehicleInfoSet
    }
  }
`;
const UPDATE_VEHICLE_INSPECTION = gql`
  mutation UpdateVehicleInspection($input: UpdateVehicleInspectionInput) {
    updateVehicleInspection(input: $input) {
      id
      inspectionStatus
    }
  }
`;

const GET_FILE_DOWNLOAD_URL = gql`
  query GetFileDownloadUrl($key: String!) {
    getFileDownloadUrl(key: $key)
  }
`;

// DRIVER MUTATIONS
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

export const createCustomDataProvider = (client: Client): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};

    try {
      if (resource.startsWith('settings-')) {
        return await handleSettingsList(resource, client);
      }

      let query;
      let variables: any = {
        pagination: {
          page: current,
          limit: pageSize,
        },
      };

      // Define valid filter fields per resource
      const validFilters: Record<string, string[]> = {
        locations: [
          'ids',
          'name',
          'address',
          'locationType',
          'isActive',
          'search',
        ],
        trips: ['status', 'customerId', 'driverId'],
        drivers: [
          'isOnline',
          'isAvailable',
          'paymentModel',
          'driverLicenseVerified',
          'vehicleInspectionDone',
          'search',
        ],
        customers: ['isEmailVerified', 'isPhoneVerified', 'search'],
        vehicles: ['brand', 'modelName', 'search', 'vehicleInspectionDone'],
        subscriptions: ['status', 'driverId'],
        'subscription-plans': ['isActive'],
        payments: ['status', 'paymentMethod'],
        'audit-logs': ['adminId', 'action', 'resource'],
      };

      // Transform filters
      if (filters && filters.length > 0) {
        const filter: any = {};
        filters.forEach((f) => {
          if ('field' in f && f.field && f.value !== undefined) {
            // Handle search filter
            if (f.field === 'q' || f.field === 'search') {
              filter.search = f.value;
            }
            // Handle vehicle inspection filter (convert string to boolean)
            else if (
              f.field === 'vehicleInspectionDone' &&
              (f.value === 'true' || f.value === 'false')
            ) {
              filter.vehicleInspectionDone = f.value === 'true';
            }
            // Handle status filter (convert string to boolean)
            else if (
              f.field === 'isOnline' &&
              (f.value === 'online' || f.value === 'offline')
            ) {
              filter.isOnline = f.value === 'online';
            }

            // Handle other filters
            else if (validFilters[resource]?.includes(f.field)) {
              filter[f.field] = f.value;
            }
          }
        });
        if (Object.keys(filter).length > 0) {
          variables.filter = filter;
        }
      }

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
          variables = { filters: variables.filter || {} };
          break;
        case 'locations':
          query = GET_LOCATIONS;
          break;
        default:
          throw new Error(`Resource ${resource} not supported`);
      }

      const result = await client.query(query, variables).toPromise();

      if (result.error) {
        throw new Error(` ${result.error.message}`);
      }

      if (!result.data) {
        throw new Error(`No data returned for ${resource}`);
      }

      let data, total;

      if (resource === 'admins') {
        const adminData = result.data.getAllAdmins;
        data = adminData?.admins || [];
        total = adminData?.total || 0;
      } else if (resource === 'audit-logs') {
        const auditData = result.data.getAuditLogs;
        data = auditData?.logs || [];
        total = auditData?.total || 0;
      } else if (resource === 'locations') {
        const locationData = result.data.listLocations;
        if (!locationData) {
          throw new Error('listLocations data is undefined');
        }
        data = locationData.data || [];
        total = locationData.paginationResult?.totalDocs || data.length;
      } else {
        // FIXED: For drivers and other resources
        const dataKey = `list${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }`;
        const responseData = result.data[dataKey];

        if (Array.isArray(responseData)) {
          data = responseData;
          total = responseData.length;
        } else {
          data = [];
          total = 0;
        }
      }

      return {
        data,
        total,
      };
    } catch (error: any) {
      // console.error(` Error fetching ${resource}:`, error);
      throw new Error(`Failed to fetch ${resource}: ${error.message}`);
    }
  },

  getOne: async ({ resource, id }) => {
    console.log('id-resource', id, resource);
    try {
      if (resource.startsWith('settings-')) {
        return await handleSettingsGetOne(resource, id, client);
      }

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
        case 'locations':
          query = GET_LOCATION;
          dataKey = 'getLocation';

          break;
        default:
          throw new Error(`Resource ${resource} not supported for getOne`);
      }
      console.log('.......');
      console.log('getting-driver...');
      const result = await client.query(query, { id }).toPromise();

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      if (!result.data || !result.data[dataKey]) {
        throw new Error(`No data returned for ${resource} with id ${id}`);
      }

      return {
        data: result.data[dataKey],
      };
    } catch (error: any) {
      // console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw new Error(`Failed to fetch ${resource}: ${error.message}`);
    }
  },

  create: async ({ resource, variables }) => {
    try {
      if (resource.startsWith('settings-')) {
        return await handleSettingsCreate(resource, variables, client);
      }
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
        case 'locations':
          mutation = CREATE_LOCATION;
          dataKey = 'createLocation';

          break;
        default:
          throw new Error(`Resource ${resource} not supported for create`);
      }

      const result = await client
        .mutation(mutation, { input: variables })
        .toPromise();

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      if (!result.data || !result.data[dataKey]) {
        throw new Error(`No data returned for create ${resource}`);
      }

      const responseData = result.data[dataKey];

      return {
        data: responseData.entity || responseData,
      };
    } catch (error: any) {
      // console.error(`Error creating ${resource}:`, error);
      throw new Error(`Failed to create ${resource}: ${error.message}`);
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      if (resource.startsWith('settings-')) {
        return await handleSettingsUpdate(resource, id, variables, client);
      }

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
        case 'locations':
          mutation = UPDATE_LOCATION;
          dataKey = 'updateLocation';

          break;
        default:
          throw new Error(`Resource ${resource} not supported for update`);
      }

      const result = await client
        .mutation(mutation, { id, input: variables })
        .toPromise();

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      if (!result.data || !result.data[dataKey]) {
        throw new Error(`No data returned for update ${resource}`);
      }

      return {
        data: result.data[dataKey],
      };
    } catch (error: any) {
      // console.error(`Error updating ${resource} with id ${id}:`, error);
      throw new Error(`Failed to update ${resource}: ${error.message}`);
    }
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    try {
      let mutation;

      switch (resource) {
        case 'admins':
          mutation = DELETE_ADMIN;
          break;
        case 'vehicles':
          mutation = DELETE_VEHICLE;
          break;
        case 'locations':
          mutation = DELETE_LOCATION;
          break;
        default:
          throw new Error(`Delete not implemented for ${resource} yet`);
      }

      const result = await client.mutation(mutation, { id }).toPromise();

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      return {
        data: { id } as TData,
      };
    } catch (error: any) {
      // console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw new Error(`Failed to delete ${resource}: ${error.message}`);
    }
  },

  getApiUrl: () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8080/graphql';
  },

  custom: async ({ url, method, meta, payload }) => {
    try {
      if (url === 'dashboard-metrics') {
        const result = await client
          .query(GET_DASHBOARD_METRICS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getDashboardMetrics)
          throw new Error('No data returned for dashboard-metrics');
        return { data: result.data.getDashboardMetrics };
      }

      if (url === 'audit-stats') {
        const result = await client.query(GET_AUDIT_STATS, meta).toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getAuditStats)
          throw new Error('No data returned for audit-stats');
        return { data: result.data.getAuditStats };
      }

      if (url === 'audit-logs') {
        const result = await client
          .query(GET_AUDIT_LOGS, { filters: meta?.query || {} })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getAuditLogs)
          throw new Error('No data returned for audit-logs');
        return { data: result.data.getAuditLogs };
      }

      if (url === 'activate-admin') {
        const adminIdPayload = payload as { adminId: string };
        const result = await client
          .mutation(ACTIVATE_ADMIN, { id: adminIdPayload?.adminId })

          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.activateAdmin)
          throw new Error('No data returned for activate-admin');
        return { data: result.data.activateAdmin };
      }

      if (url === 'deactivate-admin') {
        const adminIdPayload = payload as { adminId: string };
        const result = await client
          .mutation(DEACTIVATE_ADMIN, { id: adminIdPayload?.adminId })

          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.deactivateAdmin)
          throw new Error('No data returned for deactivate-admin');
        return { data: result.data.deactivateAdmin };
      }
      if (
        url === 'find-nearby-locations' &&
        meta?.longitude &&
        meta?.latitude
      ) {
        const result = await client
          .query(FIND_NEARBY_LOCATIONS, {
            longitude: meta.longitude,
            latitude: meta.latitude,
            maxDistance: meta.maxDistance,
            locationType: meta.locationType,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.findNearbyLocations)
          throw new Error('No data returned for find-nearby-locations');
        return { data: result.data.findNearbyLocations };
      }
      if (
        url === 'find-locations-by-point' &&
        meta?.longitude &&
        meta?.latitude
      ) {
        const result = await client
          .query(FIND_LOCATIONS_BY_POINT, {
            longitude: meta.longitude,
            latitude: meta.latitude,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.findLocationsByPoint)
          throw new Error('No data returned for find-locations-by-point');
        return { data: result.data.findLocationsByPoint };
      }
      // FIXED: VERIFICATION METHODS
      if (url === 'get-file-download-url') {
        const filePayload = payload as FileDownloadPayload;
        const key = filePayload?.key;
        if (!key) {
          console.warn('⚠️ No file key provided for download');

          return { data: null };
        }

        const result = await client
          .query(GET_FILE_DOWNLOAD_URL, { key })
          .toPromise();

        if (result.error) {
          throw new Error(`GraphQL Error: ${result.error.message}`);
        }

        return { data: result.data?.getFileDownloadUrl };
      }

      if (url === 'toggle-driver-license-verification') {
        const verificationPayload = payload as VerificationPayload;
        const userId = verificationPayload?.userId;
        const verified = verificationPayload?.verified;

        if (!userId) throw new Error('User ID is required');

        const result = await client
          .mutation(TOGGLE_DRIVER_LICENSE_VERIFICATION, {
            userId,
            verified: Boolean(verified),
          })
          .toPromise();

        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.toggleDriverLicenseVerification };
      }

      if (url === 'toggle-vehicle-inspection') {
        const inspectionPayload = payload as VehicleInspectionPayload;
        const userId = inspectionPayload?.userId;
        const inspected = inspectionPayload?.inspected;

        if (!userId) throw new Error('User ID is required');

        const result = await client
          .mutation(TOGGLE_VEHICLE_INSPECTION, {
            userId,
            inspected: Boolean(inspected),
          })
          .toPromise();

        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.toggleVehicleInspection };
      }

      // ===== SETTINGS CUSTOM OPERATIONS =====

      if (url === 'get-general-settings') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_GENERAL_SETTINGS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getGeneralSettings };
      }

      if (url === 'get-pricing-settings') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_PRICING_SETTINGS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getPricingSettings };
      }

      if (url === 'get-payment-settings') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_PAYMENT_SETTINGS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getPaymentSettings };
      }

      if (url === 'get-security-settings') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_SECURITY_SETTINGS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getSecuritySettings };
      }

      if (url === 'create-general-setting') {
        const result = await client
          .mutation(SETTINGS_OPERATIONS.CREATE_GENERAL_SETTING, {
            input: payload,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.createGeneralSetting };
      }

      if (url === 'update-general-setting') {
        const settingsPayload = payload as SettingsUpdatePayload;

        const result = await client
          .mutation(SETTINGS_OPERATIONS.UPDATE_GENERAL_SETTING, {
            id: settingsPayload!.id,
            input: settingsPayload!.input,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.updateGeneralSetting };
      }

      if (url === 'activate-general-setting') {
        const settingsPayload = payload as { id: string };
        const result = await client
          .mutation(SETTINGS_OPERATIONS.ACTIVATE_GENERAL_SETTING, {
            id: settingsPayload!.id,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.activateGeneralSetting };
      }

      if (url === 'create-pricing-setting') {
        const result = await client
          .mutation(SETTINGS_OPERATIONS.CREATE_PRICING_SETTING, {
            input: payload,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.createPricingSetting };
      }

      if (url === 'update-pricing-setting') {
        const settingsPayload = payload as SettingsUpdatePayload;
        const result = await client
          .mutation(SETTINGS_OPERATIONS.UPDATE_PRICING_SETTING, {
            id: settingsPayload!.id,
            input: settingsPayload!.input,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.updatePricingSetting };
      }

      if (url === 'activate-pricing-setting') {
        const settingsPayload = payload as { id: string };
        const result = await client
          .mutation(SETTINGS_OPERATIONS.ACTIVATE_PRICING_SETTING, {
            id: settingsPayload!.id,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.activatePricingSetting };
      }

      if (url === 'create-payment-setting') {
        const result = await client
          .mutation(SETTINGS_OPERATIONS.CREATE_PAYMENT_SETTING, {
            input: payload,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.createPaymentSetting };
      }

      if (url === 'update-payment-setting') {
        const settingsPayload = payload as SettingsUpdatePayload;
        const result = await client
          .mutation(SETTINGS_OPERATIONS.UPDATE_PAYMENT_SETTING, {
            id: settingsPayload!.id,
            input: settingsPayload!.input,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.updatePaymentSetting };
      }

      if (url === 'activate-payment-setting') {
        const settingsPayload = payload as { id: string };
        const result = await client
          .mutation(SETTINGS_OPERATIONS.ACTIVATE_PAYMENT_SETTING, {
            id: settingsPayload!.id,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.activatePaymentSetting };
      }

      if (url === 'create-security-setting') {
        const result = await client
          .mutation(SETTINGS_OPERATIONS.CREATE_SECURITY_SETTING, {
            input: payload,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.createSecuritySetting };
      }

      if (url === 'update-security-setting') {
        const settingsPayload = payload as { id: string; input: any };
        const result = await client
          .mutation(SETTINGS_OPERATIONS.UPDATE_SECURITY_SETTING, {
            id: settingsPayload!.id,
            input: settingsPayload!.input,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.updateSecuritySetting };
      }

      if (url === 'activate-security-setting') {
        const settingsPayload = payload as { id: string };
        const result = await client
          .mutation(SETTINGS_OPERATIONS.ACTIVATE_SECURITY_SETTING, {
            id: settingsPayload!.id,
          })
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.activateSecuritySetting };
      }

      if (url === 'get-system-health') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_SYSTEM_HEALTH, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getSystemHealth };
      }

      if (url === 'get-system-health-stats') {
        const result = await client
          .query(SETTINGS_OPERATIONS.GET_SYSTEM_HEALTH_STATS, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.getSystemHealthStats };
      }

      if (url === 'refresh-system-health') {
        const result = await client
          .mutation(SETTINGS_OPERATIONS.REFRESH_SYSTEM_HEALTH, {})
          .toPromise();
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        return { data: result.data?.refreshSystemHealth };
      }

      if (url === 'update-vehicle') {
        const input = (payload as any)?.input;
        console.log(input, 'input---');
        const result = await client.mutation(UPDATE_VEHICLE_INSPECTION, {
          input: {
            driverId: input.driverId,
            vehicleId: input.id,
            inspectionStatus: input.inspectionStatus,
          },
        });
        console.log(result, 'inspection result');
        if (result.error) {
          throw new Error(
            `GraphQL Error (updateVehicleInspection): ${result.error.message}`
          );
        }

        return { data: result.data?.updateVehicleInspection };
      }

      throw new Error(`Custom method for ${url} not implemented`);
    } catch (error: any) {
      throw new Error(`Failed to execute custom(${url}): ${error.message}`);
    }
  },
});

const handleSettingsList = async (resource: string, client: Client) => {
  // Settings are typically single records, return as array for list compatibility
  let query;

  switch (resource) {
    case 'settings-general':
      query = SETTINGS_OPERATIONS.GET_GENERAL_SETTINGS;
      break;
    case 'settings-pricing':
      query = SETTINGS_OPERATIONS.GET_PRICING_SETTINGS;
      break;
    case 'settings-payment':
      query = SETTINGS_OPERATIONS.GET_PAYMENT_SETTINGS;
      break;
    case 'settings-security':
      query = SETTINGS_OPERATIONS.GET_SECURITY_SETTINGS;
      break;
    default:
      throw new Error(`Settings resource ${resource} not supported`);
  }

  const result = await client.query(query, {}).toPromise();
  if (result.error) throw new Error(`GraphQL Error: ${result.error.message}`);

  const dataKey = Object.keys(result.data || {})[0];
  const data = result.data?.[dataKey];

  return {
    data: data ? [data] : [],
    total: data ? 1 : 0,
  };
};

const handleSettingsGetOne = async (
  resource: string,
  id: number | string,
  client: Client
) => {
  // For settings, we typically get the active setting
  let query;

  switch (resource) {
    case 'settings-general':
      query = SETTINGS_OPERATIONS.GET_GENERAL_SETTINGS;
      break;
    case 'settings-pricing':
      query = SETTINGS_OPERATIONS.GET_PRICING_SETTINGS;
      break;
    case 'settings-payment':
      query = SETTINGS_OPERATIONS.GET_PAYMENT_SETTINGS;
      break;
    case 'settings-security':
      query = SETTINGS_OPERATIONS.GET_SECURITY_SETTINGS;
      break;
    default:
      throw new Error(`Settings resource ${resource} not supported`);
  }

  const result = await client.query(query, {}).toPromise();
  if (result.error) throw new Error(`GraphQL Error: ${result.error.message}`);

  const dataKey = Object.keys(result.data || {})[0];
  const data = result.data?.[dataKey];

  return { data };
};

const handleSettingsCreate = async (
  resource: string,
  variables: any,
  client: Client
) => {
  let mutation;

  switch (resource) {
    case 'settings-general':
      mutation = SETTINGS_OPERATIONS.CREATE_GENERAL_SETTING;
      break;
    case 'settings-pricing':
      mutation = SETTINGS_OPERATIONS.CREATE_PRICING_SETTING;
      break;
    case 'settings-payment':
      mutation = SETTINGS_OPERATIONS.CREATE_PAYMENT_SETTING;
      break;
    case 'settings-security':
      mutation = SETTINGS_OPERATIONS.CREATE_SECURITY_SETTING;
      break;
    default:
      throw new Error(`Settings resource ${resource} not supported for create`);
  }

  const result = await client
    .mutation(mutation, { input: variables })
    .toPromise();
  if (result.error) throw new Error(`GraphQL Error: ${result.error.message}`);

  const dataKey = Object.keys(result.data || {})[0];
  const data = result.data?.[dataKey];

  return { data };
};

const handleSettingsUpdate = async (
  resource: string,
  id: string | number,
  variables: any,
  client: Client
) => {
  let mutation;

  switch (resource) {
    case 'settings-general':
      mutation = SETTINGS_OPERATIONS.UPDATE_GENERAL_SETTING;
      break;
    case 'settings-pricing':
      mutation = SETTINGS_OPERATIONS.UPDATE_PRICING_SETTING;
      break;
    case 'settings-payment':
      mutation = SETTINGS_OPERATIONS.UPDATE_PAYMENT_SETTING;
      break;
    case 'settings-security':
      mutation = SETTINGS_OPERATIONS.UPDATE_SECURITY_SETTING;
      break;
    default:
      throw new Error(`Settings resource ${resource} not supported for update`);
  }

  const result = await client
    .mutation(mutation, { id, input: variables })
    .toPromise();
  if (result.error) throw new Error(`GraphQL Error: ${result.error.message}`);

  const dataKey = Object.keys(result.data || {})[0];
  const data = result.data?.[dataKey];

  return { data };
};
