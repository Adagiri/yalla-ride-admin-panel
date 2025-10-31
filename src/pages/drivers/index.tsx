// import React, { useState } from 'react';
// import {
//   List,
//   useTable,
//   FilterDropdown,
//   getDefaultSortOrder,
// } from '@refinedev/antd';
// import { useGo } from '@refinedev/core';
// import {
//   Table,
//   Space,
//   Tag,
//   Avatar,
//   Typography,
//   Select,
//   Button,
//   Card,
//   Row,
//   Col,
//   Input,
//   Switch,
//   Badge,
//   Drawer,
//   Descriptions,
//   Statistic,
//   Modal,
//   Form,
//   message,
//   Tooltip,
// } from 'antd';
// import {
//   UserOutlined,
//   CarOutlined,
//   EyeOutlined,
//   ReloadOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   DollarOutlined,
//   StarOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   EnvironmentOutlined,
// } from '@ant-design/icons';
// import { ColumnsType } from 'antd/es/table';

// const { Text, Title } = Typography;
// const { Option } = Select;

// interface Driver {
//   id: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   phone: {
//     fullPhone: string;
//   };
//   isOnline: boolean;
//   isAvailable: boolean;
//   paymentModel: 'SUBSCRIPTION' | 'COMMISSION';
//   stats: {
//     totalTrips: number;
//     averageRating: number;
//     totalEarnings: number;
//   };
//   profilePhotoSet: boolean;
//   profilePhoto?: string;
//   personalInfoSet: boolean;
//   driverLicenseVerified: boolean;
//   vehicleInspectionDone: boolean;
//   createdAt: string;
//   updatedAt: string;
//   currentLocation?: {
//     coordinates: [number, number];
//   };
//   walletBalance?: number;
// }

// export const DriverList: React.FC = () => {
//   const go = useGo();
//   const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
//   const [drawerVisible, setDrawerVisible] = useState(false);

//   const { tableProps, sorters, searchFormProps } = useTable<Driver>({
//     resource: 'drivers',
//     initialSorter: [
//       {
//         field: 'createdAt',
//         order: 'desc',
//       },
//     ],
//     onSearch: (params: any) => {
//       return [
//         {
//           field: 'search',
//           operator: 'contains',
//           value: params.search,
//         },
//       ];
//     },
//     syncWithLocation: true,
//   });

//   const handleViewDriver = (driver: Driver) => {
//     setSelectedDriver(driver);
//     setDrawerVisible(true);
//   };

