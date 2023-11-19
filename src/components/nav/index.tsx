import { Logo } from "@/components/assets/svg/logo";
import { ModeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

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
      <div className="flex justify-end items-center">
        <NavigationMenu>
          {page === "retro" ? (
            <NavigationMenuItem className="list-none">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Plan a Sprint instead?
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className="list-none">
              <Link href="/retro" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Have a Retro instead?
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
