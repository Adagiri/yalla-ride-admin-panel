import React from 'react';
import {
  Refine,
  Authenticated,
  AuthBindings,
  AuthProvider,
} from '@refinedev/core';
import {
  ThemedLayoutV2,
  RefineThemes,
  useNotificationProvider,
  ErrorComponent,
} from '@refinedev/antd';
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import '@refinedev/antd/dist/reset.css';

import { Client, fetchExchange } from '@urql/core';
import { Provider } from 'urql';
import { createCustomDataProvider } from './providers/dataProvider';

// Import Ant Design Icons for resources
import {
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CarFilled,
  CreditCardOutlined,
  FileTextOutlined,
  WalletOutlined,
  BellOutlined,
  SettingOutlined,
  AuditOutlined,
  CustomerServiceOutlined,
  ShareAltOutlined,
  GiftOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

// Import pages
import { DashboardPage } from './pages/dashboard';
import {
  TripList,
  // TripShow, TripEdit
} from './pages/trips';
import {
  DriverList,
  // DriverCreate,
} from './pages/drivers';
import { DriverShow } from './pages/drivers/show';
import { DriverEdit } from './pages/drivers/edit';

import {
  CustomerList,
  // CustomerShow, CustomerEdit
} from './pages/customers';

import {
  SubscriptionList,
  // SubscriptionShow,
  // SubscriptionEdit,
  // SubscriptionCreate,
} from './pages/subscriptions';
import {
  PaymentList,
  //  PaymentShow
} from './pages/payments';
import {
  VehicleList,
  // VehicleShow, VehicleEdit
} from './pages/vehicles';
import { NotificationList, NotificationCreate } from './pages/notifications';
import { SystemSettings } from './pages/settings';
import {
  AdminList,
  // AdminShow,
  AdminEdit,
  AdminCreate,
} from './pages/admins';
import { AuditLogs } from './pages/audit';

// Import auth components
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminForgotPassword } from './pages/auth/AdminForgotPassword';
import { AdminResetPassword } from './pages/auth/AdminResetPassword';
import { SupportTicketList } from './pages/support';
import { Locations } from './pages/locations'; // Updated import
import {
  CampaignList,
  TransactionList,
  RewardList,
  ReferralAnalyticsDashboard,
} from './pages/referrals';

export const client = new Client({
  url: import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql',
  exchanges: [fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    };
  },
});

// Create custom data provider with backend integration
const dataProvider = createCustomDataProvider(client);

