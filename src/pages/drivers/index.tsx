import React, { useState } from 'react';
import {
  List,
  useTable,
  FilterDropdown,
  getDefaultSortOrder,
} from '@refinedev/antd';
import { useGo } from '@refinedev/core';
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
  Switch,
  Badge,
  Drawer,
  Descriptions,
  Statistic,
  Modal,
  Form,
  message,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  EyeOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  StarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
  };
  isOnline: boolean;
  isAvailable: boolean;
  paymentModel: 'SUBSCRIPTION' | 'COMMISSION';
  stats: {
    totalTrips: number;
    averageRating: number;
    totalEarnings: number;
  };
  profilePhotoSet: boolean;
  profilePhoto?: string;
  personalInfoSet: boolean;
  driverLicenseVerified: boolean;
  vehicleInspectionDone: boolean;
  createdAt: string;
  updatedAt: string;
  currentLocation?: {
    coordinates: [number, number];
  };
  walletBalance?: number;
}

export const DriverList: React.FC = () => {
  const go = useGo();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { tableProps, sorters, searchFormProps } = useTable<Driver>({
    resource: 'drivers',
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

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerVisible(true);
  };

  const columns: ColumnsType<Driver> = [
    {
      title: 'Driver',
      key: 'driver',
      render: (_: any, record: Driver) => (
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
              {record.profilePhotoSet && (
                <CheckCircleOutlined
                  style={{ color: '#52c41a', marginLeft: 8 }}
                />
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.email}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.phone.fullPhone}
            </div>
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('firstname', sorters),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Driver) => (
        <Space direction='vertical' size='small'>
          <Badge
            status={record.isOnline ? 'success' : 'default'}
            text={record.isOnline ? 'Online' : 'Offline'}
          />
          <Badge
            status={record.isAvailable ? 'processing' : 'default'}
            text={record.isAvailable ? 'Available' : 'Busy'}
          />
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select status'
            allowClear
          >
            <Option value='online'>Online</Option>
            <Option value='offline'>Offline</Option>
            <Option value='available'>Available</Option>
            <Option value='busy'>Busy</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Payment Model',
      dataIndex: 'paymentModel',
      key: 'paymentModel',
      render: (model: string) => (
        <Tag color={model === 'SUBSCRIPTION' ? 'blue' : 'orange'}>{model}</Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select payment model'
            allowClear
          >
            <Option value='SUBSCRIPTION'>Subscription</Option>
            <Option value='COMMISSION'>Commission</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Verification',
      key: 'verification',
      render: (_: any, record: Driver) => (
        <Space direction='vertical' size='small'>
          <div>
            <Text style={{ fontSize: '12px' }}>Personal Info: </Text>
            {record.personalInfoSet ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
          </div>
          <div>
            <Text style={{ fontSize: '12px' }}>License: </Text>
            {record.driverLicenseVerified ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
          </div>
          <div>
            <Text style={{ fontSize: '12px' }}>Vehicle: </Text>
            {record.vehicleInspectionDone ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_: any, record: Driver) => (
        <Space direction='vertical' size='small'>
          <div>
            <StarOutlined style={{ color: '#faad14' }} />
            <Text style={{ marginLeft: 4 }}>
              {record.stats.averageRating.toFixed(1)}
            </Text>
          </div>
          <div>
            <CarOutlined style={{ color: '#1890ff' }} />
            <Text style={{ marginLeft: 4 }}>
              {record.stats.totalTrips} trips
            </Text>
          </div>
          <div>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <Text style={{ marginLeft: 4 }}>
              ₦{record.stats.totalEarnings.toLocaleString()}
            </Text>
          </div>
        </Space>
      ),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text>{new Date(date).toLocaleDateString()}</Text>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('createdAt', sorters),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Driver) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewDriver(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                tableProps?.onChange?.(
                  tableProps.pagination || {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                  },
                  {},
                  {},
                  {
                    currentDataSource: [...(tableProps.dataSource || [])],
                    action: 'paginate',
                  }
                );
              }}
            >
              Refresh
            </Button>
          </Space>
        )}
        title={
          <div>
            <Title level={3}>Driver Management</Title>
            <Text type='secondary'>
              Manage drivers, track performance, and handle verifications
            </Text>
          </div>
        }
      >
        {/* Summary Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Total Drivers'
                value={tableProps.dataSource?.length || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Online Drivers'
                value={
                  tableProps.dataSource?.filter((d: Driver) => d.isOnline)
                    .length || 0
                }
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Available Drivers'
                value={
                  tableProps.dataSource?.filter((d: Driver) => d.isAvailable)
                    .length || 0
                }
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Verified Drivers'
                value={
                  tableProps.dataSource?.filter(
                    (d: Driver) => d.driverLicenseVerified
                  ).length || 0
                }
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form {...searchFormProps} layout='inline'>
            <Form.Item name='search'>
              <Input
                placeholder='Search drivers by name, email, or phone'
                prefix={<EnvironmentOutlined />}
                style={{ width: 300 }}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                icon={<EnvironmentOutlined />}
                onClick={() => {
                  // Reset filters
                }}
              >
                Clear Filters
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Drivers Table */}
        <Table<Driver>
          {...tableProps}
          columns={columns}
          rowKey='id'
          scroll={{ x: 1200 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} drivers`,
          }}
        />
      </List>

      {/* Driver Details Drawer */}
      <Drawer
        title='Driver Details'
        placement='right'
        size='large'
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedDriver && (
          <Space direction='vertical' style={{ width: '100%' }} size='large'>
            {/* Driver Profile */}
            <Card title='Profile Information'>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                  size={80}
                  src={selectedDriver.profilePhoto}
                  icon={<UserOutlined />}
                />
                <Title level={4} style={{ margin: '8px 0' }}>
                  {selectedDriver.firstname} {selectedDriver.lastname}
                </Title>
                <Space>
                  <Badge
                    status={selectedDriver.isOnline ? 'success' : 'default'}
                    text={selectedDriver.isOnline ? 'Online' : 'Offline'}
                  />
                  <Badge
                    status={
                      selectedDriver.isAvailable ? 'processing' : 'default'
                    }
                    text={selectedDriver.isAvailable ? 'Available' : 'Busy'}
                  />
                </Space>
              </div>

              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined />
                      Email
                    </Space>
                  }
                >
                  {selectedDriver.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined />
                      Phone
                    </Space>
                  }
                >
                  {selectedDriver.phone.fullPhone}
                </Descriptions.Item>
                <Descriptions.Item label='Payment Model'>
                  <Tag
                    color={
                      selectedDriver.paymentModel === 'SUBSCRIPTION'
                        ? 'blue'
                        : 'orange'
                    }
                  >
                    {selectedDriver.paymentModel}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Joined'>
                  {new Date(selectedDriver.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Performance Metrics */}
            <Card title='Performance Metrics'>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title='Total Trips'
                    value={selectedDriver.stats.totalTrips}
                    prefix={<CarOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Average Rating'
                    value={selectedDriver.stats.averageRating}
                    precision={1}
                    prefix={<StarOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title='Total Earnings'
                    value={selectedDriver.stats.totalEarnings}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                  />
                </Col>
              </Row>
              {selectedDriver.walletBalance !== undefined && (
                <div style={{ marginTop: 16 }}>
                  <Statistic
                    title='Wallet Balance'
                    value={selectedDriver.walletBalance}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                  />
                </div>
              )}
            </Card>

            {/* Verification Status */}
            <Card title='Verification Status'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text>Profile Photo:</Text>
                  {selectedDriver.profilePhotoSet ? (
                    <Tag color='green'>Complete</Tag>
                  ) : (
                    <Tag color='red'>Incomplete</Tag>
                  )}
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text>Personal Information:</Text>
                  {selectedDriver.personalInfoSet ? (
                    <Tag color='green'>Complete</Tag>
                  ) : (
                    <Tag color='red'>Incomplete</Tag>
                  )}
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text>Driver License:</Text>
                  {selectedDriver.driverLicenseVerified ? (
                    <Tag color='green'>Verified</Tag>
                  ) : (
                    <Tag color='orange'>Pending</Tag>
                  )}
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text>Vehicle Inspection:</Text>
                  {selectedDriver.vehicleInspectionDone ? (
                    <Tag color='green'>Done</Tag>
                  ) : (
                    <Tag color='red'>Pending</Tag>
                  )}
                </div>
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </>
  );
};
