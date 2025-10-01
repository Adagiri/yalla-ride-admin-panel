import React, { useState, useEffect } from 'react';
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
  Select,
  Statistic,
  Modal,
  Badge,
  Descriptions,
  Timeline,
  Avatar,
  message,
  Spin,
} from 'antd';
import {
  CustomerServiceOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { client } from '../../App';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userType: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  messages: {
    senderId: string;
    senderType: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

const GET_TICKETS_QUERY = `
  query GetAllTickets($filters: TicketFilters) {
    getAllTickets(filters: $filters) {
      tickets {
        id
        ticketNumber
        userId
        userType
        subject
        description
        category
        priority
        status
        assignedTo
        messages {
          senderId
          senderType
          message
          createdAt
        }
        createdAt
        updatedAt
      }
      total
      page
      totalPages
    }
  }
`;

const GET_STATS_QUERY = `
  query GetTicketStats {
    getTicketStats {
      total
      open
      inProgress
      resolved
      closed
    }
  }
`;

const UPDATE_TICKET_MUTATION = `
  mutation UpdateTicket($input: UpdateTicketInput!) {
    updateTicket(input: $input) {
      id
      status
      assignedTo
    }
  }
`;

const ADD_MESSAGE_MUTATION = `
  mutation AddMessage($input: AddMessageInput!) {
    addMessage(input: $input) {
      id
      messages {
        senderId
        senderType
        message
        createdAt
      }
    }
  }
`;

export const SupportList: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({ page: 1, limit: 20 });
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const result = await client
        .query(GET_TICKETS_QUERY, { filters })
        .toPromise();

      if (result.data?.getAllTickets) {
        setTickets(result.data.getAllTickets.tickets || []);
        setTotal(result.data.getAllTickets.total || 0);
      }
    } catch (error) {
      message.error('Failed to fetch tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await client.query(GET_STATS_QUERY, {}).toPromise();

      if (result.data?.getTicketStats) {
        setStats(result.data.getTicketStats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filters]);

  const handleViewDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDetailsModal(true);
    setReplyMessage('');
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      const result = await client
        .mutation(UPDATE_TICKET_MUTATION, {
          input: {
            ticketId: selectedTicket.id,
            status,
          },
        })
        .toPromise();

      if (result.data) {
        message.success('Ticket status updated');
        await fetchTickets();
        await fetchStats();
        setDetailsModal(false);
      }
    } catch (error) {
      message.error('Failed to update ticket');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!selectedTicket) return;

    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      message.error('Admin ID not found');
      return;
    }

    setUpdating(true);
    try {
      const result = await client
        .mutation(UPDATE_TICKET_MUTATION, {
          input: {
            ticketId: selectedTicket.id,
            assignedTo: adminId,
          },
        })
        .toPromise();

      if (result.data) {
        message.success('Ticket assigned to you');
        await fetchTickets();
        setDetailsModal(false);
      }
    } catch (error) {
      message.error('Failed to assign ticket');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      message.warning('Please enter a message');
      return;
    }

    setUpdating(true);
    try {
      const result = await client
        .mutation(ADD_MESSAGE_MUTATION, {
          input: {
            ticketId: selectedTicket.id,
            message: replyMessage,
          },
        })
        .toPromise();

      if (result.data) {
        message.success('Reply sent');
        setReplyMessage('');
        await fetchTickets();

        // Refresh selected ticket
        const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error) {
      message.error('Failed to send reply');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      LOW: 'blue',
      MEDIUM: 'orange',
      HIGH: 'red',
      URGENT: 'magenta',
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      OPEN: 'red',
      IN_PROGRESS: 'orange',
      RESOLVED: 'green',
      CLOSED: 'default',
    };
    return colors[status] || 'default';
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      PAYMENT: 'gold',
      TRIP: 'cyan',
      ACCOUNT: 'purple',
      TECHNICAL: 'blue',
      OTHER: 'default',
    };
    return colors[category] || 'default';
  };

  const columns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 140,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'DRIVER' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Messages',
      dataIndex: 'messages',
      key: 'messages',
      width: 100,
      align: 'center' as const,
      render: (messages: any[]) => (
        <Badge count={messages?.length || 0}>
          <MessageOutlined />
        </Badge>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: SupportTicket) => (
        <Space>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Support Tickets</Title>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size='small'>
            <Statistic
              title='Total Tickets'
              value={stats.total}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size='small'>
            <Statistic
              title='Open'
              value={stats.open}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size='small'>
            <Statistic
              title='In Progress'
              value={stats.inProgress}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size='small'>
            <Statistic
              title='Resolved'
              value={stats.resolved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card size='small'>
            <Statistic
              title='Closed'
              value={stats.closed}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Form layout='inline'>
          <Form.Item>
            <Input
              placeholder='Search tickets...'
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder='Status'
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value='OPEN'>Open</Option>
              <Option value='IN_PROGRESS'>In Progress</Option>
              <Option value='RESOLVED'>Resolved</Option>
              <Option value='CLOSED'>Closed</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder='Category'
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, category: value })}
            >
              <Option value='PAYMENT'>Payment</Option>
              <Option value='TRIP'>Trip</Option>
              <Option value='ACCOUNT'>Account</Option>
              <Option value='TECHNICAL'>Technical</Option>
              <Option value='OTHER'>Other</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              placeholder='User Type'
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilters({ ...filters, userType: value })}
            >
              <Option value='CUSTOMER'>Customer</Option>
              <Option value='DRIVER'>Driver</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchTickets();
                fetchStats();
              }}
            >
              Refresh
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Tickets Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={tickets}
            rowKey='id'
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              total,
              current: filters.page,
              pageSize: filters.limit,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} tickets`,
              onChange: (page, pageSize) =>
                setFilters({ ...filters, page, limit: pageSize }),
            }}
          />
        </Spin>
      </Card>

      {/* Ticket Details Modal */}
      <Modal
        title={`Ticket: ${selectedTicket?.ticketNumber}`}
        open={detailsModal}
        onCancel={() => setDetailsModal(false)}
        width={900}
        footer={null}
      >
        {selectedTicket && (
          <div>
            {/* Ticket Info */}
            <Card size='small' style={{ marginBottom: 16 }}>
              <Descriptions column={2} size='small'>
                <Descriptions.Item label='Status'>
                  <Tag color={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Priority'>
                  <Tag color={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Category'>
                  <Tag color={getCategoryColor(selectedTicket.category)}>
                    {selectedTicket.category}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='User Type'>
                  <Tag
                    color={
                      selectedTicket.userType === 'DRIVER' ? 'blue' : 'green'
                    }
                  >
                    {selectedTicket.userType}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Created'>
                  {new Date(selectedTicket.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='Last Updated'>
                  {new Date(selectedTicket.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Subject & Description */}
            <Card size='small' title='Subject' style={{ marginBottom: 16 }}>
              <Text strong>{selectedTicket.subject}</Text>
            </Card>

            <Card size='small' title='Description' style={{ marginBottom: 16 }}>
              <Text>{selectedTicket.description}</Text>
            </Card>

            {/* Message Thread */}
            <Card size='small' title='Messages' style={{ marginBottom: 16 }}>
              <Timeline>
                {selectedTicket.messages.map((msg, idx) => (
                  <Timeline.Item
                    key={idx}
                    color={msg.senderType === 'ADMIN' ? 'green' : 'blue'}
                  >
                    <div>
                      <Space>
                        <Avatar
                          icon={<UserOutlined />}
                          size='small'
                          style={{
                            backgroundColor:
                              msg.senderType === 'ADMIN'
                                ? '#52c41a'
                                : '#1890ff',
                          }}
                        />
                        <Tag>{msg.senderType}</Tag>
                        <Text type='secondary' style={{ fontSize: 12 }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </Text>
                      </Space>
                      <div style={{ marginTop: 8, marginLeft: 32 }}>
                        <Text>{msg.message}</Text>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* Reply */}
            {selectedTicket.status !== 'CLOSED' && (
              <Card size='small' title='Reply' style={{ marginBottom: 16 }}>
                <TextArea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder='Type your reply...'
                  style={{ marginBottom: 12 }}
                />
                <Button
                  type='primary'
                  icon={<MessageOutlined />}
                  onClick={handleSendReply}
                  loading={updating}
                  disabled={!replyMessage.trim()}
                >
                  Send Reply
                </Button>
              </Card>
            )}

            {/* Actions */}
            <Card size='small' title='Actions'>
              <Space>
                {!selectedTicket.assignedTo && (
                  <Button onClick={handleAssignToMe} loading={updating}>
                    Assign to Me
                  </Button>
                )}
                {selectedTicket.status === 'OPEN' && (
                  <Button
                    type='primary'
                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                    loading={updating}
                  >
                    Start Progress
                  </Button>
                )}
                {selectedTicket.status === 'IN_PROGRESS' && (
                  <Button
                    type='primary'
                    onClick={() => handleUpdateStatus('RESOLVED')}
                    loading={updating}
                  >
                    Mark Resolved
                  </Button>
                )}
                {selectedTicket.status === 'RESOLVED' && (
                  <Button
                    onClick={() => handleUpdateStatus('CLOSED')}
                    loading={updating}
                  >
                    Close Ticket
                  </Button>
                )}
                {selectedTicket.status !== 'OPEN' &&
                  selectedTicket.status !== 'CLOSED' && (
                    <Button
                      danger
                      onClick={() => handleUpdateStatus('OPEN')}
                      loading={updating}
                    >
                      Reopen
                    </Button>
                  )}
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export { SupportList as SupportTicketList };
