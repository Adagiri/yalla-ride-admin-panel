
import React, { useEffect, useState } from 'react';
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
  DeleteButton,
  useTable,
  useForm
} from '@refinedev/antd';
import {
  useGo,
  useShow,
  BaseRecord,
  useCustomMutation,
  useNotification,
  useNavigation,
} from '@refinedev/core';
import { useParams } from 'react-router-dom';
import {
  Table,
  Space,
  Tag,
  Avatar,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Input,
  Form,
  Badge,
  Modal,
  Descriptions,
  Statistic,
  message,
  Tooltip,
  Tabs,
  Alert,
  Spin,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  SafetyOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  AuditOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Admin User Interface extending BaseRecord
interface AdminUser extends BaseRecord {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT' | 'ANALYST';
  permissions: string[];
  department: string;
  employeeId?: string;
   phone?: {
      countryCode: String;
      localNumber: String;
      fullPhone: String;
    };
  isEmailVerified: boolean;
  isMFAEnabled: boolean;
  isActive: boolean;
  accessLevel: number;
  profilePhoto?: string;
  timezone: string;
  language: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  totalLogins: number;
  totalActions: number;
  createdAt: string;
  updatedAt: string;
}

// Admin List Component
export const AdminList: React.FC = () => {
  const go = useGo();
  const { edit } = useNavigation();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedAdminForAction, setSelectedAdminForAction] =
    useState<AdminUser | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { mutate: mutateAdminStatus } = useCustomMutation();
  const { open } = useNotification();

  // Use tableQueryResult for manual refresh
  const { tableProps, sorters, searchFormProps, tableQueryResult } =
    useTable<AdminUser>({
      resource: 'admins',
      initialSorter: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
      onSearch: (params: any) => {
        return [
          {
            field: 'search',
            operator: 'contains',
            value: params.search,
          },
        ];
      },
      syncWithLocation: true,
    });

  const handleViewDetails = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDetailsModalVisible(true);
  };

  const handleStatusChange = (admin: AdminUser) => {
    setSelectedAdminForAction(admin);
    setStatusModalVisible(true);
  };

  const handleRefresh = () => {
    // Trigger a refresh by updating the key and refetching
    setRefreshKey((prev) => prev + 1);
    tableQueryResult.refetch();
    message.success('Data refreshed');
  };

  const updateAdminStatus = async () => {
    if (!selectedAdminForAction) {
      message.error('No admin selected');
      return;
    }

    setUpdatingStatus(true);

    try {
      const isCurrentlyActive = selectedAdminForAction.isActive;
      const url = isCurrentlyActive ? 'deactivate-admin' : 'activate-admin';
      const actionType = isCurrentlyActive ? 'deactivate' : 'activate';

      mutateAdminStatus(
        {
          url: url,
          method: 'post',
          values: {
            adminId: selectedAdminForAction.id,
          },
        },
        {
          onSuccess: (data) => {
            open?.({
              type: 'success',
              message: `Admin ${selectedAdminForAction.firstname} ${selectedAdminForAction.lastname} has been ${actionType}d successfully`,
            });
            setStatusModalVisible(false);
            setSelectedAdminForAction(null);
            handleRefresh();
          },
          onError: (error: any) => {
            open?.({
              type: 'error',
              message: `Failed to delete an admin`,
            });
          },
        }
      );
    } catch (error) {
      message.error('Failed to update admin status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'red';
      case 'ADMIN':
        return 'blue';
      case 'MANAGER':
        return 'green';
      case 'SUPPORT':
        return 'orange';
      case 'ANALYST':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <CrownOutlined />;
      case 'ADMIN':
        return <UserOutlined />;
      case 'MANAGER':
        return <TeamOutlined />;
      case 'SUPPORT':
        return <SafetyOutlined />;
      case 'ANALYST':
        return <AuditOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getStatusButtonIcon = (isActive: boolean) => {
    return isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />;
  };

  const getStatusButtonTooltip = (isActive: boolean) => {
    return isActive ? 'Deactivate Admin' : 'Activate Admin';
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Admin',
      key: 'admin',
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.profilePhoto}
            icon={<UserOutlined />}
            size='large'
          />
          <div>
            <div>
              <Text strong>
                {record.firstname} {record.lastname}
              </Text>
              {record.isEmailVerified && (
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginLeft: 8 }}
                />
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.email}
            </div>
            {record.employeeId && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                ID: {record.employeeId}
              </div>
            )}
          </div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Role & Department',
      key: 'role',
      render: (_, record) => (
        <Space direction='vertical' size='small'>
          <Tag
            color={getRoleColor(record.role)}
            icon={getRoleIcon(record.role)}
          >
            {record.role.replace('_', ' ')}
          </Tag>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            {record.department}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status & Security',
      key: 'status',
      render: (_, record) => (
        <Space direction='vertical' size='small'>
          <Badge
            status={record.isActive ? 'success' : 'error'}
            text={record.isActive ? 'Active' : 'Inactive'}
          />
          <div>
            <Text style={{ fontSize: '12px' }}>MFA: </Text>
            {record.isMFAEnabled ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
          </div>
          <div>
            <Text style={{ fontSize: '12px' }}>
              Access Level: {record.accessLevel}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (_, record) => (
        <Space direction='vertical' size='small'>
          <div style={{ fontSize: '12px' }}>
            <Text>Logins: {record.totalLogins}</Text>
          </div>
          <div style={{ fontSize: '12px' }}>
            <Text>Actions: {record.totalActions}</Text>
          </div>
          {record.lastLoginAt && (
            <div style={{ fontSize: '12px' }}>
              <Text type='secondary'>
                Last login: {new Date(record.lastLoginAt).toLocaleDateString()}
              </Text>
            </div>
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: '12px' }}>
            {record.permissions.length} permissions
          </Text>
          <div style={{ marginTop: 4 }}>
            {record.permissions.slice(0, 2).map((permission, index) => (
              <Tag key={index} style={{ fontSize: '10px' }}>
                {permission.split(':')[0]}
              </Tag>
            ))}
            {record.permissions.length > 2 && (
              <Text type='secondary' style={{ fontSize: '10px' }}>
                +{record.permissions.length - 2} more
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title='Edit Admin'>
            <Button
              icon={<EditOutlined />}
              size='small'
              // onClick={() => edit('admins', record.id)}
              onClick={() => go({ to: `/admins/edit/${record.id}` })}
            />
          </Tooltip>
          <Tooltip title={getStatusButtonTooltip(record.isActive)}>
            <Button
              icon={getStatusButtonIcon(record.isActive)}
              size='small'
              type={record.isActive ? 'default' : 'primary'}
              danger={record.isActive}
              onClick={() => handleStatusChange(record)}
            />
          </Tooltip>
          <Tooltip title='Delete Admin'>
            <DeleteButton
              hideText
              size='small'
              recordItemId={record.id}
              confirmTitle='Delete Admin'
              confirmOkText='Delete'
              onSuccess={() => {
                message.success('Admin deleted successfully');
                handleRefresh();
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getAdminStats = () => {
    const data = tableProps.dataSource || [];
    return {
      total: data.length,
      active: data.filter((a) => a.isActive).length,
      withMFA: data.filter((a) => a.isMFAEnabled).length,
      superAdmins: data.filter((a) => a.role === 'SUPER_ADMIN').length,
    };
  };

  const stats = getAdminStats();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Admin User Management</Title>
            <Text type='secondary'>
              Manage admin users, roles, permissions, and security settings
            </Text>
          </div>
        }
        headerButtons={() => (
          <Space>
            <CreateButton
              icon={<PlusOutlined />}
              onClick={() => go({ to: '/admins/create' })}
            >
              Create Admin
            </CreateButton>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={tableQueryResult.isFetching}
            >
              Refresh
            </Button>
          </Space>
        )}
      >
        {/* Summary Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Total Admins'
                value={stats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Active'
                value={stats.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='With MFA'
                value={stats.withMFA}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Super Admins'
                value={stats.superAdmins}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Admins Table */}
        <Table<AdminUser>
          {...tableProps}
          key={refreshKey}
          columns={columns}
          rowKey='id'
          scroll={{ x: 1400 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} admins`,
          }}
        />
      </List>

      {/* Admin Details Modal */}
      <Modal
        title={`Admin Details - ${selectedAdmin?.firstname} ${selectedAdmin?.lastname}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedAdmin && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size='small' title='Admin Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Name'>
                      {selectedAdmin.firstname} {selectedAdmin.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {selectedAdmin.email}
                    </Descriptions.Item>
                    <Descriptions.Item label='Role'>
                      <Tag
                        color={getRoleColor(selectedAdmin.role)}
                        icon={getRoleIcon(selectedAdmin.role)}
                      >
                        {selectedAdmin.role.replace('_', ' ')}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Department'>
                      {selectedAdmin.department}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                      {selectedAdmin?.phone?.fullPhone}
                    </Descriptions.Item>
                    <Descriptions.Item label='Employee ID'>
                      {selectedAdmin.employeeId || 'N/A'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size='small' title='Status & Security'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Status'>
                      <Badge
                        status={selectedAdmin.isActive ? 'success' : 'error'}
                        text={selectedAdmin.isActive ? 'Active' : 'Inactive'}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label='MFA Enabled'>
                      <Badge
                        status={
                          selectedAdmin.isMFAEnabled ? 'success' : 'error'
                        }
                        text={selectedAdmin.isMFAEnabled ? 'Yes' : 'No'}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label='Email Verified'>
                      <Badge
                        status={
                          selectedAdmin.isEmailVerified ? 'success' : 'error'
                        }
                        text={selectedAdmin.isEmailVerified ? 'Yes' : 'No'}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label='Access Level'>
                      {selectedAdmin.accessLevel}
                    </Descriptions.Item>
                    <Descriptions.Item label='Total Logins'>
                      {selectedAdmin.totalLogins}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card size='small' title='Permissions'>
                  <Row gutter={[8, 8]}>
                    {selectedAdmin.permissions.map((permission, index) => (
                      <Col key={index}>
                        <Tag color='blue'>{permission}</Tag>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        title={`${
          selectedAdminForAction?.isActive ? 'Deactivate' : 'Activate'
        } Admin - ${selectedAdminForAction?.firstname} ${
          selectedAdminForAction?.lastname
        }`}
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false);
          setSelectedAdminForAction(null);
        }}
        footer={[
          <Button
            key='cancel'
            onClick={() => {
              setStatusModalVisible(false);
              setSelectedAdminForAction(null);
            }}
            disabled={updatingStatus}
          >
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            danger={selectedAdminForAction?.isActive}
            onClick={updateAdminStatus}
            loading={updatingStatus}
            icon={
              selectedAdminForAction?.isActive ? (
                <CloseCircleOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
          >
            {updatingStatus
              ? 'Processing...'
              : `Confirm ${
                  selectedAdminForAction?.isActive
                    ? 'Deactivation'
                    : 'Activation'
                }`}
          </Button>,
        ]}
      >
        {selectedAdminForAction && (
          <div>
            <Alert
              message={`Admin ${
                selectedAdminForAction.isActive ? 'Deactivation' : 'Activation'
              }`}
              description={
                <div>
                  <p>
                    You are about to{' '}
                    <strong>
                      {selectedAdminForAction.isActive
                        ? 'deactivate'
                        : 'activate'}
                    </strong>{' '}
                    the following admin user:
                  </p>
                  <Descriptions
                    size='small'
                    column={1}
                    style={{ marginTop: 16 }}
                  >
                    <Descriptions.Item label='Name'>
                      <Text strong>
                        {selectedAdminForAction.firstname}{' '}
                        {selectedAdminForAction.lastname}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {selectedAdminForAction.email}
                    </Descriptions.Item>
                    <Descriptions.Item label='Role'>
                      <Tag color={getRoleColor(selectedAdminForAction.role)}>
                        {selectedAdminForAction.role.replace('_', ' ')}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Current Status'>
                      <Badge
                        status={
                          selectedAdminForAction.isActive ? 'success' : 'error'
                        }
                        text={
                          selectedAdminForAction.isActive
                            ? 'Active'
                            : 'Inactive'
                        }
                      />
                    </Descriptions.Item>
                  </Descriptions>
                  <div
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: selectedAdminForAction.isActive
                        ? '#fff2f0'
                        : '#f6ffed',
                      border: selectedAdminForAction.isActive
                        ? '1px solid #ffccc7'
                        : '1px solid #b7eb8f',
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      type={
                        selectedAdminForAction.isActive ? 'danger' : 'success'
                      }
                    >
                      <WarningOutlined style={{ marginRight: 8 }} />
                      {selectedAdminForAction.isActive
                        ? 'This action will prevent this admin from accessing the system immediately.'
                        : "This action will restore this admin's access to the system immediately."}
                    </Text>
                  </div>
                </div>
              }
              type={selectedAdminForAction.isActive ? 'warning' : 'info'}
              showIcon
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export const AdminCreate: React.FC = () => {
  const go = useGo();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form] = Form.useForm();

  // const { onFinish, mutationResult } = useForm({
  //   resource: 'admins',
  //   redirect: false,
  // });

  // const { isLoading: isCreating } = mutationResult;
const { onFinish, mutation } = useForm({
  resource: 'admins',
  redirect: false,
});

const { isLoading: isCreating } = mutation;

  const availablePermissions = [
    'dashboard:view',
    'analytics:view',
    'drivers:view',
    'drivers:create',
    'drivers:update',
    'drivers:delete',
    'customers:view',
    'customers:update',
    'trips:view',
    'trips:assign',
    'payments:view',
    'payments:process',
    'subscriptions:view',
    'subscriptions:create',
    'notifications:send',
    'system:config',
    'users:admin',
    'audit:logs',
  ];

  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: availablePermissions,
    ADMIN: [
      'dashboard:view',
      'analytics:view',
      'drivers:view',
      'drivers:update',
      'customers:view',
      'trips:view',
      'payments:view',
      'notifications:send',
    ],
    MANAGER: ['dashboard:view', 'drivers:view', 'customers:view', 'trips:view'],
    SUPPORT: ['customers:view', 'trips:view', 'notifications:send'],
    ANALYST: ['dashboard:view', 'analytics:view'],
  };

  // Phone number formatting function
  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      return {
        countryCode: '+234',
        localNumber: cleaned,
        fullPhone: `+234${cleaned.substring(1)}`
      };
    }
    
    if (cleaned.startsWith('234')) {
      return {
        countryCode: '+234',
        localNumber: `0${cleaned.substring(3)}`,
        fullPhone: `+${cleaned}`
      };
    }
    
    return {
      countryCode: '+234',
      localNumber: cleaned,
      fullPhone: `+234${cleaned}`
    };
  };

  const handleRoleChange = (role: string) => {
    const permissions = rolePermissions[role] || [];
    setSelectedPermissions(permissions);
    form.setFieldsValue({ permissions });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleFinish = async (values: any) => {
    try {
      // Format the phone number before submitting
      const formattedValues = {
        ...values,
        phone: phoneNumber ? formatPhoneNumber(phoneNumber) : undefined
      };

      
      await onFinish(formattedValues);
      message.success('Admin created successfully');
      go({ to: '/admins' });
    } catch (error) {
      console.error('Create error:', error);
      message.error('Failed to create admin');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Create New Admin</Title>
      <Text type='secondary'>
        Add a new administrator to the system with appropriate roles and permissions
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          onValuesChange={(changedValues) => {
            if (changedValues.role) {
              handleRoleChange(changedValues.role);
            }
          }}
          disabled={isCreating}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='firstname'
                label='First Name'
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder='Enter first name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lastname'
                label='Last Name'
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder='Enter last name' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='email'
                label='Email Address'
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder='Enter email address'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Phone Number'>
                <Input
                  prefix={<PhoneOutlined />}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="09072574580"
                  addonBefore={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <GlobalOutlined />
                      <span>+234</span>
                    </div>
                  }
                />
                <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                  Enter phone number without country code (e.g., 09072574580)
                </Text>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='role'
                label='Role'
                rules={[{ required: true, message: 'Role is required' }]}
              >
                <Select placeholder='Select role'>
                  <Option value='SUPER_ADMIN'>Super Admin</Option>
                  <Option value='ADMIN'>Admin</Option>
                  <Option value='MANAGER'>Manager</Option>
                  <Option value='SUPPORT'>Support</Option>
                  <Option value='ANALYST'>Analyst</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='department'
                label='Department'
                rules={[{ required: true, message: 'Department is required' }]}
              >
                <Select placeholder='Select department'>
                  <Option value='Operations'>Operations</Option>
                  <Option value='Customer Support'>Customer Support</Option>
                  <Option value='Finance'>Finance</Option>
                  <Option value='Technology'>Technology</Option>
                  <Option value='Marketing'>Marketing</Option>
                  <Option value='Management'>Management</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
                message: 'Password is required',
              },
              {
                min: 8,
                message: 'Password must not be less than 8 characters',
              },
            ]}
          >
            <Input.Password placeholder='Please enter your admin password' />
          </Form.Item>

          <Form.Item name='employeeId' label='Employee ID'>
            <Input placeholder='Enter employee ID (optional)' />
          </Form.Item>

          <Form.Item name='permissions' label='Permissions'>
            <div>
              <Text
                type='secondary'
                style={{ display: 'block', marginBottom: 8 }}
              >
                Selected {selectedPermissions.length} permissions
              </Text>
              <Select
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select permissions'
                value={selectedPermissions}
                onChange={(value) => {
                  setSelectedPermissions(value);
                  form.setFieldsValue({ permissions: value });
                }}
              >
                {availablePermissions.map((permission) => (
                  <Select.Option key={permission} value={permission}>
                    {permission}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type='primary'
                htmlType='submit'
                loading={isCreating}
                icon={<PlusOutlined />}
              >
                Create Admin
              </Button>
              <Button onClick={() => go({ to: '/admins' })}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};


// Used in modal instead of the this component to show an admin
// Admin Show Component
export const AdminShow: React.FC = () => {
  const { query }:any = useShow({
    resource: 'admins',
  });

  const { data, isLoading } = query;
  const record = data?.data;


  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading admin details...</Text>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: 'Profile',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label='Name'>
              {record?.firstname} {record?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label='Email'>{record?.email}</Descriptions.Item>
            <Descriptions.Item label='Role'>
              <Tag color='blue'>{record?.role?.replace('_', ' ')}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Department'>
              {record?.department}
            </Descriptions.Item>
            <Descriptions.Item label='Phone'>
              {record?.phone?.fullPhone}
            </Descriptions.Item>
            <Descriptions.Item label='Employee ID'>
              {record?.employeeId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Phone'>
              {record?.phone || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Badge
                status={record?.isActive ? 'success' : 'error'}
                text={record?.isActive ? 'Active' : 'Inactive'}
              />
            </Descriptions.Item>
            <Descriptions.Item label='MFA Enabled'>
              <Badge
                status={record?.isMFAEnabled ? 'success' : 'error'}
                text={record?.isMFAEnabled ? 'Yes' : 'No'}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Permissions',
      children: (
        <Card>
          <Row gutter={[8, 8]}>
            {record?.permissions?.map((permission: string, index: number) => (
              <Col key={index}>
                <Tag color='blue'>{permission}</Tag>
              </Col>
            ))}
          </Row>
        </Card>
      ),
    },
    {
      key: '3',
      label: 'Activity',
      children: (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title='Total Logins' value={record?.totalLogins || 0} />
          </Col>
          <Col span={8}>
            <Statistic
              title='Total Actions'
              value={record?.totalActions || 0}
            />
          </Col>
          <Col span={8}>
            <Statistic title='Access Level' value={record?.accessLevel || 0} />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Admin Details</Title>
      <Tabs defaultActiveKey='1' items={tabItems} />
    </div>
  );
};

// Fixed AdminEdit Component

export const AdminEdit: React.FC = () => {
  const go = useGo();
  const { id } = useParams();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [phoneNumber, setPhoneNumber] = useState('');



const { query, onFinish, mutation }:any = useForm({
  resource: 'admins',
  id,
  action: 'edit',
  redirect: false,
});
 const { isLoading: isUpdating } = mutation;
 
const { data, error:isError, isLoading   } = query;
// const record = result;
const adminData = data?.data;

  const availablePermissions = [
    'dashboard:view', 'analytics:view', 'drivers:view', 'drivers:create', 'drivers:update', 'drivers:delete',
    'customers:view', 'customers:update', 'trips:view', 'trips:assign', 'payments:view', 'payments:process',
    'subscriptions:view', 'subscriptions:create', 'notifications:send', 'system:config', 'users:admin', 'audit:logs',
  ];

  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: availablePermissions,
    ADMIN: ['dashboard:view', 'analytics:view', 'drivers:view', 'drivers:update', 'customers:view', 'trips:view', 'payments:view', 'notifications:send'],
    MANAGER: ['dashboard:view', 'drivers:view', 'customers:view', 'trips:view'],
    SUPPORT: ['customers:view', 'trips:view', 'notifications:send'],
    ANALYST: ['dashboard:view', 'analytics:view'],
  };

  // Function to format phone number
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    
    // If it starts with 0, assume it's a Nigerian number
    if (cleaned.startsWith('0')) {
      return {
        countryCode: '+234',
        localNumber: cleaned,
        fullPhone: `+234${cleaned.substring(1)}`
      };
    }
    
    // If it starts with 234, it's already in the right format
    if (cleaned.startsWith('234')) {
      return {
        countryCode: '+234',
        localNumber: `0${cleaned.substring(3)}`,
        fullPhone: `+${cleaned}`
      };
    }
    
    // Default fallback
    return {
      countryCode: '+234',
      localNumber: cleaned,
      fullPhone: `+234${cleaned}`
    };
  };

  useEffect(() => {
    if (adminData && form) {
      // Set the phone number for display
      if (adminData.phone) {
        setPhoneNumber(adminData.phone.localNumber || adminData.phone.fullPhone?.replace('+234', '0') || '');
      }
      
      form.setFieldsValue({
        firstname: adminData.firstname,
        lastname: adminData.lastname,
        email: adminData.email,
        role: adminData.role,
        department: adminData.department,
        employeeId: adminData.employeeId || '',
        permissions: adminData.permissions || [],
      });
      setSelectedPermissions(adminData.permissions || []);
    }
  }, [adminData, form]);

  const handleRoleChange = (role: string) => {
    const permissions = rolePermissions[role] || [];
    setSelectedPermissions(permissions);
    form.setFieldsValue({ permissions });
  };

  const handlePermissionsChange = (permissions: string[]) => {
    setSelectedPermissions(permissions);
    form.setFieldsValue({ permissions });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const handleFinish = async (values: any) => {
    try {
      // Format the phone number before submitting
      const formattedValues = {
        ...values,
        phone: phoneNumber ? formatPhoneNumber(phoneNumber) : undefined
      };

      
      await onFinish(formattedValues);
      message.success('Admin updated successfully');
      go({ to: '/admins' });
    } catch (error) {
      console.error('Update error:', error);
      message.error('Failed to update admin');
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size='large' />
        <Text>Loading admin data...</Text>
      </div>
    );
  }

  if (isError || !adminData) {
    return (
      <div style={{ padding: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => go({ to: '/admins' })}>
          Back to Admin List
        </Button>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={4}>Admin Not Found</Title>
            <Button type='primary' onClick={() => go({ to: '/admins' })}>
              Return to Admin List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => go({ to: '/admins' })}>
          Back to Admin List
        </Button>
        <Title level={3}>Edit Admin User - {adminData.firstname} {adminData.lastname}</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          onValuesChange={(changedValues) => {
            if (changedValues.role) handleRoleChange(changedValues.role);
          }}
          disabled={isUpdating}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='firstname' label='First Name' rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='lastname' label='Last Name' rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Phone Number'>
                <Input 
                  prefix={<PhoneOutlined />}
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="09072574580"
                  addonBefore={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <GlobalOutlined />
                      <span>+234</span>
                    </div>
                  }
                />
                <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                  Enter phone number without country code (e.g., 09072574580)
                </Text>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='role' label='Role' rules={[{ required: true }]}>
                <Select>
                  <Option value='SUPER_ADMIN'>Super Admin</Option>
                  <Option value='ADMIN'>Admin</Option>
                  <Option value='MANAGER'>Manager</Option>
                  <Option value='SUPPORT'>Support</Option>
                  <Option value='ANALYST'>Analyst</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='department' label='Department' rules={[{ required: true }]}>
                <Select>
                  <Option value='Operations'>Operations</Option>
                  <Option value='Customer Support'>Customer Support</Option>
                  <Option value='Finance'>Finance</Option>
                  <Option value='Technology'>Technology</Option>
                  <Option value='Marketing'>Marketing</Option>
                  <Option value='Management'>Management</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='employeeId' label='Employee ID'>
            <Input />
          </Form.Item>

          <Form.Item name='permissions' label='Permissions'>
            <Select
              mode='multiple'
              value={selectedPermissions}
              onChange={handlePermissionsChange}
            >
              {availablePermissions.map((permission) => (
                <Option key={permission} value={permission}>{permission}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={isUpdating} icon={<EditOutlined />}>
                Update Admin
              </Button>
              <Button onClick={() => go({ to: '/admins' })}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};