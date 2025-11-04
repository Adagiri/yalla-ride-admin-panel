// import React, { useState } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Typography,
//   Button,
//   Space,
//   Form,
//   Input,
//   InputNumber,
//   Switch,
//   Select,
//   Alert,
//   Divider,
//   message,
//   Tabs,
//   Progress,
//   Statistic,
//   Spin,
//   Descriptions,
//   Tag,
//   Upload,
// } from "antd";
// import {
//   SettingOutlined,
//   DollarOutlined,
//   SafetyOutlined,
//   GlobalOutlined,
//   UploadOutlined,
//   DownloadOutlined,
//   DatabaseOutlined,
//   CloudOutlined,
//   UserOutlined,
//   SaveOutlined,
//   ReloadOutlined,
//   ExportOutlined,
//   ImportOutlined,
//   CreditCardOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import { useCustom, useCustomMutation } from "@refinedev/core";

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { TabPane } = Tabs;

// // Types
// interface SettingsFormData {
//   // General Settings
//   applicationName?: string;
//   supportPhone?: string;
//   defaultCurrency?: "NGN" | "USD";
//   supportEmail?: string;
//   timeZone?: "WAT" | "UTC";
//   defaultLanguage?: "en" | "ha" | "ig" | "yo";

//   // Pricing Settings
//   baseFare?: number;
//   perKmRate?: number;
//   perMinuteRate?: number;
//   minimumFare?: number;
//   maximumFare?: number;
//   surgeMultiplier?: number;
//   commissionRate?: number;
//   cancellationFee?: number;

//   // Payment Settings
//   cashPaymentsEnabled?: boolean;
//   walletPaymentsEnabled?: boolean;
//   paystackEnabled?: boolean;
//   flutterwaveEnabled?: boolean;
//   minimumWalletBalance?: number;
//   processingFeeRate?: number;
//   autoTopupEnabled?: boolean;
//   autoTopupThreshold?: number;
//   autoTopupAmount?: number;

//   // Security Settings
//   sessionTimeoutHours?: number;
//   maxLoginAttempts?: number;
//   minimumPasswordLength?: number;
//   requireStrongPasswords?: boolean;
//   requireMfaForAdmins?: boolean;
//   enable2faForAllUsers?: boolean;
//   enableIpWhitelisting?: boolean;
//   allowedIps?: string[];
//   enableAuditLogging?: boolean;
// }

// // System Settings Component
// export const SystemSettings: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("general");
//   const [loading, setLoading] = useState(false);

//   // General Settings
//   const {
//     data: generalData,
//     isLoading: generalLoading,
//     refetch: refetchGeneral,
//   } = useCustom({
//     url: "get-general-settings",
//     method: "get",
//   });

//   const { mutate: createGeneralSetting, isLoading: creatingGeneral } =
//     useCustomMutation();
//   const { mutate: updateGeneralSetting, isLoading: updatingGeneral } =
//     useCustomMutation();
//   const { mutate: activateGeneralSetting, isLoading: activatingGeneral } =
//     useCustomMutation();

//   // Pricing Settings
//   const {
//     data: pricingData,
//     isLoading: pricingLoading,
//     refetch: refetchPricing,
//   } = useCustom({
//     url: "get-pricing-settings",
//     method: "get",
//   });

//   const { mutate: createPricingSetting, isLoading: creatingPricing } =
//     useCustomMutation();
//   const { mutate: updatePricingSetting, isLoading: updatingPricing } =
//     useCustomMutation();
//   const { mutate: activatePricingSetting, isLoading: activatingPricing } =
//     useCustomMutation();

//   // Payment Settings
//   const {
//     data: paymentData,
//     isLoading: paymentLoading,
//     refetch: refetchPayment,
//   } = useCustom({
//     url: "get-payment-settings",
//     method: "get",
//   });

//   const { mutate: createPaymentSetting, isLoading: creatingPayment } =
//     useCustomMutation();
//   const { mutate: updatePaymentSetting, isLoading: updatingPayment } =
//     useCustomMutation();
//   const { mutate: activatePaymentSetting, isLoading: activatingPayment } =
//     useCustomMutation();

//   // Security Settings
//   const {
//     data: securityData,
//     isLoading: securityLoading,
//     refetch: refetchSecurity,
//   } = useCustom({
//     url: "get-security-settings",
//     method: "get",
//   });

//   const { mutate: createSecuritySetting, isLoading: creatingSecurity } =
//     useCustomMutation();
//   const { mutate: updateSecuritySetting, isLoading: updatingSecurity } =
//     useCustomMutation();
//   const { mutate: activateSecuritySetting, isLoading: activatingSecurity } =
//     useCustomMutation();

//   // System Health
//   const {
//     data: systemHealthData,
//     isLoading: healthLoading,
//     refetch: refetchHealth,
//   } = useCustom({
//     url: "get-system-health",
//     method: "get",
//   });

//   const {
//     data: systemHealthStats,
//     isLoading: statsLoading,
//     refetch: refetchStats,
//   } = useCustom({
//     url: "get-system-health-stats",
//     method: "get",
//   });

//   const { mutate: refreshSystemHealth, isLoading: refreshingHealth } =
//     useCustomMutation();

//   // Enhanced mutation handlers with automatic refetch
//   const handleCreateSettings = async (section: string, values: any) => {
//     const mutations = {
//       general: () =>
//         createGeneralSetting(
//           {
//             url: "create-general-setting",
//             method: "post",
//             values: { input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchGeneral();
//               message.success("General settings created successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to create general settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       pricing: () =>
//         createPricingSetting(
//           {
//             url: "create-pricing-setting",
//             method: "post",
//             values: { input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchPricing();
//               message.success("Pricing settings created successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to create pricing settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       payment: () =>
//         createPaymentSetting(
//           {
//             url: "create-payment-setting",
//             method: "post",
//             values: { input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchPayment();
//               message.success("Payment settings created successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to create payment settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       security: () =>
//         createSecuritySetting(
//           {
//             url: "create-security-setting",
//             method: "post",
//             values: { input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchSecurity();
//               message.success("Security settings created successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to create security settings: ${error.message}`
//               );
//             },
//           }
//         ),
//     };

//     await mutations[section as keyof typeof mutations]();
//   };

//   const handleUpdateSettings = async (
//     section: string,
//     id: string | number | undefined,
//     values: any
//   ) => {
//     const mutations = {
//       general: () =>
//         updateGeneralSetting(
//           {
//             url: "update-general-setting",
//             method: "post",
//             values: { id, input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchGeneral();
//               message.success("General settings updated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to update general settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       pricing: () =>
//         updatePricingSetting(
//           {
//             url: "update-pricing-setting",
//             method: "post",
//             values: { id, input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchPricing();
//               message.success("Pricing settings updated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to update pricing settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       payment: () =>
//         updatePaymentSetting(
//           {
//             url: "update-payment-setting",
//             method: "post",
//             values: { id, input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchPayment();
//               message.success("Payment settings updated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to update payment settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       security: () =>
//         updateSecuritySetting(
//           {
//             url: "update-security-setting",
//             method: "post",
//             values: { id, input: values },
//           },
//           {
//             onSuccess: () => {
//               refetchSecurity();
//               message.success("Security settings updated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to update security settings: ${error.message}`
//               );
//             },
//           }
//         ),
//     };

