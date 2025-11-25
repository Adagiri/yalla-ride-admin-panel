import React, { useState, useEffect } from 'react';
import { useCustom } from '@refinedev/core';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Avatar,
  Badge,
  Progress,
  Tabs,
  Select,
  DatePicker,
  Alert,
  Spin,
  Modal,
  Timeline,
} from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  CheckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ReloadOutlined,
  TrophyOutlined,
  WalletOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface DashboardMetrics {
  overview: {
    totalDrivers: number;
    activeDrivers: number;
    totalCustomers: number;
    activeCustomers: number;
    totalTrips: number;
    completedTrips: number;
    totalRevenue: number;
    platformCommission: number;
  };
  todayStats: {
    tripsToday: number;
    revenueToday: number;
    newDriversToday: number;
    newCustomersToday: number;
    activeDriversToday: number;
  };
  trends: {
    tripsGrowth: number;
    revenueGrowth: number;
    driversGrowth: number;
    customersGrowth: number;
  };
  tripsByStatus: {
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [activityModal, setActivityModal] = useState(false);

  // Fetch dashboard metrics from backend
  const {
    data: metricsData,
    isLoading,
    refetch,
  } = useCustom<DashboardMetrics>({
    url: 'dashboard-metrics',
    method: 'get',
  });

  const metrics = metricsData?.data;

  const refreshData = async () => {
    setLoading(true);
    await refetch();
    setLoading(false);
  };

  // Render trend indicator
  const renderTrendIndicator = (value: number) => {
    const isPositive = value > 0;
    return (
      <Space>
        {isPositive ? (
          <ArrowUpOutlined style={{ color: '#52c41a' }} />
        ) : (
          <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
        )}
        <Text style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
          {Math.abs(value).toFixed(1)}%
        </Text>
      </Space>
    );
  };

  // Overview Statistics Cards
  const OverviewCards = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title='Total Drivers'
            value={metrics?.overview.totalDrivers || 0}
            prefix={<CarOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
            suffix={
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {renderTrendIndicator(metrics?.trends.driversGrowth || 0)}
              </div>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Text type='secondary'>
              Active: {metrics?.overview.activeDrivers || 0}
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title='Total Customers'
            value={metrics?.overview.totalCustomers || 0}
            prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
            suffix={
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {renderTrendIndicator(metrics?.trends.customersGrowth || 0)}
              </div>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Text type='secondary'>
              Active: {metrics?.overview.activeCustomers || 0}
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title='Total Revenue'
            value={metrics?.overview.totalRevenue || 0}
            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
            precision={0}
            formatter={(value) => `₦${value?.toLocaleString()}`}
            suffix={
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {renderTrendIndicator(metrics?.trends.revenueGrowth || 0)}
              </div>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Text type='secondary'>
              Commission: ₦
              {(metrics?.overview.platformCommission || 0).toLocaleString()}
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title='Total Trips'
            value={metrics?.overview.totalTrips || 0}
            prefix={<CheckOutlined style={{ color: '#722ed1' }} />}
            valueStyle={{ color: '#722ed1' }}
            suffix={
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {renderTrendIndicator(metrics?.trends.tripsGrowth || 0)}
              </div>
            }
          />
          <div style={{ marginTop: 8 }}>
            <Text type='secondary'>
              Completed: {metrics?.overview.completedTrips || 0}
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );

  // Today's Statistics
  const TodayStats = () => (
    <Card
      title="Today's Performance"
      style={{ marginBottom: 24 }}
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshData}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={8}>
          <Card size='small'>
            <Statistic
              title='Trips Today'
              value={metrics?.todayStats.tripsToday || 0}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size='small'>
            <Statistic
              title='Revenue Today'
              value={metrics?.todayStats.revenueToday || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size='small'>
            <Statistic
              title='Active Drivers'
              value={metrics?.todayStats.activeDriversToday || 0}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card size='small'>
            <Statistic
              title='New Drivers'
              value={metrics?.todayStats.newDriversToday || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size='small'>
            <Statistic
              title='New Customers'
              value={metrics?.todayStats.newCustomersToday || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  // Trip Status Breakdown
  const TripStatusBreakdown = () => {
    const statusData = [
      {
        status: 'Completed',
        count: metrics?.tripsByStatus.completed || 0,
        color: '#52c41a',
      },
      {
        status: 'Active',
        count: metrics?.tripsByStatus.active || 0,
        color: '#1890ff',
      },
      {
        status: 'Pending',
        count: metrics?.tripsByStatus.pending || 0,
        color: '#faad14',
      },
      {
        status: 'Cancelled',
        count: metrics?.tripsByStatus.cancelled || 0,
        color: '#ff4d4f',
      },
    ];

    const total = statusData.reduce((sum, item) => sum + item.count, 0);

    return (
      <Card title='Trip Status Breakdown' style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {statusData.map((item) => (
            <Col span={6} key={item.status}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: item.color }}>
                    {item.count}
                  </Text>
                </div>
                <Progress
                  percent={total > 0 ? (item.count / total) * 100 : 0}
                  strokeColor={item.color}
                  showInfo={false}
                />
                <div style={{ marginTop: 4 }}>
                  <Text type='secondary'>{item.status}</Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  // Recent Activity
  const RecentActivity = () => (
    <Card
      title='Recent Activity'
      extra={
        <Button
          type='link'
          onClick={() => setActivityModal(true)}
          icon={<EyeOutlined />}
        >
          View All
        </Button>
      }
    >
      <Timeline>
        {metrics?.recentActivity.slice(0, 5).map((activity, index) => (
          <Timeline.Item key={index}>
            <div>
              <Text strong>{activity.description}</Text>
              {activity.amount && (
                <div>
                  <Text type='secondary'>
                    Amount: ₦{activity.amount.toLocaleString()}
                  </Text>
                </div>
              )}
              <div>
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );

  // System Health Indicators
  const SystemHealth = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={8}>
        <Card size='small'>
          <Badge status='success' />
          <Text>API Status: Online</Text>
        </Card>
      </Col>
      <Col span={8}>
        <Card size='small'>
          <Badge status='success' />
          <Text>Database: Healthy</Text>
        </Card>
      </Col>
      <Col span={8}>
        <Card size='small'>
          <Badge status='processing' />
          <Text>Payment Gateway: Active</Text>
        </Card>
      </Col>
    </Row>
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size='large' />
        <div style={{ marginTop: 16 }}>
          <Text>Loading dashboard...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <DashboardOutlined /> Dashboard Overview
        </Title>
        <Text type='secondary'>
          Real-time insights into your ride-sharing platform
        </Text>
      </div>

      {/* System Health */}
      <SystemHealth />

      {/* Overview Cards */}
      <OverviewCards />

      <Row gutter={16}>
        <Col span={16}>
          {/* Today's Stats */}
          <TodayStats />

          {/* Trip Status Breakdown */}
          <TripStatusBreakdown />
        </Col>
        <Col span={8}>
          {/* Recent Activity */}
          <RecentActivity />
        </Col>
      </Row>

      {/* Activity Modal */}
      <Modal
        title='All Recent Activity'
        open={activityModal}
        onCancel={() => setActivityModal(false)}
        footer={null}
        width={800}
      >
        <Timeline>
          {metrics?.recentActivity.map((activity, index) => (
            <Timeline.Item key={index}>
              <div>
                <Text strong>{activity.description}</Text>
                <div>
                  <Badge
                    color={
                      activity.type === 'trip'
                        ? 'blue'
                        : activity.type === 'payment'
                        ? 'green'
                        : activity.type === 'driver'
                        ? 'orange'
                        : 'purple'
                    }
                    text={
                      activity.type.charAt(0).toUpperCase() +
                      activity.type.slice(1)
                    }
                  />
                </div>
                {activity.amount && (
                  <div>
                    <Text type='secondary'>
                      Amount: ₦{activity.amount.toLocaleString()}
                    </Text>
                  </div>
                )}
                <div>
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </Text>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>
    </div>
  );
};
