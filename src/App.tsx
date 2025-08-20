import React from 'react';
import { Refine, Authenticated, AuthBindings } from '@refinedev/core';
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
} from '@ant-design/icons';

// Import pages
import { DashboardPage } from './pages/dashboard';
import { TripList, 
  // TripShow, TripEdit
 } from './pages/trips';
import {
  DriverList,
  // DriverShow,
  // DriverEdit,
  // DriverCreate,
} from './pages/drivers';
import { CustomerList, 
  
  // CustomerShow, CustomerEdit

} from './pages/customers';
import {
  SubscriptionList,
  // SubscriptionShow,
  // SubscriptionEdit,
  // SubscriptionCreate,
} from './pages/subscriptions';
import { PaymentList,
  //  PaymentShow
   } from './pages/payments';
import { VehicleList, 
  // VehicleShow, VehicleEdit
 } from './pages/vehicles';
import { NotificationList, NotificationCreate } from './pages/notifications';
import { SystemSettings } from './pages/settings';
import { AdminList, 
  // AdminShow, AdminEdit,
   AdminCreate } from './pages/admins';
import { AuditLogs } from './pages/audit';

// Import auth components
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminForgotPassword } from './pages/auth/AdminForgotPassword';
import { AdminResetPassword } from './pages/auth/AdminResetPassword';

// GraphQL client configuration
export const API_URL = 'http://localhost:8000/graphql';

export const client = new Client({
  url: API_URL,
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
const authProvider: AuthBindings = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            entity {
              id
              firstname
              lastname
              email
              accountType
              role
              permissions
              department
              isActive
              isEmailVerified
              isMFAEnabled
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
            accountType: 'ADMIN',
          },
        })
        .toPromise();

      if (result.error || !result.data?.login) {
        return {
          success: false,
          error: {
            name: 'Login Error',
            message:
              result.error?.graphQLErrors?.[0]?.message ||
              'Invalid credentials',
          },
        };
      }

      const { token, entity, expiresAt } = result.data.login;

      // Verify this is an admin account
      if (entity.accountType !== 'ADMIN') {
        return {
          success: false,
          error: {
            name: 'Access Denied',
            message: 'Only admin accounts can access this panel',
          },
        };
      }

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(entity));
      localStorage.setItem('expiresAt', expiresAt);

      return {
        success: true,
        redirectTo: '/dashboard',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: error.message || 'An error occurred during login',
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
        await client.mutation(mutation).toPromise();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear local storage
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
      };
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    const adminData = JSON.parse(admin);
    return adminData.permissions || [];
  },

  getIdentity: async () => {
    const admin = localStorage.getItem('admin');
    if (!admin) return null;

    const adminData = JSON.parse(admin);
    return {
      id: adminData.id,
      name: `${adminData.firstname} ${adminData.lastname}`,
      email: adminData.email,
      role: adminData.role,
      department: adminData.department,
      avatar: adminData.profilePhoto,
    };
  },

  onError: async (error) => {
    if (error.statusCode === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');

      return {
        logout: true,
        redirectTo: '/auth/login',
        error: {
          message: 'Session expired. Please login again.',
          name: 'Authentication Error',
        },
      };
    }

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
                  // show: '/admins/show/:id',
                  // edit: '/admins/edit/:id',
                  create: '/admins/create',
                  meta: {
                    label: 'Admin Users',
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: 'drivers',
                  list: '/drivers',
                  // show: '/drivers/show/:id',
                  // edit: '/drivers/edit/:id',
                  create: '/drivers/create',
                  meta: {
                    label: 'Drivers',
                    icon: <CarOutlined />,
                  },
                },
                {
                  name: 'customers',
                  list: '/customers',
                  // show: '/customers/show/:id',
                  // edit: '/customers/edit/:id',
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
                  name: 'notifications',
                  list: '/notifications',
                  create: '/notifications/create',
                  meta: {
                    label: 'Notifications',
                    icon: <BellOutlined />,
                  },
                },
                {
                  name: 'audit-logs',
                  list: '/audit-logs',
                  meta: {
                    label: 'Audit Logs',
                    icon: <AuditOutlined />,
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
                    {/* <Route path='edit/:id' element={<AdminEdit />} /> */}
                    <Route path='create' element={<AdminCreate />} />
                  </Route>

                  {/* Driver routes */}
                  <Route path='/drivers'>
                    <Route index element={<DriverList />} />
                    {/* <Route path='show/:id' element={<DriverShow />} /> */}
                    {/* <Route path='edit/:id' element={<DriverEdit />} /> */}
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

                  {/* Notification routes */}
                  <Route path='/notifications'>
                    <Route index element={<NotificationList />} />
                    <Route path='create' element={<NotificationCreate />} />
                  </Route>

                  {/* Audit logs route */}
                  <Route path='/audit-logs' element={<AuditLogs />} />

                  {/* Settings route */}
                  <Route path='/settings' element={<SystemSettings />} />

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