// Authentication provider with backend integration
const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const mutation = `
        mutation AdminLogin($input: AdminLoginInput!) {
          adminLogin(input: $input) {
            token
            admin {
              id
              firstname
              lastname
              email
              role
              department
              permissions
              isActive
              isEmailVerified
            }
            expiresAt
          }
        }
      `;

      const result = await client
        .mutation(mutation, {
          input: {
            email,
            password,
          },
        })
        .toPromise();

      // Better error handling to extract the actual error message
      if (result.error) {
        // Extract the detailed error message from GraphQL errors
        let errorMessage = 'Login failed';
        if (
          result.error.graphQLErrors &&
          result.error.graphQLErrors.length > 0
        ) {
          const graphQLError = result.error.graphQLErrors[0];

          // Check for detailed message in extensions
          if (
            graphQLError.extensions?.details &&
            typeof graphQLError.extensions.details === 'string'
          ) {
            errorMessage = graphQLError.extensions.details;
          } else if (graphQLError.message) {
            errorMessage = graphQLError.message;
          }
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        console.error('Login error:', errorMessage);

        return {
          success: false,
          error: {
            name: 'Login Error',
            message: errorMessage, // This will now show "Invalid credentials" or other specific error
          },
        };
      }

      if (!result.data?.adminLogin) {
        return {
          success: false,
          error: {
            name: 'Login Error',
            message: 'Login failed. Please try again.',
          },
        };
      }

      const { token, admin, expiresAt } = result.data.adminLogin;

      // Verify the admin account is active
      if (!admin.isActive) {
        return {
          success: false,
          error: {
            name: 'Account Inactive',
            message:
              'Your admin account has been deactivated. Please contact support.',
          },
        };
      }

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('expiresAt', expiresAt);

      return {
        success: true,
        redirectTo: '/dashboard',
      };
    } catch (error: any) {
      console.error('Unexpected error during login:', error);
      return {
        success: false,
        error: {
          name: 'Login Error',
          message:
            error.message || 'An unexpected error occurred. Please try again.',
        },
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const mutation = `
          mutation AdminLogout {
            adminLogout {
              success
              message
            }
          }
        `;

        const result = await client.mutation(mutation, {}).toPromise();

        if (result.error) {
          console.error('Logout error:', result.error);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear local storage regardless of logout API success
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('expiresAt');

    return {
      success: true,
      redirectTo: '/auth/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !admin || !expiresAt) {
      return {
        authenticated: false,
        redirectTo: '/auth/login',
      };
    }

    // Check if token is expired
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();

    if (now >= expiry) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');

      return {
        authenticated: false,
        redirectTo: '/auth/login',
        error: {
          message: 'Your session has expired. Please login again.',
          name: 'Session Expired',
        },
      };
    }

    // Parse admin data to check if still active
    try {
      const adminData = JSON.parse(admin);
      if (!adminData.isActive) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        localStorage.removeItem('expiresAt');

        return {
          authenticated: false,
          redirectTo: '/auth/login',
          error: {
            message: 'Your account has been deactivated.',
            name: 'Account Inactive',
          },
        };
      }
    } catch (e) {
      // If we can't parse admin data, logout
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');

      return {
        authenticated: false,
        redirectTo: '/auth/login',
      };
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    try {
      const adminData = JSON.parse(admin);
      return adminData.permissions || [];
    } catch (e) {
      return [];
    }
  },

  getIdentity: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    try {
      const adminData = JSON.parse(admin);
      return {
        id: adminData.id,
        name: `${adminData.firstname} ${adminData.lastname}`,
        email: adminData.email,
        role: adminData.role,
        department: adminData.department,
        avatar: adminData.profilePhoto,
      };
    } catch (e) {
      return null;
    }
  },

  onError: async (error) => {
    // Handle 401 Unauthorized errors
    if (error.statusCode === 401 || error.code === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');

      return {
        logout: true,
        redirectTo: '/auth/login',
        error: {
          message: 'Your session has expired. Please login again.',
          name: 'Session Expired',
        },
      };
    }

    // Handle 403 Forbidden errors
    if (error.statusCode === 403 || error.code === 403) {
      return {
        error: {
          message: 'You do not have permission to perform this action.',
          name: 'Access Denied',
        },
      };
    }

    // Pass through other errors
    return { error };
  },
};
// Main App component
function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Provider value={client}>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: 'yalla-ride-admin',
                title: {
                  text: 'Yalla Ride Admin',
                  icon: '🚗',
                },
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/dashboard',
                  meta: {
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: 'admins',
                  list: '/admins',
                  show: '/admins/show/:id',
                  edit: '/admins/edit/:id',
                  create: '/admins/create',
                  meta: {
                    label: 'Admin Users',
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: 'drivers',
                  list: '/drivers',
                  show: '/drivers/show/:id',
                  edit: '/drivers/edit/:id',
                  create: '/drivers/create',
                  meta: {
                    label: 'Drivers',

                    icon: <CarOutlined />,
                  },
                },
                {
                  name: 'customers',
                  list: '/customers',
                  show: '/customers/show/:id',
                  edit: '/customers/edit/:id',
                  meta: {
                    label: 'Customers',
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: 'trips',
                  list: '/trips',
                  // show: '/trips/show/:id',
                  // edit: '/trips/edit/:id',
                  meta: {
                    label: 'Trips',
                    icon: <EnvironmentOutlined />,
                  },
                },
                {
                  name: 'vehicles',
                  list: '/vehicles',
                  // show: '/vehicles/show/:id',
                  // edit: '/vehicles/edit/:id',
                  meta: {
                    label: 'Vehicles',
                    icon: <CarFilled />,
                  },
                },
                {
                  name: 'payments',
                  list: '/payments',
                  // show: '/payments/show/:id',
                  meta: {
                    label: 'Payments',
                    icon: <CreditCardOutlined />,
                  },
                },
                {
                  name: 'subscriptions',
                  list: '/subscriptions',
                  // show: '/subscriptions/show/:id',
                  // edit: '/subscriptions/edit/:id',
                  create: '/subscriptions/create',
                  meta: {
                    label: 'Subscriptions',
                    icon: <FileTextOutlined />,
                  },
                },
                {
                  name: 'locations',
                  list: '/locations',
                  meta: { label: 'Locations', icon: <EnvironmentOutlined /> },
                },
                // {
                //   name: 'notifications',
                //   list: '/notifications',
                //   create: '/notifications/create',
                //   meta: {
                //     label: 'Notifications',
                //     icon: <BellOutlined />,
                //   },
                // },
                {
                  name: 'audit-logs',
                  list: '/audit-logs',
                  meta: {
                    label: 'Audit Logs',
                    icon: <AuditOutlined />,
                  },
                },

                {
                  name: 'support',
                  list: '/support',
                  meta: {
                    label: 'Support',
                    icon: <CustomerServiceOutlined />,
                  },
                },

                {
                  name: 'settings',
                  list: '/settings',
                  meta: {
                    label: 'Settings',
                    icon: <SettingOutlined />,
                  },
                },
                {
                  name: 'referrals',
                  meta: {
                    label: 'Referrals',
                    icon: <ShareAltOutlined />,
                  },
                },
                {
                  name: 'referrals/campaigns',
                  list: '/referrals/campaigns',
                  meta: {
                    label: 'Campaigns',
                    icon: <GiftOutlined />,
                    parent: 'referrals',
                  },
                },
                {
                  name: 'referrals/transactions',
                  list: '/referrals/transactions',
                  meta: {
                    label: 'Transactions',
                    icon: <FileTextOutlined />,
                    parent: 'referrals',
                  },
                },
                {
                  name: 'referrals/rewards',
                  list: '/referrals/rewards',
                  meta: {
                    label: 'Rewards',
                    icon: <GiftOutlined />,
                    parent: 'referrals',
                  },
                },
                {
                  name: 'referrals/analytics',
                  list: '/referrals/analytics',
                  meta: {
                    label: 'Analytics',
                    icon: <BarChartOutlined />,
                    parent: 'referrals',
                  },
                },
              ]}
            >
              <Routes>
                {/* Public authentication routes */}
                <Route
                  element={
                    <Authenticated key='auth-routes' fallback={<Outlet />}>
                      <NavigateToResource resource='dashboard' />
                    </Authenticated>
                  }
                >
                  <Route path='/auth'>
                    <Route path='login' element={<AdminLogin />} />
                    <Route
                      path='forgot-password'
                      element={<AdminForgotPassword />}
                    />
                    <Route
                      path='reset-password'
                      element={<AdminResetPassword />}
                    />
                  </Route>
                </Route>

                {/* Protected admin routes */}
                <Route
                  element={
                    <Authenticated
                      key='authenticated-routes'
                      redirectOnFail='/auth/login'
                    >
                      <ThemedLayoutV2>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  {/* Dashboard */}

                  <Route path='/dashboard' element={<DashboardPage />} />

                  {/* Admin routes */}
                  <Route path='/admins'>
                    <Route index element={<AdminList />} />
                    {/* <Route path='show/:id' element={<AdminShow />} /> */}
                    <Route path='edit/:id' element={<AdminEdit />} />
                    <Route path='create' element={<AdminCreate />} />
                  </Route>

                  {/* Driver routes */}
                  <Route path='/drivers'>
                    <Route index element={<DriverList />} />
                    <Route path='show/:id' element={<DriverShow />} />
                    <Route path='edit/:id' element={<DriverEdit />} />
                    {/* <Route path='create' element={<DriverCreate />} /> */}
                  </Route>
                  {/* Customer routes */}
                  <Route path='/customers'>
                    <Route index element={<CustomerList />} />
                    {/* <Route path='show/:id' element={<CustomerShow />} /> */}
                    {/* <Route path='edit/:id' element={<CustomerEdit />} /> */}
                  </Route>

                  {/* Trip routes */}
                  <Route path='/trips'>
                    <Route index element={<TripList />} />
                    {/* <Route path='show/:id' element={<TripShow />} /> */}
                    {/* <Route path='edit/:id' element={<TripEdit />} /> */}
                  </Route>

                  {/* Vehicle routes */}
                  <Route path='/vehicles'>
                    <Route index element={<VehicleList />} />
                    {/* <Route path='show/:id' element={<VehicleShow />} /> */}
                    {/* <Route path='edit/:id' element={<VehicleEdit />} /> */}
                  </Route>

                  {/* Payment routes */}
                  <Route path='/payments'>
                    <Route index element={<PaymentList />} />
                    {/* <Route path='show/:id' element={<PaymentShow />} /> */}
                  </Route>

                  {/* Subscription routes */}
                  <Route path='/subscriptions'>
                    <Route index element={<SubscriptionList />} />
                    {/* <Route path='show/:id' element={<SubscriptionShow />} /> */}
                    {/* <Route path='edit/:id' element={<SubscriptionEdit />} /> */}
                    {/* <Route path='create' element={<SubscriptionCreate />} /> */}
                  </Route>
                  <Route path='/locations'>
                    <Route index element={<Locations />} />
                  </Route>

                  {/* Notification routes */}
                  <Route path='/notifications'>
                    <Route index element={<NotificationList />} />
                    <Route path='create' element={<NotificationCreate />} />
                  </Route>
                  <Route path='/notifications'>
                    <Route index element={<NotificationList />} />
                    <Route path='create' element={<NotificationCreate />} />
                  </Route>

                  {/* Audit logs route */}
                  <Route path='/audit-logs' element={<AuditLogs />} />

                  <Route path='/support'>
                    <Route index element={<SupportTicketList />} />
                  </Route>

                  {/* Settings route */}
                  <Route path='/settings' element={<SystemSettings />} />

                  {/* Referral routes */}
                  <Route path='/referrals'>
                    <Route path='campaigns' element={<CampaignList />} />
                    <Route path='transactions' element={<TransactionList />} />
                    <Route path='rewards' element={<RewardList />} />
                    <Route
                      path='analytics'
                      element={<ReferralAnalyticsDashboard />}
                    />
                  </Route>

                  {/* Catch all */}
                  <Route path='*' element={<ErrorComponent />} />
                </Route>

                {/* Root redirect */}
                <Route
                  path='/'
                  element={<NavigateToResource resource='dashboard' />}
                />
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </Provider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
