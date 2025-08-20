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

export const AdminForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      // Call your forgot password mutation here
      // await forgotPassword({ email: values.email });
      setEmailSent(true);
      message.success('Password reset instructions sent to your email');
    } catch (error: any) {
      message.error('Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
            <MailOutlined
              style={{
                fontSize: '48px',
                color: '#52c41a',
                marginBottom: '16px',
              }}
            />
            <Title level={3}>Check Your Email</Title>
            <Text type='secondary'>
              We've sent password reset instructions to your email address.
            </Text>
          </div>

          <Space direction='vertical' style={{ width: '100%' }}>
            <Alert
              message='Email Sent Successfully'
              description='Please check your inbox and follow the instructions to reset your password.'
              type='success'
              showIcon
            />

            <Button type='primary' block href='/auth/login'>
              Back to Login
            </Button>
          </Space>
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
          <LockOutlined
            style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }}
          />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Forgot Password
          </Title>
          <Text type='secondary'>
            Enter your email to receive reset instructions
          </Text>
        </div>

        <Form
          form={form}
          name='forgot-password'
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
              placeholder='Enter your email address'
              autoComplete='email'
            />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={isLoading} block>
              Send Reset Instructions
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
