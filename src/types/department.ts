export interface Department {
  id:        number;
  name:      string;
  code:      string;
  type: DepartmentType;
  facultyId?: number;
  faculty?:  { id: number; name: string, code: string };
}

export interface DepartmentsParams {
  facultyId?: number;
  search?:    string;
  type?:      string;
  page?:      number;
  limit?:     number;
}

export interface PaginatedDepartmentsResponse {
  departments: Department[];
  total:       number;
  page:        number;
  limit:       number;
}

export type DepartmentType = "Academic" | "Administrative" | "Student Union" | "Support Unit" | "Research Unit";