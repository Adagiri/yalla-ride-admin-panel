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

export const AdminResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      // Call your reset password mutation here
      // await resetPassword({
      //   token,
      //   email,
      //   password: values.password
      // });
      setIsSuccess(true);
      message.success('Password reset successfully');
    } catch (error: any) {
      message.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
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
            textAlign: 'center',
          }}
        >
          <Alert
            message='Invalid Reset Link'
            description='This password reset link is invalid or has expired. Please request a new one.'
            type='error'
            showIcon
          />
          <div style={{ marginTop: '16px' }}>
            <Button type='primary' href='/auth/forgot-password'>
              Request New Link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
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
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <SafetyOutlined
              style={{
                fontSize: '48px',
                color: '#52c41a',
                marginBottom: '16px',
              }}
            />
            <Title level={3}>Password Reset Successfully</Title>
            <Text type='secondary'>
              Your password has been updated. You can now sign in with your new
              password.
            </Text>
          </div>

          <Button type='primary' block href='/auth/login'>
            Continue to Login
          </Button>
        </Card>
      </div>
    );
  }

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
          <SafetyOutlined
            style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}
          />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Reset Password
          </Title>
          <Text type='secondary'>Create a new password for your account</Text>
        </div>

        <Form
          form={form}
          name='reset-password'
          onFinish={onFinish}
          layout='vertical'
          requiredMark={false}
          size='large'
        >
          <Form.Item
            name='password'
            label='New Password'
            rules={[
              { required: true, message: 'Please enter your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, and one number!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Enter new password'
            />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            label='Confirm Password'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Confirm new password'
            />
          </Form.Item>

          <Form.Item>
            <Alert
              message='Password Requirements'
              description='Your password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.'
              type='info'
              showIcon
              style={{ marginBottom: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={isLoading} block>
              Reset Password
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Link href='/auth/login'>← Back to Login</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
