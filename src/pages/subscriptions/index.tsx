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

// Fixed interfaces to match GraphQL schema
interface SubscriptionPlan extends BaseRecord {
  id: string;
  name: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  price: number; // Changed from 'amount' to 'price'
  description?: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DriverSubscription {
  id: string;
  driverId: string;
  planId: string;
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string; // Simplified phone structure
  };
  plan: {
    id: string;
    name: string;
    price: number; // Changed from 'amount' to 'price'
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING'; // Updated to match schema
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentReference?: string;
  subscriptionNumber: string;
  createdAt: string;
  updatedAt: string;
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
  } = useTable<DriverSubscription>({
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
  } = useTable<SubscriptionPlan>({
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
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      DAILY: 'blue',
      WEEKLY: 'green',
      MONTHLY: 'purple',
    };
    return colors[type as keyof typeof colors] || 'default';
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
                {record.driver.phone}
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
            <Tag
              color={getTypeBadge(record.plan.type)}
              style={{ marginLeft: 8 }}
            >
              {record.plan.type}
            </Tag>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ₦{record.plan.price.toLocaleString()}
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
          <Tag color={getStatusColor(status)}>{status}</Tag>
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
            <Option value='ACTIVE'>Active</Option>
            <Option value='EXPIRED'>Expired</Option>
            <Option value='CANCELLED'>Cancelled</Option>
            <Option value='PENDING'>Pending</Option>
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
          <div style={{ fontSize: '12px' }}>
            <Text type='secondary'>Ref: {record.subscriptionNumber}</Text>
          </div>
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
          {(record.status === 'EXPIRED' || record.status === 'CANCELLED') && (
            <Tooltip title='Renew'>
              <Button
                icon={<ReloadOutlined />}
                size='small'
                onClick={() => handleRenewSubscription(record)}
              />
            </Tooltip>
          )}
          {record.status === 'ACTIVE' && (
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

  const planColumns:ColumnsType<SubscriptionPlan> = [
    {
      title: 'Plan',
      key: 'plan',
      render: (_: any, record: SubscriptionPlan) => (
        <Space>
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Tag color={getTypeBadge(record.type)} style={{ marginLeft: 8 }}>
                {record.type}
              </Tag>
              {!record.isActive && (
                <Tag color='red' style={{ marginLeft: 8 }}>
                  Inactive
                </Tag>
              )}
            </div>
            {record.description && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.description}
              </div>
            )}
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
              ₦{record.price.toLocaleString()}
            </Text>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.type.toLowerCase()} plan
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
        </div>
      ),
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
      active: subscriptions.filter((s: any) => s.status === 'ACTIVE').length,
      expired: subscriptions.filter((s: any) => s.status === 'EXPIRED').length,
      revenue: subscriptions
        .filter((s: any) => s.status === 'ACTIVE')
        .reduce((sum: number, s: any) => sum + s.plan.price, 0),
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
                    title='Revenue'
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
            <Table<DriverSubscription>
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
                    title='Avg. Plan Price'
                    value={
                      (plansTableProps.dataSource || []).length > 0
                        ? (plansTableProps.dataSource || []).reduce(
                            (sum: number, p: any) => sum + p.price,
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
              <Col span={6}>
                <Card size='small'>
                  <Statistic
                    title='Plan Types'
                    value={
                      new Set(
                        (plansTableProps.dataSource || []).map(
                          (p: any) => p.type
                        )
                      ).size
                    }
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#13c2c2' }}
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
            <Table<SubscriptionPlan>
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
                    <Descriptions.Item label='Type'>
                      <Tag color={getTypeBadge(selectedPlan.type)}>
                        {selectedPlan.type}
                      </Tag>
                    </Descriptions.Item>
                    {selectedPlan.description && (
                      <Descriptions.Item label='Description'>
                        {selectedPlan.description}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label='Price'>
                      ₦{selectedPlan.price.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                      <Tag color={selectedPlan.isActive ? 'green' : 'red'}>
                        {selectedPlan.isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Created'>
                      {new Date(selectedPlan.createdAt).toLocaleDateString()}
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
                  {selectedSubscription.plan.price.toLocaleString()} (
                  {selectedSubscription.plan.type})
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
