import React, { useState } from 'react';
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
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
import { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Vehicle Types and Interfaces
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vin?: string;
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  inspectionStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  insuranceStatus: 'active' | 'expired' | 'pending';
  registrationStatus: 'active' | 'expired' | 'pending';
  lastInspectionDate?: string;
  nextInspectionDue?: string;
  insuranceExpiryDate?: string;
  registrationExpiryDate?: string;
  isActive: boolean;
  documents: {
    registration?: string;
    insurance?: string;
    inspection?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Vehicle List Component
export const VehicleList: React.FC = () => {
  const go = useGo();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);

  const { tableProps, sorters, filters, searchFormProps } = useTable<Vehicle>({
    resource: 'vehicles',
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

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  const handleInspection = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setInspectionModalVisible(true);
  };

  const updateInspectionStatus = async (values: any) => {
    try {
      // Call your update inspection mutation here
      message.success('Inspection status updated successfully');
      setInspectionModalVisible(false);
      // Refresh table data
    } catch (error) {
      message.error('Failed to update inspection status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'success';
      case 'pending':
        return 'processing';
      case 'rejected':
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const vehicleColumns: ColumnsType<Vehicle> = [
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (_: any, record: Vehicle) => (
        <Space>
          <CarFilled style={{ fontSize: '24px', color: '#1890ff' }} />
          <div>
            <div>
              <Text strong>
                {record.make} {record.model} ({record.year})
              </Text>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.plateNumber}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.color}
            </div>
          </div>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Driver',
      key: 'driver',
      render: (_: any, record: Vehicle) => (
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
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Vehicle) => (
        <Space direction='vertical' size='small'>
          <div>
            <Text style={{ fontSize: '12px' }}>Inspection: </Text>
            <Tag color={getStatusColor(record.inspectionStatus)}>
              {record.inspectionStatus.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text style={{ fontSize: '12px' }}>Insurance: </Text>
            <Tag color={getStatusColor(record.insuranceStatus)}>
              {record.insuranceStatus.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text style={{ fontSize: '12px' }}>Registration: </Text>
            <Tag color={getStatusColor(record.registrationStatus)}>
              {record.registrationStatus.toUpperCase()}
            </Tag>
          </div>
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder='Select status'
            allowClear
          >
            <Option value='approved'>Approved</Option>
            <Option value='pending'>Pending</Option>
            <Option value='rejected'>Rejected</Option>
            <Option value='expired'>Expired</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: 'Expiry Dates',
      key: 'expiry',
      render: (_: any, record: Vehicle) => (
        <Space direction='vertical' size='small'>
          {record.nextInspectionDue && (
            <div style={{ fontSize: '12px' }}>
              <CalendarOutlined />
              <Text style={{ marginLeft: 4 }}>
                Inspection:{' '}
                {new Date(record.nextInspectionDue).toLocaleDateString()}
              </Text>
            </div>
          )}
          {record.insuranceExpiryDate && (
            <div style={{ fontSize: '12px' }}>
              <SafetyOutlined />
              <Text style={{ marginLeft: 4 }}>
                Insurance:{' '}
                {new Date(record.insuranceExpiryDate).toLocaleDateString()}
              </Text>
            </div>
          )}
          {record.registrationExpiryDate && (
            <div style={{ fontSize: '12px' }}>
              <ToolOutlined />
              <Text style={{ marginLeft: 4 }}>
                Registration:{' '}
                {new Date(record.registrationExpiryDate).toLocaleDateString()}
              </Text>
            </div>
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? 'success' : 'error'}
          text={isActive ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Vehicle) => (
        <Space>
          <Tooltip title='View Details'>
            <Button
              icon={<EyeOutlined />}
              size='small'
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title='Edit Vehicle'>
            <EditButton hideText size='small' recordItemId={record.id} />
          </Tooltip>
          <Tooltip title='Update Inspection'>
            <Button
              icon={<ToolOutlined />}
              size='small'
              onClick={() => handleInspection(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getVehicleStats = () => {
    const data = tableProps.dataSource || [];
    return {
      total: data.length,
      active: data.filter((v: Vehicle) => v.isActive).length,
      approved: data.filter((v: Vehicle) => v.inspectionStatus === 'approved')
        .length,
      pending: data.filter((v: Vehicle) => v.inspectionStatus === 'pending')
        .length,
      expired: data.filter(
        (v: Vehicle) =>
          v.inspectionStatus === 'expired' ||
          v.insuranceStatus === 'expired' ||
          v.registrationStatus === 'expired'
      ).length,
    };
  };

  const stats = getVehicleStats();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Vehicle Management</Title>
            <Text type='secondary'>
              Manage vehicle registrations, inspections, and documentation
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
                title='Total Vehicles'
                value={stats.total}
                prefix={<CarFilled />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Active'
                value={stats.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Approved'
                value={stats.approved}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Expired/Issues'
                value={stats.expired}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form {...searchFormProps} layout='inline'>
            <Form.Item name='search'>
              <Input
                placeholder='Search by plate number, make, model, or driver'
                prefix={<SearchOutlined />}
                style={{ width: 350 }}
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

        {/* Vehicles Table */}
        <Table<Vehicle>
          {...tableProps}
          columns={vehicleColumns}
          rowKey='id'
          scroll={{ x: 1200 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} vehicles`,
          }}
        />
      </List>

      {/* Vehicle Details Modal */}
      <Modal
        title={`Vehicle Details - ${selectedVehicle?.plateNumber}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          selectedVehicle && (
            <Button
              key='edit'
              type='primary'
              onClick={() => {
                go({
                  to: '/vehicles/edit',
                  query: { id: selectedVehicle.id },
                });
                setDetailsModalVisible(false);
              }}
            >
              Edit Vehicle
            </Button>
          ),
        ]}
      >
        {selectedVehicle && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size='small' title='Vehicle Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Make & Model'>
                      {selectedVehicle.make} {selectedVehicle.model}
                    </Descriptions.Item>
                    <Descriptions.Item label='Year'>
                      {selectedVehicle.year}
                    </Descriptions.Item>
                    <Descriptions.Item label='Color'>
                      {selectedVehicle.color}
                    </Descriptions.Item>
                    <Descriptions.Item label='Plate Number'>
                      {selectedVehicle.plateNumber}
                    </Descriptions.Item>
                    {selectedVehicle.vin && (
                      <Descriptions.Item label='VIN'>
                        {selectedVehicle.vin}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label='Status'>
                      <Badge
                        status={selectedVehicle.isActive ? 'success' : 'error'}
                        text={selectedVehicle.isActive ? 'Active' : 'Inactive'}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size='small' title='Driver Information'>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Driver'>
                      {selectedVehicle.driver.firstname}{' '}
                      {selectedVehicle.driver.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {selectedVehicle.driver.email}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card size='small' title='Status & Compliance'>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag
                          color={getStatusColor(
                            selectedVehicle.inspectionStatus
                          )}
                        >
                          {selectedVehicle.inspectionStatus.toUpperCase()}
                        </Tag>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Inspection</Text>
                        </div>
                        {selectedVehicle.nextInspectionDue && (
                          <div style={{ fontSize: '12px', marginTop: 4 }}>
                            <Text type='secondary'>
                              Due:{' '}
                              {new Date(
                                selectedVehicle.nextInspectionDue
                              ).toLocaleDateString()}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag
                          color={getStatusColor(
                            selectedVehicle.insuranceStatus
                          )}
                        >
                          {selectedVehicle.insuranceStatus.toUpperCase()}
                        </Tag>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Insurance</Text>
                        </div>
                        {selectedVehicle.insuranceExpiryDate && (
                          <div style={{ fontSize: '12px', marginTop: 4 }}>
                            <Text type='secondary'>
                              Expires:{' '}
                              {new Date(
                                selectedVehicle.insuranceExpiryDate
                              ).toLocaleDateString()}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag
                          color={getStatusColor(
                            selectedVehicle.registrationStatus
                          )}
                        >
                          {selectedVehicle.registrationStatus.toUpperCase()}
                        </Tag>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Registration</Text>
                        </div>
                        {selectedVehicle.registrationExpiryDate && (
                          <div style={{ fontSize: '12px', marginTop: 4 }}>
                            <Text type='secondary'>
                              Expires:{' '}
                              {new Date(
                                selectedVehicle.registrationExpiryDate
                              ).toLocaleDateString()}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Inspection Update Modal */}
      <Modal
        title='Update Inspection Status'
        open={inspectionModalVisible}
        onCancel={() => setInspectionModalVisible(false)}
        footer={null}
      >
        {selectedVehicle && (
          <Form
            layout='vertical'
            onFinish={updateInspectionStatus}
            initialValues={{
              status: selectedVehicle.inspectionStatus,
            }}
          >
            <Form.Item
              name='status'
              label='Inspection Status'
              rules={[{ required: true }]}
            >
              <Select>
                <Option value='approved'>Approved</Option>
                <Option value='pending'>Pending</Option>
                <Option value='rejected'>Rejected</Option>
                <Option value='expired'>Expired</Option>
              </Select>
            </Form.Item>

            <Form.Item name='nextInspectionDue' label='Next Inspection Due'>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name='notes' label='Notes'>
              <TextArea
                rows={4}
                placeholder='Add inspection notes or comments'
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Update Status
                </Button>
                <Button onClick={() => setInspectionModalVisible(false)}>
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
