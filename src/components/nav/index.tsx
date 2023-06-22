import { Logo } from "@/components/assets/svg/logo";
import { ModeToggle } from "@/components/ui/theme-toggle";

export const Nav = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="text-xl flex justify-start items-center gap-2 font-medium">
        <Logo /> Adonis
      </div>
      <ModeToggle />
    </div>
  );
};
