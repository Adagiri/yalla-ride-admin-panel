
import { useState } from 'react';
import { message } from 'antd';

export const useFileDownload = () => {
  const [loading, setLoading] = useState(false);

  const getDownloadUrl = async (key: string): Promise<string> => {
    if (!key) {
      throw new Error('File key is required');
    }

    setLoading(true);
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            query GetFileDownloadUrl($key: String!) {
              getFileDownloadUrl(key: $key)
            }
          `,
          variables: { key },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data.getFileDownloadUrl;
    } catch (error: any) {
      console.error('Failed to get download URL:', error);
      message.error(`Failed to load file: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDownloadUrl,
    loading,
  };
};