//     await mutations[section as keyof typeof mutations]();
//   };

//   const handleSaveSettings = async (
//     values: SettingsFormData,
//     section: string
//   ) => {
//     setLoading(true);
//     try {
//       const settingsData = {
//         general: generalData?.data,
//         pricing: pricingData?.data,
//         payment: paymentData?.data,
//         security: securityData?.data,
//       }[section];

//       if (settingsData?.id) {
//         // Update existing settings
//         await handleUpdateSettings(section, settingsData.id, values);
//       } else {
//         // Create new settings
//         await handleCreateSettings(section, values);
//       }
//     } catch (error: any) {
//       // console.error(`Error saving ${section} settings:`, error);
//       // Error is already handled in the mutation callbacks
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivateSettings = async (section: string, id: string) => {
//     const mutations = {
//       general: () =>
//         activateGeneralSetting(
//           {
//             url: "activate-general-setting",
//             method: "post",
//             values: { id },
//           },
//           {
//             onSuccess: () => {
//               refetchGeneral();
//               message.success("General settings activated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to activate general settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       pricing: () =>
//         activatePricingSetting(
//           {
//             url: "activate-pricing-setting",
//             method: "post",
//             values: { id },
//           },
//           {
//             onSuccess: () => {
//               refetchPricing();
//               message.success("Pricing settings activated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to activate pricing settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       payment: () =>
//         activatePaymentSetting(
//           {
//             url: "activate-payment-setting",
//             method: "post",
//             values: { id },
//           },
//           {
//             onSuccess: () => {
//               refetchPayment();
//               message.success("Payment settings activated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to activate payment settings: ${error.message}`
//               );
//             },
//           }
//         ),
//       security: () =>
//         activateSecuritySetting(
//           {
//             url: "activate-security-setting",
//             method: "post",
//             values: { id },
//           },
//           {
//             onSuccess: () => {
//               refetchSecurity();
//               message.success("Security settings activated successfully");
//             },
//             onError: (error: any) => {
//               message.error(
//                 `Failed to activate security settings: ${error.message}`
//               );
//             },
//           }
//         ),
//     };

//     try {
//       await mutations[section as keyof typeof mutations]();
//     } catch (error: any) {
//       // Error is already handled in the mutation callbacks
//     }
//   };

//   const handleRefreshSystemHealth = async () => {
//     try {
//       await refreshSystemHealth(
//         {
//           url: "refresh-system-health",
//           method: "post",
//           values: {},
//         },
//         {
//           onSuccess: () => {
//             refetchHealth();
//             refetchStats();
//             message.success("System health refreshed successfully");
//           },
//           onError: (error: any) => {
//             message.error(`Failed to refresh system health: ${error.message}`);
//           },
//         }
//       );
//     } catch (error: any) {
//       // Error is already handled in the mutation callbacks
//     }
//   };

//   // General Settings Tab
//   const GeneralSettings = () => (
//     <Spin spinning={generalLoading}>
//       <Card
//         title={
//           <Space>
//             <GlobalOutlined />
//             General Configuration
//             {generalData?.data?.isActive && (
//               <Tag icon={<CheckCircleOutlined />} color="success">
//                 Active
//               </Tag>
//             )}
//           </Space>
//         }
//         extra={
//           generalData?.data?.id && (
//             <Button
//               type="primary"
//               icon={<CheckCircleOutlined />}
//               onClick={() =>
//                 handleActivateSettings("general", generalData?.data?.id)
//               }
//               disabled={generalData.data.isActive}
//               loading={activatingGeneral}
//             >
//               Activate
//             </Button>
//           )
//         }
//       >
//         <Form
//           layout="vertical"
//           onFinish={(values) => handleSaveSettings(values, "general")}
//           initialValues={
//             generalData?.data || {
//               applicationName: "Yalla Ride",
//               supportEmail: "support@yallaride.com",
//               supportPhone: "+2348000000000",
//               defaultCurrency: "NGN",
//               timeZone: "WAT",
//               defaultLanguage: "en",
//             }
//           }
//         >
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="applicationName"
//                 label="Application Name"
//                 rules={[
//                   { required: true, message: "Application name is required" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="supportEmail"
//                 label="Support Email"
//                 rules={[
//                   { required: true, message: "Support email is required" },
//                   { type: "email", message: "Please enter a valid email" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="supportPhone"
//                 label="Support Phone"
//                 rules={[
//                   { required: true, message: "Support phone is required" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="timeZone"
//                 label="Timezone"
//                 rules={[{ required: true, message: "Timezone is required" }]}
//               >
//                 <Select>
//                   <Option value="WAT">West Africa Time (WAT)</Option>
//                   <Option value="UTC">Coordinated Universal Time (UTC)</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="defaultCurrency"
//                 label="Default Currency"
//                 rules={[
//                   { required: true, message: "Default currency is required" },
//                 ]}
//               >
//                 <Select>
//                   <Option value="NGN">Nigerian Naira (₦)</Option>
//                   <Option value="USD">US Dollar ($)</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="defaultLanguage"
//                 label="Default Language"
//                 rules={[
//                   { required: true, message: "Default language is required" },
//                 ]}
//               >
//                 <Select>
//                   <Option value="en">English</Option>
//                   <Option value="ha">Hausa</Option>
//                   <Option value="yo">Yoruba</Option>
//                   <Option value="ig">Igbo</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading || creatingGeneral || updatingGeneral}
//               icon={<SaveOutlined />}
//             >
//               Save General Settings
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </Spin>
//   );

//   // Pricing Settings Tab
//   const PricingSettings = () => (
//     <Spin spinning={pricingLoading}>
//       <Card
//         title={
//           <Space>
//             <DollarOutlined />
//             Pricing Configuration
//             {pricingData?.data?.isActive && (
//               <Tag icon={<CheckCircleOutlined />} color="success">
//                 Active
//               </Tag>
//             )}
//           </Space>
//         }
//         extra={
//           pricingData?.data?.id && (
//             <Button
//               type="primary"
//               icon={<CheckCircleOutlined />}
//               onClick={() =>
//                 handleActivateSettings("pricing", pricingData?.data?.id)
//               }
//               disabled={pricingData?.data?.isActive}
//               loading={activatingPricing}
//             >
//               Activate
//             </Button>
//           )
//         }
//       >
//         <Alert
//           message="Pricing Changes"
//           description="Changes to pricing will affect new trips only. Existing trips will maintain their original pricing."
//           type="info"
//           style={{ marginBottom: 24 }}
//         />

//         <Form
//           layout="vertical"
//           onFinish={(values) => handleSaveSettings(values, "pricing")}
//           initialValues={
//             pricingData?.data || {
//               baseFare: 500,
//               perKmRate: 150,
//               perMinuteRate: 50,
//               minimumFare: 800,
//               maximumFare: 50000,
//               surgeMultiplier: 1.5,
//               commissionRate: 20,
//               cancellationFee: 300,
//             }
//           }
//         >
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 name="baseFare"
//                 label="Base Fare (₦)"
//                 rules={[{ required: true, message: "Base fare is required" }]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="perKmRate"
//                 label="Per Kilometer Rate (₦)"
//                 rules={[
//                   { required: true, message: "Per kilometer rate is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="perMinuteRate"
//                 label="Per Minute Rate (₦)"
//                 rules={[
//                   { required: true, message: "Per minute rate is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 name="minimumFare"
//                 label="Minimum Fare (₦)"
//                 rules={[
//                   { required: true, message: "Minimum fare is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="maximumFare"
//                 label="Maximum Fare (₦)"
//                 rules={[
//                   { required: true, message: "Maximum fare is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="surgeMultiplier"
//                 label="Surge Multiplier"
//                 rules={[
//                   { required: true, message: "Surge multiplier is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={1}
//                   max={5}
//                   step={0.1}
//                   style={{ width: "100%" }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 name="commissionRate"
//                 label="Commission Rate (%)"
//                 rules={[
//                   { required: true, message: "Commission rate is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   max={100}
//                   style={{ width: "100%" }}
//                   formatter={(value) => `${value}%`}
//                   parser={(value) => value?.replace("%", "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="cancellationFee"
//                 label="Cancellation Fee (₦)"
//                 rules={[
//                   { required: true, message: "Cancellation fee is required" },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading || creatingPricing || updatingPricing}
//               icon={<SaveOutlined />}
//             >
//               Save Pricing Settings
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </Spin>
//   );

//   // Payment Settings Tab
//   const PaymentSettings = () => (
//     <Spin spinning={paymentLoading}>
//       <Card
//         title={
//           <Space>
//             <CreditCardOutlined />
//             Payment Configuration
//             {paymentData?.data?.isActive && (
//               <Tag icon={<CheckCircleOutlined />} color="success">
//                 Active
//               </Tag>
//             )}
//           </Space>
//         }
//         extra={
//           paymentData?.data?.id && (
//             <Button
//               type="primary"
//               icon={<CheckCircleOutlined />}
//               onClick={() =>
//                 handleActivateSettings("payment", paymentData?.data?.id)
//               }
//               disabled={paymentData.data.isActive}
//               loading={activatingPayment}
//             >
//               Activate
//             </Button>
//           )
//         }
//       >
//         <Form
//           layout="vertical"
//           onFinish={(values) => handleSaveSettings(values, "payment")}
//           initialValues={
//             paymentData?.data || {
//               cashPaymentsEnabled: true,
//               walletPaymentsEnabled: true,
//               paystackEnabled: true,
//               flutterwaveEnabled: false,
//               minimumWalletBalance: 100,
//               processingFeeRate: 2.5,
//               autoTopupEnabled: false,
//               autoTopupThreshold: 50,
//               autoTopupAmount: 1000,
//             }
//           }
//         >
//           <Title level={5}>Payment Methods</Title>
//           <Row gutter={16}>
//             <Col span={6}>
//               <Form.Item
//                 name="cashPaymentsEnabled"
//                 label="Cash Payments"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="walletPaymentsEnabled"
//                 label="Wallet Payments"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="paystackEnabled"
//                 label="Paystack"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item
//                 name="flutterwaveEnabled"
//                 label="Flutterwave"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Divider />

//           <Title level={5}>Wallet Configuration</Title>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 name="minimumWalletBalance"
//                 label="Minimum Wallet Balance (₦)"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Minimum wallet balance is required",
//                   },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   style={{ width: "100%" }}
//                   formatter={(value) =>
//                     `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 name="processingFeeRate"
//                 label="Processing Fee Rate (%)"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Processing fee rate is required",
//                   },
//                 ]}
//               >
//                 <InputNumber
//                   min={0}
//                   max={10}
//                   step={0.1}
//                   style={{ width: "100%" }}
//                   formatter={(value) => `${value}%`}
//                   parser={(value) => value?.replace("%", "") as any}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="autoTopupEnabled"
//             label="Enable Auto Top-up"
//             valuePropName="checked"
//           >
//             <Switch />
//           </Form.Item>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.autoTopupEnabled !== currentValues.autoTopupEnabled
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue("autoTopupEnabled") && (
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item
//                       name="autoTopupThreshold"
//                       label="Auto Top-up Threshold (₦)"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Auto top-up threshold is required",
//                         },
//                       ]}
//                     >
//                       <InputNumber
//                         min={0}
//                         style={{ width: "100%" }}
//                         formatter={(value) =>
//                           `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                         }
//                         parser={(value) =>
//                           value?.replace(/₦\s?|(,*)/g, "") as any
//                         }
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item
//                       name="autoTopupAmount"
//                       label="Auto Top-up Amount (₦)"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Auto top-up amount is required",
//                         },
//                       ]}
//                     >
//                       <InputNumber
//                         min={0}
//                         style={{ width: "100%" }}
//                         formatter={(value) =>
//                           `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                         }
//                         parser={(value) =>
//                           value?.replace(/₦\s?|(,*)/g, "") as any
//                         }
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               )
//             }
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading || creatingPayment || updatingPayment}
//               icon={<SaveOutlined />}
//             >
//               Save Payment Settings
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </Spin>
//   );

