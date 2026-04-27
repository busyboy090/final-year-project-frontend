import type { AxiosResponse } from "axios";
import { apiClient } from "@/apis/axios";

export function apiGet<T = unknown>(path: string): Promise<AxiosResponse<T>> {
  return apiClient.get<T>(path);
}

export function apiPost<T = unknown, B = unknown>(
  path: string,
  body: B
): Promise<AxiosResponse<T>> {
  return apiClient.post<T>(path, body);
}
