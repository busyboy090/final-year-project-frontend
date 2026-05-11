import { 
  UserPlus, 
  Filter, 
  Download, 
  Edit, 
  LockKeyhole, 
  UserMinus, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Users
} from "lucide-react";

// Shadcn UI Components (Assuming standard installation paths)
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const UserManagement = () => {
  const users = [
    {
      id: 1,
      name: "Dr. Chidi Okoro",
      email: "chidi.okoro@adun.edu.ng",
      role: "Academic Staff",
      department: "Cyber Security",
      status: "Active",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMbMTd6i4N0soUpuO3JgSbrEsg9qDEVkj2EzR65HnFG2BamZrOIzPul9HQO3G_7QIAQUaHzlDMoN3K_yVJTIw5RnYnj1VYZTApnsu1N1Bnm5uhjOPC1zo8eTq1q9DbGijj--qv_PVXT5tBKfXl2M-I0yq2-yubrr3E0dl5eHAOdk2D9erJSqHjRmlpU51CLA25oVWYZbKMeRoazp3CYa5hX8sphb2dXK991uasWMR1GeKSMVPgw8adbeZ_yTQq97DEyeKHdBcLiXA"
    },
    {
      id: 2,
      name: "Tunde Adeyemi",
      email: "t.adeyemi@adun.student.ng",
      role: "Student",
      department: "Maritime Studies",
      status: "Active",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM6GU9eomTNmsukYXYG1U6QOSgdAw6fhTNJyI7kOdaj1wIEoI77boIzqyrtXpA3v12ItoM8mOeb0Ab_G_8I_m72JkHoJBv1KuhXp-73Ds044zdU_bG9xLq_VAjdhJ5ohMyr3rVCaFuRtKTZohqIhtAcdY7wOR0BPDyXtln9ljYqJ54vGCr6wq3pr0CmnohL_iK0ssyvJtQ3gxPECiS1z1vgmH5Ce1g_r92xtsGZUhm9U7B7kRVjeDDVJEFJN_8l6Nr6fH8-9YwHho"
    },
    {
      id: 3,
      name: "Sarah Philips",
      email: "s.philips@adun.edu.ng",
      role: "Admin",
      department: "Registry Office",
      status: "Inactive",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoLoEZlyGdqsTLqCUwHOPBT0rY-AbjwqPcD0LoBf-AL2slKoddF5Dv7GbtFG7EyLXK3zFwJ00uME-0Lbt2o5o9ragZ9kod-pLskG16J7wZ0TfBJabaxYFL_XHmTX7Jb9KY_YL_CR7BmWpoyKV-UR_sEin033tLXsT_w9yQwNsxQd6e7UOiGM7gmiVEyNXC-ykPghK4kCsabmye0zr98-0zWq4-jImWElpD_H0tm5Tnv2nqd0zQKZkincxwUDjfUtLevnGM3GEcBeM"
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-xs font-black text-[#7b5800] tracking-[0.2em] uppercase block">
            Central Registry
          </span>
          <h2 className="text-4xl font-extrabold text-[#001e40] tracking-tight">
            User Management
          </h2>
        </div>
        <Button className="bg-[#7b5800] hover:bg-[#5d4200] text-white font-bold h-12 px-6 gap-2 shadow-lg">
          <UserPlus className="w-5 h-5" />
          Add New User
        </Button>
      </div>

      {/* Filter & Statistics Bento Bar */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-[#ecf5fe] rounded-xl p-4 flex items-center justify-between border border-blue-100">
          <div className="flex items-center gap-8">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#737780] tracking-wider ml-1">Filter by Role</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-transparent border-none font-semibold text-[#001e40] focus:ring-0 h-auto p-0">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All University Roles</SelectItem>
                  <SelectItem value="admin">Administrative</SelectItem>
                  <SelectItem value="staff">Academic Staff</SelectItem>
                  <SelectItem value="student">Student Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-px h-8 bg-[#c3c6d1]/40" />

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#737780] tracking-wider ml-1">Department</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-transparent border-none font-semibold text-[#001e40] focus:ring-0 h-auto p-0">
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="maritime">Maritime Studies</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="cyber">Cyber Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white border-none shadow-sm hover:shadow-md">
              <Filter className="w-4 h-4 text-[#001e40]" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white border-none shadow-sm hover:shadow-md">
              <Download className="w-4 h-4 text-[#001e40]" />
            </Button>
          </div>
        </div>

        <div className="col-span-4 bg-[#001e40] rounded-xl p-4 flex items-center gap-6 text-white overflow-hidden relative border border-[#002b5c]">
          <div className="z-10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Total Registered</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">1,248</span>
              <span className="text-[10px] text-emerald-400 font-bold">+12% this month</span>
            </div>
          </div>
          <Users className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e0e9f2]/50">
            <TableRow className="hover:bg-transparent border-b border-[#c3c6d1]/20">
              <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">Identity & Name</TableHead>
              <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">Access Role</TableHead>
              <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">Department</TableHead>
              <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">Status</TableHead>
              <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-[#ecf5fe]/30 transition-colors border-b border-slate-50">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#e0e9f2] flex items-center justify-center overflow-hidden border border-slate-100">
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#001e40] leading-none mb-1">{user.name}</p>
                      <p className="text-[11px] text-[#737780] font-medium">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter border-none shadow-none ${
                    user.role === 'Admin' ? 'bg-[#fec657]/20 text-[#735200]' : 'bg-[#001e40]/10 text-[#001e40]'
                  }`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-6">
                  <p className="text-sm font-semibold text-[#43474f]">{user.department}</p>
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className={`text-[11px] font-bold uppercase ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#001e40] hover:bg-[#001e40]/5">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7b5800] hover:bg-[#7b5800]/5">
                      <LockKeyhole className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                      {user.status === 'Active' ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <div className="px-6 py-4 bg-[#ecf5fe]/50 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] font-bold text-[#737780] uppercase tracking-wider">
            Showing {users.length} of 1,248 Faculty Members
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button size="sm" className="w-8 h-8 bg-[#001e40] text-white font-bold p-0">1</Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 text-[#001e40] font-bold p-0">2</Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 text-[#001e40] font-bold p-0">3</Button>
            </div>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;