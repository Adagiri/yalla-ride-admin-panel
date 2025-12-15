import React, { useState } from 'react';
import {
  useShow,
  useNavigation,
  useCustom,
  useCustomMutation,
  useGo,
} from '@refinedev/core';
import { Show, DateField, useForm } from '@refinedev/antd';
import {
  Card,
  Typography,
  Space,
  Button,
  Avatar,
  Descriptions,
  Row,
  Col,
  Statistic,
  Tag,
  Badge,
  Alert,
  Image,
  Spin,
  Modal,
  Switch,
  message,
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CarFilled,
  DollarOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

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
  isOnline: boolean;
  isAvailable: boolean;
  profilePhotoSet: boolean;
  profilePhoto?: string;
  personalInfoSet: boolean;
  driverLicenseVerified: boolean;
  vehicleInspectionDone: boolean;
  driverLicenseFront?: string;
  driverLicenseBack?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalTrips: number;
    averageRating: number;
    totalEarnings: number;
    completionRate: number;
  };
  paymentModel?: string;
  walletBalance?: number;
  vehicleId?: string;
  vehicle?: {
    id: string;
    brand: string;
    modelName: string;
    plateNumber: string;
    color: string;
    inspectionStatus: string;
    vehicleInspectionDone: boolean;
  };
}