//   // Security Settings Tab
//   const SecuritySettings = () => (
//     <Spin spinning={securityLoading}>
//       <Card
//         title={
//           <Space>
//             <SafetyOutlined />
//             Security Configuration
//             {securityData?.data?.isActive && (
//               <Tag icon={<CheckCircleOutlined />} color="success">
//                 Active
//               </Tag>
//             )}
//           </Space>
//         }
//         extra={
//           securityData?.data?.id && (
//             <Button
//               type="primary"
//               icon={<CheckCircleOutlined />}
//               onClick={() =>
//                 handleActivateSettings("security", securityData?.data?.id)
//               }
//               disabled={securityData.data.isActive}
//               loading={activatingSecurity}
//             >
//               Activate
//             </Button>
//           )
//         }
//       >
//         <Form
//           layout="vertical"
//           onFinish={(values) => handleSaveSettings(values, "security")}
//           initialValues={
//             securityData?.data || {
//               sessionTimeoutHours: 24,
//               maxLoginAttempts: 5,
//               minimumPasswordLength: 8,
//               requireStrongPasswords: false,
//               requireMfaForAdmins: true,
//               enable2faForAllUsers: false,
//               enableIpWhitelisting: false,
//               allowedIps: [],
//               enableAuditLogging: true,
//             }
//           }
//         >
//           <Title level={5}>Authentication</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="sessionTimeoutHours"
//                 label="Session Timeout (hours)"
//                 rules={[
//                   { required: true, message: "Session timeout is required" },
//                 ]}
//               >
//                 <InputNumber min={1} max={720} style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="maxLoginAttempts"
//                 label="Max Login Attempts"
//                 rules={[
//                   { required: true, message: "Max login attempts is required" },
//                 ]}
//               >
//                 <InputNumber min={1} max={10} style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Title level={5}>Password Policy</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="minimumPasswordLength"
//                 label="Minimum Password Length"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Minimum password length is required",
//                   },
//                 ]}
//               >
//                 <InputNumber min={6} max={32} style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="requireStrongPasswords"
//                 label="Require Strong Passwords"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Title level={5}>Two-Factor Authentication</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="requireMfaForAdmins"
//                 label="Require MFA for Admins"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="enable2faForAllUsers"
//                 label="Enable 2FA for All Users"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Title level={5}>Security Features</Title>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="enableIpWhitelisting"
//                 label="Enable IP Whitelisting"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="enableAuditLogging"
//                 label="Enable Audit Logging"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             noStyle
//             shouldUpdate={(prevValues, currentValues) =>
//               prevValues.enableIpWhitelisting !==
//               currentValues.enableIpWhitelisting
//             }
//           >
//             {({ getFieldValue }) =>
//               getFieldValue("enableIpWhitelisting") && (
//                 <Form.Item
//                   name="allowedIps"
//                   label="Allowed IP Addresses"
//                   rules={[
//                     {
//                       required: true,
//                       message: "At least one IP address is required",
//                     },
//                   ]}
//                 >
//                   <Select
//                     mode="tags"
//                     placeholder="Enter IP addresses (e.g., 192.168.1.1)"
//                   />
//                 </Form.Item>
//               )
//             }
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading || creatingSecurity || updatingSecurity}
//               icon={<SaveOutlined />}
//             >
//               Save Security Settings
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </Spin>
//   );

