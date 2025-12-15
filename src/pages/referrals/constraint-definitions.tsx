import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Tag,
  Button,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { client } from '../../App';
import {
  LIST_CONSTRAINT_DEFINITIONS,
  CREATE_CONSTRAINT_DEFINITION,
  UPDATE_CONSTRAINT_DEFINITION,
  TOGGLE_CONSTRAINT_DEFINITION,
  DELETE_CONSTRAINT_DEFINITION,
} from '../../graphql/referral.operations';
import {
  ConstraintDefinition,
  CreateConstraintDefinitionInput,
  ValueType,
  AppliesTo,
} from '../../types/referral.types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ConstraintDefinitions: React.FC = () => {
  const [definitions, setDefinitions] = useState<ConstraintDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<ConstraintDefinition | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  const [form] = Form.useForm();

  // Fetch definitions
  const fetchDefinitions = async () => {
    setLoading(true);
    try {
      const result = await client
        .query(LIST_CONSTRAINT_DEFINITIONS, {
          activeOnly: filterActive,
        })
        .toPromise();

      if (result.error) {
        message.error('Failed to load constraint definitions');
        console.error(result.error);
        return;
      }

      setDefinitions(result.data?.listConstraintDefinitions || []);
    } catch (error) {
      message.error('An error occurred while loading constraint definitions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDefinitions();
  }, [filterActive]);

  // Open create modal
  const openCreateModal = () => {
    setEditingDefinition(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (definition: ConstraintDefinition) => {
    if (definition.isSystemDefined) {
      message.warning('System-defined constraints cannot be edited');
      return;
    }
    setEditingDefinition(definition);
    form.setFieldsValue(definition);
    setModalVisible(true);
  };

  // Handle submit (create or update)
  const handleSubmit = async (values: any) => {
    try {
      const input: CreateConstraintDefinitionInput = {
        ...values,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      if (editingDefinition) {
        // Update
        const result = await client
          .mutation(UPDATE_CONSTRAINT_DEFINITION, {
            id: editingDefinition.id,
            input,
          })
          .toPromise();

        if (result.error) {
          message.error('Failed to update constraint definition');
          console.error(result.error);
          return;
        }

        message.success('Constraint definition updated successfully');
      } else {
        // Create
        const result = await client
          .mutation(CREATE_CONSTRAINT_DEFINITION, { input })
          .toPromise();

        if (result.error) {
          message.error('Failed to create constraint definition');
          console.error(result.error);
          return;
        }

        message.success('Constraint definition created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingDefinition(null);
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while saving constraint definition');
      console.error(error);
    }
  };

  // Toggle active status
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const result = await client
        .mutation(TOGGLE_CONSTRAINT_DEFINITION, { id, isActive: !isActive })
        .toPromise();

      if (result.error) {
        message.error('Failed to toggle constraint definition');
        console.error(result.error);
        return;
      }

      message.success(
        `Constraint definition ${!isActive ? 'activated' : 'deactivated'} successfully`
      );
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while toggling constraint definition');
      console.error(error);
    }
  };

  // Delete definition
  const handleDelete = async (id: string) => {
    try {
      const result = await client
        .mutation(DELETE_CONSTRAINT_DEFINITION, { id })
        .toPromise();

      if (result.error) {
        message.error('Failed to delete constraint definition');
        console.error(result.error);
        return;
      }

      message.success('Constraint definition deleted successfully');
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while deleting constraint definition');
      console.error(error);
    }
  };

  // Filter definitions based on search
  const filteredDefinitions = definitions.filter((def) =>
    def.name.toLowerCase().includes(searchText.toLowerCase()) ||
    def.type.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns: ColumnsType<ConstraintDefinition> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ConstraintDefinition) => (
        <div>
          <div>
            <strong>{name}</strong>
            {record.isSystemDefined && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                System
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Value Type',
      dataIndex: 'valueType',
      key: 'valueType',
      render: (valueType: ValueType) => <Tag color="cyan">{valueType}</Tag>,
    },
    {
      title: 'Applies To',
      dataIndex: 'appliesTo',
      key: 'appliesTo',
      render: (appliesTo: AppliesTo) => <Tag color="purple">{appliesTo}</Tag>,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit?: string) => unit || 'N/A',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ConstraintDefinition) => (
        <Space>
          {record.isSystemDefined ? (
            <Tooltip title="System-defined constraints cannot be modified">
              <Button icon={<LockOutlined />} disabled />
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(record)}
                />
              </Tooltip>
              <Tooltip title={record.isActive ? 'Deactivate' : 'Activate'}>
                <Switch
                  checked={record.isActive}
                  onChange={() => handleToggle(record.id, record.isActive)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this constraint definition?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Title level={3}>Constraint Definitions</Title>
            <Space>
              <Select
                style={{ width: 150 }}
                placeholder="Filter by status"
                allowClear
                value={filterActive}
                onChange={setFilterActive}
              >
                <Option value={true}>Active Only</Option>
                <Option value={false}>Inactive Only</Option>
              </Select>
              <Input.Search
                style={{ width: 250 }}
                placeholder="Search by name or type"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Button icon={<ReloadOutlined />} onClick={fetchDefinitions}>
                Refresh
              </Button>
            </Space>
          </div>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create New Constraint
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={filteredDefinitions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingDefinition ? 'Edit Constraint Definition' : 'Create Constraint Definition'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingDefinition(null);
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="type"
            label="Type (Unique ID)"
            rules={[
              { required: true, message: 'Please enter constraint type' },
              { pattern: /^[A-Z_]+$/, message: 'Only uppercase letters and underscores allowed' },
            ]}
            extra="Uppercase letters and underscores only (e.g., MIN_TRIP_COUNT)"
          >
            <Input
              placeholder="MIN_TRIP_COUNT"
              disabled={!!editingDefinition}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter constraint name' }]}
          >
            <Input placeholder="Minimum Trip Count" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={2} placeholder="User must have completed at least this many trips" />
          </Form.Item>

          <Form.Item
            name="valueType"
            label="Value Type"
            rules={[{ required: true, message: 'Please select value type' }]}
          >
            <Select placeholder="Select value type">
              <Option value={ValueType.NUMBER}>Number</Option>
              <Option value={ValueType.BOOLEAN}>Boolean</Option>
              <Option value={ValueType.NONE}>None</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="appliesTo"
            label="Applies To"
            rules={[{ required: true, message: 'Please select who this applies to' }]}
          >
            <Select placeholder="Select who this applies to">
              <Option value={AppliesTo.REFERRER}>Referrer Only</Option>
              <Option value={AppliesTo.REFEREE}>Referee Only</Option>
              <Option value={AppliesTo.BOTH}>Both</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.valueType !== currentValues.valueType
            }
          >
            {({ getFieldValue }) => {
              const valueType = getFieldValue('valueType');

              if (valueType === ValueType.NUMBER || valueType === ValueType.PERCENTAGE) {
                return (
                  <>
                    <Form.Item name="unit" label="Unit">
                      <Input placeholder="trips, days, NGN (kobo), etc." />
                    </Form.Item>

                    <Form.Item name="minValue" label="Minimum Value">
                      <InputNumber style={{ width: '100%' }} placeholder="Optional" />
                    </Form.Item>

                    <Form.Item name="maxValue" label="Maximum Value">
                      <InputNumber style={{ width: '100%' }} placeholder="Optional" />
                    </Form.Item>

                    <Form.Item name="defaultValue" label="Default Value">
                      <InputNumber style={{ width: '100%' }} placeholder="Optional" />
                    </Form.Item>
                  </>
                );
              }

              if (valueType === ValueType.BOOLEAN) {
                return (
                  <Form.Item name="defaultValue" label="Default Value" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                );
              }

              return null;
            }}
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
