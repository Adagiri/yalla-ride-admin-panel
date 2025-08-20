import React, { useState } from 'react';
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
  DeleteButton,
  useTable,
  FilterDropdown,
  getDefaultSortOrder,
} from '@refinedev/antd';
import { BaseRecord, useGo } from '@refinedev/core';
import {
  Table,
  Space,
  Tag,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Input,
  Switch,
  Badge,
  Modal,
  Descriptions,
  Statistic,
  Form,
  InputNumber,
  message,
  Tooltip,
  Tabs,
  Progress,
  Alert,
} from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CrownOutlined,
  StarOutlined,
  WarningOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface SubscriptionPlan extends BaseRecord {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  duration: number;
  features: string[];
  isActive: boolean;
  maxTripsPerDay?: number;
  commissionRate: number;
  subscribersCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface DriverSubscription {
  id: string;
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: {
      fullPhone: string;
    };
  };
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    duration: number;
  };
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  remainingTrips?: number;
  createdAt: string;
}

export const SubscriptionList: React.FC = () => {
  const go = useGo();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<DriverSubscription | null>(null);

  // Subscription data
  const {
    tableProps: subscriptionTableProps,
    sorters: subscriptionSorters,
    searchFormProps: subscriptionSearchProps,
  } = useTable({
    resource: 'subscriptions',
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

  // Subscription plans data
  const {
    tableProps: plansTableProps,
    sorters: plansSorters,
    searchFormProps: plansSearchProps,
  } = useTable({
    resource: 'subscription-plans',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
    syncWithLocation: true,
  });

  const handleViewPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPlanModalVisible(true);
  };

  const handleRenewSubscription = (subscription: DriverSubscription) => {
    setSelectedSubscription(subscription);
    setRenewModalVisible(true);
  };

  const renewSubscription = async (values: any) => {
    try {
      // Call your renew subscription mutation here
      message.success('Subscription renewed successfully');
      setRenewModalVisible(false);
      // Refresh table data
    } catch (error) {
      message.error('Failed to renew subscription');
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      // Call your toggle plan status mutation here
      message.success(
        `Plan ${currentStatus ? 'deactivated' : 'activated'} successfully`
      );
      // Refresh table data
    } catch (error) {
      message.error('Failed to update plan status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  };

  const subscriptionColumns: ColumnsType<DriverSubscription> = [
    {
      title: 'Driver',
      key: 'driver',
      render: (_: any, record: DriverSubscription) => (
        <Space>
          <div>
            <div>
              <Text strong>
                {record.driver.firstname} {record.driver.lastname}
              </Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.driver.email}
            </div>
            {record.driver.phone && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.driver.phone.fullPhone}
              </div>
            )}
          </div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Plan',
      key: 'plan',
      render: (_: any, record: DriverSubscription) => (
        <div>
          <div>
            <Text strong>{record.plan.name}</Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.plan.currency}₦{record.plan.amount.toLocaleString()} /{' '}
            {record.plan.duration} days
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: DriverSubscription) => (
        <Space direction='vertical' size='small'>
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          {record.autoRenew && <Tag color='blue'>Auto Renew</Tag>}
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select status'
            allowClear
          >
            <Option value='active'>Active</Option>
            <Option value='expired'>Expired</Option>
            <Option value='cancelled'>Cancelled</Option>
            <Option value='pending'>Pending</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Period',
      key: 'period',
      render: (_: any, record: DriverSubscription) => (
        <Space direction='vertical' size='small'>
          <div style={{ fontSize: '12px' }}>
            <CalendarOutlined />
            <Text style={{ marginLeft: 4 }}>
              {new Date(record.startDate).toLocaleDateString()} -{' '}
              {new Date(record.endDate).toLocaleDateString()}
            </Text>
          </div>
          {record.remainingTrips !== undefined && (
            <div style={{ fontSize: '12px' }}>
              <Text type='secondary'>
                Remaining trips: {record.remainingTrips}
              </Text>
            </div>
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: DriverSubscription) => (
        <Space>
          <Tooltip title='View Details'>
            <ShowButton hideText size='small' recordItemId={record.id} />
          </Tooltip>
          {(record.status === 'expired' || record.status === 'cancelled') && (
            <Tooltip title='Renew'>
              <Button
                icon={<ReloadOutlined />}
                size='small'
                onClick={() => handleRenewSubscription(record)}
              />
            </Tooltip>
          )}
          {record.status === 'active' && (
            <Tooltip title='Cancel'>
              <Button
                icon={<CloseOutlined />}
                size='small'
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Cancel Subscription',
                    content:
                      'Are you sure you want to cancel this subscription?',
                    onOk: () => {
                      // Handle cancel subscription
                      message.success('Subscription cancelled successfully');
                    },
                  });
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const planColumns = [
    {
      title: 'Plan',
      key: 'plan',
      render: (_: any, record: SubscriptionPlan) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.name}</Text>
              {!record.isActive && (
                <Tag color='red' style={{ marginLeft: 8 }}>
                  Inactive
                </Tag>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description}
            </div>
          </div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_: any, record: SubscriptionPlan) => (
        <Space direction='vertical' size='small'>
          <div>
            <DollarOutlined />
            <Text strong style={{ marginLeft: 4 }}>
              {record.currency}₦{record.amount.toLocaleString()}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Duration: {record.duration} days
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Commission: {record.commissionRate}%
          </div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Features',
      key: 'features',
      render: (_: any, record: SubscriptionPlan) => (
        <div>
          {record.features.slice(0, 3).map((feature, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>
              {feature}
            </Tag>
          ))}
          {record.features.length > 3 && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              +{record.features.length - 3} more
            </Text>
          )}
          {record.maxTripsPerDay && (
            <div style={{ marginTop: 4, fontSize: '12px' }}>
              <Text type='secondary'>
                Max trips/day: {record.maxTripsPerDay}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Subscribers',
      key: 'subscribers',
      render: (_: any, record: SubscriptionPlan) => (
        <Space direction='vertical' size='small'>
          <div>
            <UserOutlined />
            <Text style={{ marginLeft: 4 }}>
              {record.subscribersCount || 0}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>subscribers</div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: SubscriptionPlan) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => togglePlanStatus(record.id, !checked)}
          checkedChildren='Active'
          unCheckedChildren='Inactive'
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: SubscriptionPlan) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewPlan(record)}
            />
          </Tooltip>
          <Tooltip title='Edit Plan'>
            <EditButton hideText size='small' recordItemId={record.id} />
          </Tooltip>
          <Tooltip title='Delete Plan'>
            <DeleteButton
              hideText
              size='small'
              recordItemId={record.id}
              onSuccess={() => {
                message.success('Plan deleted successfully');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getSubscriptionStats = () => {
    const subscriptions = subscriptionTableProps.dataSource || [];
    return {
      total: subscriptions.length,
      active: subscriptions.filter((s: any) => s.status === 'active').length,
      expired: subscriptions.filter((s: any) => s.status === 'expired').length,
      revenue: subscriptions
        .filter((s: any) => s.status === 'active')
        .reduce((sum: number, s: any) => sum + s.plan.amount, 0),
    };
  };

  const stats = getSubscriptionStats();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Subscription Management</Title>
            <Text type='secondary'>
              Manage subscription plans and driver subscriptions
            </Text>
          </div>
        }
        headerButtons={() => (
          <Space>
            {activeTab === 'plans' && (
              <CreateButton
                icon={<PlusOutlined />}
                onClick={() => go({ to: '/subscriptions/create' })}
              >
                Create Plan
              </CreateButton>
            )}
            <Button
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Space>
        )}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab='Driver Subscriptions' key='subscriptions'>
            {/* Summary Cards for Subscriptions */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Total Subscriptions'
                    value={stats.total}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Active'
                    value={stats.active}
                    prefix={<CheckOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Expired'
                    value={stats.expired}
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Monthly Revenue'
                    value={stats.revenue}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Filters */}
            <Card style={{ marginBottom: 16 }}>
              <Form {...subscriptionSearchProps} layout='inline'>
                <Form.Item name='search'>
                  <Input
                    placeholder='Search by driver name or email'
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Search
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<FilterOutlined />}>Clear Filters</Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Subscriptions Table */}
            <Table
              {...subscriptionTableProps}
              columns={subscriptionColumns}
              rowKey='id'
              scroll={{ x: 1200 }}
              pagination={{
                ...subscriptionTableProps.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} subscriptions`,
              }}
            />
          </TabPane>

          <TabPane tab='Subscription Plans' key='plans'>
            {/* Summary Cards for Plans */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Total Plans'
                    value={plansTableProps.dataSource?.length || 0}
                    prefix={<CrownOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Active Plans'
                    value={
                      (plansTableProps.dataSource || []).filter(
                        (p: any) => p.isActive
                      ).length
                    }
                    prefix={<StarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Total Subscribers'
                    value={(plansTableProps.dataSource || []).reduce(
                      (sum: number, p: any) => sum + (p.subscribersCount || 0),
                      0
                    )}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Avg. Plan Price'
                    value={
                      (plansTableProps.dataSource || []).length > 0
                        ? (plansTableProps.dataSource || []).reduce(
                            (sum: number, p: any) => sum + p.amount,
                            0
                          ) / (plansTableProps.dataSource || []).length
                        : 0
                    }
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Filters */}
            <Card style={{ marginBottom: 16 }}>
              <Form {...plansSearchProps} layout='inline'>
                <Form.Item name='search'>
                  <Input
                    placeholder='Search plans by name'
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Search
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button icon={<FilterOutlined />}>Clear Filters</Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Plans Table */}
            <Table
              {...plansTableProps}
              columns={planColumns}
              rowKey='id'
              scroll={{ x: 1200 }}
              pagination={{
                ...plansTableProps.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} plans`,
              }}
            />
          </TabPane>
        </Tabs>
      </List>

      {/* Plan Details Modal */}
      <Modal
        title={`Plan Details - ${selectedPlan?.name}`}
        open={planModalVisible}
        onCancel={() => setPlanModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setPlanModalVisible(false)}>
            Close
          </Button>,
          selectedPlan && (
            <Button
              key='edit'
              type='primary'
              onClick={() => {
                go({
                  to: '/subscriptions/edit',
                  query: { id: selectedPlan.id },
                });
                setPlanModalVisible(false);
              }}
            >
              Edit Plan
            </Button>
          ),
        ]}
      >
        {selectedPlan && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size='small' title='Plan Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Name'>
                      {selectedPlan.name}
                    </Descriptions.Item>
                    <Descriptions.Item label='Description'>
                      {selectedPlan.description}
                    </Descriptions.Item>
                    <Descriptions.Item label='Price'>
                      {selectedPlan.currency}₦
                      {selectedPlan.amount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Duration'>
                      {selectedPlan.duration} days
                    </Descriptions.Item>
                    <Descriptions.Item label='Commission Rate'>
                      {selectedPlan.commissionRate}%
                    </Descriptions.Item>
                    {selectedPlan.maxTripsPerDay && (
                      <Descriptions.Item label='Max Trips/Day'>
                        {selectedPlan.maxTripsPerDay}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label='Status'>
                      <Tag color={selectedPlan.isActive ? 'green' : 'red'}>
                        {selectedPlan.isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size='small' title='Features'>
                  <Space direction='vertical' style={{ width: '100%' }}>
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index}>
                        <CheckOutlined
                          style={{ color: '#52c41a', marginRight: 8 }}
                        />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card size='small' title='Statistics'>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title='Current Subscribers'
                        value={selectedPlan.subscribersCount || 0}
                        prefix={<UserOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Monthly Revenue'
                        value={
                          (selectedPlan.subscribersCount || 0) *
                          selectedPlan.amount
                        }
                        prefix='₦'
                        formatter={(value) => value?.toLocaleString()}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Created'
                        value={new Date(
                          selectedPlan.createdAt
                        ).toLocaleDateString()}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Renew Subscription Modal */}
      <Modal
        title='Renew Subscription'
        open={renewModalVisible}
        onCancel={() => setRenewModalVisible(false)}
        footer={null}
      >
        {selectedSubscription && (
          <Form
            layout='vertical'
            onFinish={renewSubscription}
            initialValues={{
              planId: selectedSubscription.plan.id,
              autoRenew: selectedSubscription.autoRenew,
              duration: selectedSubscription.plan.duration,
            }}
          >
            <Alert
              message='Subscription Renewal'
              description={`Renewing subscription for ${selectedSubscription.driver.firstname} ${selectedSubscription.driver.lastname}`}
              type='info'
              style={{ marginBottom: 16 }}
            />

            <Form.Item name='planId' label='Plan'>
              <Select disabled>
                <Option value={selectedSubscription.plan.id}>
                  {selectedSubscription.plan.name} - ₦
                  {selectedSubscription.plan.amount.toLocaleString()}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name='duration'
              label='Duration (days)'
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={365} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='autoRenew'
              label='Auto Renew'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Renew Subscription
                </Button>
                <Button onClick={() => setRenewModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