export const DriverShow: React.FC = () => {
  // Get the ID from URL params automatically
  const { query } = useShow<Driver>();
  const { data, isLoading, isError } = query;
  const { edit } = useNavigation();
  const go = useGo();

  const driver = data?.data;

  const [licenseModalVisible, setLicenseModalVisible] = useState(false);
  const [selectedLicenseSide, setSelectedLicenseSide] = useState<
    'front' | 'back'
  >('front');
  // Fetch license images
  const { data: frontLicenseData, isLoading: frontLoading } = useCustom({
    url: 'get-file-download-url',
    method: 'get',
    config: {
      payload: {
        key: driver?.driverLicenseFront,
      },
    },
    queryOptions: {
      enabled:
        !!driver?.driverLicenseFront &&
        licenseModalVisible &&
        selectedLicenseSide === 'front',
    },
  });

  const { data: backLicenseData, isLoading: backLoading } = useCustom({
    url: 'get-file-download-url',
    method: 'get',
    config: {
      payload: {
        key: driver?.driverLicenseBack,
      },
    },
    queryOptions: {
      enabled:
        !!driver?.driverLicenseBack &&
        licenseModalVisible &&
        selectedLicenseSide === 'back',
    },
  });
  // Handle license verification mutation
  const { mutate: mutateLicense, isPending: licenseUpdating } =
    useCustomMutation();

  const handleLicenseVerification = (verified: boolean) => {
    if (!driver?.id) return;

    mutateLicense(
      {
        url: 'toggle-driver-license-verification',
        method: 'post',
        values: {
          userId: driver.id,
          verified,
        },
      },
      {
        onSuccess: () => {
          message.success(`License ${verified ? 'approved' : 'rejected'}`);
          query.refetch();
        },
        onError: (error) => {
          message.error(`Failed to update license: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Spin size='large' tip='Loading driver details...' />
      </div>
    );
  }

  if (isError) {
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

  if (!driver) {
    return (
      <Alert
        message='Driver Not Found'
        description='The requested driver could not be found.'
        type='warning'
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <Show
      title={
        <Space>
          <UserOutlined />
          <span>Driver Details</span>
          <Tag color='blue'>
            {driver.firstname} {driver.lastname}
          </Tag>
        </Space>
      }
      headerButtons={[
        <Button
          key='back'
          icon={<ArrowLeftOutlined />}
          onClick={() => go({ to: '/drivers' })}
        >
          Back to List
        </Button>,
        <Button
          key='edit'
          type='primary'
          icon={<EditOutlined />}
          onClick={() => edit('drivers', driver.id)}
        >
          Edit Driver
        </Button>,
      ]}
      isLoading={isLoading}
      breadcrumb={
        <div>
          <Button
            type='link'
            onClick={() => go({ to: '/drivers' })}
            icon={<ArrowLeftOutlined />}
          >
            Drivers
          </Button>
          <span>
            {' '}
            / {driver.firstname} {driver.lastname}
          </span>
        </div>
      }
    >
      <Row gutter={24}>
        {/* Left Column - Driver Info */}
        <Col span={16}>
          <Card
            title={
              <Space>
                <Avatar
                  size='large'
                  src={driver.profilePhoto}
                  icon={<UserOutlined />}
                />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {driver.firstname} {driver.lastname}
                  </Title>
                  <Text type='secondary'>{driver.email}</Text>
                </div>
              </Space>
            }
            extra={
              <Space>
                <Badge
                  status={driver.isOnline ? 'success' : 'default'}
                  text={driver.isOnline ? 'Online' : 'Offline'}
                />
                <Badge
                  status={driver.isAvailable ? 'processing' : 'default'}
                  text={driver.isAvailable ? 'Available' : 'Busy'}
                />
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions column={1} size='small'>
                  <Descriptions.Item label='Phone Number'>
                    <Space>
                      <PhoneOutlined />
                      {driver.phone?.fullPhone || 'N/A'}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    <Space>
                      <MailOutlined />
                      {driver.email || 'N/A'}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Payment Model'>
                    <Tag
                      color={
                        driver.paymentModel === 'SUBSCRIPTION'
                          ? 'blue'
                          : 'orange'
                      }
                    >
                      {driver.paymentModel || 'COMMISSION'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Joined'>
                    <DateField value={driver.createdAt} format='LLL' />
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1} size='small'>
                  <Descriptions.Item label='Profile Photo'>
                    <Space>
                      <PictureOutlined />
                      {driver.profilePhotoSet ? (
                        <Tag color='green'>Uploaded</Tag>
                      ) : (
                        <Tag color='red'>Missing</Tag>
                      )}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Personal Info'>
                    <Space>
                      <UserOutlined />
                      {driver.personalInfoSet ? (
                        <Tag color='green'>Complete</Tag>
                      ) : (
                        <Tag color='red'>Incomplete</Tag>
                      )}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Driver License'>
                    <Space>
                      <IdcardOutlined />
                      {driver.driverLicenseVerified ? (
                        <Tag color='green'>Verified</Tag>
                      ) : (
                        <Tag color='orange'>Pending</Tag>
                      )}
                      {(driver.driverLicenseFront ||
                        driver.driverLicenseBack) && (
                        <Button
                          size='small'
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setLicenseModalVisible(true);
                            setSelectedLicenseSide('front');
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label='Vehicle Inspection'>
                    <Space>
                      <CarOutlined />
                      {driver.vehicleInspectionDone ? (
                        <Tag color='green'>Approved</Tag>
                      ) : (
                        <Tag color='orange'>Pending</Tag>
                      )}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Performance Stats */}
          <Card title='Performance Statistics' style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col span={6}>
                <Statistic
                  title='Total Trips'
                  value={driver.stats?.totalTrips || 0}
                  prefix={<CarOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Average Rating'
                  value={driver.stats?.averageRating || 0}
                  precision={1}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Total Earnings'
                  value={driver.stats?.totalEarnings || 0}
                  prefix={<DollarOutlined />}
                  formatter={(value) => `₦${Number(value).toLocaleString()}`}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title='Completion Rate'
                  value={driver.stats?.completionRate || 0}
                  suffix='%'
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Vehicle Information */}
          {driver.vehicle && (
            <Card
              title={
                <Space>
                  <CarFilled />
                  <span>Assigned Vehicle</span>
                </Space>
              }
              extra={
                <Button
                  type='link'
                  icon={<EyeOutlined />}
                  onClick={() =>
                    go({ to: `/vehicles/show/${driver.vehicle!.id}` })
                  }
                >
                  View Vehicle
                </Button>
              }
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Brand & Model'>
                      {driver.vehicle.brand} {driver.vehicle.modelName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Plate Number'>
                      <Text strong>{driver.vehicle.plateNumber}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label='Color'>
                      {driver.vehicle.color}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Inspection Status'>
                      <Space>
                        <Badge
                          status={
                            driver.vehicle.inspectionStatus === 'APPROVED'
                              ? 'success'
                              : driver.vehicle.inspectionStatus === 'PENDING'
                              ? 'warning'
                              : 'error'
                          }
                          text={driver.vehicle.inspectionStatus}
                        />
                        {driver.vehicle.vehicleInspectionDone && (
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        )}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        {/* Right Column - Verification Status */}
        <Col span={8}>
          <Card title='Verification Status' style={{ marginBottom: 24 }}>
            <Space direction='vertical' style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Profile Photo:</Text>
                {driver.profilePhotoSet ? (
                  <Tag color='green'>Complete</Tag>
                ) : (
                  <Tag color='red'>Incomplete</Tag>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Personal Information:</Text>
                {driver.personalInfoSet ? (
                  <Tag color='green'>Complete</Tag>
                ) : (
                  <Tag color='red'>Incomplete</Tag>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Driver License:</Text>
                <Space>
                  {driver.driverLicenseVerified ? (
                    <Tag color='green'>Verified</Tag>
                  ) : (
                    <Tag color='orange'>Pending</Tag>
                  )}
                  <Switch
                    checked={driver.driverLicenseVerified}
                    onChange={handleLicenseVerification}
                    loading={licenseUpdating}
                    checkedChildren='Approve'
                    unCheckedChildren='Reject'
                    disabled={
                      !driver.driverLicenseFront || !driver.driverLicenseBack
                    }
                  />
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Vehicle Inspection:</Text>
                {driver.vehicleInspectionDone ? (
                  <Tag color='green'>Approved</Tag>
                ) : (
                  <Tag color='orange'>Pending</Tag>
                )}
              </div>
            </Space>
          </Card>

          {/* Wallet Balance */}
          {driver.walletBalance !== undefined && (
            <Card title='Wallet Balance'>
              <Statistic
                value={driver.walletBalance}
                prefix='₦'
                formatter={(value) => Number(value).toLocaleString()}
                style={{ textAlign: 'center' }}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* License Images Modal */}
      <Modal
        title='Driver License Images'
        open={licenseModalVisible}
        onCancel={() => setLicenseModalVisible(false)}
        width={800}
        footer={[
          <Space
            key='footer'
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <div>
              {driver.driverLicenseFront && (
                <Button
                  type={selectedLicenseSide === 'front' ? 'primary' : 'default'}
                  onClick={() => setSelectedLicenseSide('front')}
                >
                  Front Side
                </Button>
              )}
              {driver.driverLicenseBack && (
                <Button
                  type={selectedLicenseSide === 'back' ? 'primary' : 'default'}
                  onClick={() => setSelectedLicenseSide('back')}
                >
                  Back Side
                </Button>
              )}
            </div>
            <Button onClick={() => setLicenseModalVisible(false)}>Close</Button>
          </Space>,
        ]}
      >
        <div style={{ textAlign: 'center', minHeight: '400px' }}>
          {selectedLicenseSide === 'front' ? (
            frontLoading ? (
              <Spin tip='Loading front license image...' />
            ) : frontLicenseData?.data ? (
              <Image
                src={(frontLicenseData?.data as unknown as string) ?? ''}
                alt='Driver License Front'
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            ) : (
              <Alert
                message='Image Not Available'
                description='Front license image could not be loaded.'
                type='warning'
                showIcon
              />
            )
          ) : backLoading ? (
            <Spin tip='Loading back license image...' />
          ) : backLicenseData?.data ? (
            <Image
              src={(backLicenseData?.data as unknown as string) ?? ''}
              alt='Driver License Back'
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          ) : (
            <Alert
              message='Image Not Available'
              description='Back license image could not be loaded.'
              type='warning'
              showIcon
            />
          )}
        </div>
      </Modal>
    </Show>
  );
};
