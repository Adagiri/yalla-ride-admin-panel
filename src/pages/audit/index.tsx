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
import { gql } from 'urql';

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

interface TopAction {
  action: string;
  count: number;
}

interface TopAdmin {
  adminEmail: string;
  // count: number;
}

interface AuditStats {
  topActions: TopAction[];
  topAdmins: TopAdmin[];
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

// Fixed GraphQL Queries
const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($filters: AuditLogFiltersInput) {
    getAuditLogs(filters: $filters) {
      logs {
        id
        adminId
        adminEmail
        adminRole
        action
        resource
        resourceId
        success
        timestamp
        ipAddress
        userAgent
        errorMessage
        metadata
      }
      total
      page
      totalPages
    }
  }
`;

const GET_AUDIT_STATS = gql`
  query GetAuditStats($days: Int) {
    getAuditStats(days: $days) {
      topActions {
        action
        count
      }
      topAdmins {
        adminEmail
        count
      }
    }
  }
`;

export const AuditLogs: React.FC = () => {
  const [filters, setFilters] = useState<any>({});

  // Fetch audit logs
  const {
    data: logsData,
    isLoading,
    refetch,
  } = useCustom<AuditLogsResponse>({
    url: 'audit-logs',
    method: 'get',
    config: {
      query: filters,
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
  const total = logsData?.data?.total || 0;
  const stats = statsData?.data;

  // Calculate derived statistics from logs data
  const calculateStats = () => {
    if (!logs.length) {
      return {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        successRate: 0,
      };
    }

    const totalActions = logs.length;
    const successfulActions = logs.filter((log) => log.success).length;
    const failedActions = totalActions - successfulActions;
    const successRate =
      totalActions > 0 ? (successfulActions / totalActions) * 100 : 0;

    return {
      totalActions,
      successfulActions,
      failedActions,
      successRate,
    };
  };

  const calculatedStats = calculateStats();

  const handleSearch = (values: any) => {
    const searchFilters: any = {};

    if (values.adminEmail) {
      searchFilters.adminEmail = values.adminEmail;
    }
    if (values.action) {
      searchFilters.action = values.action;
    }
    if (values.resource) {
      searchFilters.resource = values.resource;
    }
    if (values.dateRange && values.dateRange.length === 2) {
      searchFilters.startDate = values.dateRange[0].toISOString();
      searchFilters.endDate = values.dateRange[1].toISOString();
    }

    setFilters(searchFilters);
  };

  const clearFilters = () => {
    setFilters({});
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
      width: 150,
    },
    {
      title: 'Admin',
      key: 'admin',
      render: (_: any, record: AuditLog) => (
        <Space direction='vertical' size='small'>
          <Text strong>{record.adminEmail}</Text>
          {record.adminRole && <Tag>{record.adminRole}</Tag>}
        </Space>
      ),
      width: 200,
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
      width: 180,
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
      width: 100,
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
      width: 150,
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
              Error: {record.errorMessage.substring(0, 50)}...
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
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size='small'>
            <Statistic
              title='Total Actions'
              value={calculatedStats.totalActions}
              prefix={<AuditOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size='small'>
            <Statistic
              title='Successful'
              value={calculatedStats.successfulActions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size='small'>
            <Statistic
              title='Failed'
              value={calculatedStats.failedActions}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size='small'>
            <Statistic
              title='Success Rate'
              value={calculatedStats.successRate.toFixed(1)}
              suffix='%'
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

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
            <Button icon={<FilterOutlined />} onClick={clearFilters}>
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
          scroll={{ x: 1000 }}
          pagination={{
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} logs`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      {/* Top Activities */}
      {stats && (
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card title='Top Actions' size='small'>
              {stats.topActions && stats.topActions.length > 0 ? (
                stats.topActions.map((action, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      padding: '4px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Text>{action.action.replace(/_/g, ' ')}</Text>
                    <Tag color='blue'>{action.count}</Tag>
                  </div>
                ))
              ) : (
                <Text type='secondary'>No data available</Text>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title='Most Active Admins' size='small'>
              {stats.topAdmins && stats.topAdmins.length > 0 ? (
                stats.topAdmins.map((admin, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      padding: '4px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Text>{admin.adminEmail}</Text>
                    {/* <Tag color='green'>{admin.count}</Tag> */}
                  </div>
                ))
              ) : (
                <Text type='secondary'>No data available</Text>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* Show message if no logs */}
      {!isLoading && logs.length === 0 && (
        <Alert
          message='No audit logs found'
          description='No audit logs match your current filters. Try adjusting your search criteria.'
          type='info'
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};