//   // System Health Tab
//   const SystemHealthTab = () => (
//     <Spin spinning={healthLoading || statsLoading}>
//       <Space direction="vertical" style={{ width: "100%" }} size="large">
//         <Card
//           title={
//             <Space>
//               <DatabaseOutlined />
//               System Health Overview
//               <Button
//                 icon={<ReloadOutlined />}
//                 onClick={handleRefreshSystemHealth}
//                 loading={refreshingHealth}
//               >
//                 Refresh
//               </Button>
//             </Space>
//           }
//         >
//           <Row gutter={16}>
//             <Col span={6}>
//               <Card size="small" title="Database">
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Statistic
//                     title="Total Records"
//                     value={systemHealthData?.data?.totalRecords || 0}
//                     prefix={<DatabaseOutlined />}
//                   />
//                   <Progress
//                     percent={systemHealthData?.data?.databaseUsagePercent || 0}
//                     status={
//                       (systemHealthData?.data?.databaseUsagePercent || 0) > 90
//                         ? "exception"
//                         : (systemHealthData?.data?.databaseUsagePercent || 0) >
//                           75
//                         ? "warning"
//                         : "active"
//                     }
//                   />
//                   <Text type="secondary">
//                     Usage: {systemHealthData?.data?.databaseUsagePercent || 0}%
//                   </Text>
//                 </Space>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card size="small" title="Storage">
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Statistic
//                     title="Used Space"
//                     value={systemHealthData?.data?.usedSpaceGB || 0}
//                     suffix="GB"
//                     prefix={<CloudOutlined />}
//                   />
//                   <Progress
//                     percent={systemHealthData?.data?.storageUsagePercent || 0}
//                     status={
//                       (systemHealthData?.data?.storageUsagePercent || 0) > 90
//                         ? "exception"
//                         : (systemHealthData?.data?.storageUsagePercent || 0) >
//                           75
//                         ? "warning"
//                         : "active"
//                     }
//                   />
//                   <Text type="secondary">
//                     Usage: {systemHealthData?.data?.storageUsagePercent || 0}%
//                   </Text>
//                 </Space>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card size="small" title="Users">
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Statistic
//                     title="Online Now"
//                     value={systemHealthData?.data?.activeUsersOnline || 0}
//                     prefix={<UserOutlined />}
//                   />
//                   <Progress
//                     percent={
//                       systemHealthData?.data?.userUtilizationPercent || 0
//                     }
//                     status="active"
//                   />
//                   <Text type="secondary">
//                     Peak: {systemHealthData?.data?.peakUsersToday || 0} users
//                   </Text>
//                 </Space>
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card size="small" title="System">
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Statistic
//                     title="Uptime"
//                     value={systemHealthData?.data?.serverUptimeHours || 0}
//                     suffix="hours"
//                   />
//                   <Statistic
//                     title="Response Time"
//                     value={systemHealthData?.data?.averageResponseTime || 0}
//                     suffix="ms"
//                   />
//                   <Text type="secondary">
//                     Error Rate: {systemHealthData?.data?.errorRate || 0}%
//                   </Text>
//                 </Space>
//               </Card>
//             </Col>
//           </Row>
//         </Card>

//         {systemHealthStats?.data && (
//           <Card title="Detailed Statistics">
//             <Descriptions bordered column={2}>
//               <Descriptions.Item label="Database Growth Rate">
//                 {systemHealthStats.data.database?.growthRate || 0}%
//               </Descriptions.Item>
//               <Descriptions.Item label="Available Storage">
//                 {systemHealthStats.data.storage?.availableSpaceGB || 0} GB
//               </Descriptions.Item>
//               <Descriptions.Item label="Total Users">
//                 {systemHealthStats.data.users?.totalUsers || 0}
//               </Descriptions.Item>
//               <Descriptions.Item label="Last Backup">
//                 {systemHealthStats.data.system?.lastBackup
//                   ? new Date(
//                       systemHealthStats.data.system.lastBackup
//                     ).toLocaleString()
//                   : "N/A"}
//               </Descriptions.Item>
//             </Descriptions>
//           </Card>
//         )}
//       </Space>
//     </Spin>
//   );

