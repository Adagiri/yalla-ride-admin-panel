import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Alert,
  Divider,
  message,
  Tabs,
  Table,
  Tag,
  Modal,
  Upload,
  Progress,
  Statistic,
} from 'antd';
import {
  SettingOutlined,
  DollarOutlined,
  SafetyOutlined,
  BellOutlined,
  GlobalOutlined,
  UploadOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  CloudOutlined,
  UserOutlined,
  KeyOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// System Settings Component
export const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSaveSettings = async (values: any, section: string) => {
    setLoading(true);
    try {
      // Call your update settings mutation here
      message.success(`${section} settings updated successfully`);
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // General Settings Tab
  const GeneralSettings = () => (
    <Card title='General Configuration'>
      <Form
        layout='vertical'
        onFinish={(values) => handleSaveSettings(values, 'General')}
        initialValues={{
          appName: 'Yalla Ride',
          supportEmail: 'support@yallaride.com',
          supportPhone: '+234-800-YALLA',
          timezone: 'Africa/Lagos',
          currency: 'NGN',
          language: 'en',
          maintenanceMode: false,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='appName'
              label='Application Name'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='supportEmail'
              label='Support Email'
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='supportPhone'
              label='Support Phone'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='timezone'
              label='Timezone'
              rules={[{ required: true }]}
            >
              <Select>
                <Option value='Africa/Lagos'>West Africa Time (WAT)</Option>
                <Option value='UTC'>Coordinated Universal Time (UTC)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='currency'
              label='Default Currency'
              rules={[{ required: true }]}
            >
              <Select>
                <Option value='NGN'>Nigerian Naira (₦)</Option>
                <Option value='USD'>US Dollar ($)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='language'
              label='Default Language'
              rules={[{ required: true }]}
            >
              <Select>
                <Option value='en'>English</Option>
                <Option value='ha'>Hausa</Option>
                <Option value='yo'>Yoruba</Option>
                <Option value='ig'>Igbo</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name='maintenanceMode'
          label='Maintenance Mode'
          valuePropName='checked'
        >
          <Switch checkedChildren='ON' unCheckedChildren='OFF' />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save General Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // Pricing Settings Tab
  const PricingSettings = () => (
    <Card title='Pricing Configuration'>
      <Form
        layout='vertical'
        onFinish={(values) => handleSaveSettings(values, 'Pricing')}
        initialValues={{
          baseFare: 500,
          perKmRate: 150,
          perMinuteRate: 50,
          minimumFare: 800,
          maximumFare: 50000,
          surgeMultiplier: 1.5,
          commissionRate: 20,
          cashHandlingFee: 0,
          cancellationFee: 200,
        }}
      >
        <Alert
          message='Pricing Changes'
          description='Changes to pricing will affect new trips only. Existing trips will maintain their original pricing.'
          type='info'
          style={{ marginBottom: 24 }}
        />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='baseFare'
              label='Base Fare (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='perKmRate'
              label='Per Kilometer Rate (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='perMinuteRate'
              label='Per Minute Rate (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='minimumFare'
              label='Minimum Fare (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='maximumFare'
              label='Maximum Fare (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='surgeMultiplier'
              label='Surge Multiplier'
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                max={5}
                step={0.1}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='commissionRate'
              label='Commission Rate (%)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={50} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='cancellationFee'
              label='Cancellation Fee (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save Pricing Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // Payment Settings Tab
  const PaymentSettings = () => (
    <Card title='Payment Configuration'>
      <Form
        layout='vertical'
        onFinish={(values) => handleSaveSettings(values, 'Payment')}
        initialValues={{
          paystackEnabled: true,
          flutterwaveEnabled: false,
          cashPaymentsEnabled: true,
          walletEnabled: true,
          minimumWalletBalance: 100,
          autoTopUpEnabled: true,
          processingFeeRate: 2.5,
        }}
      >
        <Title level={5}>Payment Methods</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name='cashPaymentsEnabled'
              label='Cash Payments'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='walletEnabled'
              label='Wallet Payments'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='paystackEnabled'
              label='Paystack'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='flutterwaveEnabled'
              label='Flutterwave'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Wallet Configuration</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='minimumWalletBalance'
              label='Minimum Wallet Balance (₦)'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='processingFeeRate'
              label='Processing Fee Rate (%)'
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name='autoTopUpEnabled'
          label='Enable Auto Top-up'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save Payment Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // Security Settings Tab
  const SecuritySettings = () => (
    <Card title='Security Configuration'>
      <Form
        layout='vertical'
        onFinish={(values) => handleSaveSettings(values, 'Security')}
        initialValues={{
          mfaRequired: false,
          sessionTimeout: 24,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireStrongPasswords: true,
          twoFactorEnabled: false,
        }}
      >
        <Title level={5}>Authentication</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='sessionTimeout'
              label='Session Timeout (hours)'
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={168} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='maxLoginAttempts'
              label='Max Login Attempts'
              rules={[{ required: true }]}
            >
              <InputNumber min={3} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Password Policy</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='passwordMinLength'
              label='Minimum Password Length'
              rules={[{ required: true }]}
            >
              <InputNumber min={6} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='requireStrongPasswords'
              label='Require Strong Passwords'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Two-Factor Authentication</Title>
        <Form.Item
          name='mfaRequired'
          label='Require MFA for Admins'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name='twoFactorEnabled'
          label='Enable 2FA for All Users'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save Security Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  // System Health Tab
  const SystemHealth = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title='Database'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Statistic
              title='Total Records'
              value={12845}
              prefix={<DatabaseOutlined />}
            />
            <Progress percent={75} status='active' />
            <Text type='secondary'>Database usage: 75%</Text>
          </Space>
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Storage'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Statistic
              title='Used Space'
              value={2.4}
              suffix='GB'
              prefix={<CloudOutlined />}
            />
            <Progress percent={45} status='active' />
            <Text type='secondary'>Storage usage: 45%</Text>
          </Space>
        </Card>
      </Col>
      <Col span={8}>
        <Card title='Active Users'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Statistic
              title='Online Now'
              value={234}
              prefix={<UserOutlined />}
            />
            <Progress percent={85} status='active' />
            <Text type='secondary'>Peak: 280 users</Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  // Data Management Tab
  const DataManagement = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title='Backup & Export'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Button type='primary' icon={<ExportOutlined />} block>
              Export All Data
            </Button>
            <Button icon={<DownloadOutlined />} block>
              Download Trip Reports
            </Button>
            <Button icon={<DownloadOutlined />} block>
              Download User Data
            </Button>
            <Button icon={<DownloadOutlined />} block>
              Download Payment Records
            </Button>
          </Space>
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Data Import'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Upload>
              <Button icon={<UploadOutlined />} block>
                Import Driver Data
              </Button>
            </Upload>
            <Upload>
              <Button icon={<UploadOutlined />} block>
                Import Customer Data
              </Button>
            </Upload>
            <Upload>
              <Button icon={<UploadOutlined />} block>
                Import Vehicle Data
              </Button>
            </Upload>
            <Alert
              message='Import Guidelines'
              description='Please ensure your CSV files follow the required format. Contact support for templates.'
              type='info'
              style={{ marginTop: 16 }}
            />
          </Space>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SettingOutlined /> System Settings
        </Title>
        <Text type='secondary'>
          Configure your ride-sharing platform settings and preferences
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab='General' key='general' icon={<GlobalOutlined />}>
          <GeneralSettings />
        </TabPane>

        <TabPane tab='Pricing' key='pricing' icon={<DollarOutlined />}>
          <PricingSettings />
        </TabPane>

        <TabPane tab='Payments' key='payments' icon={<CreditCardOutlined />}>
          <PaymentSettings />
        </TabPane>

        <TabPane tab='Security' key='security' icon={<SafetyOutlined />}>
          <SecuritySettings />
        </TabPane>

        <TabPane tab='System Health' key='health' icon={<DatabaseOutlined />}>
          <SystemHealth />
        </TabPane>

        <TabPane tab='Data Management' key='data' icon={<ImportOutlined />}>
          <DataManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};