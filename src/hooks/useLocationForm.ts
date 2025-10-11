
// src/hooks/useLocationForm.ts
import { useState, useCallback } from 'react';
import { useForm, HttpError } from '@refinedev/core';
import { message, Form } from 'antd';

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

interface UseLocationFormProps {
  onSuccess?: () => void;
  onError?: (error: HttpError) => void;
}

export const useLocationForm = ({ onSuccess, onError }: UseLocationFormProps = {}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [form] = Form.useForm();

  const formConfig = {
    resource: "locations",
    redirect: false,
    onMutationSuccess: (data: any, variables: any, context: any) => {
      const isEdit = !!variables?.id;
      message.success(
        isEdit ? "Location updated successfully" : "Location created successfully"
      );
      onSuccess?.();
    },
    onMutationError: (error: HttpError, variables: any, context: any) => {
      const isEdit = !!variables?.id;
      const errorMessage = error?.message || 
        (isEdit ? "Failed to update location" : "Failed to create location");
      message.error(errorMessage);
      onError?.(error);
    },
  };

  const createForm = useForm({
    ...formConfig,
    action: "create",
  });

  const editForm = useForm({
    ...formConfig,
    action: "edit",
    id: selectedLocation?.id, // Add this line to ensure ID is available
  });

  const handleCreateSubmit = useCallback(async (values: any) => {
    try {
      await createForm.onFinish(values);
    } catch (error) {
      console.error("Create mutation error:", error);
      throw error;
    }
  }, [createForm]);

  const handleEditSubmit = useCallback(async (values: any, id?: string) => {
  try {
    if (!id) {
      throw new Error("Location ID is required for editing");
    }
    
    console.log("Submitting edit with ID:", id, "Values:", values);
    
    // Remove the ID from the values object before sending
    const { id: _, ...cleanValues } = values;
    
    // Pass ID separately, not in the input object
    await editForm.onFinish(cleanValues, id);
  } catch (error) {
    console.error("Edit mutation error:", error);
    throw error;
  }
}, [editForm]);

  return {
    form,
    createFormProps: createForm,
    editFormProps: {
      ...editForm,
      id: selectedLocation?.id, // Pass ID to form props
    },
    handleCreateSubmit,
    handleEditSubmit,
    selectedLocation,
    setSelectedLocation,
  };
};