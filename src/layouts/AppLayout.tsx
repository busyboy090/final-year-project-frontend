import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AxiosHeaders, type AxiosRequestConfig } from "axios";

import Preloader from '@/components/Preloader';
import ScrollTop from '@/components/ScrollTop';
import { apiClient } from "@/apis/axios";
import useAuth from '@/hooks/useAuth';
import useApp from '@/hooks/useApp';
import useUser from '@/hooks/useUser';

function isMutatingRequest(config: AxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase();
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method || "");
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];
let csrfTokenCache: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

function AppLayout({ children }: { children?: React.ReactNode }) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { accessToken, login, logout } = useAuth();
  const { setNeedsProfileCompletion } = useUser();
  const { bootstrap, initialized } = useApp();

  // ✅ Refs so interceptors always read the latest values without re-registering
  const accessTokenRef = useRef<string | null>(accessToken);
  const initializedRef = useRef(initialized);
  const loginRef = useRef(login);
  const logoutRef = useRef(logout);

  const booted = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  const isPublicRouteRef = useRef(isPublicRoute);

  // Keep all refs in sync with latest values every render
  useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);
  useEffect(() => { initializedRef.current = initialized; }, [initialized]);
  useEffect(() => { loginRef.current = login; }, [login]);
  useEffect(() => { logoutRef.current = logout; }, [logout]);
  useEffect(() => { isPublicRouteRef.current = isPublicRoute; }, [isPublicRoute]);

  // 1. Bootstrap — runs exactly once
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const init = async () => {
      try {
        await bootstrap();
      } finally {
        setIsBootstrapping(false);
      }
    };
    init();
  }, [bootstrap]);

  // 2. Interceptors — registered once, refs keep values fresh
  useEffect(() => {
    const requestInterceptorId = apiClient.interceptors.request.use(async (config) => {
      const isAuthPath = config.url?.includes('/auth/');

      // Wait for bootstrap to finish before sending data requests
      if (!initializedRef.current && !isAuthPath) {
        await new Promise<void>((resolve) => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (initializedRef.current || attempts > 20) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      const headers = AxiosHeaders.from(config.headers ?? {});

      // ✅ Always reads the latest token via ref — no stale closure
      const token = accessTokenRef.current;
      if (token) headers.set("Authorization", `Bearer ${token}`);

      if (isMutatingRequest(config)) {
        if (!csrfTokenCache && !csrfTokenRequest) {
          csrfTokenRequest = apiClient
            .get("/v1/auth/csrf-token")
            .then((res) => {
              csrfTokenCache = res.data.csrfToken;
              return csrfTokenCache!;
            })
            .finally(() => { csrfTokenRequest = null; });
        }
        const csrf = await (csrfTokenCache
          ? Promise.resolve(csrfTokenCache)
          : csrfTokenRequest!);
        if (csrf) headers.set("x-csrf-token", csrf);
      }

      config.headers = headers;
      return config;
    });

    const responseInterceptorId = apiClient.interceptors.response.use(
      (res) => {
        if (res.data?.accessToken) {
          loginRef.current({ accessToken: res.data.accessToken, user: res.data.user });
        }
        if (res.data?.needsProfileCompletion) setNeedsProfileCompletion(true);
        return res;
      },
      async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return apiClient(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const res = await apiClient.post("/v1/auth/refresh-token");
            const newToken = res.data.accessToken;

            // ✅ Update ref immediately so queued requests get the token right away
            accessTokenRef.current = newToken;
            loginRef.current({ accessToken: newToken, user: res.data.user });

            processQueue(null, newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (reErr) {
            processQueue(reErr, null);
            csrfTokenCache = null; // invalidate CSRF on full logout
            logoutRef.current();
            if (!isPublicRouteRef.current) navigate("/login");
            return Promise.reject(reErr);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(err);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptorId);
      apiClient.interceptors.response.eject(responseInterceptorId);
    };
  }, []); // ✅ Empty deps — registers once, refs handle freshness

  // --- Rendering ---
  if (isBootstrapping) return <Preloader />;

  if (!accessToken && !isPublicRoute) {
    navigate("/login", { replace: true });
    return <Preloader />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollTop />
      {children || <Outlet />}
    </div>
  );
}

export default AppLayout;