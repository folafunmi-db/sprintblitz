import { Logo } from "@/components/assets/svg/logo";
import { ModeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ClipboardEdit, Footprints } from "lucide-react";

type NavProps = {
  page?: string;
};

export const Nav = ({ page }: NavProps) => {
  return (
    <div className="w-full flex justify-between items-center">
      <Link
        href={"/"}
        className="text-md flex justify-start items-center gap-0 font-medium"
      >
        <Logo showBg={false} /> <p className="hidden md:block">Sprintblitz</p>
      </Link>
      <div className="flex gap-2 justify-end items-center">
        <NavigationMenu>
          {page === "retro" ? (
            <NavigationMenuItem className="list-none">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`space-x-2 ${navigationMenuTriggerStyle()}`}
                >
                  <Footprints />
                  <span>Plan a Sprint instead?</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className="list-none">
              <Link href="/retro" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`space-x-2 ${navigationMenuTriggerStyle()}`}
                >
                  <ClipboardEdit />
                  <span>Have a Retro instead?</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenu>
        <ModeToggle />
      </div>
    </div>
  );
};
