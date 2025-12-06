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
  LIST_REWARD_DEFINITIONS,
  CREATE_REWARD_DEFINITION,
  UPDATE_REWARD_DEFINITION,
  TOGGLE_REWARD_DEFINITION,
  DELETE_REWARD_DEFINITION,
} from '../../graphql/referral.operations';
import {
  RewardDefinition,
  CreateRewardDefinitionInput,
  ValueType,
} from '../../types/referral.types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const RewardDefinitions: React.FC = () => {
  const [definitions, setDefinitions] = useState<RewardDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<RewardDefinition | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  const [form] = Form.useForm();

  // Fetch definitions
  const fetchDefinitions = async () => {
    setLoading(true);
    try {
      const result = await client
        .query(LIST_REWARD_DEFINITIONS, {
          activeOnly: filterActive,
        })
        .toPromise();

      if (result.error) {
        message.error('Failed to load reward definitions');
        console.error(result.error);
        return;
      }

      setDefinitions(result.data?.listRewardDefinitions || []);
    } catch (error) {
      message.error('An error occurred while loading reward definitions');
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
  const openEditModal = (definition: RewardDefinition) => {
    if (definition.isSystemDefined) {
      message.warning('System-defined rewards cannot be edited');
      return;
    }
    setEditingDefinition(definition);
    form.setFieldsValue(definition);
    setModalVisible(true);
  };

  // Handle submit (create or update)
  const handleSubmit = async (values: any) => {
    try {
      const input: CreateRewardDefinitionInput = {
        ...values,
        isActive: values.isActive !== undefined ? values.isActive : true,
        requiresMaxValue: values.requiresMaxValue || false,
      };

      if (editingDefinition) {
        // Update
        const result = await client
          .mutation(UPDATE_REWARD_DEFINITION, {
            id: editingDefinition.id,
            input,
          })
          .toPromise();

        if (result.error) {
          message.error('Failed to update reward definition');
          console.error(result.error);
          return;
        }

        message.success('Reward definition updated successfully');
      } else {
        // Create
        const result = await client
          .mutation(CREATE_REWARD_DEFINITION, { input })
          .toPromise();

        if (result.error) {
          message.error('Failed to create reward definition');
          console.error(result.error);
          return;
        }

        message.success('Reward definition created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingDefinition(null);
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while saving reward definition');
      console.error(error);
    }
  };

  // Toggle active status
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const result = await client
        .mutation(TOGGLE_REWARD_DEFINITION, { id, isActive: !isActive })
        .toPromise();

      if (result.error) {
        message.error('Failed to toggle reward definition');
        console.error(result.error);
        return;
      }

      message.success(
        `Reward definition ${!isActive ? 'activated' : 'deactivated'} successfully`
      );
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while toggling reward definition');
      console.error(error);
    }
  };

  // Delete definition
  const handleDelete = async (id: string) => {
    try {
      const result = await client
        .mutation(DELETE_REWARD_DEFINITION, { id })
        .toPromise();

      if (result.error) {
        message.error('Failed to delete reward definition');
        console.error(result.error);
        return;
      }

      message.success('Reward definition deleted successfully');
      fetchDefinitions();
    } catch (error) {
      message.error('An error occurred while deleting reward definition');
      console.error(error);
    }
  };

  // Filter definitions based on search
  const filteredDefinitions = definitions.filter((def) =>
    def.name.toLowerCase().includes(searchText.toLowerCase()) ||
    def.type.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns: ColumnsType<RewardDefinition> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: RewardDefinition) => (
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
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit?: string) => unit || 'N/A',
    },
    {
      title: 'Requires Max Value',
      dataIndex: 'requiresMaxValue',
      key: 'requiresMaxValue',
      render: (requiresMaxValue: boolean) => (
        requiresMaxValue ? <Tag color="orange">Yes</Tag> : <Tag>No</Tag>
      ),
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
      render: (_, record: RewardDefinition) => (
        <Space>
          {record.isSystemDefined ? (
            <Tooltip title="System-defined rewards cannot be modified">
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
                title="Are you sure you want to delete this reward definition?"
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
            <Title level={3}>Reward Definitions</Title>
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create New Reward
          </Button>
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
        title={editingDefinition ? 'Edit Reward Definition' : 'Create Reward Definition'}
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
              { required: true, message: 'Please enter reward type' },
              { pattern: /^[A-Z_]+$/, message: 'Only uppercase letters and underscores allowed' },
            ]}
            extra="Uppercase letters and underscores only (e.g., VIP_UPGRADE)"
          >
            <Input
              placeholder="VIP_UPGRADE"
              disabled={!!editingDefinition}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter reward name' }]}
          >
            <Input placeholder="VIP Upgrade" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={2} placeholder="Upgrade user to VIP tier for specified days" />
          </Form.Item>

          <Form.Item
            name="valueType"
            label="Value Type"
            rules={[{ required: true, message: 'Please select value type' }]}
          >
            <Select placeholder="Select value type">
              <Option value={ValueType.NUMBER}>Number</Option>
              <Option value={ValueType.PERCENTAGE}>Percentage</Option>
              <Option value={ValueType.NONE}>None</Option>
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
                      <Input placeholder="NGN (kobo), rides, days, %, etc." />
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

                    <Form.Item
                      name="requiresMaxValue"
                      label="Requires Max Value"
                      valuePropName="checked"
                      extra="Check if this reward type requires a maximum value cap (e.g., percentage discounts)"
                    >
                      <Switch />
                    </Form.Item>
                  </>
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
