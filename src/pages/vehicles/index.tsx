// import React, { useState } from "react";
// import { useNotification, useCustomMutation } from "@refinedev/core";
// import {
//   List,
//   useTable,
//   FilterDropdown,
//   getDefaultSortOrder,
// } from "@refinedev/antd";
// import {
//   Table,
//   Space,
//   Tag,
//   Typography,
//   Select,
//   Button,
//   Card,
//   Row,
//   Col,
//   Input,
//   Badge,
//   Modal,
//   Descriptions,
//   Statistic,
//   Form,
//   message,
//   Tooltip,
//   Alert,
//   Dropdown,
//   Menu,
// } from "antd";
// import { ColumnsType } from "antd/es/table";
// import {
//   CarFilled,
//   CarOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   WarningOutlined,
//   EyeOutlined,
//   EditOutlined,
//   ToolOutlined,
//   SearchOutlined,
//   FilterOutlined,
//   ReloadOutlined,
//   SafetyOutlined,
//   DownOutlined,
// } from "@ant-design/icons";

// const { Text, Title } = Typography;
// const { Option } = Select;

// // Updated Vehicle Types and Interfaces
// type InspectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

// interface Vehicle {
//   id: string;
//   brand: string;
//   modelName: string;
//   manufactureYear: string;
//   color: string;
//   identificationNumber: string;
//   plateNumber: string;
//   vehicleInspectionDone: boolean;
//   driverId: string | undefined;
//   createdAt: string;
//   updatedAt: string;
//   inspectionStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  
// }

// // Status mapping and configuration
// const INSPECTION_STATUS_CONFIG = {
//   PENDING: {
//     text: 'Pending',
//     color: 'warning',
//     icon: <WarningOutlined />,
//     tagColor: 'orange',
//   },
//   APPROVED: {
//     text: 'Approved',
//     color: 'success',
//     icon: <CheckCircleOutlined />,
//     tagColor: 'green',
//   },
//   REJECTED: {
//     text: 'Rejected',
//     color: 'error',
//     icon: <CloseCircleOutlined />,
//     tagColor: 'red',
//   },
//   EXPIRED: {
//     text: 'Expired',
//     color: 'default',
//     icon: <WarningOutlined />,
//     tagColor: 'gray',
//   },
// } as const;

// // Status options for dropdown
// const STATUS_OPTIONS = [
//   { value: 'PENDING', label: 'Pending', color: 'orange' },
//   { value: 'APPROVED', label: 'Approved', color: 'green' },
//   { value: 'REJECTED', label: 'Rejected', color: 'red' },
//   { value: 'EXPIRED', label: 'Expired', color: 'gray' },
// ];

// // Vehicle List Component
// export const VehicleList: React.FC = () => {
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const { open } = useNotification();

//   // Mutation for updating vehicle inspection
//   const { mutate: updateVehicleInspection, isLoading: updatingVehicle } =
//     useCustomMutation();

//   // Get vehicle data with table hooks
//   const { tableProps, sorters, searchFormProps, tableQuery } =
//     useTable<Vehicle>({
//       resource: "vehicles",
//       initialSorter: [
//         {
//           field: "createdAt",
//           order: "desc",
//         },
//       ],
//       onSearch: (params: any) => {
//         return [
//           {
//             field: "search",
//             operator: "contains",
//             value: params.search,
//           },
//         ];
//       },
//       syncWithLocation: true,
//     });

//   // Handle viewing vehicle details
//   const handleViewDetails = (vehicle: Vehicle) => {
//     setSelectedVehicle(vehicle);
//     setDetailsModalVisible(true);
//   };

//   // Updated function to handle inspection status changes
//   const handleInspectionStatusChange = async (
//     vehicleId: string,
//     driverId: string | undefined,
//     newStatus: InspectionStatus
//   ) => {
//     if (!driverId) {
//       message.error("Driver ID is required to update inspection status");
//       return;
//     }

