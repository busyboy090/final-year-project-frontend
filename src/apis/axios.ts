import { API_BASE_URL } from '@/configs/api';
import axios from "axios";

export const apiClient = axios.create({
    baseURL: API_BASE_URL + "/api",
    withCredentials: true,
});