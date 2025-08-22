// Notification List Component
import React, { useState } from 'react';
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
  useTable,
  FilterDropdown,
  getDefaultSortOrder,
  Title,
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
  message,
  Tooltip,
  Alert,
  Upload,
  DatePicker,
  Tabs,
} from 'antd';
import {
  CarFilled,
  CarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  SafetyOutlined,
  ToolOutlined,
  BellOutlined,
  SendOutlined,
  NotificationOutlined,
  MessageOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Option } from 'antd/es/mentions';

export const NotificationList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable({
    resource: 'notifications',
    initialSorter: [
      {
        field: 'createdAt',
        order: 'desc',
      },
    ],
  });

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag
          color={
            type === 'info'
              ? 'blue'
              : type === 'warning'
              ? 'orange'
              : type === 'error'
              ? 'red'
              : 'green'
          }
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (recipients: string[]) => (
        <Text>{recipients.length} recipients</Text>
      ),
    },
    {
      title: 'Sent',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={
            status === 'sent'
              ? 'success'
              : status === 'failed'
              ? 'error'
              : 'processing'
          }
          text={status.toUpperCase()}
        />
      ),
    },
  ];

  return (
    <List
      breadcrumb={false}
      title={
        <div>
          <Title level={3}>Notification Management</Title>
          <Text type='secondary'>
            Send notifications and manage communication with users
          </Text>
        </div>
      }
    >
      <Table
        {...tableProps}
        columns={columns}
        rowKey='id'
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </List>
  );
};

// Create Notification Component
export const NotificationCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      // Call your create notification mutation here
      message.success('Notification sent successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Send Notification</Title>
      <Text type='secondary'>
        Create and send notifications to drivers, customers, or all users
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='type'
                label='Notification Type'
                rules={[{ required: true }]}
              >
                <Select placeholder='Select notification type'>
                  <Option value='info'>Information</Option>
                  <Option value='warning'>Warning</Option>
                  <Option value='error'>Error/Alert</Option>
                  <Option value='success'>Success</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='audience'
                label='Send To'
                rules={[{ required: true }]}
              >
                <Select placeholder='Select audience'>
                  <Option value='all'>All Users</Option>
                  <Option value='drivers'>All Drivers</Option>
                  <Option value='customers'>All Customers</Option>
                  <Option value='active_drivers'>Active Drivers Only</Option>
                  <Option value='specific'>Specific Users</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='title' label='Title' rules={[{ required: true }]}>
            <Input placeholder='Enter notification title' />
          </Form.Item>

          <Form.Item
            name='message'
            label='Message'
            rules={[{ required: true }]}
          >
            <TextArea
              rows={6}
              placeholder='Enter your message here...'
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item name='channels' label='Channels'>
            <Select mode='multiple' placeholder='Select delivery channels'>
              <Option value='push'>Push Notification</Option>
              <Option value='email'>Email</Option>
              <Option value='sms'>SMS</Option>
              <Option value='in_app'>In-App</Option>
            </Select>
          </Form.Item>

          <Form.Item name='scheduleAt' label='Schedule For Later (Optional)'>
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder='Leave empty to send immediately'
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type='primary'
                htmlType='submit'
                loading={isLoading}
                icon={<SendOutlined />}
              >
                Send Notification
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