//     try {
//       await updateVehicleInspection(
//         {
//           url: "update-vehicle",
//           method: "post",
//           values: {
//             input: {
//               id: vehicleId,
//               driverId: driverId,
//               inspectionStatus: newStatus,
//             },
//           },
//         },
//         {
//           onSuccess: (data: any) => {
//             const statusText = INSPECTION_STATUS_CONFIG[newStatus].text;
//             message.success(`Vehicle inspection status updated to ${statusText}`);
            
//             // Update local state for immediate UI feedback
//             const updatedVehicles = tableProps.dataSource?.map((vehicle: Vehicle) => 
//               vehicle.id === vehicleId 
//                 ? { 
//                     ...vehicle, 
//                     inspectionStatus: newStatus,
//                     vehicleInspectionDone: newStatus === 'APPROVED'
//                   } 
//                 : vehicle
//             );
            
//             // Update table data
//             if (updatedVehicles) {
//               // Note: You might need to use a different method to update table data
//               // depending on your Refine version. This is a conceptual approach.
//               tableQuery.refetch();
//             }
            
//             // Update selected vehicle if it's the one being modified
//             if (selectedVehicle?.id === vehicleId) {
//               setSelectedVehicle(prev => prev ? {
//                 ...prev,
//                 inspectionStatus: newStatus,
//                 vehicleInspectionDone: newStatus === 'APPROVED'
//               } : null);
//             }
//           },
//           onError: (error: any) => {
//             console.error("Inspection update error:", error);
//             message.error(`Failed to update inspection: ${error.message || "Unknown error"}`);
//           },
//         }
//       );
//     } catch (error: any) {
//       console.error("Inspection update exception:", error);
//       message.error("Failed to update inspection status");
//     }
//   };

//   // Get current inspection status (falls back to derived status if not provided)
//   const getCurrentInspectionStatus = (vehicle: Vehicle): InspectionStatus => {
//     console.log(vehicle.inspectionStatus?.toUpperCase(),"inspectionStatus")
//     return vehicle.inspectionStatus?.toUpperCase();
//   };

//   // Get status configuration
//   const getStatusConfig = (status: InspectionStatus) => {
//     return INSPECTION_STATUS_CONFIG[status] || INSPECTION_STATUS_CONFIG.PENDING;
//   };

//   // Status dropdown menu
//   const renderStatusMenu = (vehicle: Vehicle) => (
//     <Menu
//       onClick={({ key }) => {
//         handleInspectionStatusChange(
//           vehicle.id, 
//           vehicle.driverId, 
//           key as InspectionStatus
//         );
//       }}
//     >
//       {STATUS_OPTIONS.map(option => (
//         <Menu.Item 
//           key={option.value} 
//           icon={getStatusConfig(option.value as InspectionStatus).icon}
//           disabled={option.value === getCurrentInspectionStatus(vehicle)}
//         >
//           <span style={{ color: option.color }}>{option.label}</span>
//         </Menu.Item>
//       ))}
//     </Menu>
//   );

//   // Vehicle columns definition
//   const vehicleColumns: ColumnsType<Vehicle> = [
//     {
//       title: "Vehicle",
//       key: "vehicle",
//       render: (_: any, record: Vehicle) => (
//         <Space>
//           <CarFilled style={{ fontSize: "24px", color: "#1890ff" }} />
//           <div>
//             <div>
//               <Text strong>
//                 {record.brand} {record.modelName} ({record.manufactureYear})
//               </Text>
//             </div>
//             <div style={{ fontSize: "12px", color: "#666" }}>
//               {record.plateNumber}
//             </div>
//             <div style={{ fontSize: "12px", color: "#666" }}>
//               {record.color}
//             </div>
//           </div>
//         </Space>
//       ),
//       sorter: true,
//       defaultSortOrder: getDefaultSortOrder("brand", sorters),
//     },
//     {
//       title: "Identification Number",
//       dataIndex: "identificationNumber",
//       key: "identificationNumber",
//       render: (vin: string) => <Text code>{vin}</Text>,
//     },
//     {
//       title: "Inspection Status",
//       key: "inspectionStatus",
//       render: (_: any, record: Vehicle) => {
//         const currentStatus = getCurrentInspectionStatus(record);
//         const statusConfig = getStatusConfig(currentStatus);
        
