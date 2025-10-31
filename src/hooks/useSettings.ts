// src/hooks/useSettings.ts
import { useCustom, useCustomMutation } from "@refinedev/core";

// General Settings Hooks
export const useGeneralSettings = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-general-settings",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreateGeneralSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const createSetting = (values: any) => {
    return mutate({
      url: "create-general-setting",
      method: "post",
      values,
    });
  };

  return {
    mutate: createSetting,
    isLoading,
    isError,
  };
};

export const useUpdateGeneralSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const updateSetting = (id: string, values: any) => {
    return mutate({
      url: "update-general-setting",
      method: "post",
      values: {
        id,
        input: values,
      },
    });
  };

  return {
    mutate: updateSetting,
    isLoading,
    isError,
  };
};

export const useActivateGeneralSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const activateSetting = (id: string) => {
    return mutate({
      url: "activate-general-setting",
      method: "post",
      values: { id },
    });
  };

  return {
    mutate: activateSetting,
    isLoading,
    isError,
  };
};

// Pricing Settings Hooks
export const usePricingSettings = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-pricing-settings",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreatePricingSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const createSetting = (values: any) => {
    return mutate({
      url: "create-pricing-setting",
      method: "post",
      values,
    });
  };

  return {
    mutate: createSetting,
    isLoading,
    isError,
  };
};

export const useUpdatePricingSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const updateSetting = (id: string, values: any) => {
    return mutate({
      url: "update-pricing-setting",
      method: "post",
      values: {
        id,
        input: values,
      },
    });
  };

  return {
    mutate: updateSetting,
    isLoading,
    isError,
  };
};

export const useActivatePricingSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const activateSetting = (id: string) => {
    return mutate({
      url: "activate-pricing-setting",
      method: "post",
      values: { id },
    });
  };

  return {
    mutate: activateSetting,
    isLoading,
    isError,
  };
};

// Payment Settings Hooks
export const usePaymentSettings = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-payment-settings",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreatePaymentSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const createSetting = (values: any) => {
    return mutate({
      url: "create-payment-setting",
      method: "post",
      values,
    });
  };

  return {
    mutate: createSetting,
    isLoading,
    isError,
  };
};

export const useUpdatePaymentSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const updateSetting = (id: string, values: any) => {
    return mutate({
      url: "update-payment-setting",
      method: "post",
      values: {
        id,
        input: values,
      },
    });
  };

  return {
    mutate: updateSetting,
    isLoading,
    isError,
  };
};

export const useActivatePaymentSetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const activateSetting = (id: string) => {
    return mutate({
      url: "activate-payment-setting",
      method: "post",
      values: { id },
    });
  };

  return {
    mutate: activateSetting,
    isLoading,
    isError,
  };
};

// Security Settings Hooks
export const useSecuritySettings = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-security-settings",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useCreateSecuritySetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const createSetting = (values: any) => {
    return mutate({
      url: "create-security-setting",
      method: "post",
      values,
    });
  };

  return {
    mutate: createSetting,
    isLoading,
    isError,
  };
};

export const useUpdateSecuritySetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const updateSetting = (id: string, values: any) => {
    return mutate({
      url: "update-security-setting",
      method: "post",
      values: {
        id,
        input: values,
      },
    });
  };

  return {
    mutate: updateSetting,
    isLoading,
    isError,
  };
};

export const useActivateSecuritySetting = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const activateSetting = (id: string) => {
    return mutate({
      url: "activate-security-setting",
      method: "post",
      values: { id },
    });
  };

  return {
    mutate: activateSetting,
    isLoading,
    isError,
  };
};

// System Health Hooks
export const useSystemHealth = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-system-health",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useSystemHealthStats = () => {
  const { data, isLoading, isError, refetch } = useCustom({
    url: "get-system-health-stats",
    method: "get",
  });

  return {
    data: data?.data,
    isLoading,
    isError,
    refetch,
  };
};

export const useRefreshSystemHealth = () => {
  const { mutate, isLoading, isError } = useCustomMutation();

  const refreshHealth = () => {
    return mutate({
      url: "refresh-system-health",
      method: "post",
      values: {},
    });
  };

  return {
    mutate: refreshHealth,
    isLoading,
    isError,
  };
};