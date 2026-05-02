import useAuth from "@/hooks/useAuth";
import { formatName } from "@/utils/format";

function WelcomeBack() {
  const { user } = useAuth();
  
  return (
    <h2 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
      Welcome back, { user && user?.first_name && user?.last_name && formatName(user.first_name, user.last_name) }
    </h2>
  )
}

export default WelcomeBack;