//   // Data Management Tab
//   const DataManagement = () => (
//     <Row gutter={16}>
//       <Col span={12}>
//         <Card title="Backup & Export">
//           <Space direction="vertical" style={{ width: "100%" }}>
//             <Button type="primary" icon={<ExportOutlined />} block>
//               Export All Data
//             </Button>
//             <Button icon={<DownloadOutlined />} block>
//               Download Trip Reports
//             </Button>
//             <Button icon={<DownloadOutlined />} block>
//               Download User Data
//             </Button>
//             <Button icon={<DownloadOutlined />} block>
//               Download Payment Records
//             </Button>
//           </Space>
//         </Card>
//       </Col>
//       <Col span={12}>
//         <Card title="Data Import">
//           <Space direction="vertical" style={{ width: "100%" }}>
//             <Upload>
//               <Button icon={<UploadOutlined />} block>
//                 Import Driver Data
//               </Button>
//             </Upload>
//             <Upload>
//               <Button icon={<UploadOutlined />} block>
//                 Import Customer Data
//               </Button>
//             </Upload>
//             <Upload>
//               <Button icon={<UploadOutlined />} block>
//                 Import Vehicle Data
//               </Button>
//             </Upload>
//             <Alert
//               message="Import Guidelines"
//               description="Please ensure your CSV files follow the required format. Contact support for templates."
//               type="info"
//               style={{ marginTop: 16 }}
//             />
//           </Space>
//         </Card>
//       </Col>
//     </Row>
//   );

//   return (
//     <div style={{ padding: "24px" }}>
//       <div style={{ marginBottom: 24 }}>
//         <Title level={2}>
//           <SettingOutlined /> System Settings
//         </Title>
//         <Text type="secondary">
//           Configure your ride-sharing platform settings and preferences
//         </Text>
//       </div>

//       <Tabs
//         activeKey={activeTab}
//         onChange={setActiveTab}
//         items={[
//           {
//             key: "general",
//             label: (
//               <span>
//                 <GlobalOutlined />
//                 General
//               </span>
//             ),
//             children: <GeneralSettings />,
//           },
//           {
//             key: "pricing",
//             label: (
//               <span>
//                 <DollarOutlined />
//                 Pricing
//               </span>
//             ),
//             children: <PricingSettings />,
//           },
//           {
//             key: "payments",
//             label: (
//               <span>
//                 <CreditCardOutlined />
//                 Payments
//               </span>
//             ),
//             children: <PaymentSettings />,
//           },
//           {
//             key: "security",
//             label: (
//               <span>
//                 <SafetyOutlined />
//                 Security
//               </span>
//             ),
//             children: <SecuritySettings />,
//           },
//           {
//             key: "health",
//             label: (
//               <span>
//                 <DatabaseOutlined />
//                 System Health
//               </span>
//             ),
//             children: <SystemHealthTab />,
//           },
//           {
//             key: "data",
//             label: (
//               <span>
//                 <ImportOutlined />
//                 Data Management
//               </span>
//             ),
//             children: <DataManagement />,
//           },
//         ]}
//       />
//     </div>
//   );
// };

import React, { useState } from "react";
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
  Progress,
  Statistic,
  Spin,
  Descriptions,
  Tag,
  Upload,
} from "antd";
import {
  SettingOutlined,
  DollarOutlined,
  SafetyOutlined,
  GlobalOutlined,
  UploadOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  CloudOutlined,
  UserOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useCustom, useCustomMutation, BaseKey } from "@refinedev/core";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Types
interface SettingsFormData {
  // General Settings
  applicationName?: string;
  supportPhone?: string;
  defaultCurrency?: "NGN" | "USD";
  supportEmail?: string;
  timeZone?: "WAT" | "UTC";
  defaultLanguage?: "en" | "ha" | "ig" | "yo";

  // Pricing Settings
  baseFare?: number;
  perKmRate?: number;
  perMinuteRate?: number;
  minimumFare?: number;
  maximumFare?: number;
  surgeMultiplier?: number;
  commissionRate?: number;
  cancellationFee?: number;

  // Payment Settings
  cashPaymentsEnabled?: boolean;
  walletPaymentsEnabled?: boolean;
  paystackEnabled?: boolean;
  flutterwaveEnabled?: boolean;
  minimumWalletBalance?: number;
  processingFeeRate?: number;
  autoTopupEnabled?: boolean;
  autoTopupThreshold?: number;
  autoTopupAmount?: number;

  // Security Settings
  sessionTimeoutHours?: number;
  maxLoginAttempts?: number;
  minimumPasswordLength?: number;
  requireStrongPasswords?: boolean;
  requireMfaForAdmins?: boolean;
  enable2faForAllUsers?: boolean;
  enableIpWhitelisting?: boolean;
  allowedIps?: string[];
  enableAuditLogging?: boolean;
}

// FIX 1: Define proper response interfaces
interface SettingsResponse {
  id: string;
  isActive: boolean;
  // Add other fields as needed
  [key: string]: any;
}

interface SystemHealthResponse {
  totalRecords?: number;
  databaseUsagePercent?: number;
  usedSpaceGB?: number;
  storageUsagePercent?: number;
  activeUsersOnline?: number;
  userUtilizationPercent?: number;
  peakUsersToday?: number;
  serverUptimeHours?: number;
  averageResponseTime?: number;
  errorRate?: number;
  [key: string]: any;
}

interface SystemHealthStatsResponse {
  database?: {
    growthRate?: number;
  };
  storage?: {
    availableSpaceGB?: number;
  };
  users?: {
    totalUsers?: number;
  };
  system?: {
    lastBackup?: string;
  };
  [key: string]: any;
}

