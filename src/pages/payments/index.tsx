import React, { useState } from 'react';
import {
  List,
  ShowButton,
  useTable,
  FilterDropdown,
  getDefaultSortOrder,
} from '@refinedev/antd';
import { useGo } from '@refinedev/core';
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
  Badge,
  Modal,
  Descriptions,
  Statistic,
  Form,
  DatePicker,
  message,
  Tooltip,
  Tabs,
  Alert,
  Progress,
  Timeline,
} from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  WalletOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SyncOutlined,
  MoneyCollectOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'wallet' | 'bank_transfer';
  reference: string;
  trip: {
    id: string;
    tripNumber: string;
    customer: {
      firstname: string;
      lastname: string;
    };
    driver: {
      firstname: string;
      lastname: string;
    };
  };
  customer: {
    id: string;
    firstname: string;
    lastname: string;
  };
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refundReason?: string;
}

interface PaymentAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  averageTransactionAmount: number;
  paymentMethodBreakdown: {
    cash: number;
    card: number;
    wallet: number;
    bank_transfer: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

export const PaymentList: React.FC = () => {
  const go = useGo();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('payments');

  const { tableProps, sorters, filters, searchFormProps } = useTable<Payment>({
    resource: 'payments',
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

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsModalVisible(true);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundModalVisible(true);
  };

  const processRefund = async (values: any) => {
    try {
      // Call your refund payment mutation here
      message.success('Refund processed successfully');
      setRefundModalVisible(false);
      // Refresh table data
    } catch (error) {
      message.error('Failed to process refund');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'processing';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'pending':
        return <SyncOutlined spin />;
      case 'failed':
        return <CloseCircleOutlined />;
      case 'refunded':
        return <ExclamationCircleOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCardOutlined />;
      case 'wallet':
        return <WalletOutlined />;
      case 'bank_transfer':
        return <BankOutlined />;
      case 'cash':
        return <MoneyCollectOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'card':
        return 'blue';
      case 'wallet':
        return 'green';
      case 'bank_transfer':
        return 'purple';
      case 'cash':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Payment> = [
    {
      title: 'Payment ID',
      key: 'paymentId',
      render: (_: any, record: Payment) => (
        <Space direction='vertical' size='small'>
          <Text strong>{record.reference}</Text>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            {new Date(record.createdAt).toLocaleString()}
          </Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Trip',
      key: 'trip',
      render: (_: any, record: Payment) =>
        record.trip ? (
          <Space direction='vertical' size='small'>
            <div>
              <EnvironmentOutlined />
              <Text strong style={{ marginLeft: 4 }}>
                {record.trip.tripNumber}
              </Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Customer: {record.trip.customer.firstname}{' '}
              {record.trip.customer.lastname}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Driver: {record.trip.driver.firstname}{' '}
              {record.trip.driver.lastname}
            </div>
          </Space>
        ) : (
          <Space>
            <UserOutlined />
            <div>
              <Text>
                {record.customer.firstname} {record.customer.lastname}
              </Text>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Wallet Top-up
              </div>
            </div>
          </Space>
        ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_: any, record: Payment) => (
        <Space direction='vertical' size='small'>
          <div>
            <DollarOutlined />
            <Text strong style={{ marginLeft: 4 }}>
              {record.currency}₦{record.amount.toLocaleString()}
            </Text>
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('amount', sorters),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => (
        <Tag
          color={getPaymentMethodColor(method)}
          icon={getPaymentMethodIcon(method)}
        >
          {method.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select payment method'
            allowClear
          >
            <Option value='cash'>Cash</Option>
            <Option value='card'>Card</Option>
            <Option value='wallet'>Wallet</Option>
            <Option value='bank_transfer'>Bank Transfer</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Payment) => (
        <Space direction='vertical' size='small'>
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {status.toUpperCase()}
          </Tag>
          {record.processedAt && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              {new Date(record.processedAt).toLocaleString()}
            </Text>
          )}
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select status'
            allowClear
          >
            <Option value='completed'>Completed</Option>
            <Option value='pending'>Pending</Option>
            <Option value='failed'>Failed</Option>
            <Option value='refunded'>Refunded</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_: any, record: Payment) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'completed' && record.trip && (
            <Tooltip title='Refund'>
              <Button
                icon={<ExclamationCircleOutlined />}
                size='small'
                onClick={() => handleRefund(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const getPaymentStats = () => {
    const data = tableProps.dataSource || [];
    const totalAmount = data.reduce(
      (sum: number, p: Payment) => sum + p.amount,
      0
    );
    const completedPayments = data.filter(
      (p: Payment) => p.status === 'completed'
    );
    const completedAmount = completedPayments.reduce(
      (sum: number, p: Payment) => sum + p.amount,
      0
    );

    return {
      total: data.length,
      completed: completedPayments.length,
      pending: data.filter((p: Payment) => p.status === 'pending').length,
      failed: data.filter((p: Payment) => p.status === 'failed').length,
      refunded: data.filter((p: Payment) => p.status === 'refunded').length,
      totalAmount,
      completedAmount,
      averageAmount:
        completedPayments.length > 0
          ? completedAmount / completedPayments.length
          : 0,
    };
  };

  const stats = getPaymentStats();

  // Mock analytics data - replace with real data from backend
  const analytics: PaymentAnalytics = {
    totalRevenue: stats.completedAmount,
    totalTransactions: stats.total,
    successfulTransactions: stats.completed,
    failedTransactions: stats.failed,
    refundedTransactions: stats.refunded,
    averageTransactionAmount: stats.averageAmount,
    paymentMethodBreakdown: {
      cash: 45,
      card: 30,
      wallet: 20,
      bank_transfer: 5,
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 125000, transactions: 50 },
      { month: 'Feb', revenue: 150000, transactions: 60 },
      { month: 'Mar', revenue: 180000, transactions: 72 },
    ],
  };

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Payment Management</Title>
            <Text type='secondary'>
              Monitor transactions, process refunds, and track revenue
            </Text>
          </div>
        }
        headerButtons={() => (
          <Space>
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
          <TabPane tab='Payments' key='payments'>
            {/* Summary Cards */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Total Payments'
                    value={stats.total}
                    prefix={<CreditCardOutlined />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Completed'
                    value={stats.completed}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Pending'
                    value={stats.pending}
                    prefix={<SyncOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Failed'
                    value={stats.failed}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Revenue'
                    value={stats.completedAmount}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card size='small'>
                  <Statistic
                    title='Avg Amount'
                    value={stats.averageAmount}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
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
                    placeholder='Search by reference, customer, or trip'
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Form.Item name='dateRange'>
                  <RangePicker
                    placeholder={['Start Date', 'End Date']}
                    style={{ width: 250 }}
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

            {/* Payments Table */}
            <Table<Payment>
              {...tableProps}
              columns={columns}
              rowKey='id'
              scroll={{ x: 1400 }}
              pagination={{
                ...tableProps.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} payments`,
              }}
            />
          </TabPane>

          <TabPane tab='Analytics' key='analytics'>
            {/* Analytics Overview */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title='Total Revenue'
                    value={analytics.totalRevenue}
                    prefix='₦'
                    formatter={(value) => value?.toLocaleString()}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title='Success Rate'
                    value={
                      analytics.totalTransactions > 0
                        ? (
                            (analytics.successfulTransactions /
                              analytics.totalTransactions) *
                            100
                          ).toFixed(1)
                        : 0
                    }
                    suffix='%'
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title='Failed Transactions'
                    value={analytics.failedTransactions}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title='Refunded'
                    value={analytics.refundedTransactions}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Payment Method Breakdown */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card title='Payment Method Distribution'>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Cash Payments</Text>
                        <Progress
                          percent={analytics.paymentMethodBreakdown.cash}
                          strokeColor='#faad14'
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Card Payments</Text>
                        <Progress
                          percent={analytics.paymentMethodBreakdown.card}
                          strokeColor='#1890ff'
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Wallet Payments</Text>
                        <Progress
                          percent={analytics.paymentMethodBreakdown.wallet}
                          strokeColor='#52c41a'
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Bank Transfers</Text>
                        <Progress
                          percent={
                            analytics.paymentMethodBreakdown.bank_transfer
                          }
                          strokeColor='#722ed1'
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card title='Key Metrics'>
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <Statistic
                      title='Average Transaction Amount'
                      value={analytics.averageTransactionAmount}
                      prefix='₦'
                      formatter={(value) => value?.toLocaleString()}
                    />
                    <Statistic
                      title='Total Transactions'
                      value={analytics.totalTransactions}
                    />
                    <Statistic
                      title='Processing Fee'
                      value={analytics.totalRevenue * 0.025} // 2.5% processing fee
                      prefix='₦'
                      formatter={(value) => value?.toLocaleString()}
                    />
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Monthly Revenue Trend */}
            <Card title='Monthly Revenue Trend'>
              <Row gutter={16}>
                {analytics.revenueByMonth.map((data, index) => (
                  <Col span={8} key={index}>
                    <Card size='small'>
                      <Statistic
                        title={`${data.month} Revenue`}
                        value={data.revenue}
                        prefix='₦'
                        formatter={(value) => value?.toLocaleString()}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type='secondary'>
                          {data.transactions} transactions
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </List>

      {/* Payment Details Modal */}
      <Modal
        title={`Payment Details - ${selectedPayment?.reference}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          selectedPayment &&
            selectedPayment.status === 'completed' &&
            selectedPayment.trip && (
              <Button
                key='refund'
                danger
                onClick={() => {
                  setDetailsModalVisible(false);
                  handleRefund(selectedPayment);
                }}
              >
                Process Refund
              </Button>
            ),
        ]}
      >
        {selectedPayment && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size='small' title='Payment Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Reference'>
                      {selectedPayment.reference}
                    </Descriptions.Item>
                    <Descriptions.Item label='Amount'>
                      {selectedPayment.currency}₦
                      {selectedPayment.amount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Payment Method'>
                      <Tag
                        color={getPaymentMethodColor(
                          selectedPayment.paymentMethod
                        )}
                        icon={getPaymentMethodIcon(
                          selectedPayment.paymentMethod
                        )}
                      >
                        {selectedPayment.paymentMethod
                          .replace('_', ' ')
                          .toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                      <Tag
                        color={getStatusColor(selectedPayment.status)}
                        icon={getStatusIcon(selectedPayment.status)}
                      >
                        {selectedPayment.status.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Created'>
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    {selectedPayment.processedAt && (
                      <Descriptions.Item label='Processed'>
                        {new Date(selectedPayment.processedAt).toLocaleString()}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size='small' title='Customer Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Customer'>
                      {selectedPayment.customer.firstname}{' '}
                      {selectedPayment.customer.lastname}
                    </Descriptions.Item>
                    {selectedPayment.trip && (
                      <>
                        <Descriptions.Item label='Trip Number'>
                          {selectedPayment.trip.tripNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label='Driver'>
                          {selectedPayment.trip.driver.firstname}{' '}
                          {selectedPayment.trip.driver.lastname}
                        </Descriptions.Item>
                      </>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {selectedPayment.failureReason && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Alert
                    message='Payment Failed'
                    description={selectedPayment.failureReason}
                    type='error'
                    showIcon
                  />
                </Col>
              </Row>
            )}

            {selectedPayment.refundReason && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Alert
                    message='Payment Refunded'
                    description={selectedPayment.refundReason}
                    type='warning'
                    showIcon
                  />
                </Col>
              </Row>
            )}
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        title='Process Refund'
        open={refundModalVisible}
        onCancel={() => setRefundModalVisible(false)}
        footer={null}
      >
        {selectedPayment && (
          <Form
            layout='vertical'
            onFinish={processRefund}
            initialValues={{
              amount: selectedPayment.amount,
            }}
          >
            <Alert
              message='Refund Request'
              description={`Processing refund for payment ${selectedPayment.reference}`}
              type='warning'
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              name='amount'
              label='Refund Amount'
              rules={[{ required: true }]}
            >
              <Input
                prefix='₦'
                disabled
                value={selectedPayment.amount.toLocaleString()}
              />
            </Form.Item>

            <Form.Item
              name='reason'
              label='Refund Reason'
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} placeholder='Enter reason for refund' />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type='primary' danger htmlType='submit'>
                  Process Refund
                </Button>
                <Button onClick={() => setRefundModalVisible(false)}>
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