//         return (
//           <Space>
//             <Tag color={statusConfig.tagColor}>
//               {statusConfig.icon} {statusConfig.text}
//             </Tag>
//             <Dropdown 
//               overlay={renderStatusMenu(record)} 
//               trigger={['click']}
//               disabled={updatingVehicle}
//             >
//               <Button 
//                 size="small" 
//                 loading={updatingVehicle}
//                 icon={<DownOutlined />}
//               >
//                 Change
//               </Button>
//             </Dropdown>
//           </Space>
//         );
//       },
//       filterDropdown: (props: any) => (
//         <FilterDropdown {...props}>
//           <Select
//             style={{ minWidth: 200 }}
//             placeholder="Filter by inspection status"
//             allowClear
//             value={props.selectedKeys?.[0]}
//             onChange={(value) => {
//               props.setSelectedKeys(value ? [value] : []);
//             }}
//             onBlur={() => {
//               props.confirm();
//             }}
//           >
//             {STATUS_OPTIONS.map(option => (
//               <Option key={option.value} value={option.value}>
//                 {option.label}
//               </Option>
//             ))}
//           </Select>
//         </FilterDropdown>
//       ),
//     },
//     {
//       title: "Created",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//       sorter: true,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       fixed: "right" as const,
//       width: 150,
//       render: (_: any, record: Vehicle) => (
//         <Space>
//           <Tooltip title="View Details">
//             <Button
//               icon={<EyeOutlined />}
//               size="small"
//               onClick={() => handleViewDetails(record)}
//               loading={tableQuery.isFetching}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   // Get vehicle statistics
//   const getVehicleStats = () => {
//     const data = tableProps.dataSource || [];
//     const statusCounts = {
//       total: data.length,
//       approved: 0,
//       pending: 0,
//       rejected: 0,
//       expired: 0,
//     };

//     data.forEach((vehicle: Vehicle) => {
//       const status = getCurrentInspectionStatus(vehicle);
//       switch (status) {
//         case 'APPROVED':
//           statusCounts.approved++;
//           break;
//         case 'PENDING':
//           statusCounts.pending++;
//           break;
//         case 'REJECTED':
//           statusCounts.rejected++;
//           break;
//         case 'EXPIRED':
//           statusCounts.expired++;
//           break;
//       }
//     });

//     return statusCounts;
//   };

//   const stats = getVehicleStats();

//   return (
//     <>
//       <List
//         breadcrumb={false}
//         title={
//           <div>
//             <Title level={3}>Vehicle Management</Title>
//             <Text type="secondary">
//               Manage vehicle registrations and inspections
//             </Text>
//           </div>
//         }
//         headerButtons={() => (
//           <Space>
//             <Button
//               icon={<ReloadOutlined />}
//               onClick={() => tableQuery.refetch()}
//               loading={tableQuery.isFetching}
//             >
//               Refresh
//             </Button>
//           </Space>
//         )}
//       >
//         {tableQuery.error && (
//           <Alert
//             message="Error Loading Vehicles"
//             description={tableQuery.error.message}
//             type="error"
//             showIcon
//             style={{ marginBottom: 16 }}
//           />
//         )}

