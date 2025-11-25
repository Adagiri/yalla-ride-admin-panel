import React, { useEffect, useState } from "react";
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
  DeleteButton,
  useTable,
  useForm,
  FilterDropdown,
  getDefaultSortOrder,
} from "@refinedev/antd";
import { useGo, useShow, BaseRecord } from "@refinedev/core";
import {
  Table,
  Space,
  Tag,
  Avatar,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Input,
  Form,
  Switch,
  Badge,
  Modal,
  Descriptions,
  Statistic,
  message,
  Tooltip,
  Tabs,
  Alert,
  Timeline,
  Transfer,
  Spin,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  SafetyOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  KeyOutlined,
  AuditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { TransferKey } from "antd/es/transfer/interface";
import { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Admin User Interface extending BaseRecord
interface AdminUser extends BaseRecord {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "SUPPORT" | "ANALYST";
  permissions: string[];
  department: string;
  employeeId?: string;
  phone?: {
    countryCode: string;
    fullPhone: string;
    localNumber: string;
  };
  isEmailVerified: boolean;
  isMFAEnabled: boolean;
  isActive: boolean;
  accessLevel: number;
  profilePhoto?: string;
  timezone: string;
  language: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  totalLogins: number;
  totalActions: number;
  createdAt: string;
  updatedAt: string;
}

// Admin List Component
export const AdminList: React.FC = () => {
  const go = useGo();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedAdminForAction, setSelectedAdminForAction] =
    useState<AdminUser | null>(null);

  const { tableProps, sorters, filters, searchFormProps } = useTable<AdminUser>(
    {
      resource: "admins",
      initialSorter: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
      onSearch: (params: any) => {
        return [
          {
            field: "search",
            operator: "contains",
            value: params.search,
          },
        ];
      },
      syncWithLocation: true,
    }
  );

  const handleViewDetails = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setDetailsModalVisible(true);
  };

  const handleStatusChange = (admin: AdminUser) => {
    setSelectedAdminForAction(admin);
    setStatusModalVisible(true);
  };

  const updateAdminStatus = async (values: any) => {
    try {
      // Call your update admin status mutation here
      message.success("Admin status updated successfully");
      setStatusModalVisible(false);
      // Refresh table data
    } catch (error) {
      message.error("Failed to update admin status");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "red";
      case "ADMIN":
        return "blue";
      case "MANAGER":
        return "green";
      case "SUPPORT":
        return "orange";
      case "ANALYST":
        return "purple";
      default:
        return "default";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <CrownOutlined />;
      case "ADMIN":
        return <UserOutlined />;
      case "MANAGER":
        return <TeamOutlined />;
      case "SUPPORT":
        return <SafetyOutlined />;
      case "ANALYST":
        return <AuditOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  // Properly typed columns for AdminUser
  const columns: ColumnsType<AdminUser> = [
    {
      title: "Admin",
      key: "admin",
      render: (_: any, record: any) => (
        <Space>
          <Avatar
            src={record.profilePhoto}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div>
              <Text strong>
                {record.firstname} {record.lastname}
              </Text>
              {record.isEmailVerified && (
                <CheckCircleOutlined
                  style={{ color: "#52c41a", marginLeft: 8 }}
                />
              )}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
            {record.employeeId && (
              <div style={{ fontSize: "12px", color: "#666" }}>
                ID: {record.employeeId}
              </div>
            )}
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder("firstname", sorters),
    },
    {
      title: "Role & Department",
      key: "role",
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Tag
            color={getRoleColor(record.role)}
            icon={getRoleIcon(record.role)}
          >
            {record.role.replace("_", " ")}
          </Tag>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.department}
          </Text>
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder="Select role"
            allowClear
          >
            <Option value="SUPER_ADMIN">Super Admin</Option>
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="SUPPORT">Support</Option>
            <Option value="ANALYST">Analyst</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: "Status & Security",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Badge
            status={record.isActive ? "success" : "error"}
            text={record.isActive ? "Active" : "Inactive"}
          />
          <div>
            <Text style={{ fontSize: "12px" }}>MFA: </Text>
            {record.isMFAEnabled ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            )}
          </div>
          <div>
            <Text style={{ fontSize: "12px" }}>
              Access Level: {record.accessLevel}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Activity",
      key: "activity",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontSize: "12px" }}>
            <Text>Logins: {record.totalLogins}</Text>
          </div>
          <div style={{ fontSize: "12px" }}>
            <Text>Actions: {record.totalActions}</Text>
          </div>
          {record.lastLoginAt && (
            <div style={{ fontSize: "12px" }}>
              <Text type="secondary">
                Last login: {new Date(record.lastLoginAt).toLocaleDateString()}
              </Text>
            </div>
          )}
        </Space>
      ),
      sorter: true,
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: "12px" }}>
            {record.permissions.length} permissions
          </Text>
          <div style={{ marginTop: 4 }}>
            {record.permissions.slice(0, 2).map((permission, index) => (
              <Tag key={index} style={{ fontSize: "10px" }}>
                {permission.split(":")[0]}
              </Tag>
            ))}
            {record.permissions.length > 2 && (
              <Text type="secondary" style={{ fontSize: "10px" }}>
                +{record.permissions.length - 2} more
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Admin">
            <EditButton hideText size="small" recordItemId={record.id} />
          </Tooltip>
          <Tooltip title="Change Status">
            <Button
              icon={
                record.isActive ? (
                  <CloseCircleOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              size="small"
              onClick={() => handleStatusChange(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Admin">
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              confirmTitle="Delete Admin"
              confirmOkText="Delete"
              onSuccess={() => {
                message.success("Admin deleted successfully");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Fixed typing for stats calculation
  const getAdminStats = () => {
    const data = (tableProps.dataSource as AdminUser[]) || [];
    return {
      total: data.length,
      active: data.filter((a) => a.isActive).length,
      withMFA: data.filter((a) => a.isMFAEnabled).length,
      superAdmins: data.filter((a) => a.role === "SUPER_ADMIN").length,
    };
  };

  const stats = getAdminStats();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Admin User Management</Title>
            <Text type="secondary">
              Manage admin users, roles, permissions, and security settings
            </Text>
          </div>
        }
        headerButtons={() => (
          <Space>
            <CreateButton
              icon={<PlusOutlined />}
              onClick={() => go({ to: "/admins/create" })}
            >
              Create Admin
            </CreateButton>
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
            <Card size="small">
              <Statistic
                title="Total Admins"
                value={stats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Active"
                value={stats.active}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="With MFA"
                value={stats.withMFA}
                prefix={<SafetyOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Super Admins"
                value={stats.superAdmins}
                prefix={<CrownOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form {...searchFormProps} layout="inline">
            <Form.Item name="search">
              <Input
                placeholder="Search by name, email, or employee ID"
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  // Reset filters
                }}
              >
                Clear Filters
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Admins Table */}
        <Table<AdminUser>
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} admins`,
          }}
        />
      </List>

      {/* Payment Details Modal */}
      <Modal
        title={`Admin Details - ${selectedAdmin?.firstname} ${selectedAdmin?.lastname}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedAdmin && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="Admin Information">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      {selectedAdmin.firstname} {selectedAdmin.lastname}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedAdmin.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                      <Tag
                        color={getRoleColor(selectedAdmin.role)}
                        icon={getRoleIcon(selectedAdmin.role)}
                      >
                        {selectedAdmin.role.replace("_", " ")}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Department">
                      {selectedAdmin.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="Employee ID">
                      {selectedAdmin.employeeId || "N/A"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Status & Security">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Status">
                      <Badge
                        status={selectedAdmin.isActive ? "success" : "error"}
                        text={selectedAdmin.isActive ? "Active" : "Inactive"}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="MFA Enabled">
                      <Badge
                        status={selectedAdmin.isMFAEnabled ? "success" : "error"}
                        text={selectedAdmin.isMFAEnabled ? "Yes" : "No"}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Email Verified">
                      <Badge
                        status={selectedAdmin.isEmailVerified ? "success" : "error"}
                        text={selectedAdmin.isEmailVerified ? "Yes" : "No"}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Access Level">
                      {selectedAdmin.accessLevel}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Logins">
                      {selectedAdmin.totalLogins}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card size="small" title="Permissions">
                  <Row gutter={[8, 8]}>
                    {selectedAdmin.permissions.map((permission, index) => (
                      <Col key={index}>
                        <Tag color="blue">{permission}</Tag>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        title={`Change Admin Status - ${selectedAdminForAction?.firstname} ${selectedAdminForAction?.lastname}`}
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        {selectedAdminForAction && (
          <Form
            layout="vertical"
            onFinish={updateAdminStatus}
            initialValues={{
              isActive: selectedAdminForAction.isActive,
            }}
          >
            <Alert
              message="Status Change"
              description={`Changing status for admin ${selectedAdminForAction.firstname} ${selectedAdminForAction.lastname}`}
              type="warning"
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              name="isActive"
              label="Admin Status"
              rules={[{ required: true }]}
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                defaultChecked={selectedAdminForAction.isActive}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason for Status Change"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} placeholder="Enter reason for status change" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Update Status
                </Button>
                <Button onClick={() => setStatusModalVisible(false)}>
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

// Admin Create Component
export const AdminCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "admins",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<TransferKey[]>(
    []
  );

  const availablePermissions = [
    "dashboard:view",
    "analytics:view",
    "drivers:view",
    "drivers:create",
    "drivers:update",
    "drivers:delete",
    "customers:view",
    "customers:update",
    "trips:view",
    "trips:assign",
    "payments:view",
    "payments:process",
    "subscriptions:view",
    "subscriptions:create",
    "notifications:send",
    "system:config",
    "users:admin",
    "audit:logs",
  ];

  const rolePermissions = {
    SUPER_ADMIN: availablePermissions,
    ADMIN: [
      "dashboard:view",
      "analytics:view",
      "drivers:view",
      "drivers:update",
      "customers:view",
      "trips:view",
      "payments:view",
      "notifications:send",
    ],
    MANAGER: ["dashboard:view", "drivers:view", "customers:view", "trips:view"],
    SUPPORT: ["customers:view", "trips:view", "notifications:send"],
    ANALYST: ["dashboard:view", "analytics:view"],
  };

  const handleRoleChange = (role: string) => {
    const permissions =
      rolePermissions[role as keyof typeof rolePermissions] || [];
    setSelectedPermissions(permissions as TransferKey[]);
    formProps.form?.setFieldsValue({ permissions });
  };

  // Fixed Transfer onChange handler
  const handleTransferChange = (targetKeys: TransferKey[]) => {
    setSelectedPermissions(targetKeys);
    formProps.form?.setFieldsValue({ permissions: targetKeys });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Create New Admin</Title>
      <Text type="secondary">
        Add a new administrator to the system with appropriate roles and
        permissions
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Form
          {...formProps}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if (changedValues.role) {
              handleRoleChange(changedValues.role);
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[
                  { required: true, message: "First name is required" },
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter email address"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Role is required" }]}
              >
                <Select placeholder="Select role">
                  <Option value="SUPER_ADMIN">Super Admin</Option>
                  <Option value="ADMIN">Admin</Option>
                  <Option value="MANAGER">Manager</Option>
                  <Option value="SUPPORT">Support</Option>
                  <Option value="ANALYST">Analyst</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Department is required" },
                ]}
              >
                <Select placeholder="Select department">
                  <Option value="Operations">Operations</Option>
                  <Option value="Customer Support">Customer Support</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Technology">Technology</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Management">Management</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="employeeId" label="Employee ID">
            <Input placeholder="Enter employee ID (optional)" />
          </Form.Item>

          <Form.Item name="permissions" label="Permissions">
            <Transfer
              dataSource={availablePermissions.map((p) => ({
                key: p,
                title: p,
              }))}
              targetKeys={selectedPermissions}
              onChange={handleTransferChange}
              render={(item) => item.title}
              listStyle={{
                width: 300,
                height: 300,
              }}
              titles={["Available Permissions", "Assigned Permissions"]}
              showSearch
              filterOption={(inputValue, item) =>
                item.title.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                {...saveButtonProps}
                icon={<PlusOutlined />}
              >
                Create Admin
              </Button>
              <Button onClick={() => window.history.back()}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export const AdminEdit: React.FC = () => {
  const go = useGo();
  const [selectedPermissions, setSelectedPermissions] = useState<TransferKey[]>(
    []
  );

  const { formProps, saveButtonProps, queryResult, onFinish } =
    useForm<AdminUser>({
      resource: "admins",
      action: "edit",
      redirect: "list",
    });

  const data = queryResult?.data;
  const isLoading = queryResult?.isLoading ?? false;
  const isError = queryResult?.isError ?? false;
  const adminData: AdminUser | undefined = data?.data;

  const availablePermissions = [
    "dashboard:view",
    "analytics:view",
    "drivers:view",
    "drivers:create",
    "drivers:update",
    "drivers:delete",
    "customers:view",
    "customers:update",
    "trips:view",
    "trips:assign",
    "payments:view",
    "payments:process",
    "subscriptions:view",
    "subscriptions:create",
    "notifications:send",
    "system:config",
    "users:admin",
    "audit:logs",
  ];

  const rolePermissions = {
    SUPER_ADMIN: availablePermissions,
    ADMIN: [
      "dashboard:view",
      "analytics:view",
      "drivers:view",
      "drivers:update",
      "customers:view",
      "trips:view",
      "payments:view",
      "notifications:send",
    ],
    MANAGER: ["dashboard:view", "drivers:view", "customers:view", "trips:view"],
    SUPPORT: ["customers:view", "trips:view", "notifications:send"],
    ANALYST: ["dashboard:view", "analytics:view"],
  };

  useEffect(() => {
    if (adminData) {
      formProps.form?.setFieldsValue({
        firstname: adminData.firstname,
        lastname: adminData.lastname,
        email: adminData.email,
        phone: adminData.phone,
        role: adminData.role,
        department: adminData.department,
        employeeId: adminData.employeeId,
        permissions: adminData.permissions,
      });
      setSelectedPermissions(adminData.permissions || []);
    }
  }, [adminData, formProps.form]);

  const handleRoleChange = (role: string) => {
    const permissions =
      rolePermissions[role as keyof typeof rolePermissions] || [];
    setSelectedPermissions(permissions as TransferKey[]);
    formProps.form?.setFieldsValue({ permissions });
  };

  const handleTransferChange = (targetKeys: TransferKey[]) => {
    setSelectedPermissions(targetKeys);
    formProps.form?.setFieldsValue({ permissions: targetKeys });
  };

  const handleFinish = async (values: any) => {
    try {
      await onFinish({
        ...values,
        permissions: selectedPermissions,
      });
      message.success("Admin updated successfully");
    } catch (error) {
      message.error("Failed to update admin");
    }
  };

  if (isError) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Text type="danger">Error loading admin data. Please try again.</Text>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => go({ to: "/admins" })}
          style={{ marginBottom: 16 }}
        >
          Back to Admin List
        </Button>
        <Title level={3}>Edit Admin User</Title>
        <Text type="secondary">
          Update administrator information, role, and permissions
        </Text>
      </div>

      <Spin spinning={isLoading}>
        <Card>
          <Form
            {...formProps}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={(changedValues) => {
              if (changedValues.role) {
                handleRoleChange(changedValues.role);
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstname"
                  label="First Name"
                  rules={[
                    { required: true, message: "First name is required" },
                  ]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastname"
                  label="Last Name"
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter email address"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter phone number"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Role is required" }]}
                >
                  <Select placeholder="Select role">
                    <Option value="SUPER_ADMIN">Super Admin</Option>
                    <Option value="ADMIN">Admin</Option>
                    <Option value="MANAGER">Manager</Option>
                    <Option value="SUPPORT">Support</Option>
                    <Option value="ANALYST">Analyst</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[
                    { required: true, message: "Department is required" },
                  ]}
                >
                  <Select placeholder="Select department">
                    <Option value="Operations">Operations</Option>
                    <Option value="Customer Support">Customer Support</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Technology">Technology</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="Management">Management</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="employeeId" label="Employee ID">
              <Input placeholder="Enter employee ID (optional)" />
            </Form.Item>

            <Form.Item name="permissions" label="Permissions">
              <Transfer
                dataSource={availablePermissions.map((p) => ({
                  key: p,
                  title: p,
                }))}
                targetKeys={selectedPermissions}
                onChange={handleTransferChange}
                render={(item) => item.title}
                listStyle={{
                  width: 300,
                  height: 300,
                }}
                titles={["Available Permissions", "Assigned Permissions"]}
                showSearch
                filterOption={(inputValue, item) =>
                  item.title.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  {...saveButtonProps}
                  icon={<EditOutlined />}
                >
                  Update Admin
                </Button>
                <Button onClick={() => go({ to: "/admins" })}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

// Admin Show Component
export const AdminShow: React.FC = () => {
  const { queryResult } = useShow({
    resource: "admins",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading admin details...
      </div>
    );
  }

  const tabItems = [
    {
      key: "1",
      label: "Profile",
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Name">
              {record?.firstname} {record?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {record?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color="blue">{record?.role?.replace("_", " ")}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {record?.department}
            </Descriptions.Item>
            <Descriptions.Item label="Employee ID">
              {record?.employeeId || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {record?.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                status={record?.isActive ? "success" : "error"}
                text={record?.isActive ? "Active" : "Inactive"}
              />
            </Descriptions.Item>
            <Descriptions.Item label="MFA Enabled">
              <Badge
                status={record?.isMFAEnabled ? "success" : "error"}
                text={record?.isMFAEnabled ? "Yes" : "No"}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Permissions",
      children: (
        <Card>
          <Row gutter={[8, 8]}>
            {record?.permissions?.map((permission: string, index: number) => (
              <Col key={index}>
                <Tag color="blue">{permission}</Tag>
              </Col>
            ))}
          </Row>
        </Card>
      ),
    },
    {
      key: "3",
      label: "Activity",
      children: (
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Total Logins"
              value={record?.totalLogins || 0}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Actions"
              value={record?.totalActions || 0}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Access Level"
              value={record?.accessLevel || 0}
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Admin Details</Title>

      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};