import React, { useState } from 'react';
import { useCustom } from '@refinedev/core';
import {
  Table,
  Space,
  Tag,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Input,
  Form,
  DatePicker,
  Select,
  Statistic,
  Timeline,
  Alert,
  Badge,
} from 'antd';
import {
  AuditOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface AuditLog {
  id: string;
  adminId?: string;
  adminEmail: string;
  adminRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  success: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
  metadata?: any;
}

interface AuditStats {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  topActions: Array<{ action: string; count: number }>;
  topAdmins: Array<{ adminEmail: string; count: number }>;
  activityByDay: Array<{ date: string; count: number }>;
}

export const AuditLogs: React.FC = () => {
  const [filters, setFilters] = useState<any>({});

  // Fetch audit logs
  const {
    data: logsData,
    isLoading,
    refetch,
  } = useCustom<{ logs: AuditLog[]; total: number }>({
    url: 'audit-logs',
    method: 'get',
    config: {
      query: {
        filters,
      },
    },
  });

  // Fetch audit stats
  const { data: statsData } = useCustom<AuditStats>({
    url: 'audit-stats',
    method: 'get',
    config: {
      query: {
        days: 30,
      },
    },
  });

  const logs = logsData?.data?.logs || [];
  const stats = statsData?.data;

  const handleSearch = (values: any) => {
    setFilters(values);
    refetch();
  };

  const getActionColor = (action: string) => {
    if (action.includes('login') || action.includes('create')) return 'green';
    if (action.includes('delete') || action.includes('deactivate'))
      return 'red';
    if (action.includes('update') || action.includes('edit')) return 'blue';
    if (action.includes('failed')) return 'red';
    return 'default';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: string) => (
        <div>
          <div>{new Date(date).toLocaleDateString()}</div>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            {new Date(date).toLocaleTimeString()}
          </Text>
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Admin',
      key: 'admin',
      render: (_: any, record: AuditLog) => (
        <Space direction='vertical' size='small'>
          <Text strong>{record.adminEmail}</Text>
          {record.adminRole && <Tag >{record.adminRole}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string, record: AuditLog) => (
        <Space direction='vertical' size='small'>
          <Tag color={getActionColor(action)}>
            {action.replace(/_/g, ' ').toUpperCase()}
          </Tag>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            on {record.resource}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'success',
      key: 'success',
      render: (success: boolean) => (
        <Badge
          status={success ? 'success' : 'error'}
          text={success ? 'Success' : 'Failed'}
        />
      ),
    },
    {
      title: 'Resource',
      key: 'resource',
      render: (_: any, record: AuditLog) => (
        <Space direction='vertical' size='small'>
          <Text>{record.resource}</Text>
          {record.resourceId && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              ID: {record.resourceId}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_: any, record: AuditLog) => (
        <Space direction='vertical' size='small'>
          {record.ipAddress && (
            <Text style={{ fontSize: '12px' }}>IP: {record.ipAddress}</Text>
          )}
          {record.errorMessage && (
            <Text type='danger' style={{ fontSize: '12px' }}>
              Error: {record.errorMessage}
            </Text>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <AuditOutlined /> Audit Logs
        </Title>
        <Text type='secondary'>
          Track all administrative actions and system events
        </Text>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Total Actions'
                value={stats.totalActions}
                prefix={<AuditOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Successful'
                value={stats.successfulActions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Failed'
                value={stats.failedActions}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Success Rate'
                value={
                  stats.totalActions > 0
                    ? (
                        (stats.successfulActions / stats.totalActions) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix='%'
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Form layout='inline' onFinish={handleSearch}>
          <Form.Item name='adminEmail'>
            <Input
              placeholder='Search by admin email'
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          </Form.Item>
          <Form.Item name='action'>
            <Select
              placeholder='Select action'
              style={{ width: 150 }}
              allowClear
            >
              <Option value='login'>Login</Option>
              <Option value='create'>Create</Option>
              <Option value='update'>Update</Option>
              <Option value='delete'>Delete</Option>
              <Option value='activate'>Activate</Option>
              <Option value='deactivate'>Deactivate</Option>
            </Select>
          </Form.Item>
          <Form.Item name='resource'>
            <Select
              placeholder='Select resource'
              style={{ width: 150 }}
              allowClear
            >
              <Option value='admin'>Admin</Option>
              <Option value='driver'>Driver</Option>
              <Option value='customer'>Customer</Option>
              <Option value='trip'>Trip</Option>
              <Option value='payment'>Payment</Option>
            </Select>
          </Form.Item>
          <Form.Item name='dateRange'>
            <RangePicker style={{ width: 250 }} />
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
                setFilters({});
                refetch();
              }}
            >
              Clear
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Title level={4}>Audit Trail</Title>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        </div>

        <Table
          dataSource={logs}
          columns={columns}
          rowKey='id'
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} logs`,
          }}
        />
      </Card>

      {/* Top Activities */}
      {stats && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card title='Top Actions'>
              {stats.topActions.map((action, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Text>{action.action.replace(/_/g, ' ')}</Text>
                  <Text strong>{action.count}</Text>
                </div>
              ))}
            </Card>
          </Col>
          <Col span={12}>
            <Card title='Most Active Admins'>
              {stats.topAdmins.map((admin, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Text>{admin.adminEmail}</Text>
                  <Text strong>{admin.count}</Text>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};
