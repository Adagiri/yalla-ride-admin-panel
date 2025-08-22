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
  Timeline,
  Avatar,
  Tooltip,
  Steps,
} from 'antd';
import {
  EnvironmentOutlined,
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

interface Trip {
  id: string;
  tripNumber: string;
  status:
    | 'searching'
    | 'drivers_found'
    | 'driver_assigned'
    | 'driver_arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

  customer: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: {
      fullPhone: string;
    };
  };

  driver?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: {
      fullPhone: string;
    };
  };

  pickup: {
    address: string;
    coordinates?: [number, number];
  };

  destination: {
    address: string;
    coordinates?: [number, number];
  };

  pricing: {
    finalAmount: number;
    baseAmount: number;
    surgeMultiplier: number;
    breakdown: {
      baseFare: number;
      distanceCharge: number;
      timeCharge: number;
      surgeFee: number;
      discount: number;
    };
  };

  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus?: 'pending' | 'completed' | 'failed';

  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  timeline?: Array<{
    event: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}

export const TripList: React.FC = () => {
  const go = useGo();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [timelineModalVisible, setTimelineModalVisible] = useState(false);

  const { tableProps, sorters, filters, searchFormProps } = useTable<Trip>({
    resource: 'trips',
    initialSorter: [
      {
        field: 'requestedAt',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'processing';
      case 'driver_assigned':
      case 'driver_arrived':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'searching':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'in_progress':
        return <PlayCircleOutlined />;
      case 'driver_assigned':
      case 'driver_arrived':
        return <CarOutlined />;
      case 'cancelled':
        return <CloseCircleOutlined />;
      case 'searching':
        return <ExclamationCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailsModalVisible(true);
  };

  const handleViewTimeline = (trip: Trip) => {
    setSelectedTrip(trip);
    setTimelineModalVisible(true);
  };

  const getTripStepStatus = (trip: Trip) => {
    const statusOrder = [
      'searching',
      'driver_assigned',
      'driver_arrived',
      'in_progress',
      'completed',
    ];
    return statusOrder.indexOf(trip.status);
  };

  const columns: ColumnsType<Trip> = [
    {
      title: 'Trip #',
      dataIndex: 'tripNumber',
      key: 'tripNumber',
      render: (text: string, record: Trip) => (
        <Space direction='vertical' size='small'>
          <Text strong>{text}</Text>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            {new Date(record.requestedAt).toLocaleString()}
          </Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: any, record: Trip) => (
        <Space>
          <Avatar icon={<UserOutlined />} size='small' />
          <div>
            <div>
              <Text strong>
                {record?.customer?.firstname} {record?.customer?.lastname}
              </Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record?.customer?.phone?.fullPhone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Driver',
      key: 'driver',
      render: (_: any, record: Trip) =>
        record.driver ? (
          <Space>
            <Avatar icon={<CarOutlined />} size='small' />
            <div>
              <div>
                <Text strong>
                  {record.driver.firstname} {record.driver.lastname}
                </Text>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.driver.phone.fullPhone}
              </div>
            </div>
          </Space>
        ) : (
          <Text type='secondary'>Not assigned</Text>
        ),
    },
    {
      title: 'Route',
      key: 'route',
      render: (_: any, record: Trip) => (
        <div style={{ maxWidth: 200 }}>
          <div style={{ fontSize: '12px', marginBottom: 4 }}>
            <EnvironmentOutlined style={{ color: '#52c41a' }} />
            <Text ellipsis style={{ marginLeft: 4 }}>
              {record.pickup.address}
            </Text>
          </div>
          <div style={{ fontSize: '12px' }}>
            <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
            <Text ellipsis style={{ marginLeft: 4 }}>
              {record.destination.address}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select status'
            allowClear
          >
            <Option value='searching'>Searching</Option>
            <Option value='driver_assigned'>Driver Assigned</Option>
            <Option value='driver_arrived'>Driver Arrived</Option>
            <Option value='in_progress'>In Progress</Option>
            <Option value='completed'>Completed</Option>
            <Option value='cancelled'>Cancelled</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_: any, record: Trip) => (
        <Space direction='vertical' size='small'>
          <div>
            <DollarOutlined />
            <Text style={{ marginLeft: 4 }}>
              ₦{record.pricing.finalAmount.toLocaleString()}
            </Text>
          </div>
          <div>
            <Tag
              color={
                record.paymentMethod === 'cash'
                  ? 'orange'
                  : record.paymentMethod === 'card'
                  ? 'blue'
                  : 'green'
              }
            >
              {record.paymentMethod.toUpperCase()}
            </Tag>
          </div>
          {record.paymentStatus && (
            <div>
              <Badge
                status={
                  record.paymentStatus === 'completed'
                    ? 'success'
                    : record.paymentStatus === 'failed'
                    ? 'error'
                    : 'processing'
                }
                text={record.paymentStatus}
              />
            </div>
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, record: Trip) => {
        if (record.completedAt && record.startedAt) {
          const duration =
            new Date(record.completedAt).getTime() -
            new Date(record.startedAt).getTime();
          const minutes = Math.floor(duration / (1000 * 60));
          return (
            <Space>
              <ClockCircleOutlined />
              <Text>{minutes} min</Text>
            </Space>
          );
        }
        if (record.startedAt) {
          const duration =
            new Date().getTime() - new Date(record.startedAt).getTime();
          const minutes = Math.floor(duration / (1000 * 60));
          return (
            <Space>
              <ClockCircleOutlined />
              <Text>{minutes} min (ongoing)</Text>
            </Space>
          );
        }
        return <Text type='secondary'>-</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_: any, record: Trip) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title='View Timeline'>
            <Button
              icon={<ClockCircleOutlined />}
              size='small'
              onClick={() => handleViewTimeline(record)}
            />
          </Tooltip>
          {/* Edit/Delete disabled intentionally for trips */}
        </Space>
      ),
    },
  ];

  const getStatusCounts = () => {
    const data = tableProps.dataSource || [];
    return {
      total: data.length,
      searching: data.filter((t: Trip) => t.status === 'searching').length,
      active: data.filter((t: Trip) =>
        ['driver_assigned', 'driver_arrived', 'in_progress'].includes(t.status)
      ).length,
      completed: data.filter((t: Trip) => t.status === 'completed').length,
      cancelled: data.filter((t: Trip) => t.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Trip Management</Title>
            <Text type='secondary'>
              Monitor all trips, track real-time status, and manage operations
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
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Total Trips'
                value={statusCounts.total}
                prefix={<EnvironmentOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Searching'
                value={statusCounts.searching}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Active'
                value={statusCounts.active}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Completed'
                value={statusCounts.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Cancelled'
                value={statusCounts.cancelled}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size='small'>
              <Statistic
                title='Revenue Today'
                value={(tableProps.dataSource || [])
                  .filter((t: Trip) => t.status === 'completed')
                  .reduce(
                    (sum: number, t: Trip) => sum + t.pricing.finalAmount,
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
                placeholder='Search by trip number, customer, or driver'
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

        {/* Trips Table */}
        <Table
          {...tableProps}
          columns={columns}
          rowKey='id'
          scroll={{ x: 1400 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} trips`,
          }}
        />
      </List>

      {/* Trip Details Modal */}
      <Modal
        title={`Trip Details - ${selectedTrip?.tripNumber}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={900}
        footer={[
          <Button key='close' onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          selectedTrip && (
            <Button
              key='timeline'
              type='primary'
              onClick={() => {
                setDetailsModalVisible(false);
                handleViewTimeline(selectedTrip);
              }}
            >
              View Timeline
            </Button>
          ),
        ]}
      >
        {selectedTrip && (
          <div>
            {/* Trip Progress */}
            <Card size='small' style={{ marginBottom: 16 }}>
              <Steps
                current={getTripStepStatus(selectedTrip)}
                status={
                  selectedTrip.status === 'cancelled' ? 'error' : 'process'
                }
                size='small'
              >
                <Step title='Searching' icon={<ExclamationCircleOutlined />} />
                <Step title='Driver Assigned' icon={<CarOutlined />} />
                <Step title='Driver Arrived' icon={<EnvironmentOutlined />} />
                <Step title='In Progress' icon={<PlayCircleOutlined />} />
                <Step title='Completed' icon={<CheckCircleOutlined />} />
              </Steps>
            </Card>

            <Row gutter={16}>
              <Col span={12}>
                <Card size='small' title='Customer Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Name'>
                      {selectedTrip?.customer?.firstname}{' '}
                      {selectedTrip?.customer?.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {selectedTrip?.customer?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                      {selectedTrip?.customer?.phone?.fullPhone}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size='small' title='Driver Information'>
                  {selectedTrip.driver ? (
                    <Descriptions column={1} size='small'>
                      <Descriptions.Item label='Name'>
                        {selectedTrip.driver.firstname}{' '}
                        {selectedTrip.driver.lastname}
                      </Descriptions.Item>
                      <Descriptions.Item label='Email'>
                        {selectedTrip.driver.email}
                      </Descriptions.Item>
                      <Descriptions.Item label='Phone'>
                        {selectedTrip.driver.phone.fullPhone}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Text type='secondary'>No driver assigned</Text>
                  )}
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card size='small' title='Route Information'>
                  <Space direction='vertical' style={{ width: '100%' }}>
                    <div>
                      <EnvironmentOutlined style={{ color: '#52c41a' }} />
                      <Text strong style={{ marginLeft: 8 }}>
                        Pickup:
                      </Text>
                      <div style={{ marginLeft: 24 }}>
                        <Text>{selectedTrip.pickup.address}</Text>
                      </div>
                    </div>
                    <div>
                      <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
                      <Text strong style={{ marginLeft: 8 }}>
                        Destination:
                      </Text>
                      <div style={{ marginLeft: 24 }}>
                        <Text>{selectedTrip.destination.address}</Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card size='small' title='Payment Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Total Amount'>
                      ₦{selectedTrip.pricing.finalAmount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Payment Method'>
                      <Tag
                        color={
                          selectedTrip.paymentMethod === 'cash'
                            ? 'orange'
                            : selectedTrip.paymentMethod === 'card'
                            ? 'blue'
                            : 'green'
                        }
                      >
                        {selectedTrip.paymentMethod.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    {selectedTrip.paymentStatus && (
                      <Descriptions.Item label='Payment Status'>
                        <Badge
                          status={
                            selectedTrip.paymentStatus === 'completed'
                              ? 'success'
                              : selectedTrip.paymentStatus === 'failed'
                              ? 'error'
                              : 'processing'
                          }
                          text={selectedTrip.paymentStatus}
                        />
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label='Surge Multiplier'>
                      ×{selectedTrip.pricing.surgeMultiplier.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label='Base Amount'>
                      ₦{selectedTrip.pricing.baseAmount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Final Amount'>
                      ₦{selectedTrip.pricing.finalAmount.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>

                  {/* Detailed Breakdown */}
                  <Card
                    size='small'
                    style={{ marginTop: 12 }}
                    title='Fare Breakdown'
                  >
                    <Descriptions column={1} size='small'>
                      <Descriptions.Item label='Base Fare'>
                        ₦
                        {selectedTrip.pricing.breakdown.baseFare.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label='Distance Charge'>
                        ₦
                        {selectedTrip.pricing.breakdown.distanceCharge.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label='Time Charge'>
                        ₦
                        {selectedTrip.pricing.breakdown.timeCharge.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label='Surge Fee'>
                        ₦
                        {selectedTrip.pricing.breakdown.surgeFee.toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label='Discount'>
                        ₦
                        {selectedTrip.pricing.breakdown.discount.toLocaleString()}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Timeline Modal */}
      <Modal
        title={`Trip Timeline - ${selectedTrip?.tripNumber}`}
        open={timelineModalVisible}
        onCancel={() => setTimelineModalVisible(false)}
        width={600}
        footer={[
          <Button key='close' onClick={() => setTimelineModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedTrip && (
          <Timeline>
            <Timeline.Item color='blue'>
              <Text strong>Trip Requested</Text>
              <div>
                <Text type='secondary'>
                  {new Date(selectedTrip.requestedAt).toLocaleString()}
                </Text>
              </div>
            </Timeline.Item>

            {selectedTrip.timeline?.map((event, index) => (
              <Timeline.Item
                key={index}
                color={
                  event.event.includes('cancelled')
                    ? 'red'
                    : event.event.includes('completed')
                    ? 'green'
                    : event.event.includes('started')
                    ? 'blue'
                    : 'orange'
                }
              >
                <Text strong>
                  {event.event.replace(/_/g, ' ').toUpperCase()}
                </Text>
                <div>
                  <Text type='secondary'>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                </div>
                {event.metadata && (
                  <div style={{ marginTop: 4 }}>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      {JSON.stringify(event.metadata)}
                    </Text>
                  </div>
                )}
              </Timeline.Item>
            ))}

            {selectedTrip.startedAt && (
              <Timeline.Item color='green'>
                <Text strong>Trip Started</Text>
                <div>
                  <Text type='secondary'>
                    {new Date(selectedTrip.startedAt).toLocaleString()}
                  </Text>
                </div>
              </Timeline.Item>
            )}

            {selectedTrip.completedAt && (
              <Timeline.Item color='green'>
                <Text strong>Trip Completed</Text>
                <div>
                  <Text type='secondary'>
                    {new Date(selectedTrip.completedAt).toLocaleString()}
                  </Text>
                </div>
              </Timeline.Item>
            )}

            {selectedTrip.cancelledAt && (
              <Timeline.Item color='red'>
                <Text strong>Trip Cancelled</Text>
                <div>
                  <Text type='secondary'>
                    {new Date(selectedTrip.cancelledAt).toLocaleString()}
                  </Text>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        )}
      </Modal>
    </>
  );
};
