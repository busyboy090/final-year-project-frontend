import useUser from "@/hooks/useUser";
import { FormattedName } from "./formatted-name";

function WelcomeBack() {
  const { profile } = useUser();

  return (
    <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#001e40]">
      Welcome back, {"  "}
      <FormattedName
        firstName={profile.first_name}
        lastName={profile.last_name}
        title={profile.title}
      />
    </h2>
  )
}

export default WelcomeBack;