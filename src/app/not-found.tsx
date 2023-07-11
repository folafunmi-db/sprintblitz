import Balancer from "react-wrap-balancer";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/assets/svg/logo";

export default function NotFound() {
  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-center p-4 pb-0">
      <div className="w-full flex justify-center items-center gap-3">
        <div className="w-full max-w-3xl text-6xl mt-4 font-bold text-center mx-auto">
          <div className="mx-auto grid place-items-center">
            <Logo width="200" height="200" showBg={false} />
          </div>
          <Balancer>Seems you&apos;re lost</Balancer>
          <div className="mx-auto my-4 flex w-full max-w-md justify-center items-center space-x-2">
            <Link href={"/"}>
              <Button>Go home</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
