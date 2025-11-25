import React, { useState } from 'react';
import { useLogin } from '@refinedev/core';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Checkbox,
  Divider,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  LoginOutlined,
  CarOutlined,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

export const AdminLogin: React.FC = () => {
  const { mutate: login, isLoading } = useLogin();
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);

  const onFinish = (values: { email: string; password: string }) => {
    login({
      email: values.email,
      password: values.password,
      remember: rememberMe,
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <CarOutlined
            style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
          />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Yalla Ride Admin
          </Title>
          <Text type='secondary'>
            Sign in to manage your ride-sharing platform
          </Text>
        </div>

        <Form
          form={form}
          name='admin-login'
          onFinish={onFinish}
          layout='vertical'
          requiredMark={false}
          size='large'
        >
          <Form.Item
            name='email'
            label='Email Address'
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder='admin@yallaride.com'
              autoComplete='email'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Enter your password'
              autoComplete='current-password'
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Remember me
              </Checkbox>
              <Link href='/auth/forgot-password'>Forgot password?</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              block
              icon={<LoginOutlined />}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type='secondary' style={{ fontSize: '12px' }}>
            Secure Admin Access
          </Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Protected by enterprise-grade security
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};