//         {/* Summary Cards */}
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={6}>
//             <Card size="small">
//               <Statistic
//                 title="Total Vehicles"
//                 value={stats.total}
//                 prefix={<CarFilled />}
//                 loading={tableQuery.isLoading}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size="small">
//               <Statistic
//                 title="Approved"
//                 value={stats.approved}
//                 prefix={<CheckCircleOutlined />}
//                 valueStyle={{ color: "#52c41a" }}
//                 loading={tableQuery.isLoading}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size="small">
//               <Statistic
//                 title="Pending"
//                 value={stats.pending}
//                 prefix={<WarningOutlined />}
//                 valueStyle={{ color: "#faad14" }}
//                 loading={tableQuery.isLoading}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size="small">
//               <Statistic
//                 title="Rejected/Expired"
//                 value={stats.rejected + stats.expired}
//                 prefix={<CloseCircleOutlined />}
//                 valueStyle={{ color: "#ff4d4f" }}
//                 loading={tableQuery.isLoading}
//               />
//             </Card>
//           </Col>
//         </Row>

//         {/* Search and Filters */}
//         <Card style={{ marginBottom: 16 }}>
//           <Form {...searchFormProps} layout="inline">
//             <Form.Item name="search">
//               <Input
//                 placeholder="Search by plate number, brand, or VIN"
//                 prefix={<SearchOutlined />}
//                 style={{ width: 350 }}
//               />
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={tableQuery.isFetching}
//               >
//                 Search
//               </Button>
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 onClick={() => {
//                   searchFormProps.form?.resetFields();
//                   tableQuery.refetch();
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>

//         {/* Vehicles Table */}
//         <Table<Vehicle>
//           {...tableProps}
//           columns={vehicleColumns}
//           rowKey="id"
//           scroll={{ x: 1000 }}
//           pagination={{
//             ...tableProps.pagination,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} vehicles`,
//           }}
//           loading={tableQuery.isLoading || tableQuery.isFetching}
//         />
//       </List>

//       {/* Vehicle Details Modal */}
//       <Modal
//         title={`Vehicle Details - ${selectedVehicle?.plateNumber}`}
//         open={detailsModalVisible}
//         onCancel={() => setDetailsModalVisible(false)}
//         width={600}
//         footer={[
//           <Button key="close" onClick={() => setDetailsModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//       >
//         {selectedVehicle && (
//           <Descriptions bordered column={1}>
//             <Descriptions.Item label="Brand & Model">
//               {selectedVehicle.brand} {selectedVehicle.modelName}
//             </Descriptions.Item>
//             <Descriptions.Item label="Year">
//               {selectedVehicle.manufactureYear}
//             </Descriptions.Item>
//             <Descriptions.Item label="Color">
//               {selectedVehicle.color}
//             </Descriptions.Item>
//             <Descriptions.Item label="Plate Number">
//               {selectedVehicle.plateNumber}
//             </Descriptions.Item>
//             <Descriptions.Item label="Identification Number">
//               <Text code>{selectedVehicle.identificationNumber}</Text>
//             </Descriptions.Item>
//             <Descriptions.Item label="Driver ID">
//               {selectedVehicle.driverId || "Not assigned"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Inspection Status">
//               <Space direction="vertical" style={{ width: '100%' }}>
//                 <Space>
//                   {(() => {
//                     const currentStatus = getCurrentInspectionStatus(selectedVehicle);
//                     const statusConfig = getStatusConfig(currentStatus);
//                     return (
//                       <Tag color={statusConfig.tagColor}>
//                         {statusConfig.icon} {statusConfig.text}
//                       </Tag>
//                     );
//                   })()}
//                 </Space>
//                 <Dropdown 
//                   overlay={renderStatusMenu(selectedVehicle)} 
//                   trigger={['click']}
//                   disabled={updatingVehicle}
//                 >
//                   <Button 
//                     type="primary" 
//                     loading={updatingVehicle}
//                     icon={<DownOutlined />}
//                     block
//                   >
//                     Update Inspection Status
//                   </Button>
//                 </Dropdown>
//               </Space>
//             </Descriptions.Item>
//             <Descriptions.Item label="Created">
//               {new Date(selectedVehicle.createdAt).toLocaleString()}
//             </Descriptions.Item>
//             <Descriptions.Item label="Last Updated">
//               {new Date(selectedVehicle.updatedAt).toLocaleString()}
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>
//     </>
//   );
// };


import React, { useState } from "react";
import { useNotification, useCustomMutation, useNavigation } from "@refinedev/core";
import {
  List,
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
  Dropdown,
  Menu,
  Avatar,
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
  DownOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

// Updated Vehicle Types and Interfaces
type InspectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

interface Vehicle {
  id: string;
  brand: string;
  modelName: string;
  manufactureYear: string;
  color: string;
  identificationNumber: string;
  plateNumber: string;
  vehicleInspectionDone: boolean;
  driverId: string | undefined;
  createdAt: string;
  updatedAt: string;
  inspectionStatus: InspectionStatus;
  driver?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: { fullPhone: string };
    profilePhoto?: string;
    driverLicenseVerified: boolean;
  };
}

// Status mapping and configuration
const INSPECTION_STATUS_CONFIG = {
  PENDING: {
    text: 'Pending',
    color: 'warning',
    icon: <WarningOutlined />,
    tagColor: 'orange',
  },
  APPROVED: {
    text: 'Approved',
    color: 'success',
    icon: <CheckCircleOutlined />,
    tagColor: 'green',
  },
  REJECTED: {
    text: 'Rejected',
    color: 'error',
    icon: <CloseCircleOutlined />,
    tagColor: 'red',
  },
  EXPIRED: {
    text: 'Expired',
    color: 'default',
    icon: <WarningOutlined />,
    tagColor: 'gray',
  },
} as const;

// Status options for dropdown
const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'orange' },
  { value: 'APPROVED', label: 'Approved', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'EXPIRED', label: 'Expired', color: 'gray' },
];

