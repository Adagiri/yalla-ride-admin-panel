import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { client } from '../../App';
import {
  LIST_CONSTRAINT_DEFINITIONS,
  LIST_REWARD_DEFINITIONS,
} from '../../graphql/referral.operations';
import {
  ConstraintDefinition,
  RewardDefinition,
  CampaignType,
  AppliesTo,
  UserType,
  ValueType,
  CampaignConstraint,
  CampaignReward,
} from '../../types/referral.types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CampaignFormEnhancedProps {
  form: any;
  onFinish: (values: any) => void;
  isEdit?: boolean;
}

export const CampaignFormEnhanced: React.FC<CampaignFormEnhancedProps> = ({
  form,
  onFinish,
  isEdit = false,
}) => {
  const [constraintDefinitions, setConstraintDefinitions] = useState<ConstraintDefinition[]>([]);
  const [rewardDefinitions, setRewardDefinitions] = useState<RewardDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch definitions on mount
  useEffect(() => {
    fetchDefinitions();
  }, []);

  const fetchDefinitions = async () => {
    setLoading(true);
    try {
      const [constraintsResult, rewardsResult] = await Promise.all([
        client.query(LIST_CONSTRAINT_DEFINITIONS, { activeOnly: true }).toPromise(),
        client.query(LIST_REWARD_DEFINITIONS, { activeOnly: true }).toPromise(),
      ]);

      if (constraintsResult.error || rewardsResult.error) {
        message.error('Failed to load definitions');
        return;
      }

      setConstraintDefinitions(constraintsResult.data?.listConstraintDefinitions || []);
      setRewardDefinitions(rewardsResult.data?.listRewardDefinitions || []);
    } catch (error) {
      message.error('An error occurred while loading definitions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Get constraint definition by type
  const getConstraintDefinition = (type: string): ConstraintDefinition | undefined => {
    return constraintDefinitions.find((def) => def.type === type);
  };

  // Get reward definition by type
  const getRewardDefinition = (type: string): RewardDefinition | undefined => {
    return rewardDefinitions.find((def) => def.type === type);
  };

  // Validate constraint based on definition
  const validateConstraintValue = (constraint: CampaignConstraint): string[] => {
    const errors: string[] = [];
    const definition = getConstraintDefinition(constraint.constraintType);

    if (!definition) {
      errors.push('Invalid constraint type');
      return errors;
    }

    if (definition.valueType === ValueType.NUMBER) {
      if (typeof constraint.value !== 'number') {
        errors.push('Value must be a number');
      } else {
        if (definition.minValue !== undefined && constraint.value < definition.minValue) {
          errors.push(`Value must be at least ${definition.minValue}`);
        }
        if (definition.maxValue !== undefined && constraint.value > definition.maxValue) {
          errors.push(`Value must be at most ${definition.maxValue}`);
        }
      }
    }

    if (definition.valueType === ValueType.BOOLEAN && typeof constraint.value !== 'boolean') {
      errors.push('Value must be true or false');
    }

    return errors;
  };

  // Validate reward based on definition
  const validateRewardValue = (reward: CampaignReward): string[] => {
    const errors: string[] = [];
    const definition = getRewardDefinition(reward.rewardType);

    if (!definition) {
      errors.push('Invalid reward type');
      return errors;
    }

    if (typeof reward.value !== 'number') {
      errors.push('Value must be a number');
    } else {
      if (definition.minValue !== undefined && reward.value < definition.minValue) {
        errors.push(`Value must be at least ${definition.minValue}`);
      }
      if (definition.maxValue !== undefined && reward.value > definition.maxValue) {
        errors.push(`Value must be at most ${definition.maxValue}`);
      }
    }

    if (definition.requiresMaxValue && !reward.maxValue) {
      errors.push('Max value is required for this reward type');
    }

    return errors;
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Campaign Name"
        rules={[{ required: true, message: 'Please enter campaign name' }]}
      >
        <Input placeholder="e.g., Summer Referral Campaign 2024" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={3} placeholder="Brief description of the campaign" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Campaign Type"
            rules={[{ required: true, message: 'Please select campaign type' }]}
          >
            <Select placeholder="Select type">
              <Option value={CampaignType.SIGNUP}>Signup</Option>
              <Option value={CampaignType.SPECIAL}>Special</Option>
              <Option value={CampaignType.SEASONAL}>Seasonal</Option>
              <Option value={CampaignType.TARGETED}>Targeted</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="eligibleUserTypes"
            label="Eligible User Types"
            rules={[{ required: true, message: 'Please select eligible user types' }]}
          >
            <Select mode="multiple" placeholder="Select user types">
              <Option value="CUSTOMER">Customer</Option>
              <Option value="DRIVER">Driver</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="endDate" label="End Date (Optional)">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      {/* Constraints Section */}
      <Title level={5}>Campaign Constraints</Title>
      <Text type="secondary">
        Define conditions that users must meet to participate in this campaign
      </Text>

      <Form.List name="constraints">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginTop: 16, marginBottom: 16 }}
                title={`Constraint #${name + 1}`}
                extra={
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, 'constraintType']}
                  label="Constraint Type"
                  rules={[{ required: true, message: 'Please select constraint type' }]}
                >
                  <Select
                    placeholder="Select constraint type"
                    onChange={() => {
                      // Clear value when type changes
                      const constraints = form.getFieldValue('constraints');
                      constraints[name].value = undefined;
                      form.setFieldsValue({ constraints });
                    }}
                  >
                    {constraintDefinitions.map((def) => (
                      <Option key={def.id} value={def.type}>
                        <div>
                          <strong>{def.name}</strong>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            {def.description}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    const prevType = prevValues.constraints?.[name]?.constraintType;
                    const currType = currentValues.constraints?.[name]?.constraintType;
                    return prevType !== currType;
                  }}
                >
                  {({ getFieldValue }) => {
                    const constraintType = getFieldValue(['constraints', name, 'constraintType']);
                    const definition = getConstraintDefinition(constraintType);

                    if (!definition) return null;

                    return (
                      <>
                        <Form.Item
                          {...restField}
                          name={[name, 'appliesTo']}
                          label="Applies To"
                          rules={[{ required: true, message: 'Please select who this applies to' }]}
                        >
                          <Select placeholder="Select who this applies to">
                            <Option value={AppliesTo.REFERRER}>Referrer Only</Option>
                            <Option value={AppliesTo.REFEREE}>Referee Only</Option>
                            <Option value={AppliesTo.BOTH}>Both</Option>
                          </Select>
                        </Form.Item>

                        {definition.valueType === ValueType.NUMBER && (
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            label={`Value${definition.unit ? ` (${definition.unit})` : ''}`}
                            rules={[
                              { required: true, message: 'Please enter value' },
                              {
                                validator: (_, value) => {
                                  if (value === undefined) return Promise.resolve();
                                  if (
                                    definition.minValue !== undefined &&
                                    value < definition.minValue
                                  ) {
                                    return Promise.reject(
                                      `Value must be at least ${definition.minValue}`
                                    );
                                  }
                                  if (
                                    definition.maxValue !== undefined &&
                                    value > definition.maxValue
                                  ) {
                                    return Promise.reject(
                                      `Value must be at most ${definition.maxValue}`
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              min={definition.minValue}
                              max={definition.maxValue}
                              placeholder={
                                definition.defaultValue?.toString() || 'Enter value'
                              }
                            />
                          </Form.Item>
                        )}

                        {definition.valueType === ValueType.BOOLEAN && (
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            label="Required"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        )}

                        <Form.Item
                          {...restField}
                          name={[name, 'userTypes']}
                          label="User Types (Optional)"
                        >
                          <Select mode="multiple" placeholder="Select user types">
                            <Option value={UserType.CUSTOMER}>Customer</Option>
                            <Option value={UserType.DRIVER}>Driver</Option>
                          </Select>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              disabled={loading || constraintDefinitions.length === 0}
            >
              Add Constraint
            </Button>
          </>
        )}
      </Form.List>

      <Divider />

      {/* Referrer Rewards Section */}
      <Title level={5}>Referrer Rewards</Title>
      <Text type="secondary">Define rewards for users who refer others</Text>

      <Form.List name="referrerRewards">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginTop: 16, marginBottom: 16 }}
                title={`Reward #${name + 1}`}
                extra={
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, 'rewardType']}
                  label="Reward Type"
                  rules={[{ required: true, message: 'Please select reward type' }]}
                >
                  <Select
                    placeholder="Select reward type"
                    onChange={() => {
                      // Clear value when type changes
                      const rewards = form.getFieldValue('referrerRewards');
                      rewards[name].value = undefined;
                      rewards[name].maxValue = undefined;
                      form.setFieldsValue({ referrerRewards: rewards });
                    }}
                  >
                    {rewardDefinitions.map((def) => (
                      <Option key={def.id} value={def.type}>
                        <div>
                          <strong>{def.name}</strong>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            {def.description}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    const prevType = prevValues.referrerRewards?.[name]?.rewardType;
                    const currType = currentValues.referrerRewards?.[name]?.rewardType;
                    return prevType !== currType;
                  }}
                >
                  {({ getFieldValue }) => {
                    const rewardType = getFieldValue(['referrerRewards', name, 'rewardType']);
                    const definition = getRewardDefinition(rewardType);

                    if (!definition) return null;

                    return (
                      <>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          label={`Value${definition.unit ? ` (${definition.unit})` : ''}`}
                          rules={[
                            { required: true, message: 'Please enter value' },
                            {
                              validator: (_, value) => {
                                if (value === undefined) return Promise.resolve();
                                if (
                                  definition.minValue !== undefined &&
                                  value < definition.minValue
                                ) {
                                  return Promise.reject(
                                    `Value must be at least ${definition.minValue}`
                                  );
                                }
                                if (
                                  definition.maxValue !== undefined &&
                                  value > definition.maxValue
                                ) {
                                  return Promise.reject(
                                    `Value must be at most ${definition.maxValue}`
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={definition.minValue}
                            max={definition.maxValue}
                            placeholder={definition.defaultValue?.toString() || 'Enter value'}
                          />
                        </Form.Item>

                        {definition.requiresMaxValue && (
                          <Form.Item
                            {...restField}
                            name={[name, 'maxValue']}
                            label="Max Value (NGN kobo)"
                            rules={[
                              { required: true, message: 'Max value is required for this reward' },
                            ]}
                            extra="Maximum discount amount cap"
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="e.g., 2000 (₦20.00)"
                            />
                          </Form.Item>
                        )}
                      </>
                    );
                  }}
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              disabled={loading || rewardDefinitions.length === 0}
            >
              Add Referrer Reward
            </Button>
          </>
        )}
      </Form.List>

      <Divider />

      {/* Referee Rewards Section */}
      <Title level={5}>Referee Rewards</Title>
      <Text type="secondary">Define rewards for users who are referred</Text>

      <Form.List name="refereeRewards">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginTop: 16, marginBottom: 16 }}
                title={`Reward #${name + 1}`}
                extra={
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, 'rewardType']}
                  label="Reward Type"
                  rules={[{ required: true, message: 'Please select reward type' }]}
                >
                  <Select
                    placeholder="Select reward type"
                    onChange={() => {
                      // Clear value when type changes
                      const rewards = form.getFieldValue('refereeRewards');
                      rewards[name].value = undefined;
                      rewards[name].maxValue = undefined;
                      form.setFieldsValue({ refereeRewards: rewards });
                    }}
                  >
                    {rewardDefinitions.map((def) => (
                      <Option key={def.id} value={def.type}>
                        <div>
                          <strong>{def.name}</strong>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            {def.description}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    const prevType = prevValues.refereeRewards?.[name]?.rewardType;
                    const currType = currentValues.refereeRewards?.[name]?.rewardType;
                    return prevType !== currType;
                  }}
                >
                  {({ getFieldValue }) => {
                    const rewardType = getFieldValue(['refereeRewards', name, 'rewardType']);
                    const definition = getRewardDefinition(rewardType);

                    if (!definition) return null;

                    return (
                      <>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          label={`Value${definition.unit ? ` (${definition.unit})` : ''}`}
                          rules={[
                            { required: true, message: 'Please enter value' },
                            {
                              validator: (_, value) => {
                                if (value === undefined) return Promise.resolve();
                                if (
                                  definition.minValue !== undefined &&
                                  value < definition.minValue
                                ) {
                                  return Promise.reject(
                                    `Value must be at least ${definition.minValue}`
                                  );
                                }
                                if (
                                  definition.maxValue !== undefined &&
                                  value > definition.maxValue
                                ) {
                                  return Promise.reject(
                                    `Value must be at most ${definition.maxValue}`
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={definition.minValue}
                            max={definition.maxValue}
                            placeholder={definition.defaultValue?.toString() || 'Enter value'}
                          />
                        </Form.Item>

                        {definition.requiresMaxValue && (
                          <Form.Item
                            {...restField}
                            name={[name, 'maxValue']}
                            label="Max Value (NGN kobo)"
                            rules={[
                              { required: true, message: 'Max value is required for this reward' },
                            ]}
                            extra="Maximum discount amount cap"
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="e.g., 2000 (₦20.00)"
                            />
                          </Form.Item>
                        )}
                      </>
                    );
                  }}
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              disabled={loading || rewardDefinitions.length === 0}
            >
              Add Referee Reward
            </Button>
          </>
        )}
      </Form.List>

      <Divider />

      {/* Limits & Settings */}
      <Title level={5}>Limits & Settings</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="maxTotalRedemptions" label="Max Total Redemptions">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Unlimited" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="maxRedemptionsPerUser" label="Max Per User">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Unlimited" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="rewardExpiryDays" label="Reward Expiry (days)">
        <InputNumber min={0} style={{ width: '100%' }} placeholder="No expiry" />
      </Form.Item>

      <Form.Item name="autoApplyReward" label="Auto Apply Reward" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="termsAndConditions" label="Terms & Conditions">
        <TextArea rows={4} placeholder="Enter terms and conditions" />
      </Form.Item>
    </Form>
  );
};
