import React, { useState } from 'react';
import {
  List,
  ShowButton,
  EditButton,
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
  Tabs,
  Timeline,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  WalletOutlined,
  CreditCardOutlined,
  WarningOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePhotoSet: boolean;
  profilePhoto?: string;
  personalInfoSet: boolean;
  walletId?: string;
  paymentPreferences?: {
    preferredMethod: 'wallet' | 'card' | 'cash';
    autoTopUp: boolean;
    autoTopUpThreshold: number;
    autoTopUpAmount: number;
    preferredCard?: string;
  };
  totalSpentAllTime: number;
  totalWalletTopUps: number;
  averageSpendPerTrip: number;
  lastPaymentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const CustomerList: React.FC = () => {
  const go = useGo();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [selectedCustomerForAction, setSelectedCustomerForAction] =
    useState<Customer | null>(null);

  const { tableProps, sorters, filters, searchFormProps } = useTable({
    resource: 'customers',
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

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerVisible(true);
  };

  const handleSuspendCustomer = (customer: Customer) => {
    setSelectedCustomerForAction(customer);
    setSuspendModalVisible(true);
  };

  const suspendCustomer = async (values: any) => {
    try {
      // Call your suspend customer mutation here
      message.success('Customer status updated successfully');
      setSuspendModalVisible(false);
      // Refresh table data
    } catch (error) {
      message.error('Failed to update customer status');
    }
  };

  const getVerificationStatus = (customer: Customer) => {
    const total = 4; // email, phone, profile, personal info
    let verified = 0;

    if (customer.isEmailVerified) verified++;
    if (customer.isPhoneVerified) verified++;
    if (customer.profilePhotoSet) verified++;
    if (customer.personalInfoSet) verified++;

    return { verified, total, percentage: (verified / total) * 100 };
  };

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_: any, record: Customer) => {
        const verification = getVerificationStatus(record);
        return (
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
                {verification.percentage === 100 && (
                  <CheckOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
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
        );
      },
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('firstname', sorters),
    },
    {
      title: 'Verification',
      key: 'verification',
      render: (_: any, record: Customer) => {
        const verification = getVerificationStatus(record);
        return (
          <Space direction='vertical' size='small'>
            <div>
              <Text style={{ fontSize: '12px' }}>
                {verification.verified}/{verification.total} verified
              </Text>
            </div>
            <Space size='small'>
              <Tooltip title='Email Verification'>
                <Badge
                  status={record.isEmailVerified ? 'success' : 'error'}
                  dot
                />
              </Tooltip>
              <Tooltip title='Phone Verification'>
                <Badge
                  status={record.isPhoneVerified ? 'success' : 'error'}
                  dot
                />
              </Tooltip>
              <Tooltip title='Profile Photo'>
                <Badge
                  status={record.profilePhotoSet ? 'success' : 'error'}
                  dot
                />
              </Tooltip>
              <Tooltip title='Personal Info'>
                <Badge
                  status={record.personalInfoSet ? 'success' : 'error'}
                  dot
                />
              </Tooltip>
            </Space>
          </Space>
        );
      },
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select verification status'
            allowClear
          >
            <Option value='verified'>Fully Verified</Option>
            <Option value='partial'>Partially Verified</Option>
            <Option value='unverified'>Unverified</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Payment Method',
      key: 'paymentMethod',
      render: (_: any, record: Customer) => (
        <Space direction='vertical' size='small'>
          {record.paymentPreferences && (
            <Tag
              color={
                record.paymentPreferences.preferredMethod === 'wallet'
                  ? 'green'
                  : record.paymentPreferences.preferredMethod === 'card'
                  ? 'blue'
                  : 'orange'
              }
            >
              {record.paymentPreferences.preferredMethod.toUpperCase()}
            </Tag>
          )}
          {record.paymentPreferences?.autoTopUp && (
            <Tag color='purple'>Auto Top-up</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Spending',
      key: 'spending',
      render: (_: any, record: Customer) => (
        <Space direction='vertical' size='small'>
          <div>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <Text style={{ marginLeft: 4 }}>
              ₦{record?.totalSpentAllTime?.toLocaleString()}
            </Text>
          </div>
          <div>
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Avg: ₦{record?.averageSpendPerTrip?.toLocaleString()}
            </Text>
          </div>
          <div>
            <WalletOutlined style={{ color: '#1890ff' }} />
            <Text style={{ marginLeft: 4, fontSize: '12px' }}>
              ₦{record?.totalWalletTopUps?.toLocaleString()}
            </Text>
          </div>
        </Space>
      ),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Last Activity',
      key: 'lastActivity',
      render: (_: any, record: Customer) => (
        <Space direction='vertical' size='small'>
          <div>
            <Text style={{ fontSize: '12px' }}>
              Joined: {new Date(record.createdAt).toLocaleDateString()}
            </Text>
          </div>
          {record.lastPaymentAt && (
            <div>
              <Text type='secondary' style={{ fontSize: '12px' }}>
                Last payment:{' '}
                {new Date(record.lastPaymentAt).toLocaleDateString()}
              </Text>
            </div>
          )}
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('createdAt', sorters),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Customer) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewCustomer(record)}
            />
          </Tooltip>
          <Tooltip title='Edit Customer'>
            <Button
              icon={<EditOutlined />}
              size='small'
              onClick={() =>
                go({
                  to: '/customers/edit',
                  query: { id: record.id },
                })
              }
            />
          </Tooltip>
          <Tooltip title='Suspend/Activate'>
            <Button
              icon={<WarningOutlined />}
              size='small'
              onClick={() => handleSuspendCustomer(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getVerificationCounts = () => {
    const data = tableProps.dataSource || [];
    return {
      total: data.length,
      fullyVerified: data.filter(
        (c: Customer) => getVerificationStatus(c).percentage === 100
      ).length,
      emailVerified: data.filter((c: Customer) => c.isEmailVerified).length,
      phoneVerified: data.filter((c: Customer) => c.isPhoneVerified).length,
    };
  };

  const verificationCounts = getVerificationCounts();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Customer Management</Title>
            <Text type='secondary'>
              Manage customers, track spending, and handle verifications
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
        {/* Summary Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Total Customers'
                value={verificationCounts.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Fully Verified'
                value={verificationCounts.fullyVerified}
                prefix={<CheckOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Email Verified'
                value={verificationCounts.emailVerified}
                prefix={<MailOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Phone Verified'
                value={verificationCounts.phoneVerified}
                prefix={<PhoneOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Total Revenue Card */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card size='small'>
              <Statistic
                title='Total Customer Spending'
                value={(tableProps.dataSource || []).reduce(
                  (sum: number, c: Customer) => sum + c.totalSpentAllTime,
                  0
                )}
                prefix='₦'
                formatter={(value) => value?.toLocaleString()}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form {...searchFormProps} layout='inline'>
            <Form.Item name='search'>
              <Input
                placeholder='Search customers by name, email, or phone'
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
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  // Reset filters
                }}
              >
                Clear Filters
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Customers Table */}
        <Table
          {...tableProps}
          columns={columns}
          rowKey='id'
          scroll={{ x: 1200 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} customers`,
          }}
        />
      </List>

      {/* Customer Details Drawer */}
      <Drawer
        title='Customer Details'
        placement='right'
        size='large'
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          selectedCustomer && (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  go({
                    to: '/customers/edit',
                    query: { id: selectedCustomer.id },
                  });
                  setDrawerVisible(false);
                }}
              >
                Edit
              </Button>
            </Space>
          )
        }
      >
        {selectedCustomer && (
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Profile' key='1'>
              <Space
                direction='vertical'
                style={{ width: '100%' }}
                size='large'
              >
                {/* Customer Profile */}
                <Card title='Profile Information'>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar
                      size={80}
                      src={selectedCustomer.profilePhoto}
                      icon={<UserOutlined />}
                    />
                    <Title level={4} style={{ margin: '8px 0' }}>
                      {selectedCustomer.firstname} {selectedCustomer.lastname}
                    </Title>
                    <Space>
                      <Badge
                        status={
                          selectedCustomer.isEmailVerified ? 'success' : 'error'
                        }
                        text='Email'
                      />
                      <Badge
                        status={
                          selectedCustomer.isPhoneVerified ? 'success' : 'error'
                        }
                        text='Phone'
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
                      <Space>
                        {selectedCustomer.email}
                        {selectedCustomer.isEmailVerified ? (
                          <CheckOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <CloseOutlined style={{ color: '#ff4d4f' }} />
                        )}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          <PhoneOutlined />
                          Phone
                        </Space>
                      }
                    >
                      <Space>
                        {selectedCustomer.phone.fullPhone}
                        {selectedCustomer.isPhoneVerified ? (
                          <CheckOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <CloseOutlined style={{ color: '#ff4d4f' }} />
                        )}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label='Profile Setup'>
                      <Space>
                        <Text>Photo: </Text>
                        {selectedCustomer.profilePhotoSet ? (
                          <CheckOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <CloseOutlined style={{ color: '#ff4d4f' }} />
                        )}
                        <Text style={{ marginLeft: 16 }}>Info: </Text>
                        {selectedCustomer.personalInfoSet ? (
                          <CheckOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <CloseOutlined style={{ color: '#ff4d4f' }} />
                        )}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label='Member Since'>
                      {new Date(
                        selectedCustomer.createdAt
                      ).toLocaleDateString()}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Payment Information */}
                <Card title='Payment Information'>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title='Total Spent'
                        value={selectedCustomer.totalSpentAllTime}
                        prefix='₦'
                        formatter={(value) => value?.toLocaleString()}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Wallet Top-ups'
                        value={selectedCustomer.totalWalletTopUps}
                        prefix='₦'
                        formatter={(value) => value?.toLocaleString()}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title='Avg per Trip'
                        value={selectedCustomer.averageSpendPerTrip}
                        prefix='₦'
                        formatter={(value) => value?.toLocaleString()}
                      />
                    </Col>
                  </Row>

                  {selectedCustomer.paymentPreferences && (
                    <div style={{ marginTop: 24 }}>
                      <Title level={5}>Payment Preferences</Title>
                      <Descriptions column={1} bordered>
                        <Descriptions.Item label='Preferred Method'>
                          <Tag
                            color={
                              selectedCustomer.paymentPreferences
                                .preferredMethod === 'wallet'
                                ? 'green'
                                : selectedCustomer.paymentPreferences
                                    .preferredMethod === 'card'
                                ? 'blue'
                                : 'orange'
                            }
                          >
                            {selectedCustomer.paymentPreferences.preferredMethod.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label='Auto Top-up'>
                          <Switch
                            checked={
                              selectedCustomer.paymentPreferences.autoTopUp
                            }
                            disabled
                          />
                        </Descriptions.Item>
                        {selectedCustomer.paymentPreferences.autoTopUp && (
                          <>
                            <Descriptions.Item label='Top-up Threshold'>
                              ₦
                              {selectedCustomer.paymentPreferences.autoTopUpThreshold.toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label='Top-up Amount'>
                              ₦
                              {selectedCustomer.paymentPreferences.autoTopUpAmount.toLocaleString()}
                            </Descriptions.Item>
                          </>
                        )}
                      </Descriptions>
                    </div>
                  )}
                </Card>
              </Space>
            </TabPane>

            <TabPane tab='Activity' key='2'>
              <Card title='Recent Activity'>
                <Timeline>
                  <Timeline.Item color='green'>
                    <Text strong>Account Created</Text>
                    <div>
                      <Text type='secondary'>
                        {new Date(selectedCustomer.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  </Timeline.Item>

                  {selectedCustomer.lastPaymentAt && (
                    <Timeline.Item color='blue'>
                      <Text strong>Last Payment</Text>
                      <div>
                        <Text type='secondary'>
                          {new Date(
                            selectedCustomer.lastPaymentAt
                          ).toLocaleString()}
                        </Text>
                      </div>
                    </Timeline.Item>
                  )}

                  <Timeline.Item color='orange'>
                    <Text strong>Profile Updated</Text>
                    <div>
                      <Text type='secondary'>
                        {new Date(selectedCustomer.updatedAt).toLocaleString()}
                      </Text>
                    </div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </TabPane>
          </Tabs>
        )}
      </Drawer>

      {/* Suspend Customer Modal */}
      <Modal
        title='Update Customer Status'
        open={suspendModalVisible}
        onCancel={() => setSuspendModalVisible(false)}
        footer={null}
      >
        {selectedCustomerForAction && (
          <Form
            layout='vertical'
            onFinish={suspendCustomer}
            initialValues={{
              action: 'suspend',
              reason: '',
            }}
          >
            <Form.Item name='action' label='Action'>
              <Select>
                <Option value='suspend'>Suspend Account</Option>
                <Option value='activate'>Activate Account</Option>
                <Option value='warning'>Send Warning</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='reason'
              label='Reason'
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={4}
                placeholder='Enter reason for this action'
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Update Status
                </Button>
                <Button onClick={() => setSuspendModalVisible(false)}>
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