// Vehicle List Component
export const VehicleList: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { open } = useNotification();
  const { show } = useNavigation();

  // Mutation for updating vehicle inspection
  const { mutate: updateVehicleInspection, isLoading: updatingVehicle } =
    useCustomMutation();

  // Get vehicle data with table hooks
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

  // Handle viewing vehicle details
  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsModalVisible(true);
  };

  // Handle navigation to driver
  const handleViewDriver = (driverId: string) => {
    show("drivers", driverId);
  };

  // Updated function to handle inspection status changes
  const handleInspectionStatusChange = async (
    vehicleId: string,
    driverId: string | undefined,
    newStatus: InspectionStatus
  ) => {
    if (!driverId) {
      message.error("Driver ID is required to update inspection status");
      return;
    }

    try {
      await updateVehicleInspection(
        {
          url: "update-vehicle",
          method: "post",
          values: {
            input: {
              id: vehicleId,
              driverId: driverId,
              inspectionStatus: newStatus,
            },
          },
        },
        {
          onSuccess: (data: any) => {
            const statusText = INSPECTION_STATUS_CONFIG[newStatus].text;
            message.success(`Vehicle inspection status updated to ${statusText}`);
            
            // Update local state for immediate UI feedback
            const updatedVehicles = tableProps.dataSource?.map((vehicle: Vehicle) => 
              vehicle.id === vehicleId 
                ? { 
                    ...vehicle, 
                    inspectionStatus: newStatus,
                    vehicleInspectionDone: newStatus === 'APPROVED'
                  } 
                : vehicle
            );
            
            // Update table data
            if (updatedVehicles) {
              tableQuery.refetch();
            }
            
            // Update selected vehicle if it's the one being modified
            if (selectedVehicle?.id === vehicleId) {
              setSelectedVehicle(prev => prev ? {
                ...prev,
                inspectionStatus: newStatus,
                vehicleInspectionDone: newStatus === 'APPROVED'
              } : null);
            }
          },
          onError: (error: any) => {
            console.error("Inspection update error:", error);
            message.error(`Failed to update inspection: ${error.message || "Unknown error"}`);
          },
        }
      );
    } catch (error: any) {
      console.error("Inspection update exception:", error);
      message.error("Failed to update inspection status");
    }
  };

  // Get current inspection status
  const getCurrentInspectionStatus = (vehicle: Vehicle): InspectionStatus => {
    return vehicle.inspectionStatus;
  };

  // Get status configuration
  const getStatusConfig = (status: InspectionStatus) => {
    return INSPECTION_STATUS_CONFIG[status] || INSPECTION_STATUS_CONFIG.PENDING;
  };

  // Status dropdown menu
  const renderStatusMenu = (vehicle: Vehicle) => (
    <Menu
      onClick={({ key }) => {
        handleInspectionStatusChange(
          vehicle.id, 
          vehicle.driverId, 
          key as InspectionStatus
        );
      }}
    >
      {STATUS_OPTIONS.map(option => (
        <Menu.Item 
          key={option.value} 
          icon={getStatusConfig(option.value as InspectionStatus).icon}
          disabled={option.value === getCurrentInspectionStatus(vehicle)}
        >
          <span style={{ color: option.color }}>{option.label}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Vehicle columns definition
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
            {record.driver && (
              <div style={{ fontSize: "12px", color: "#722ed1" }}>
                <UserOutlined style={{ marginRight: 4 }} />
                {record.driver.firstname} {record.driver.lastname}
              </div>
            )}
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder("brand", sorters),
    },
    {
      title: "Driver",
      key: "driver",
      render: (_: any, record: Vehicle) => (
        record.driver ? (
          <Space>
            <Avatar
              size="small"
              src={record.driver.profilePhoto}
              icon={<UserOutlined />}
            />
            <div>
              <div>
                {record.driver.firstname} {record.driver.lastname}
              </div>
              <div style={{ fontSize: "11px", color: "#666" }}>
                {record.driver.email}
              </div>
            </div>
          </Space>
        ) : (
          <Text type="secondary">No driver assigned</Text>
        )
      ),
    },
    {
      title: "Identification Number",
      dataIndex: "identificationNumber",
      key: "identificationNumber",
      render: (vin: string) => <Text code>{vin}</Text>,
    },
    {
      title: "Inspection Status",
      key: "inspectionStatus",
      render: (_: any, record: Vehicle) => {
        const currentStatus = getCurrentInspectionStatus(record);
        const statusConfig = getStatusConfig(currentStatus);
        
        return (
          <Space>
            <Tag color={statusConfig.tagColor}>
              {statusConfig.icon} {statusConfig.text}
            </Tag>
            <Dropdown 
              overlay={renderStatusMenu(record)} 
              trigger={['click']}
              disabled={updatingVehicle}
            >
              <Button 
                size="small" 
                loading={updatingVehicle}
                icon={<DownOutlined />}
              >
                Change
              </Button>
            </Dropdown>
          </Space>
        );
      },
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            placeholder="Filter by inspection status"
            allowClear
            value={props.selectedKeys?.[0]}
            onChange={(value) => {
              props.setSelectedKeys(value ? [value] : []);
            }}
            onBlur={() => {
              props.confirm();
            }}
          >
            {STATUS_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </FilterDropdown>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 180,
      render: (_: any, record: Vehicle) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
              loading={tableQuery.isFetching}
            />
          </Tooltip>
          {record.driverId && (
            <Tooltip title="View Driver">
              <Button
                icon={<UserOutlined />}
                size="small"
                onClick={() => handleViewDriver(record.driverId!)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Get vehicle statistics
  const getVehicleStats = () => {
    const data = tableProps.dataSource || [];
    const statusCounts = {
      total: data.length,
      approved: 0,
      pending: 0,
      rejected: 0,
      expired: 0,
    };

    data.forEach((vehicle: Vehicle) => {
      const status = getCurrentInspectionStatus(vehicle);
      switch (status) {
        case 'APPROVED':
          statusCounts.approved++;
          break;
        case 'PENDING':
          statusCounts.pending++;
          break;
        case 'REJECTED':
          statusCounts.rejected++;
          break;
        case 'EXPIRED':
          statusCounts.expired++;
          break;
      }
    });

    return statusCounts;
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
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Vehicles"
                value={stats.total}
                prefix={<CarFilled />}
                loading={tableQuery.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Pending"
                value={stats.pending}
                prefix={<WarningOutlined />}
                valueStyle={{ color: "#faad14" }}
                loading={tableQuery.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Rejected/Expired"
                value={stats.rejected + stats.expired}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
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
                placeholder="Search by plate number, brand, or VIN"
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
            <Form.Item>
              <Button
                onClick={() => {
                  searchFormProps.form?.resetFields();
                  tableQuery.refetch();
                }}
              >
                Clear Filters
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
        title={
          <Space>
            <CarFilled />
            <span>Vehicle Details - {selectedVehicle?.plateNumber}</span>
          </Space>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        width={700}
        footer={[
          <Space key="footer">
            {selectedVehicle?.driverId && (
              <Button
                icon={<UserOutlined />}
                onClick={() => handleViewDriver(selectedVehicle.driverId!)}
              >
                View Driver
              </Button>
            )}
            <Button key="close" onClick={() => setDetailsModalVisible(false)}>
              Close
            </Button>
          </Space>,
        ]}
      >
        {selectedVehicle && (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions bordered column={1} size="small">
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
                    <Text strong>{selectedVehicle.plateNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Identification Number">
                    <Text code>{selectedVehicle.identificationNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {new Date(selectedVehicle.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {new Date(selectedVehicle.updatedAt).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              
              <Col span={12}>
                {/* Driver Information Card */}
                <Card 
                  size="small" 
                  title={
                    <Space>
                      <UserOutlined />
                      <span>Driver Information</span>
                    </Space>
                  }
                  style={{ marginBottom: 16 }}
                >
                  {selectedVehicle.driver ? (
                    <div>
                      <Space align="start" style={{ marginBottom: 16 }}>
                        <Avatar
                          size="large"
                          src={selectedVehicle.driver.profilePhoto}
                          icon={<UserOutlined />}
                        />
                        <div>
                          <div>
                            <Text strong>
                              {selectedVehicle.driver.firstname} {selectedVehicle.driver.lastname}
                            </Text>
                            {selectedVehicle.driver.driverLicenseVerified && (
                              <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {selectedVehicle.driver.email}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {selectedVehicle.driver.phone.fullPhone}
                          </div>
                        </div>
                      </Space>
                      <Button
                        type="link"
                        icon={<LinkOutlined />}
                        onClick={() => handleViewDriver(selectedVehicle.driverId!)}
                        size="small"
                        block
                      >
                        View Driver Details
                      </Button>
                    </div>
                  ) : (
                    <Alert
                      message="No Driver Assigned"
                      description="This vehicle has not been assigned to a driver."
                      type="info"
                      showIcon
                    />
                  )}
                </Card>

                {/* Inspection Status Card */}
                <Card size="small" title="Inspection Status">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      {(() => {
                        const currentStatus = getCurrentInspectionStatus(selectedVehicle);
                        const statusConfig = getStatusConfig(currentStatus);
                        return (
                          <Tag color={statusConfig.tagColor} style={{ fontSize: '14px', padding: '4px 8px' }}>
                            {statusConfig.icon} {statusConfig.text}
                          </Tag>
                        );
                      })()}
                    </Space>
                    <Dropdown 
                      overlay={renderStatusMenu(selectedVehicle)} 
                      trigger={['click']}
                      disabled={updatingVehicle}
                    >
                      <Button 
                        type="primary" 
                        loading={updatingVehicle}
                        icon={<DownOutlined />}
                        block
                      >
                        Update Inspection Status
                      </Button>
                    </Dropdown>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </>
  );
};
