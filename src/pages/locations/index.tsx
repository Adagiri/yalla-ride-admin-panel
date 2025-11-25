import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  List,
  useTable,
  DeleteButton,
  FilterDropdown,
  getDefaultSortOrder,
} from "@refinedev/antd";
import { useInvalidate, CrudFilter } from "@refinedev/core";
import {
  Table,
  Space,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Alert,
  message,
  Descriptions,
  Badge,
  Tooltip,
  App,
  Avatar,
  Statistic,
  Drawer,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  EnvironmentOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  AimOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  FlagOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { MapComponent } from "../../components/map";
import { reverseGeocode, validateCoordinates } from "../../utils/index";
import { useLocationForm } from "../../hooks/useLocationForm";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  boundary?: {
    type: "Polygon";
    coordinates: [[[number, number]]];
  };
  locationType: "estate" | "landmark" | "general";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const Locations: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedBoundary, setSelectedBoundary] = useState<
    [[[number, number]]] | null
  >(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 8.4799, lng: 4.5418 });

  const { message: messageApi } = App.useApp();
  const invalidate = useInvalidate();

  const { tableProps, sorters, searchFormProps, setFilters } =
    useTable<Location>({
      resource: "locations",
      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
      onSearch: (params: any) => {
        const filters: CrudFilter[] = [];
        if (params.search) {
          filters.push({
            field: "search",
            operator: "contains" as const,
            value: params.search,
          });
        }
        if (params.locationType) {
          filters.push({
            field: "locationType",
            operator: "eq" as const,
            value: params.locationType,
          });
        }
        if (params.isActive !== undefined) {
          filters.push({
            field: "isActive",
            operator: "eq" as const,
            value: params.isActive,
          });
        }
        return filters;
      },
      syncWithLocation: true,
    });

  const handleClearFilters = () => {
    searchFormProps.form?.resetFields();
    setFilters([], "replace");
    invalidate({
      resource: "locations",
      invalidates: ["list"],
    });
  };

  const handleSuccess = useCallback(() => {
    invalidate({
      resource: "locations",
      invalidates: ["list"],
    });
    resetForm();
    setCreateModalVisible(false);
    setEditModalVisible(false);
  }, [invalidate]);

  const {
    form,
    createFormProps,
    editFormProps,
    handleCreateSubmit,
    handleEditSubmit,
    selectedLocation: editSelectedLocation,
    setSelectedLocation: setEditSelectedLocation,
  } = useLocationForm({
    onSuccess: handleSuccess,
  });

  const currentFormRef = useRef(form);

  useEffect(() => {
    currentFormRef.current = form;
  }, [form]);

  const resetForm = () => {
    setSelectedCoordinates(null);
    setSelectedBoundary(null);
    setEditSelectedLocation(null);
    currentFormRef.current?.resetFields();
  };

  const handleLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      if (!validateCoordinates(lat, lng)) {
        messageApi.error("Invalid coordinates selected");
        return;
      }

      setSelectedCoordinates({ lat, lng });
      setMapCenter({ lat, lng });

      setIsFetchingAddress(true);
      try {
        const address = await reverseGeocode(lat, lng);
        currentFormRef.current?.setFieldValue("address", address);
        messageApi.success("Address fetched successfully");
      } catch (error) {
        console.error("Failed to fetch address:", error);
        messageApi.warning("Could not fetch address automatically");
      } finally {
        setIsFetchingAddress(false);
      }

      currentFormRef.current?.setFieldsValue({
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
    },
    [messageApi]
  );

  const handleBoundaryComplete = useCallback(
    (boundary: [[[number, number]]]) => {
      // console.log("Boundary completed:", boundary);
      setSelectedBoundary(boundary);

      const isValid = boundary && boundary[0] && boundary[0].length >= 3;
      if (isValid) {
        messageApi.success(
          `Boundary drawn with ${boundary[0]?.length || 0} points`
        );
      }
    },
    [messageApi]
  );

  const handleEdit = (record: Location) => {
    setEditSelectedLocation(record);

    if (record.location?.coordinates) {
      const coords = {
        lat: record.location.coordinates[1],
        lng: record.location.coordinates[0],
      };
      setSelectedCoordinates(coords);
      setMapCenter(coords);
    }

    if (record.boundary?.coordinates) {
      setSelectedBoundary(record.boundary.coordinates);
    } else {
      setSelectedBoundary(null);
    }

    setTimeout(() => {
      currentFormRef.current?.setFieldsValue({
        name: record.name,
        description: record.description,
        address: record.address,
        locationType: record.locationType,
        isActive: record.isActive,
        location: record.location,
        boundary: record.boundary,
      });
    }, 100);

    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const handleCreateModalClose = () => {
    setCreateModalVisible(false);
    resetForm();
  };

  const handleView = (record: Location) => {
    setSelectedLocation(record);
    setDrawerVisible(true);
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
    resetForm();
    setMapCenter({ lat: 8.4799, lng: 4.5418 });
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "estate":
        return "blue";
      case "landmark":
        return "green";
      case "general":
        return "orange";
      default:
        return "default";
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case "estate":
        return <HomeOutlined />;
      case "landmark":
        return <FlagOutlined />;
      case "general":
        return <GlobalOutlined />;
      default:
        return <EnvironmentOutlined />;
    }
  };

  const isBoundaryValid = (boundary: [[[number, number]]] | null): boolean => {
    return !!(boundary && boundary[0] && boundary[0].length >= 3);
  };

  const formatBoundaryForSubmission = (
    boundary: [[[number, number]]] | null
  ) => {
    if (!isBoundaryValid(boundary)) {
      return undefined;
    }

    return {
      type: "Polygon",
      coordinates: boundary,
    };
  };

  const handleFormSubmit = useCallback(
    async (values: any, isEdit: boolean) => {
      try {
        // console.log("Form values:", values);
        // console.log("Selected boundary:", selectedBoundary);
        // console.log("Editing location ID:", editSelectedLocation?.id);

        const submitData: any = {
          name: values.name,
          description: values.description,
          address: values.address,
          locationType: values.locationType,
          isActive: values.isActive !== undefined ? values.isActive : true,
          location: {
            type: "Point",
            coordinates: values.location?.coordinates || [0, 0],
          },
        };

        const formattedBoundary = formatBoundaryForSubmission(selectedBoundary);
        if (formattedBoundary) {
          submitData.boundary = formattedBoundary;
          // console.log("Including boundary:", submitData.boundary);
        } else {
          // console.log("No valid boundary to include");
          if (
            isEdit &&
            editSelectedLocation?.boundary &&
            !isBoundaryValid(selectedBoundary)
          ) {
            submitData.boundary = null;
          }
        }

        // console.log("Final data for submission:", submitData);
        // console.log("Is edit mode:", isEdit);
        // console.log("Location ID for edit:", editSelectedLocation?.id);

        if (isEdit) {
          if (!editSelectedLocation?.id) {
            throw new Error("Location ID is missing for editing");
          }
          await handleEditSubmit(submitData, editSelectedLocation.id);
        } else {
          await handleCreateSubmit(submitData);
        }
      } catch (error: any) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    [
      selectedBoundary,
      editSelectedLocation,
      handleCreateSubmit,
      handleEditSubmit,
    ]
  );

  const totalLocations = tableProps.dataSource?.length || 0;
  const activeLocations =
    tableProps.dataSource?.filter((loc) => loc.isActive).length || 0;
  const locationsWithBoundary =
    tableProps.dataSource?.filter((loc) => loc.boundary).length || 0;
  const estateLocations =
    tableProps.dataSource?.filter((loc) => loc.locationType === "estate")
      .length || 0;

  const columns: ColumnType<Location>[] = [
    {
      title: "Location",
      key: "location",
      render: (_: any, record: Location) => (
        <Space>
          <Avatar
            icon={getLocationTypeIcon(record.locationType)}
            style={{
              backgroundColor:
                getLocationTypeColor(record.locationType) === "blue"
                  ? "#1890ff"
                  : getLocationTypeColor(record.locationType) === "green"
                  ? "#52c41a"
                  : "#fa8c16",
            }}
            size="large"
          />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              {record.isActive && (
                <CheckCircleOutlined
                  style={{ color: "#52c41a", marginLeft: 8 }}
                />
              )}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.address || "No address"}
            </div>
            <div style={{ fontSize: "11px", color: "#999" }}>
              {record.location.coordinates[0].toFixed(6)},{" "}
              {record.location.coordinates[1].toFixed(6)}
            </div>
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder("name", sorters),
    },
    {
      title: "Type",
      dataIndex: "locationType",
      key: "locationType",
      render: (type: string) => (
        <Tag
          color={getLocationTypeColor(type)}
          icon={getLocationTypeIcon(type)}
        >
          {type.toUpperCase()}
        </Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 120 }}
            placeholder="Select type"
            allowClear
          >
            <Option value="estate">Estate</Option>
            <Option value="landmark">Landmark</Option>
            <Option value="general">General</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? "success" : "error"}
          text={isActive ? "Active" : "Inactive"}
        />
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 120 }}
            placeholder="Select status"
            allowClear
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: "Boundary",
      key: "boundary",
      render: (_: any, record: Location) => (
        <Space>
          {record.boundary ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          )}
          <Text style={{ fontSize: "12px" }}>
            {record.boundary ? "Has Boundary" : "No Boundary"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder("createdAt", sorters),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: Location) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Location">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Location">
            <DeleteButton
              hideText
              size="small"
              recordItemId={record.id}
              onSuccess={() => {
                messageApi.success("Location deleted successfully");
                invalidate({
                  resource: "locations",
                  invalidates: ["list"],
                });
              }}
              confirmTitle="Delete Location"
              confirmOkText="Yes, Delete"
              confirmCancelText="Cancel"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderLocationForm = (isEdit: boolean = false) => {
    const formProps = isEdit ? editFormProps : createFormProps;
    const isLoading = isEdit
      ? editFormProps?.mutation?.isPending
      : createFormProps?.mutation?.isPending;
    const selectedLocation = isEdit ? editSelectedLocation : null;

    // Create clean form props without the id property that conflicts with Ant Design
    // const cleanFormProps = { ...formProps };
    // delete (cleanFormProps as any).id;
    const { id, ...formPropsWithoutId } = formProps as any;

    return (
      <Form
        {...formPropsWithoutId}
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          try {
            await handleFormSubmit(values, isEdit);
          } catch (error: any) {
            messageApi.error(
              error.message ||
                `Failed to ${isEdit ? "update" : "create"} location`
            );
          }
        }}
        initialValues={
          isEdit && selectedLocation
            ? {
                name: selectedLocation.name,
                description: selectedLocation.description,
                address: selectedLocation.address,
                locationType: selectedLocation.locationType,
                isActive: selectedLocation.isActive,
                location: selectedLocation.location,
                boundary: selectedLocation.boundary,
              }
            : {
                locationType: "general",
                isActive: true,
                location: { type: "Point", coordinates: [0, 0] },
              }
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter location name" },
              ]}
            >
              <Input placeholder="Enter location name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Location Type"
              name="locationType"
              rules={[
                { required: true, message: "Please select location type" },
              ]}
            >
              <Select size="large">
                <Option value="estate">Estate</Option>
                <Option value="landmark">Landmark</Option>
                <Option value="general">General</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Address"
          name="address"
          extra={
            isFetchingAddress
              ? "Fetching address..."
              : "Click on map to auto-fetch address or enter manually"
          }
        >
          <TextArea
            rows={2}
            placeholder="Address will be auto-filled when you click on the map, or enter manually"
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            rows={3}
            placeholder="Enter location description (optional)"
          />
        </Form.Item>

        <Form.Item label="Map Selection">
          <Alert
            message={
              <div>
                <strong>Map Instructions:</strong>
                <ul style={{ margin: "8px 0", paddingLeft: "16px" }}>
                  <li>Click on map to set location coordinates</li>
                  <li>
                    Use polygon tool (top center) to draw service boundaries
                  </li>
                  <li>Right-click polygon to delete</li>
                  <li>Drag polygon vertices to edit shape</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {selectedBoundary && (
            <Alert
              message={
                <div>
                  <strong>Boundary Status:</strong>
                  <div style={{ marginTop: 4 }}>
                    Points: {selectedBoundary[0]?.length || 0}
                    <br />
                    Valid:{" "}
                    {isBoundaryValid(selectedBoundary)
                      ? "✅"
                      : "❌ (Need 3+ points)"}
                  </div>
                </div>
              }
              type={isBoundaryValid(selectedBoundary) ? "success" : "warning"}
              showIcon
              style={{ marginBottom: 8 }}
            />
          )}

          <MapComponent
            onLocationSelect={handleLocationSelect}
            onBoundaryComplete={handleBoundaryComplete}
            selectedCoordinates={selectedCoordinates}
            selectedBoundary={selectedBoundary}
            enableDrawing={true}
            center={mapCenter}
            existingLocations={
              isEdit ? [] : (tableProps.dataSource as Location[]) || []
            }
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Longitude" name={["location", "coordinates", 0]}>
              <Input
                disabled
                placeholder="Auto-filled from map click"
                suffix={<AimOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Latitude" name={["location", "coordinates", 1]}>
              <Input
                disabled
                placeholder="Auto-filled from map click"
                suffix={<AimOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Active Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              style={{ minWidth: 120 }}
            >
              {isEdit ? "Update Location" : "Create Location"}
            </Button>
            <Button
              size="large"
              onClick={isEdit ? handleEditModalClose : handleCreateModalClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <List
      breadcrumb={false}
      headerProps={{
        style: {
          background: "#fff",
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
        },
      }}
      headerButtons={[
        <Button
          key="refresh"
          icon={<ReloadOutlined />}
          onClick={() => {
            invalidate({
              resource: "locations",
              invalidates: ["list"],
            });
          }}
        >
          Refresh
        </Button>,
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Create Location
        </Button>,
      ]}
      title={
        <div>
          <Title level={3}>Location Management</Title>
          <Text type="secondary">
            Manage locations, boundaries, and service areas
          </Text>
        </div>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Locations"
              value={totalLocations}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Active Locations"
              value={activeLocations}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="With Boundaries"
              value={locationsWithBoundary}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Estates"
              value={estateLocations}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Form {...searchFormProps} layout="inline">
          <Form.Item name="search">
            <Input
              placeholder="Search locations by name or address"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item name="locationType">
            <Select
              placeholder="Location Type"
              style={{ width: 150 }}
              allowClear
            >
              <Option value="estate">Estate</Option>
              <Option value="landmark">Landmark</Option>
              <Option value="general">General</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isActive">
            <Select placeholder="Status" style={{ width: 120 }} allowClear>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleClearFilters}
              disabled={
                !searchFormProps.form?.getFieldValue("search") &&
                !searchFormProps.form?.getFieldValue("locationType") &&
                searchFormProps.form?.getFieldValue("isActive") === undefined
              }
            >
              Clear Filters
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} locations`,
          }}
        />
      </Card>

      <Modal
        title="Create New Location"
        open={createModalVisible}
        onCancel={handleCreateModalClose}
        width={1200}
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
      >
        {renderLocationForm(false)}
      </Modal>

      <Modal
        title={`Edit Location - ${editSelectedLocation?.name || "Loading..."}`}
        open={editModalVisible}
        onCancel={handleEditModalClose}
        width={1200}
        style={{ top: 20 }}
        footer={null}
        destroyOnClose
      >
        {editSelectedLocation && renderLocationForm(true)}
      </Modal>

      <Modal
        title={`Location Details - ${editSelectedLocation?.name}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          editSelectedLocation && (
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                setViewModalVisible(false);
                handleEdit(editSelectedLocation);
              }}
            >
              Edit Location
            </Button>
          ),
        ]}
      >
        {editSelectedLocation && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              <Text strong>{editSelectedLocation.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {editSelectedLocation.address || "No address provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Coordinates">
              <Text code>
                Longitude:{" "}
                {editSelectedLocation.location.coordinates[0].toFixed(6)}
                <br />
                Latitude:{" "}
                {editSelectedLocation.location.coordinates[1].toFixed(6)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag
                color={getLocationTypeColor(editSelectedLocation.locationType)}
              >
                {editSelectedLocation.locationType.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                status={editSelectedLocation.isActive ? "success" : "error"}
                text={editSelectedLocation.isActive ? "Active" : "Inactive"}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {editSelectedLocation.description || "No description provided"}
            </Descriptions.Item>
            {editSelectedLocation.boundary && (
              <Descriptions.Item label="Has Boundary">
                <Tag color="green">Yes</Tag>
                <Text
                  type="secondary"
                  style={{ marginLeft: 8, fontSize: "12px" }}
                >
                  {editSelectedLocation.boundary.coordinates[0].length} points
                </Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Created">
              {new Date(editSelectedLocation.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(editSelectedLocation.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Drawer
        title="Location Details"
        placement="right"
        size="large"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedLocation && (
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Card title="Location Information">
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar
                  size={80}
                  icon={getLocationTypeIcon(selectedLocation.locationType)}
                  style={{
                    backgroundColor:
                      getLocationTypeColor(selectedLocation.locationType) ===
                      "blue"
                        ? "#1890ff"
                        : getLocationTypeColor(
                            selectedLocation.locationType
                          ) === "green"
                        ? "#52c41a"
                        : "#fa8c16",
                  }}
                />
                <Title level={4} style={{ margin: "8px 0" }}>
                  {selectedLocation.name}
                </Title>
                <Space>
                  <Badge
                    status={selectedLocation.isActive ? "success" : "error"}
                    text={selectedLocation.isActive ? "Active" : "Inactive"}
                  />
                  <Tag
                    color={getLocationTypeColor(selectedLocation.locationType)}
                  >
                    {selectedLocation.locationType.toUpperCase()}
                  </Tag>
                </Space>
              </div>

              <Descriptions column={1} bordered>
                <Descriptions.Item label="Address">
                  {selectedLocation.address || "No address provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Coordinates">
                  <Text code>
                    Longitude:{" "}
                    {selectedLocation.location.coordinates[0].toFixed(6)}
                    <br />
                    Latitude:{" "}
                    {selectedLocation.location.coordinates[1].toFixed(6)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {selectedLocation.description || "No description provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Boundary">
                  {selectedLocation.boundary ? (
                    <Tag color="green">
                      Yes ({selectedLocation.boundary.coordinates[0].length}{" "}
                      points)
                    </Tag>
                  ) : (
                    <Tag color="red">No</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {new Date(selectedLocation.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {new Date(selectedLocation.updatedAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Drawer>
    </List>
  );
};
