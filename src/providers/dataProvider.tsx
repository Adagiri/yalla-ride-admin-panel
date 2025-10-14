import {
  BaseRecord,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  UpdateParams,
} from "@refinedev/core";
import { Client, gql } from "@urql/core";

// Existing queries/mutations (unchanged, included for completeness)
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

// Location Operations
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

      // Define valid filter fields per resource
      const validFilters: Record<string, string[]> = {
        locations: [
          "ids",
          "name",
          "address",
          "locationType",
          "isActive",
          "search",
        ],
        trips: ["status", "customerId", "driverId"],
        drivers: ["isOnline", "isAvailable", "paymentModel"],
        customers: ["isEmailVerified", "isPhoneVerified"],
        vehicles: ["brand", "modelName"],
        subscriptions: ["status", "driverId"],
        "subscription-plans": ["isActive"],
        payments: ["status", "paymentMethod"],
        "audit-logs": ["adminId", "action", "resource"],
      };

      // Transform filters
      if (filters && filters.length > 0) {
        const filter: any = {};
        filters.forEach((f) => {
          if (
            "field" in f &&
            f.field &&
            f.value !== undefined &&
            validFilters[resource]?.includes(f.field)
          ) {
            // Handle boolean fields explicitly
            if (f.field === "isActive" && resource === "locations") {
              filter[f.field] = f.value === "true" || f.value === true;
            } else {
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
          direction: sorters[0].order?.toUpperCase() || "DESC",
        };
      }

      switch (resource) {
        case "admins":
          query = GET_ADMINS;
          variables = { page: current, limit: pageSize };
          break;
        case "trips":
          query = GET_TRIPS;
          break;
        case "drivers":
          query = GET_DRIVERS;
          break;
        case "customers":
          query = GET_CUSTOMERS;
          break;
        case "vehicles":
          query = GET_VEHICLES;
          break;
        case "subscriptions":
          query = GET_SUBSCRIPTIONS;
          break;
        case "subscription-plans":
          query = GET_SUBSCRIPTION_PLANS;
          break;
        case "payments":
          query = GET_PAYMENTS;
          break;
        case "audit-logs":
          query = GET_AUDIT_LOGS;
          variables = { filters: variables.filter || {} };
          break;
        case "locations":
          query = GET_LOCATIONS;
          break;
        default:
          throw new Error(`Resource ${resource} not supported`);
      }

      const result = await client.query(query, variables).toPromise();

      // Log result for debugging
      // console.log(
      //   `getList(${resource}) - Variables:`,
      //   JSON.stringify(variables, null, 2)
      // );
      // console.log(`getList(${resource}) - Result:`, {
      //   data: result,
      //   error: result.error,
      // });

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      if (!result.data) {
        throw new Error(`No data returned for ${resource}`);
      }

      let data, total;

      if (resource === "admins") {
        const adminData = result.data.getAllAdmins;
        data = adminData?.admins || [];
        total = adminData?.total || 0;
      } else if (resource === "audit-logs") {
        const auditData = result.data.getAuditLogs;
        data = auditData?.logs || [];
        total = auditData?.total || 0;
      } else if (resource === "locations") {
        const locationData = result.data.listLocations;
        if (!locationData) {
          throw new Error("listLocations data is undefined");
        }
        data = locationData.data || [];
        total = locationData.paginationResult?.totalDocs || data.length;
      } else {
        const dataKey = `list${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }`;
        data = result.data[dataKey] || [];
        total = data.length; // Fallback; adjust if backend provides total
      }

      return {
        data,
        total,
      };
    } catch (error: any) {
      console.error(`Error fetching ${resource}:`, error);
      throw new Error(`Failed to fetch ${resource}: ${error.message}`);
    }
  },

  getOne: async ({ resource, id }) => {
    try {
      let query;
      let dataKey;

      switch (resource) {
        case "admins":
          query = GET_ADMIN;
          dataKey = "getAdminById";
          break;
        case "trips":
          query = GET_TRIP;
          dataKey = "getTrip";
          break;
        case "drivers":
          query = GET_DRIVER;
          dataKey = "getDriver";
          break;
        case "customers":
          query = GET_CUSTOMER;
          dataKey = "getCustomer";
          break;
        case "vehicles":
          query = GET_VEHICLE;
          dataKey = "getVehicle";
          break;
        case "subscription-plans":
          query = GET_SUBSCRIPTION_PLAN;
          dataKey = "getSubscriptionPlan";
          break;
        case "locations":
          query = GET_LOCATION;
          dataKey = "getLocation";
          break;
        default:
          throw new Error(`Resource ${resource} not supported for getOne`);
      }

      const result = await client.query(query, { id }).toPromise();

      // Log result for debugging
      // console.log(`getOne(${resource}, id: ${id}) - Result:`, {
      //   data: result.data,
      //   error: result.error,
      // });

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
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw new Error(`Failed to fetch ${resource}: ${error.message}`);
    }
  },

  create: async ({ resource, variables }) => {
    try {
      let mutation;
      let dataKey;

      switch (resource) {
        case "admins":
          mutation = CREATE_ADMIN;
          dataKey = "createAdmin";
          break;
        case "drivers":
          mutation = CREATE_DRIVER;
          dataKey = "registerDriver";
          break;
        case "vehicles":
          mutation = CREATE_VEHICLE;
          dataKey = "createVehicle";
          break;
        case "subscription-plans":
          mutation = CREATE_SUBSCRIPTION_PLAN;
          dataKey = "createSubscriptionPlan";
          break;
        case "locations":
          mutation = CREATE_LOCATION;
          dataKey = "createLocation";
          break;
        default:
          throw new Error(`Resource ${resource} not supported for create`);
      }

      const result = await client
        .mutation(mutation, { input: variables })
        .toPromise();

      // Log result for debugging
      // console.log(
      //   `create(${resource}) - Variables:`,
      //   JSON.stringify(variables, null, 2)
      // );
      // console.log(`create(${resource}) - Result:`, {
      //   data: result.data,
      //   error: result.error,
      // });

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
      console.error(`Error creating ${resource}:`, error);
      throw new Error(`Failed to create ${resource}: ${error.message}`);
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      let mutation;
      let dataKey;

      switch (resource) {
        case "admins":
          mutation = UPDATE_ADMIN;
          dataKey = "updateAdmin";
          break;
        case "drivers":
          mutation = UPDATE_DRIVER;
          dataKey = "updateDriverPersonalInfo";
          break;
        case "vehicles":
          mutation = UPDATE_VEHICLE;
          dataKey = "updateVehicle";
          break;
        case "subscription-plans":
          mutation = UPDATE_SUBSCRIPTION_PLAN;
          dataKey = "updateSubscriptionPlan";
          break;
        case "locations":
          mutation = UPDATE_LOCATION;
          dataKey = "updateLocation";
          break;
        default:
          throw new Error(`Resource ${resource} not supported for update`);
      }

      const result = await client
        .mutation(mutation, { id, input: variables })
        .toPromise();

      // Log result for debugging
      // console.log(
      //   `update(${resource}, id: ${id}) - Variables:`,
      //   JSON.stringify(variables, null, 2)
      // );
      // console.log(`update(${resource}) - Result:`, {
      //   data: result.data,
      //   error: result.error,
      // });

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
      console.error(`Error updating ${resource} with id ${id}:`, error);
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
        case "admins":
          mutation = DELETE_ADMIN;
          break;
        case "vehicles":
          mutation = DELETE_VEHICLE;
          break;
        case "locations":
          mutation = DELETE_LOCATION;
          break;
        default:
          throw new Error(`Delete not implemented for ${resource} yet`);
      }

      const result = await client.mutation(mutation, { id }).toPromise();

      // Log result for debugging
      // console.log(`deleteOne(${resource}, id: ${id}) - Result:`, {
      //   data: result.data,
      //   error: result.error,
      // });

      if (result.error) {
        throw new Error(`GraphQL Error: ${result.error.message}`);
      }

      return {
        data: { id } as TData,
      };
    } catch (error: any) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw new Error(`Failed to delete ${resource}: ${error.message}`);
    }
  },

  getApiUrl: () => {
    return import.meta.env.VITE_API_URL || "http://localhost:8080/graphql";
  },

  custom: async ({ url, method, headers, meta }) => {
    try {
      if (url === "dashboard-metrics") {
        const result = await client
          .query(GET_DASHBOARD_METRICS, {})
          .toPromise();
        // console.log("custom(dashboard-metrics) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getDashboardMetrics)
          throw new Error("No data returned for dashboard-metrics");
        return { data: result.data.getDashboardMetrics };
      }

      if (url === "audit-stats") {
        const result = await client.query(GET_AUDIT_STATS, meta).toPromise();
        // console.log("custom(audit-stats) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getAuditStats)
          throw new Error("No data returned for audit-stats");
        return { data: result.data.getAuditStats };
      }

      if (url === "audit-logs") {
        const result = await client
          .query(GET_AUDIT_LOGS, { filters: meta?.query || {} })
          .toPromise();
        // console.log("custom(audit-logs) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.getAuditLogs)
          throw new Error("No data returned for audit-logs");
        return { data: result.data.getAuditLogs };
      }

      if (url === "activate-admin" && meta?.id) {
        const result = await client
          .mutation(ACTIVATE_ADMIN, { id: meta.id })
          .toPromise();
        // console.log("custom(activate-admin) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.activateAdmin)
          throw new Error("No data returned for activate-admin");
        return { data: result.data.activateAdmin };
      }

      if (url === "deactivate-admin" && meta?.id) {
        const result = await client
          .mutation(DEACTIVATE_ADMIN, { id: meta.id })
          .toPromise();
        // console.log("custom(deactivate-admin) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.deactivateAdmin)
          throw new Error("No data returned for deactivate-admin");
        return { data: result.data.deactivateAdmin };
      }

      if (
        url === "find-nearby-locations" &&
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
        // console.log("custom(find-nearby-locations) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.findNearbyLocations)
          throw new Error("No data returned for find-nearby-locations");
        return { data: result.data.findNearbyLocations };
      }

      if (
        url === "find-locations-by-point" &&
        meta?.longitude &&
        meta?.latitude
      ) {
        const result = await client
          .query(FIND_LOCATIONS_BY_POINT, {
            longitude: meta.longitude,
            latitude: meta.latitude,
          })
          .toPromise();
        // console.log("custom(find-locations-by-point) - Result:", {
        //   data: result.data,
        //   error: result.error,
        // });
        if (result.error)
          throw new Error(`GraphQL Error: ${result.error.message}`);
        if (!result.data?.findLocationsByPoint)
          throw new Error("No data returned for find-locations-by-point");
        return { data: result.data.findLocationsByPoint };
      }

      throw new Error(`Custom method for ${url} not implemented`);
    } catch (error: any) {
      console.error(`Error in custom(${url}):`, error);
      throw new Error(`Failed to execute custom(${url}): ${error.message}`);
    }
  },
});
