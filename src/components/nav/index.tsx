import { Logo } from "@/components/assets/svg/logo";
import { ModeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export const Nav = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <Link
        href={"/"}
        className="text-xl flex justify-start items-center gap-0 font-medium"
      >
        <Logo showBg={false} /> Adonis
      </Link>
      <ModeToggle />
    </div>
  );
};
