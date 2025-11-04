import React, { useState } from "react";
import { useNotification, useCustomMutation } from "@refinedev/core";
import {
  List,
  ShowButton,
  EditButton,
  CreateButton,
  useTable,
  FilterDropdown,
  getDefaultSortOrder,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Tag,
  Typography,
  Select,
  Button,
  Card,
  Row,
  Col,
  Input,
  Badge,
  Modal,
  Descriptions,
  Statistic,
  Form,
  message,
  Tooltip,
  Alert,
  Switch,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  CarFilled,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  ToolOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

// Vehicle Types and Interfaces
interface Vehicle {
  id: string;
  brand: string;
  modelName: string;
  manufactureYear: string;
  color: string;
  identificationNumber: string;
  plateNumber: string;
  vehicleInspectionDone: boolean;
  driverId?: string;
  createdAt: string;
  updatedAt: string;
}

// Vehicle List Component
export const VehicleList: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { open } = useNotification();

  const { mutate: updateVehicle, isLoading: updatingVehicle } =
    useCustomMutation();

  const { tableProps, sorters, searchFormProps, tableQuery } =
    useTable<Vehicle>({
      resource: "vehicles",
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
    });

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  const handleInspectionToggle = async (
    vehicleId: string,
    inspected: boolean
  ) => {
    try {
      await updateVehicle(
        {
          url: "update-vehicle",
          method: "post",
          values: {
            id: vehicleId,
            input: {
              vehicleInspectionDone: inspected,
            },
          },
        },
        {
          onSuccess: () => {
            message.success(
              `Vehicle inspection ${inspected ? "approved" : "rejected"}`
            );
            tableQuery.refetch();
          },
          onError: (error: any) => {
            message.error(`Failed to update inspection: ${error.message}`);
          },
        }
      );
    } catch (error) {
      message.error("Failed to update inspection status");
    }
  };

  const getInspectionStatus = (inspected: boolean) => {
    return inspected ? "approved" : "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const vehicleColumns: ColumnsType<Vehicle> = [
    {
      title: "Vehicle",
      key: "vehicle",
      render: (_: any, record: Vehicle) => (
        <Space>
          <CarFilled style={{ fontSize: "24px", color: "#1890ff" }} />
          <div>
            <div>
              <Text strong>
                {record.brand} {record.modelName} ({record.manufactureYear})
              </Text>
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.plateNumber}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.color}
            </div>
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder("brand", sorters),
    },
    {
      title: "Identification Number",
      dataIndex: "identificationNumber",
      key: "identificationNumber",
      render: (vin: string) => <Text code>{vin}</Text>,
    },
    {
      title: "Inspection Status",
      dataIndex: "vehicleInspectionDone", // Add this dataIndex
      key: "vehicleInspectionDone", // Use the actual field name as key
      render: (inspected: boolean, record: Vehicle) => (
        <Space>
          <Tag color={getStatusColor(getInspectionStatus(inspected))}>
            {getInspectionStatus(inspected).toUpperCase()}
          </Tag>
          <Switch
            checked={inspected}
            onChange={(checked) => handleInspectionToggle(record.id, checked)}
            loading={updatingVehicle}
            size="small"
            checkedChildren="Approved"
            unCheckedChildren="Pending"
          />
        </Space>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder="Select inspection status"
            allowClear
            value={props.selectedKeys?.[0]}
            onChange={(value) => {
              props.setSelectedKeys(value ? [value] : []);
            }}
            onBlur={() => {
              props.confirm();
            }}
          >
            <Option value="true">Approved</Option>
            <Option value="false">Pending</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 150,
      render: (_: any, record: Vehicle) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Vehicle">
            <EditButton hideText size="small" recordItemId={record.id} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data = tableProps.dataSource || [];
  console.log(data, "vehicleData");
  const getVehicleStats = () => {
    const data = tableProps.dataSource || [];

    return {
      total: data.length,
      approved: data.filter((v: Vehicle) => v.vehicleInspectionDone).length,
      pending: data.filter((v: Vehicle) => !v.vehicleInspectionDone).length,
    };
  };

  const stats = getVehicleStats();

  return (
    <>
      <List
        breadcrumb={false}
        title={
          <div>
            <Title level={3}>Vehicle Management</Title>
            <Text type="secondary">
              Manage vehicle registrations and inspections
            </Text>
          </div>
        }
        headerButtons={() => (
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => tableQuery.refetch()}
              loading={tableQuery.isFetching}
            >
              Refresh
            </Button>
          </Space>
        )}
      >
        {tableQuery.error && (
          <Alert
            message="Error Loading Vehicles"
            description={tableQuery.error.message}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Summary Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Total Vehicles"
                value={stats.total}
                prefix={<CarFilled />}
                loading={tableQuery.isLoading}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Approved"
                value={stats.approved}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
                loading={tableQuery.isLoading}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Pending Inspection"
                value={stats.pending}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#faad14" }}
                loading={tableQuery.isLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form {...searchFormProps} layout="inline">
            <Form.Item name="search">
              <Input
                placeholder="Search by plate number, brand, and  Identification Number"
                prefix={<SearchOutlined />}
                style={{ width: 350 }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={tableQuery.isFetching}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Vehicles Table */}
        <Table<Vehicle>
          {...tableProps}
          columns={vehicleColumns}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} vehicles`,
          }}
          loading={tableQuery.isLoading || tableQuery.isFetching}
        />
      </List>

      {/* Vehicle Details Modal */}
      <Modal
        title={`Vehicle Details - ${selectedVehicle?.plateNumber}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          selectedVehicle && (
            <EditButton
              key="edit"
              type="primary"
              recordItemId={selectedVehicle.id}
              onClick={() => setDetailsModalVisible(false)}
            >
              Edit Vehicle
            </EditButton>
          ),
        ]}
      >
        {selectedVehicle && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Brand & Model">
              {selectedVehicle.brand} {selectedVehicle.modelName}
            </Descriptions.Item>
            <Descriptions.Item label="Year">
              {selectedVehicle.manufactureYear}
            </Descriptions.Item>
            <Descriptions.Item label="Color">
              {selectedVehicle.color}
            </Descriptions.Item>
            <Descriptions.Item label="Plate Number">
              {selectedVehicle.plateNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Identification Number">
              <Text code>{selectedVehicle.identificationNumber}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Inspection Status">
              <Space>
                <Tag
                  color={getStatusColor(
                    getInspectionStatus(selectedVehicle.vehicleInspectionDone)
                  )}
                >
                  {getInspectionStatus(
                    selectedVehicle.vehicleInspectionDone
                  ).toUpperCase()}
                </Tag>
                <Switch
                  checked={selectedVehicle.vehicleInspectionDone}
                  onChange={(checked) => {
                    handleInspectionToggle(selectedVehicle.id, checked);
                    setSelectedVehicle({
                      ...selectedVehicle,
                      vehicleInspectionDone: checked,
                    });
                  }}
                  loading={updatingVehicle}
                  checkedChildren="Approved"
                  unCheckedChildren="Pending"
                />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {new Date(selectedVehicle.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(selectedVehicle.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};