//   const columns: ColumnsType<Driver> = [
//     {
//       title: 'Driver',
//       key: 'driver',
//       render: (_: any, record: Driver) => (
//         <Space>
//           <Avatar
//             src={record.profilePhoto}
//             icon={<UserOutlined />}
//             size='large'
//           />
//           <div>
//             <div>
//               <Text strong>
//                 {record.firstname} {record.lastname}
//               </Text>
//               {record.profilePhotoSet && (
//                 <CheckCircleOutlined
//                   style={{ color: '#52c41a', marginLeft: 8 }}
//                 />
//               )}
//             </div>
//             <div style={{ fontSize: '12px', color: '#666' }}>
//               {record.email}
//             </div>
//             <div style={{ fontSize: '12px', color: '#666' }}>
//               {record.phone.fullPhone}
//             </div>
//           </div>
//         </Space>
//       ),
//       sorter: true,
//       defaultSortOrder: getDefaultSortOrder('firstname', sorters),
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       render: (_: any, record: Driver) => (
//         <Space direction='vertical' size='small'>
//           <Badge
//             status={record.isOnline ? 'success' : 'default'}
//             text={record.isOnline ? 'Online' : 'Offline'}
//           />
//           <Badge
//             status={record.isAvailable ? 'processing' : 'default'}
//             text={record.isAvailable ? 'Available' : 'Busy'}
//           />
//         </Space>
//       ),
//       filterDropdown: (props: any) => (
//         <FilterDropdown {...props}>
//           <Select
//             style={{ minWidth: 200 }}
//             placeholder='Select status'
//             allowClear
//           >
//             <Option value='online'>Online</Option>
//             <Option value='offline'>Offline</Option>
//             <Option value='available'>Available</Option>
//             <Option value='busy'>Busy</Option>
//           </Select>
//         </FilterDropdown>
//       ),
//     },
//     {
//       title: 'Payment Model',
//       dataIndex: 'paymentModel',
//       key: 'paymentModel',
//       render: (model: string) => (
//         <Tag color={model === 'SUBSCRIPTION' ? 'blue' : 'orange'}>{model}</Tag>
//       ),
//       filterDropdown: (props: any) => (
//         <FilterDropdown {...props}>
//           <Select
//             style={{ minWidth: 200 }}
//             placeholder='Select payment model'
//             allowClear
//           >
//             <Option value='SUBSCRIPTION'>Subscription</Option>
//             <Option value='COMMISSION'>Commission</Option>
//           </Select>
//         </FilterDropdown>
//       ),
//     },
//     {
//       title: 'Verification',
//       key: 'verification',
//       render: (_: any, record: Driver) => (
//         <Space direction='vertical' size='small'>
//           <div>
//             <Text style={{ fontSize: '12px' }}>Personal Info: </Text>
//             {record.personalInfoSet ? (
//               <CheckCircleOutlined style={{ color: '#52c41a' }} />
//             ) : (
//               <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
//             )}
//           </div>
//           <div>
//             <Text style={{ fontSize: '12px' }}>License: </Text>
//             {record.driverLicenseVerified ? (
//               <CheckCircleOutlined style={{ color: '#52c41a' }} />
//             ) : (
//               <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
//             )}
//           </div>
//           <div>
//             <Text style={{ fontSize: '12px' }}>Vehicle: </Text>
//             {record.vehicleInspectionDone ? (
//               <CheckCircleOutlined style={{ color: '#52c41a' }} />
//             ) : (
//               <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
//             )}
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: 'Performance',
//       key: 'performance',
//       render: (_: any, record: Driver) => (
//         <Space direction='vertical' size='small'>
//           <div>
//             <StarOutlined style={{ color: '#faad14' }} />
//             <Text style={{ marginLeft: 4 }}>
//               {record.stats.averageRating.toFixed(1)}
//             </Text>
//           </div>
//           <div>
//             <CarOutlined style={{ color: '#1890ff' }} />
//             <Text style={{ marginLeft: 4 }}>
//               {record.stats.totalTrips} trips
//             </Text>
//           </div>
//           <div>
//             <DollarOutlined style={{ color: '#52c41a' }} />
//             <Text style={{ marginLeft: 4 }}>
//               ₦{record.stats.totalEarnings.toLocaleString()}
//             </Text>
//           </div>
//         </Space>
//       ),
//       sorter: {
//         multiple: 1,
//       },
//     },
//     {
//       title: 'Joined',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date: string) => (
//         <Text>{new Date(date).toLocaleDateString()}</Text>
//       ),
//       sorter: true,
//       defaultSortOrder: getDefaultSortOrder('createdAt', sorters),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       fixed: 'right',
//       width: 100,
//       render: (_: any, record: Driver) => (
//         <Space>
//           <Tooltip title='View Details'>
//             <Button
//               icon={<EyeOutlined />}
//               size='small'
//               onClick={() => handleViewDriver(record)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <List
//         breadcrumb={false}
//         headerButtons={() => (
//           <Space>
//             <Button
//               icon={<ReloadOutlined />}
//               onClick={() => {
//                 tableProps?.onChange?.(
//                   tableProps.pagination || {
//                     current: 1,
//                     pageSize: 10,
//                     total: 0,
//                   },
//                   {},
//                   {},
//                   {
//                     currentDataSource: [...(tableProps.dataSource || [])],
//                     action: 'paginate',
//                   }
//                 );
//               }}
//             >
//               Refresh
//             </Button>
//           </Space>
//         )}
//         title={
//           <div>
//             <Title level={3}>Driver Management</Title>
//             <Text type='secondary'>
//               Manage drivers, track performance, and handle verifications
//             </Text>
//           </div>
//         }
//       >
//         {/* Summary Cards */}
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={6}>
//             <Card size='small'>
//               <Statistic
//                 title='Total Drivers'
//                 value={tableProps.dataSource?.length || 0}
//                 prefix={<UserOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size='small'>
//               <Statistic
//                 title='Online Drivers'
//                 value={
//                   tableProps.dataSource?.filter((d: Driver) => d.isOnline)
//                     .length || 0
//                 }
//                 prefix={<CheckCircleOutlined />}
//                 valueStyle={{ color: '#52c41a' }}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size='small'>
//               <Statistic
//                 title='Available Drivers'
//                 value={
//                   tableProps.dataSource?.filter((d: Driver) => d.isAvailable)
//                     .length || 0
//                 }
//                 prefix={<CarOutlined />}
//                 valueStyle={{ color: '#1890ff' }}
//               />
//             </Card>
//           </Col>
//           <Col span={6}>
//             <Card size='small'>
//               <Statistic
//                 title='Verified Drivers'
//                 value={
//                   tableProps.dataSource?.filter(
//                     (d: Driver) => d.driverLicenseVerified
//                   ).length || 0
//                 }
//                 prefix={<CheckCircleOutlined />}
//                 valueStyle={{ color: '#722ed1' }}
//               />
//             </Card>
//           </Col>
//         </Row>

//         {/* Search and Filters */}
//         <Card style={{ marginBottom: 16 }}>
//           <Form {...searchFormProps} layout='inline'>
//             <Form.Item name='search'>
//               <Input
//                 placeholder='Search drivers by name, email, or phone'
//                 prefix={<EnvironmentOutlined />}
//                 style={{ width: 300 }}
//               />
//             </Form.Item>
//             <Form.Item>
//               <Button type='primary' htmlType='submit'>
//                 Search
//               </Button>
//             </Form.Item>
//             <Form.Item>
//               <Button
//                 icon={<EnvironmentOutlined />}
//                 onClick={() => {
//                   // Reset filters
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>

//         {/* Drivers Table */}
//         <Table<Driver>
//           {...tableProps}
//           columns={columns}
//           rowKey='id'
//           scroll={{ x: 1200 }}
//           pagination={{
//             ...tableProps.pagination,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} drivers`,
//           }}
//         />
//       </List>

//       {/* Driver Details Drawer */}
//       <Drawer
//         title='Driver Details'
//         placement='right'
//         size='large'
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//       >
//         {selectedDriver && (
//           <Space direction='vertical' style={{ width: '100%' }} size='large'>
//             {/* Driver Profile */}
//             <Card title='Profile Information'>
//               <div style={{ textAlign: 'center', marginBottom: 24 }}>
//                 <Avatar
//                   size={80}
//                   src={selectedDriver.profilePhoto}
//                   icon={<UserOutlined />}
//                 />
//                 <Title level={4} style={{ margin: '8px 0' }}>
//                   {selectedDriver.firstname} {selectedDriver.lastname}
//                 </Title>
//                 <Space>
//                   <Badge
//                     status={selectedDriver.isOnline ? 'success' : 'default'}
//                     text={selectedDriver.isOnline ? 'Online' : 'Offline'}
//                   />
//                   <Badge
//                     status={
//                       selectedDriver.isAvailable ? 'processing' : 'default'
//                     }
//                     text={selectedDriver.isAvailable ? 'Available' : 'Busy'}
//                   />
//                 </Space>
//               </div>

//               <Descriptions column={1} bordered>
//                 <Descriptions.Item
//                   label={
//                     <Space>
//                       <MailOutlined />
//                       Email
//                     </Space>
//                   }
//                 >
//                   {selectedDriver.email}
//                 </Descriptions.Item>
//                 <Descriptions.Item
//                   label={
//                     <Space>
//                       <PhoneOutlined />
//                       Phone
//                     </Space>
//                   }
//                 >
//                   {selectedDriver.phone.fullPhone}
//                 </Descriptions.Item>
//                 <Descriptions.Item label='Payment Model'>
//                   <Tag
//                     color={
//                       selectedDriver.paymentModel === 'SUBSCRIPTION'
//                         ? 'blue'
//                         : 'orange'
//                     }
//                   >
//                     {selectedDriver.paymentModel}
//                   </Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label='Joined'>
//                   {new Date(selectedDriver.createdAt).toLocaleDateString()}
//                 </Descriptions.Item>
//               </Descriptions>
//             </Card>

//             {/* Performance Metrics */}
//             <Card title='Performance Metrics'>
//               <Row gutter={16}>
//                 <Col span={8}>
//                   <Statistic
//                     title='Total Trips'
//                     value={selectedDriver.stats.totalTrips}
//                     prefix={<CarOutlined />}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Statistic
//                     title='Average Rating'
//                     value={selectedDriver.stats.averageRating}
//                     precision={1}
//                     prefix={<StarOutlined />}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <Statistic
//                     title='Total Earnings'
//                     value={selectedDriver.stats.totalEarnings}
//                     prefix='₦'
//                     formatter={(value) => value?.toLocaleString()}
//                   />
//                 </Col>
//               </Row>
//               {selectedDriver.walletBalance !== undefined && (
//                 <div style={{ marginTop: 16 }}>
//                   <Statistic
//                     title='Wallet Balance'
//                     value={selectedDriver.walletBalance}
//                     prefix='₦'
//                     formatter={(value) => value?.toLocaleString()}
//                   />
//                 </div>
//               )}
//             </Card>

//             {/* Verification Status */}
//             <Card title='Verification Status'>
//               <Space direction='vertical' style={{ width: '100%' }}>
//                 <div
//                   style={{ display: 'flex', justifyContent: 'space-between' }}
//                 >
//                   <Text>Profile Photo:</Text>
//                   {selectedDriver.profilePhotoSet ? (
//                     <Tag color='green'>Complete</Tag>
//                   ) : (
//                     <Tag color='red'>Incomplete</Tag>
//                   )}
//                 </div>
//                 <div
//                   style={{ display: 'flex', justifyContent: 'space-between' }}
//                 >
//                   <Text>Personal Information:</Text>
//                   {selectedDriver.personalInfoSet ? (
//                     <Tag color='green'>Complete</Tag>
//                   ) : (
//                     <Tag color='red'>Incomplete</Tag>
//                   )}
//                 </div>
//                 <div
//                   style={{ display: 'flex', justifyContent: 'space-between' }}
//                 >
//                   <Text>Driver License:</Text>
//                   {selectedDriver.driverLicenseVerified ? (
//                     <Tag color='green'>Verified</Tag>
//                   ) : (
//                     <Tag color='orange'>Pending</Tag>
//                   )}
//                 </div>
//                 <div
//                   style={{ display: 'flex', justifyContent: 'space-between' }}
//                 >
//                   <Text>Vehicle Inspection:</Text>
//                   {selectedDriver.vehicleInspectionDone ? (
//                     <Tag color='green'>Done</Tag>
//                   ) : (
//                     <Tag color='red'>Pending</Tag>
//                   )}
//                 </div>
//               </Space>
//             </Card>
//           </Space>
//         )}
//       </Drawer>
//     </>
//   );
// };



import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  useTable,
  useNotification,
  useCustomMutation,
  useCustom,
} from '@refinedev/core';
import {
  List,
  getDefaultSortOrder,
} from '@refinedev/antd';
import {
  Table,
  Space,
  Tag,
  Avatar,
  Typography,
  Button,
  Card,
  Row,
  Col,
  Input,
  Badge,
  Drawer,
  Statistic,
  Tooltip,
  Switch,
  Image,
  Spin,
  Alert,
  Form,
} from 'antd';
import {
  UserOutlined,
  CarOutlined,
  EyeOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  PictureOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: {
    fullPhone: string;
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
  stats?: {
    totalTrips: number;
    averageRating: number;
    totalEarnings: number;
  };
  paymentModel?: string;
}

interface VerificationSectionProps {
  title: string;
  verified: boolean;
  onToggle: (verified: boolean) => void;
  images?: { front?: string; back?: string };
  loading?: boolean;
  canBeVerified?: boolean;
}

const VerificationSection: React.FC<VerificationSectionProps> = memo(({
  title,
  verified,
  onToggle,
  images,
  loading = false,
  canBeVerified = true,
}) => {
  const [imageUrls, setImageUrls] = useState<{ front?: string; back?: string }>({});
  const [loadingImages, setLoadingImages] = useState<{ front: boolean; back: boolean }>({
    front: false,
    back: false,
  });
  const { open } = useNotification();
   
  const { 
    data: frontData, 
    isLoading: frontIsLoading, 
    error: frontError 
  } = useCustom({
    url: 'get-file-download-url',
    method: 'get',
    config: {
      payload: {
        key: images?.front,
      },
      query: {
        key: images?.front,
      },
    },
    queryOptions: {
      enabled: !!images?.front,
      onSuccess: (data) => {
        if (data) {
          setImageUrls(prev => ({ ...prev, front: data.data })); 
        }
      },
      onError: (error) => {
        console.error('❌ Front image fetch error:', error);
      },
    },
  });

  const { 
    data: backData, 
    isLoading: backIsLoading, 
    error: backError 
  } = useCustom<string>({
    url: 'get-file-download-url',
    method: 'get', 
    config: {
      payload: {
        key: images?.back,
      },
      query: {
        key: images?.back,
      },
    },
    queryOptions: {
      enabled: !!images?.back, 
      onSuccess: (data) => {
        if (data) {
          setImageUrls(prev => ({ ...prev, back: data.data })); 
        }
      },
      onError: (error) => {
        console.error('Back image fetch error:', error);
        open?.({ type: 'error', message: 'Failed to load back image' });
      },
    },
  });

  useEffect(() => {
    setLoadingImages({
      front: frontIsLoading,
      back: backIsLoading,
    });
  }, [frontIsLoading, backIsLoading]);

  const renderImageWithFallback = (url: string | undefined, loading: boolean, alt: string, error?: any) => {
    if (error) return <Alert message="Failed to load image" type="error" showIcon />;
    if (loading) return <Spin tip="Loading image..." />;
    if (url) {
      return (
        <Image
          src={url}
          alt={alt}
          style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
          placeholder={<Spin />}
        />
      );
    }
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <ExclamationCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
        <div style={{ marginTop: 8 }}>Image not available</div>
      </div>
    );
  };

  return (
    <Card 
      size="small" 
      style={{ 
        border: `2px solid ${verified ? '#52c41a' : '#d9d9d9'}`,
        marginBottom: 16 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          {title === 'Profile Photo' && <PictureOutlined />}
          {title === 'Driver License' && <IdcardOutlined />}
          {title === 'Vehicle Inspection' && <CarOutlined />}
          {title === 'Personal Information' && <UserOutlined />}
          <Text strong>{title}</Text>
        </Space>
        
        <Space>
          <Badge 
            status={verified ? "success" : "default"} 
            text={verified ? "Verified" : "Pending"} 
          />
          {canBeVerified && (
            <Switch
              checked={verified}
              onChange={onToggle}
              loading={loading}
              checkedChildren="Approved"
              unCheckedChildren="Reject"
            />
          )}
        </Space>
      </div>

      {title === 'Driver License' && (images?.front || images?.back) && (
        <div>
          <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            License Images:
          </Text>
          <Row gutter={16}>
            {images.front && (
              <Col span={12}>
                <Card size="small" title="Front Side">
                  {renderImageWithFallback(imageUrls.front, loadingImages.front, "Driver License Front", frontError)}
                </Card>
              </Col>
            )}
            {images.back && (
              <Col span={12}>
                <Card size="small" title="Back Side">
                  {renderImageWithFallback(imageUrls.back, loadingImages.back, "Driver License Back", backError)}
                </Card>
              </Col>
            )}
          </Row>
        </div>
      )}

      {title === 'Profile Photo' && images?.front && (
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            Profile Photo:
          </Text>
          {renderImageWithFallback(imageUrls.front, loadingImages.front, "Profile Photo", frontError)}
        </div>
      )}
    </Card>
  );
});

export const DriverList: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { open } = useNotification();
  const [searchForm] = Form.useForm();

  // Use table hook with proper filter management
  const { 
    tableProps, 
    sorters, 
    tableQueryResult, 
    setFilters,
    current,
    setCurrent,
    filters: currentFilters,
    searchFormProps 
  } = useTable<Driver>({
    resource: 'drivers',
    initialSorter: [{ field: 'createdAt', order: 'desc' }],
    syncWithLocation: true,
    onSearch: (values: any) => {
      
      const filters = [];
      if (values.search && values.search.trim()) {
        filters.push({
          field: 'search',
          operator: 'eq',
          value: values.search.trim(),
        });
      }
      
      return filters;
    },
    queryOptions: {
      retry: 3,
      onError: (error) => {
        console.error('Table fetch error:', error);
        open?.({ type: 'error', message: 'Failed to load drivers. Please check backend connection.' });
      },
    },
  });

  const { mutate: mutateLicense } = useCustomMutation();
  const { mutate: mutateInspection } = useCustomMutation();

  const dataSource = tableQueryResult?.data?.data || [];
  const pagination = tableProps?.pagination || { current: 1, pageSize: 10, total: 0 };

  // Handle search with proper filter management
  const handleSearch = useCallback((values: { search?: string }) => {
    
    const newFilters = [];
    if (values.search && values.search.trim()) {
      newFilters.push({
        field: 'search',
        operator: 'contains',
        value: values.search.trim(),
      });
    }
    
    setFilters(newFilters);
    setCurrent(1); // Reset to first page
  }, [setFilters, setCurrent]);

  // Handle reset - COMPLETE reset using Refine's built-in methods
  const handleReset = useCallback(() => {
    //  Reset form fields
    searchForm.resetFields();
    // Clear ALL filters (this is the key fix)
    setFilters([], 'replace');
    // Reset to first page
    setCurrent(1);
    // Refetch the data 
    tableQueryResult.refetch();
  }, [searchForm, setFilters, setCurrent, tableQueryResult]);

  // Sync form with current filters
  useEffect(() => {
    const searchFilter = currentFilters?.find((f: any) => f.field === 'search');
    if (searchFilter) {
      searchForm.setFieldValue('search', searchFilter.value);
    } else {
      searchForm.setFieldValue('search', '');
    }
  }, [currentFilters, searchForm]);

  // Handle individual driver actions
  const handleViewDriver = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
    setDrawerVisible(true);
  }, []);

  const handleLicenseVerification = useCallback((verified: boolean) => {
    if (!selectedDriver?.id) {
      open?.({ type: 'error', message: 'No driver selected' });
      return;
    }

    mutateLicense({
      url: 'toggle-driver-license-verification',
      method: 'post',
      values: {
        userId: selectedDriver.id,
        verified,
      }
    }, {
      onSuccess: (data) => {
        open?.({ type: 'success', message: `License ${verified ? 'approved' : 'rejected'}` });
        setSelectedDriver(prev => prev ? { ...prev, driverLicenseVerified: verified } : null);
        tableQueryResult.refetch();
      },
      onError: (error) => open?.({ type: 'error', message: `Failed: ${error.message}` }),
    });
  }, [selectedDriver, open, mutateLicense, tableQueryResult]);

  const handleVehicleInspection = useCallback((inspected: boolean) => {
    if (!selectedDriver?.id) {
      open?.({ type: 'error', message: 'No driver selected' });
      return;
    }

    mutateInspection({
      url: 'toggle-vehicle-inspection',
      method: 'post', 
      values: {
        userId: selectedDriver.id,
        inspected
      }
    }, {
      onSuccess: (data) => {
        open?.({ type: 'success', message: `Inspection ${inspected ? 'approved' : 'rejected'}` });
        setSelectedDriver(prev => prev ? { ...prev, vehicleInspectionDone: inspected } : null);
        tableQueryResult.refetch();
      },
      onError: (error) => open?.({ type: 'error', message: `Failed: ${error.message}` }),
    });
  }, [selectedDriver, open, mutateInspection, tableQueryResult]);

  // Table columns definition
  const columns = [
    {
      title: 'Driver',
      key: 'driver',
      render: (_: any, record: Driver) => (
        <Space>
          <Avatar 
            src={record.profilePhoto} 
            icon={<UserOutlined />} 
            size='large' 
          />
          <div>
            <div>
              <Text strong>{record.firstname} {record.lastname}</Text>
              {record.profilePhotoSet && (
                <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.phone?.fullPhone}</div>
          </div>
        </Space>
      ),
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('firstname', sorters),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Driver) => (
        <Space direction='vertical' size='small'>
          <Badge status={record.isOnline ? 'success' : 'default'} text={record.isOnline ? 'Online' : 'Offline'} />
          <Badge status={record.isAvailable ? 'processing' : 'default'} text={record.isAvailable ? 'Available' : 'Busy'} />
        </Space>
      ),
      filters: [
        { text: 'Online', value: 'online' },
        { text: 'Offline', value: 'offline' },
      ],
      onFilter: (value: any, record: Driver) => {
        if (value === 'online') return record.isOnline;
        if (value === 'offline') return !record.isOnline;
        return true;
      },
    },
    {
      title: 'Payment Model',
      dataIndex: 'paymentModel',
      key: 'paymentModel',
      render: (model: string) => (
        <Tag color={model === 'SUBSCRIPTION' ? 'blue' : 'orange'}>
          {model || 'COMMISSION'}
        </Tag>
      ),
      filters: [
        { text: 'Subscription', value: 'SUBSCRIPTION' },
        { text: 'Commission', value: 'COMMISSION' },
      ],
      onFilter: (value: any, record: Driver) => record.paymentModel === value,
    },
    {
      title: 'Verification Status',
      key: 'verification',
      render: (_: any, record: Driver) => (
        <Space direction="vertical" size="small">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PictureOutlined /><Text>Profile: </Text>
            {record.profilePhotoSet ? 
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined /><Text>Personal: </Text>
            {record.personalInfoSet ? 
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IdcardOutlined /><Text>License: </Text>
            {record.driverLicenseVerified ? 
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CarOutlined /><Text>Vehicle: </Text>
            {record.vehicleInspectionDone ? 
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            }
          </div>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_: any, record: Driver) => (
        <Tooltip title='View Details & Verify'>
          <Button 
            icon={<EyeOutlined />} 
            size='small' 
            type="primary" 
            onClick={() => handleViewDriver(record)}
          >
            Verify
          </Button>
        </Tooltip>
      ),
    },
  ];

  const hasActiveFilters = currentFilters && currentFilters.length > 0;

  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            loading={tableQueryResult.isFetching}
          >
            Refresh
          </Button>
        )}
        title={
          <div>
            <Title level={3}>Driver Management</Title>
            <Text type='secondary'>
              Manage drivers, track performance, and handle verifications
            </Text>
          </div>
        }
      >
        {tableQueryResult.error && (
          <Alert
            message="Error Loading Drivers"
            description={tableQueryResult.error.message}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Summary Cards */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Total Drivers'
                value={dataSource.length}
                prefix={<UserOutlined />}
                loading={tableQueryResult.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Online Drivers'
                value={dataSource.filter(d => d.isOnline).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
                loading={tableQueryResult.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Verified Drivers'
                value={dataSource.filter(d => d.driverLicenseVerified && d.vehicleInspectionDone).length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
                loading={tableQueryResult.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small'>
              <Statistic
                title='Pending Verification'
                value={dataSource.filter(d => !d.driverLicenseVerified || !d.vehicleInspectionDone).length}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
                loading={tableQueryResult.isLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Form 
            form={searchForm}
            onFinish={handleSearch}
            layout='inline'
            initialValues={{ search: '' }}
          >
            <Form.Item name="search">
              <Input
                placeholder='Search drivers by name, email, or phone'
                
                style={{ width: 300 }}
                allowClear
                onPressEnter={() => searchForm.submit()}
                onBlur={(e) => {
                  // Auto-search when input loses focus with value
                  if (e.target.value.trim()) {
                    searchForm.submit();
                  }
                }}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button 
                  type='primary' 
                  htmlType='submit' 
                  loading={tableQueryResult.isFetching}
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
                <Button 
                  onClick={handleReset}
                  loading={tableQueryResult.isFetching}
                  icon={<ReloadOutlined />}
                  disabled={!hasActiveFilters}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
            
          </Form>
        </Card>

        {/* Drivers Table */}
        <Table<Driver>
          {...tableProps}
          dataSource={dataSource}
          columns={columns}
          rowKey='id'
          scroll={{ x: 1200 }}
          pagination={pagination}
          loading={tableQueryResult.isLoading || tableQueryResult.isFetching}
        />
      </List>

      {/* Driver Details Drawer */}
      <Drawer
        title={
          <Space>
            <UserOutlined />
            <span>Driver Verification - {selectedDriver?.firstname} {selectedDriver?.lastname}</span>
          </Space>
        }
        placement='right'
        size="large"
        onClose={() => { setDrawerVisible(false); setSelectedDriver(null); }}
        open={drawerVisible}
        width={800}
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => selectedDriver && handleViewDriver(selectedDriver)}
          >
            Refresh
          </Button>
        }
      >
        {selectedDriver && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert 
              message="Verification Dashboard" 
              description="Review and verify driver documents." 
              type="info" 
              showIcon 
            />
            
            <VerificationSection 
              title="Profile Photo" 
              verified={selectedDriver.profilePhotoSet} 
              onToggle={() => {}} 
              images={{ front: selectedDriver.profilePhoto }} 
              canBeVerified={false} 
            />
            
            <VerificationSection 
              title="Personal Information" 
              verified={selectedDriver.personalInfoSet} 
              onToggle={() => {}} 
              canBeVerified={false} 
            />
            
            <VerificationSection 
              title="Driver License" 
              verified={selectedDriver.driverLicenseVerified} 
              onToggle={handleLicenseVerification} 
              images={{ front: selectedDriver.driverLicenseFront, back: selectedDriver.driverLicenseBack }} 
              loading={false} 
              canBeVerified={!!selectedDriver.driverLicenseFront && !!selectedDriver.driverLicenseBack} 
            />
            
            <VerificationSection 
              title="Vehicle Inspection" 
              verified={selectedDriver.vehicleInspectionDone} 
              onToggle={handleVehicleInspection} 
              loading={false} 
              canBeVerified={true} 
            />

            <Card 
              title="Overall Verification Status" 
              style={{ 
                background: selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone ? '#f6ffed' : '#fff2e8', 
                border: `2px solid ${selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone ? '#52c41a' : '#faad14'}`
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Complete Verification:</Text>
                  <Badge 
                    status={selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone ? 'success' : 'warning'} 
                    text={selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone ? 'Fully Verified' : 'Pending Verification'} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Can Accept Rides:</Text>
                  <Text strong={selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone}>
                    {selectedDriver.driverLicenseVerified && selectedDriver.vehicleInspectionDone ? 'Yes' : 'No'}
                  </Text>
                </div>
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </>
  );
};