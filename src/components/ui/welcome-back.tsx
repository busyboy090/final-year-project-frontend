import useUser from "@/hooks/useUser";
import { formatName } from "@/utils/format";

function WelcomeBack() {
  const { profile } = useUser();
  
  return (
    <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#001e40]">
      Welcome back, { profile && profile?.first_name && profile?.last_name && formatName(profile.first_name, profile.last_name, profile?.title) }
    </h2>
  )
}

export default WelcomeBack;