import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AxiosHeaders, type AxiosRequestConfig } from "axios";

// Components
import Preloader from '@/components/Preloader';
import ScrollTop from '@/components/ScrollTop';
import { apiClient } from "@/apis/axios";
import useAuth from '@/hooks/useAuth';
import useApp from '@/hooks/useApp';
import useUser from '@/hooks/useUser';

function isMutatingRequest(config: AxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase();
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { accessToken, login } = useAuth();
  const { setNeedsProfileCompletion } = useUser();
  const { bootstrap, initialized } = useApp();
  const booted = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootstrap();
  }, []);

  // Set loading to false once bootstrapped (adjusted from 5s to rely on logic if needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
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
            if (!res.data.csrfToken) throw new Error("Invalid CSRF response");
            csrfTokenCache = res.data.csrfToken;
            return csrfTokenCache;
          })
          .finally(() => { csrfTokenRequest = null; });
      }
      return csrfTokenRequest;
    };

    // --- Request Interceptor ---
    const requestInterceptorId = apiClient.interceptors.request.use(async (config) => {
      const headers = AxiosHeaders.from(config.headers ?? {});
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
      if (isMutatingRequest(config)) {
        const csrfToken = await getCsrfToken();
        headers.set("x-csrf-token", csrfToken);
      }
      config.headers = headers;
      return config;
    });

    // --- Response Interceptor (REDIRECT LOGIC HERE) ---
    const responseInterceptorId = apiClient.interceptors.response.use(
      (response) => {
        if (response?.data?.accessToken && response?.data?.user) {
          login({
            accessToken: response.data.accessToken,
            user: response.data.user
          });
        }

        // Handle logic if backend returns 200 but includes the needsProfileCompletion
        if (response.data?.needsProfileCompletion) {
          setNeedsProfileCompletion(true)
        }

        return response;
      },
      async (error) => {
        const data = error.response?.data;

        // Catch the specific ADUN "Incomplete Profile" error
        if (data?.needsProfileCompletion) {
          setNeedsProfileCompletion(true)
          return Promise.reject(error);
        }

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
  }, [accessToken, navigate]);

  if (loading) return <Preloader />;

  if (!initialized) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollTop />

      {children ? children : <Outlet />}
    </div>
  );
}

export default AppLayout;