// System Settings Component
export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  // General Settings
  const {
    data: generalData,
    isLoading: generalLoading,
    refetch: refetchGeneral,
  } = useCustom<SettingsResponse>({
    url: "get-general-settings",
    method: "get",
  });

  const { mutate: createGeneralSetting, isLoading: creatingGeneral } =
    useCustomMutation();
  const { mutate: updateGeneralSetting, isLoading: updatingGeneral } =
    useCustomMutation();
  const { mutate: activateGeneralSetting, isLoading: activatingGeneral } =
    useCustomMutation();

  // Pricing Settings
  const {
    data: pricingData,
    isLoading: pricingLoading,
    refetch: refetchPricing,
  } = useCustom<SettingsResponse>({
    url: "get-pricing-settings",
    method: "get",
  });

  const { mutate: createPricingSetting, isLoading: creatingPricing } =
    useCustomMutation();
  const { mutate: updatePricingSetting, isLoading: updatingPricing } =
    useCustomMutation();
  const { mutate: activatePricingSetting, isLoading: activatingPricing } =
    useCustomMutation();

  // Payment Settings
  const {
    data: paymentData,
    isLoading: paymentLoading,
    refetch: refetchPayment,
  } = useCustom<SettingsResponse>({
    url: "get-payment-settings",
    method: "get",
  });

  const { mutate: createPaymentSetting, isLoading: creatingPayment } =
    useCustomMutation();
  const { mutate: updatePaymentSetting, isLoading: updatingPayment } =
    useCustomMutation();
  const { mutate: activatePaymentSetting, isLoading: activatingPayment } =
    useCustomMutation();

  // Security Settings
  const {
    data: securityData,
    isLoading: securityLoading,
    refetch: refetchSecurity,
  } = useCustom<SettingsResponse>({
    url: "get-security-settings",
    method: "get",
  });

  const { mutate: createSecuritySetting, isLoading: creatingSecurity } =
    useCustomMutation();
  const { mutate: updateSecuritySetting, isLoading: updatingSecurity } =
    useCustomMutation();
  const { mutate: activateSecuritySetting, isLoading: activatingSecurity } =
    useCustomMutation();

  // System Health
  const {
    data: systemHealthData,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useCustom<SystemHealthResponse>({
    url: "get-system-health",
    method: "get",
  });

  const {
    data: systemHealthStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useCustom<SystemHealthStatsResponse>({
    url: "get-system-health-stats",
    method: "get",
  });

  const { mutate: refreshSystemHealth, isLoading: refreshingHealth } =
    useCustomMutation();

  // FIX 2: Proper type for handleActivateSettings
  const handleActivateSettings = async (
    section: string,
    id: BaseKey | undefined
  ) => {
    if (!id) {
      message.error("Settings ID is required");
      return;
    }

    const mutations = {
      general: () =>
        activateGeneralSetting(
          {
            url: "activate-general-setting",
            method: "post",
            values: { id },
          },
          {
            onSuccess: () => {
              refetchGeneral();
              message.success("General settings activated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to activate general settings: ${error.message}`
              );
            },
          }
        ),
      pricing: () =>
        activatePricingSetting(
          {
            url: "activate-pricing-setting",
            method: "post",
            values: { id },
          },
          {
            onSuccess: () => {
              refetchPricing();
              message.success("Pricing settings activated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to activate pricing settings: ${error.message}`
              );
            },
          }
        ),
      payment: () =>
        activatePaymentSetting(
          {
            url: "activate-payment-setting",
            method: "post",
            values: { id },
          },
          {
            onSuccess: () => {
              refetchPayment();
              message.success("Payment settings activated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to activate payment settings: ${error.message}`
              );
            },
          }
        ),
      security: () =>
        activateSecuritySetting(
          {
            url: "activate-security-setting",
            method: "post",
            values: { id },
          },
          {
            onSuccess: () => {
              refetchSecurity();
              message.success("Security settings activated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to activate security settings: ${error.message}`
              );
            },
          }
        ),
    };

    try {
      await mutations[section as keyof typeof mutations]();
    } catch (error: any) {
      // Error is already handled in the mutation callbacks
    }
  };

  // Enhanced mutation handlers with automatic refetch
  const handleCreateSettings = async (section: string, values: any) => {
    const mutations = {
      general: () =>
        createGeneralSetting(
          {
            url: "create-general-setting",
            method: "post",
            values: { input: values },
          },
          {
            onSuccess: () => {
              refetchGeneral();
              message.success("General settings created successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to create general settings: ${error.message}`
              );
            },
          }
        ),
      pricing: () =>
        createPricingSetting(
          {
            url: "create-pricing-setting",
            method: "post",
            values: { input: values },
          },
          {
            onSuccess: () => {
              refetchPricing();
              message.success("Pricing settings created successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to create pricing settings: ${error.message}`
              );
            },
          }
        ),
      payment: () =>
        createPaymentSetting(
          {
            url: "create-payment-setting",
            method: "post",
            values: { input: values },
          },
          {
            onSuccess: () => {
              refetchPayment();
              message.success("Payment settings created successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to create payment settings: ${error.message}`
              );
            },
          }
        ),
      security: () =>
        createSecuritySetting(
          {
            url: "create-security-setting",
            method: "post",
            values: { input: values },
          },
          {
            onSuccess: () => {
              refetchSecurity();
              message.success("Security settings created successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to create security settings: ${error.message}`
              );
            },
          }
        ),
    };

    await mutations[section as keyof typeof mutations]();
  };

  const handleUpdateSettings = async (
    section: string,
    id: BaseKey | undefined,
    values: any
  ) => {
    if (!id) {
      message.error("Settings ID is required for update");
      return;
    }

    const mutations = {
      general: () =>
        updateGeneralSetting(
          {
            url: "update-general-setting",
            method: "post",
            values: { id, input: values },
          },
          {
            onSuccess: () => {
              refetchGeneral();
              message.success("General settings updated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to update general settings: ${error.message}`
              );
            },
          }
        ),
      pricing: () =>
        updatePricingSetting(
          {
            url: "update-pricing-setting",
            method: "post",
            values: { id, input: values },
          },
          {
            onSuccess: () => {
              refetchPricing();
              message.success("Pricing settings updated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to update pricing settings: ${error.message}`
              );
            },
          }
        ),
      payment: () =>
        updatePaymentSetting(
          {
            url: "update-payment-setting",
            method: "post",
            values: { id, input: values },
          },
          {
            onSuccess: () => {
              refetchPayment();
              message.success("Payment settings updated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to update payment settings: ${error.message}`
              );
            },
          }
        ),
      security: () =>
        updateSecuritySetting(
          {
            url: "update-security-setting",
            method: "post",
            values: { id, input: values },
          },
          {
            onSuccess: () => {
              refetchSecurity();
              message.success("Security settings updated successfully");
            },
            onError: (error: any) => {
              message.error(
                `Failed to update security settings: ${error.message}`
              );
            },
          }
        ),
    };

    await mutations[section as keyof typeof mutations]();
  };

  const handleSaveSettings = async (
    values: SettingsFormData,
    section: string
  ) => {
    setLoading(true);
    try {
      const settingsData = {
        general: generalData?.data,
        pricing: pricingData?.data,
        payment: paymentData?.data,
        security: securityData?.data,
      }[section];

      if (settingsData?.id) {
        // Update existing settings
        await handleUpdateSettings(section, settingsData.id, values);
      } else {
        // Create new settings
        await handleCreateSettings(section, values);
      }
    } catch (error: any) {
      // console.error(`Error saving ${section} settings:`, error);
      // Error is already handled in the mutation callbacks
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSystemHealth = async () => {
    try {
      await refreshSystemHealth(
        {
          url: "refresh-system-health",
          method: "post",
          values: {},
        },
        {
          onSuccess: () => {
            refetchHealth();
            refetchStats();
            message.success("System health refreshed successfully");
          },
          onError: (error: any) => {
            message.error(`Failed to refresh system health: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      // Error is already handled in the mutation callbacks
    }
  };

  // FIX 3: Progress status helper function
  const getProgressStatus = (
    percent: number | undefined
  ): "success" | "normal" | "active" | "exception" | undefined => {
    const value = percent || 0;
    if (value > 90) return "exception";
    if (value > 75) return "active"; // Using 'active' instead of 'warning' since 'warning' is not a valid status
    return "active";
  };

  // General Settings Tab
  const GeneralSettings = () => (
    <Spin spinning={generalLoading}>
      <Card
        title={
          <Space>
            <GlobalOutlined />
            General Configuration
            {generalData?.data?.isActive && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Active
              </Tag>
            )}
          </Space>
        }
        extra={
          generalData?.data?.id && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() =>
                handleActivateSettings("general", generalData?.data?.id)
              }
              disabled={generalData.data.isActive}
              loading={activatingGeneral}
            >
              Activate
            </Button>
          )
        }
      >
        <Form
          layout="vertical"
          onFinish={(values) => handleSaveSettings(values, "general")}
          initialValues={
            generalData?.data || {
              applicationName: "Yalla Ride",
              supportEmail: "support@yallaride.com",
              supportPhone: "+2348000000000",
              defaultCurrency: "NGN",
              timeZone: "WAT",
              defaultLanguage: "en",
            }
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="applicationName"
                label="Application Name"
                rules={[
                  { required: true, message: "Application name is required" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supportEmail"
                label="Support Email"
                rules={[
                  { required: true, message: "Support email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="supportPhone"
                label="Support Phone"
                rules={[
                  { required: true, message: "Support phone is required" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timeZone"
                label="Timezone"
                rules={[{ required: true, message: "Timezone is required" }]}
              >
                <Select>
                  <Option value="WAT">West Africa Time (WAT)</Option>
                  <Option value="UTC">Coordinated Universal Time (UTC)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultCurrency"
                label="Default Currency"
                rules={[
                  { required: true, message: "Default currency is required" },
                ]}
              >
                <Select>
                  <Option value="NGN">Nigerian Naira (₦)</Option>
                  <Option value="USD">US Dollar ($)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="defaultLanguage"
                label="Default Language"
                rules={[
                  { required: true, message: "Default language is required" },
                ]}
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="ha">Hausa</Option>
                  <Option value="yo">Yoruba</Option>
                  <Option value="ig">Igbo</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || creatingGeneral || updatingGeneral}
              icon={<SaveOutlined />}
            >
              Save General Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );

  // Pricing Settings Tab
  const PricingSettings = () => (
    <Spin spinning={pricingLoading}>
      <Card
        title={
          <Space>
            <DollarOutlined />
            Pricing Configuration
            {pricingData?.data?.isActive && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Active
              </Tag>
            )}
          </Space>
        }
        extra={
          pricingData?.data?.id && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() =>
                handleActivateSettings("pricing", pricingData?.data?.id)
              }
              disabled={pricingData?.data?.isActive}
              loading={activatingPricing}
            >
              Activate
            </Button>
          )
        }
      >
        <Alert
          message="Pricing Changes"
          description="Changes to pricing will affect new trips only. Existing trips will maintain their original pricing."
          type="info"
          style={{ marginBottom: 24 }}
        />

        <Form
          layout="vertical"
          onFinish={(values) => handleSaveSettings(values, "pricing")}
          initialValues={
            pricingData?.data || {
              baseFare: 500,
              perKmRate: 150,
              perMinuteRate: 50,
              minimumFare: 800,
              maximumFare: 50000,
              surgeMultiplier: 1.5,
              commissionRate: 20,
              cancellationFee: 300,
            }
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="baseFare"
                label="Base Fare (₦)"
                rules={[{ required: true, message: "Base fare is required" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="perKmRate"
                label="Per Kilometer Rate (₦)"
                rules={[
                  { required: true, message: "Per kilometer rate is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="perMinuteRate"
                label="Per Minute Rate (₦)"
                rules={[
                  { required: true, message: "Per minute rate is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="minimumFare"
                label="Minimum Fare (₦)"
                rules={[
                  { required: true, message: "Minimum fare is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maximumFare"
                label="Maximum Fare (₦)"
                rules={[
                  { required: true, message: "Maximum fare is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="surgeMultiplier"
                label="Surge Multiplier"
                rules={[
                  { required: true, message: "Surge multiplier is required" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={5}
                  step={0.1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="commissionRate"
                label="Commission Rate (%)"
                rules={[
                  { required: true, message: "Commission rate is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value?.replace("%", "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="cancellationFee"
                label="Cancellation Fee (₦)"
                rules={[
                  { required: true, message: "Cancellation fee is required" },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || creatingPricing || updatingPricing}
              icon={<SaveOutlined />}
            >
              Save Pricing Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );

  // Payment Settings Tab
  const PaymentSettings = () => (
    <Spin spinning={paymentLoading}>
      <Card
        title={
          <Space>
            <CreditCardOutlined />
            Payment Configuration
            {paymentData?.data?.isActive && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Active
              </Tag>
            )}
          </Space>
        }
        extra={
          paymentData?.data?.id && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() =>
                handleActivateSettings("payment", paymentData?.data?.id)
              }
              disabled={paymentData.data.isActive}
              loading={activatingPayment}
            >
              Activate
            </Button>
          )
        }
      >
        <Form
          layout="vertical"
          onFinish={(values) => handleSaveSettings(values, "payment")}
          initialValues={
            paymentData?.data || {
              cashPaymentsEnabled: true,
              walletPaymentsEnabled: true,
              paystackEnabled: true,
              flutterwaveEnabled: false,
              minimumWalletBalance: 100,
              processingFeeRate: 2.5,
              autoTopupEnabled: false,
              autoTopupThreshold: 50,
              autoTopupAmount: 1000,
            }
          }
        >
          <Title level={5}>Payment Methods</Title>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="cashPaymentsEnabled"
                label="Cash Payments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="walletPaymentsEnabled"
                label="Wallet Payments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="paystackEnabled"
                label="Paystack"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="flutterwaveEnabled"
                label="Flutterwave"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={5}>Wallet Configuration</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="minimumWalletBalance"
                label="Minimum Wallet Balance (₦)"
                rules={[
                  {
                    required: true,
                    message: "Minimum wallet balance is required",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/₦\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="processingFeeRate"
                label="Processing Fee Rate (%)"
                rules={[
                  {
                    required: true,
                    message: "Processing fee rate is required",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={10}
                  step={0.1}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value?.replace("%", "") as any}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="autoTopupEnabled"
            label="Enable Auto Top-up"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.autoTopupEnabled !== currentValues.autoTopupEnabled
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("autoTopupEnabled") && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="autoTopupThreshold"
                      label="Auto Top-up Threshold (₦)"
                      rules={[
                        {
                          required: true,
                          message: "Auto top-up threshold is required",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/₦\s?|(,*)/g, "") as any
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="autoTopupAmount"
                      label="Auto Top-up Amount (₦)"
                      rules={[
                        {
                          required: true,
                          message: "Auto top-up amount is required",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/₦\s?|(,*)/g, "") as any
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || creatingPayment || updatingPayment}
              icon={<SaveOutlined />}
            >
              Save Payment Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );

  // Security Settings Tab
  const SecuritySettings = () => (
    <Spin spinning={securityLoading}>
      <Card
        title={
          <Space>
            <SafetyOutlined />
            Security Configuration
            {securityData?.data?.isActive && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Active
              </Tag>
            )}
          </Space>
        }
        extra={
          securityData?.data?.id && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() =>
                handleActivateSettings("security", securityData?.data?.id)
              }
              disabled={securityData.data.isActive}
              loading={activatingSecurity}
            >
              Activate
            </Button>
          )
        }
      >
        <Form
          layout="vertical"
          onFinish={(values) => handleSaveSettings(values, "security")}
          initialValues={
            securityData?.data || {
              sessionTimeoutHours: 24,
              maxLoginAttempts: 5,
              minimumPasswordLength: 8,
              requireStrongPasswords: false,
              requireMfaForAdmins: true,
              enable2faForAllUsers: false,
              enableIpWhitelisting: false,
              allowedIps: [],
              enableAuditLogging: true,
            }
          }
        >
          <Title level={5}>Authentication</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sessionTimeoutHours"
                label="Session Timeout (hours)"
                rules={[
                  { required: true, message: "Session timeout is required" },
                ]}
              >
                <InputNumber min={1} max={720} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxLoginAttempts"
                label="Max Login Attempts"
                rules={[
                  { required: true, message: "Max login attempts is required" },
                ]}
              >
                <InputNumber min={1} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Password Policy</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minimumPasswordLength"
                label="Minimum Password Length"
                rules={[
                  {
                    required: true,
                    message: "Minimum password length is required",
                  },
                ]}
              >
                <InputNumber min={6} max={32} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="requireStrongPasswords"
                label="Require Strong Passwords"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Two-Factor Authentication</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="requireMfaForAdmins"
                label="Require MFA for Admins"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enable2faForAllUsers"
                label="Enable 2FA for All Users"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>Security Features</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enableIpWhitelisting"
                label="Enable IP Whitelisting"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enableAuditLogging"
                label="Enable Audit Logging"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.enableIpWhitelisting !==
              currentValues.enableIpWhitelisting
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("enableIpWhitelisting") && (
                <Form.Item
                  name="allowedIps"
                  label="Allowed IP Addresses"
                  rules={[
                    {
                      required: true,
                      message: "At least one IP address is required",
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter IP addresses (e.g., 192.168.1.1)"
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || creatingSecurity || updatingSecurity}
              icon={<SaveOutlined />}
            >
              Save Security Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );

  // System Health Tab
  const SystemHealthTab = () => (
    <Spin spinning={healthLoading || statsLoading}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card
          title={
            <Space>
              <DatabaseOutlined />
              System Health Overview
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefreshSystemHealth}
                loading={refreshingHealth}
              >
                Refresh
              </Button>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small" title="Database">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Statistic
                    title="Total Records"
                    value={systemHealthData?.data?.totalRecords || 0}
                    prefix={<DatabaseOutlined />}
                  />
                  <Progress
                    percent={systemHealthData?.data?.databaseUsagePercent || 0}
                    status={getProgressStatus(
                      systemHealthData?.data?.databaseUsagePercent
                    )}
                  />
                  <Text type="secondary">
                    Usage: {systemHealthData?.data?.databaseUsagePercent || 0}%
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" title="Storage">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Statistic
                    title="Used Space"
                    value={systemHealthData?.data?.usedSpaceGB || 0}
                    suffix="GB"
                    prefix={<CloudOutlined />}
                  />
                  <Progress
                    percent={systemHealthData?.data?.storageUsagePercent || 0}
                    status={getProgressStatus(
                      systemHealthData?.data?.storageUsagePercent
                    )}
                  />
                  <Text type="secondary">
                    Usage: {systemHealthData?.data?.storageUsagePercent || 0}%
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" title="Users">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Statistic
                    title="Online Now"
                    value={systemHealthData?.data?.activeUsersOnline || 0}
                    prefix={<UserOutlined />}
                  />
                  <Progress
                    percent={
                      systemHealthData?.data?.userUtilizationPercent || 0
                    }
                    status="active"
                  />
                  <Text type="secondary">
                    Peak: {systemHealthData?.data?.peakUsersToday || 0} users
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" title="System">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Statistic
                    title="Uptime"
                    value={systemHealthData?.data?.serverUptimeHours || 0}
                    suffix="hours"
                  />
                  <Statistic
                    title="Response Time"
                    value={systemHealthData?.data?.averageResponseTime || 0}
                    suffix="ms"
                  />
                  <Text type="secondary">
                    Error Rate: {systemHealthData?.data?.errorRate || 0}%
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        {systemHealthStats?.data && (
          <Card title="Detailed Statistics">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Database Growth Rate">
                {systemHealthStats.data.database?.growthRate || 0}%
              </Descriptions.Item>
              <Descriptions.Item label="Available Storage">
                {systemHealthStats.data.storage?.availableSpaceGB || 0} GB
              </Descriptions.Item>
              <Descriptions.Item label="Total Users">
                {systemHealthStats.data.users?.totalUsers || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Last Backup">
                {systemHealthStats.data.system?.lastBackup
                  ? new Date(
                      systemHealthStats.data.system.lastBackup
                    ).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Space>
    </Spin>
  );

  // Data Management Tab
  const DataManagement = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="Backup & Export">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button type="primary" icon={<ExportOutlined />} block>
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
        <Card title="Data Import">
          <Space direction="vertical" style={{ width: "100%" }}>
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
              message="Import Guidelines"
              description="Please ensure your CSV files follow the required format. Contact support for templates."
              type="info"
              style={{ marginTop: 16 }}
            />
          </Space>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SettingOutlined /> System Settings
        </Title>
        <Text type="secondary">
          Configure your ride-sharing platform settings and preferences
        </Text>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "general",
            label: (
              <span>
                <GlobalOutlined />
                General
              </span>
            ),
            children: <GeneralSettings />,
          },
          {
            key: "pricing",
            label: (
              <span>
                <DollarOutlined />
                Pricing
              </span>
            ),
            children: <PricingSettings />,
          },
          {
            key: "payments",
            label: (
              <span>
                <CreditCardOutlined />
                Payments
              </span>
            ),
            children: <PaymentSettings />,
          },
          {
            key: "security",
            label: (
              <span>
                <SafetyOutlined />
                Security
              </span>
            ),
            children: <SecuritySettings />,
          },
          {
            key: "health",
            label: (
              <span>
                <DatabaseOutlined />
                System Health
              </span>
            ),
            children: <SystemHealthTab />,
          },
          {
            key: "data",
            label: (
              <span>
                <ImportOutlined />
                Data Management
              </span>
            ),
            children: <DataManagement />,
          },
        ]}
      />
    </div>
  );
};
