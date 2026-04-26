import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AxiosHeaders, type AxiosRequestConfig } from "axios";

// Components
import Preloader from '@/components/Preloader';
import ScrollTop from '@/components/ScrollTop';
import { apiClient } from "@/apis/axios";
import useAuth from '@/hooks/useAuth';

function isMutatingRequest(config: AxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase();
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { bootstrap, accessToken } = useAuth();
  const booted = useRef<boolean>(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootstrap();
}, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    let csrfTokenCache: string | null = null;
    let csrfTokenRequest: Promise<string> | null = null;

    const getCsrfToken = async (): Promise<string> => {
      if (csrfTokenCache) return csrfTokenCache;
      if (!csrfTokenRequest) {
        csrfTokenRequest = apiClient
          .get<{ csrfToken?: string }>("/v1/auth/csrf-token")
          .then((res) => {
            if (!res.data.csrfToken) {
              throw new Error("Invalid CSRF response");
            }
            csrfTokenCache = res.data.csrfToken;
            return csrfTokenCache;
          })
          .finally(() => {
            csrfTokenRequest = null;
          });
      }
      return csrfTokenRequest;
    };

    const requestInterceptorId = apiClient.interceptors.request.use(async (config) => {
      const headers = AxiosHeaders.from(config.headers ?? {});

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (isMutatingRequest(config)) {
        const csrfToken = await getCsrfToken();
        headers.set("x-csrf-token", csrfToken);
      }

      config.headers = headers;
      return config;
    });

    const responseInterceptorId = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 403 && isMutatingRequest(error.config ?? {})) {
          csrfTokenCache = null;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptorId);
      apiClient.interceptors.response.eject(responseInterceptorId);
    };
  }, [accessToken]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollTop />
      { children ? children : <Outlet /> }
    </div>
  )
}

export default AppLayout