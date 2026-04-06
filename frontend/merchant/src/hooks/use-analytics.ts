import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:3000/api/v1/analytics';
const STORE_ID = 'store_001';

export function useAnalytics<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          headers: {
            'x-store-id': STORE_ID,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (isMounted) {
          setData(result);
          setError(null);
          retryCount.current = 0;
        }
      } catch (err: any) {
        console.error(`Error fetching ${endpoint}:`, err.message);
        if (isMounted) {
          setError(err);
          // Simple exponential backoff retry for non-400 errors
          if (retryCount.current < MAX_RETRIES) {
            retryCount.current += 1;
            const delay = Math.pow(2, retryCount.current) * 1000;
            setTimeout(() => {
              if (isMounted) fetchData();
            }, delay);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [endpoint]);

  return { data, loading, error };
}
