import React from 'react';
import { useNavigation, useGo } from '@refinedev/core';
import { Edit, useForm, useSelect } from '@refinedev/antd';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Alert,
  Tag,
  Switch,
  DatePicker,
} from 'antd';
import { useParams } from 'react-router-dom';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
    countryCode: string;
    localNumber: string;
  };
  locationId?: string;
  isOnline: boolean;
  isAvailable: boolean;
  driverLicenseVerified: boolean;
  vehicleInspectionDone: boolean;
  paymentModel: string;
  stats?: {
    totalTrips: number;
    averageRating: number;
  };
  createdAt: string;
}

export const DriverEdit: React.FC = () => {
  const { id } = useParams();
  const go = useGo();
  const { list } = useNavigation();

  const { formProps, saveButtonProps, query, onFinish } = useForm<Driver>({
    resource: 'drivers',
    id,
    action: 'edit',
    redirect: false,
  });

  const driver = query?.data?.data;

  // Fetch locations for dropdown
  const { selectProps: locationSelectProps } = useSelect({
    resource: 'locations',
    optionLabel: 'name',
    optionValue: 'id',
  });

  // Custom form submission to handle phone object
  const handleFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      phone: driver?.phone || {
        fullPhone: '',
        countryCode: '',
        localNumber: '',
      },
    };
    await onFinish(formattedValues);
  };

  if (query?.isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Alert
          message='Loading...'
          description='Fetching driver details...'
          type='info'
          showIcon
        />
      </div>
    );
  }

  if (query?.isError) {
    return (
      <Alert
        message='Error'
        description='Failed to load driver details. Please try again.'
        type='error'
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <Edit
      title={
        <Space>
          <UserOutlined />
          <span>Edit Driver</span>
          <Tag color='blue'>
            {driver?.firstname} {driver?.lastname}
          </Tag>
        </Space>
      }
      saveButtonProps={saveButtonProps}
      headerButtons={[
        <Button
          key='cancel'
          icon={<CloseOutlined />}
          onClick={() => list('drivers')}
        >
          Cancel
        </Button>,
      ]}
      breadcrumb={false}
    >
      <Form
        {...formProps}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          ...driver,
          locationId: driver?.locationId,
          paymentModel: driver?.paymentModel || 'COMMISSION',
        }}
      >
        {/* ... rest of your form code remains the same ... */}
        <Row gutter={24}>
          {/* Personal Information */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Personal Information</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Form.Item
                label='First Name'
                name='firstname'
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder='Enter first name'
                  size='large'
                />
              </Form.Item>

              <Form.Item
                label='Last Name'
                name='lastname'
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder='Enter last name'
                  size='large'
                />
              </Form.Item>

              <Form.Item
                label='Email'
                name='email'
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder='Enter email address'
                  size='large'
                  disabled
                />
              </Form.Item>

              <Form.Item
                label='Phone Number'
                help='Contact driver to update phone number through profile'
              >
                <Input
                  prefix={<PhoneOutlined />}
                  value={driver?.phone?.fullPhone || 'Not available'}
                  disabled
                  size='large'
                />
              </Form.Item>

              <Form.Item label='Location' name='locationId'>
                <Select
                  {...locationSelectProps}
                  placeholder='Select driver location'
                  size='large'
                  suffixIcon={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Account & Status */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <CarOutlined />
                  <span>Account Settings</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Form.Item label='Payment Model' name='paymentModel'>
                <Select size='large'>
                  <Option value='COMMISSION'>Commission</Option>
                  <Option value='SUBSCRIPTION'>Subscription</Option>
                </Select>
              </Form.Item>

              <Form.Item label='Account Status'>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Online Status:</Text>
                    <Switch
                      checked={driver?.isOnline}
                      checkedChildren='Online'
                      unCheckedChildren='Offline'
                      disabled
                    />
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Availability:</Text>
                    <Switch
                      checked={driver?.isAvailable}
                      checkedChildren='Available'
                      unCheckedChildren='Busy'
                      disabled
                    />
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>License Verified:</Text>
                    <Tag
                      color={driver?.driverLicenseVerified ? 'green' : 'orange'}
                    >
                      {driver?.driverLicenseVerified ? 'Verified' : 'Pending'}
                    </Tag>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Vehicle Inspection:</Text>
                    <Tag
                      color={driver?.vehicleInspectionDone ? 'green' : 'orange'}
                    >
                      {driver?.vehicleInspectionDone ? 'Approved' : 'Pending'}
                    </Tag>
                  </div>
                </Space>
              </Form.Item>

              <Form.Item label='Performance Stats' style={{ marginTop: 16 }}>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Total Trips:</Text>
                    <Text strong>{driver?.stats?.totalTrips || 0}</Text>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Average Rating:</Text>
                    <Text strong>
                      {driver?.stats?.averageRating?.toFixed(1) || '0.0'}
                    </Text>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text>Member Since:</Text>
                    <Text>
                      {driver?.createdAt
                        ? new Date(driver.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </div>
                </Space>
              </Form.Item>
            </Card>

            {/* Admin Notes */}
            <Card title='Admin Notes'>
              <Form.Item name='notes'>
                <TextArea
                  rows={4}
                  placeholder='Add any notes or comments about this driver...'
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* Form Actions */}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => list('drivers')}>Cancel</Button>
            <Button
              type='primary'
              htmlType='submit'
              icon={<SaveOutlined />}
              loading={saveButtonProps?.loading}
            >
              Save Changes
            </Button>
          </Space>
        </div>
      </Form>
    </Edit>
  );
};
