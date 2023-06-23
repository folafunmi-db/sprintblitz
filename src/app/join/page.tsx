"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Balancer from "react-wrap-balancer";
import * as React from "react";
import Link from "next/link";
import { DoorOpen, LogIn } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function Join({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");

  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const roomId = searchParams?.id;
  const roomName = searchParams?.name;

  React.useEffect(() => {
    if (!(roomId && roomName)) {
      router.push("/");
    }
  }, [roomId, roomName]);

  const roomRoute = `/room?id=${roomId}&name=${roomName}&user=${username}`;

  const handleJoin = () => {
    router.push(roomRoute);
  };

  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4">
      <Nav />
      <div className="w-full flex justify-center items-center gap-3">
        <div className="w-full max-w-3xl text-6xl my-2 font-bold text-center mx-auto">
          <Balancer>
            Join the {roomName}
            {!roomName?.includes("room") && " room"}. What&apos;s your name?
          </Balancer>
          <div className="mx-auto mt-10 mb-0 flex w-full max-w-sm items-center space-x-2">
            <Input
              name="your-name"
              placeholder="Your name"
              value={username}
              onChange={(e) => {
                handleUsernameInputChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !!username) {
                  handleJoin();
                }
              }}
            />
            <Button
              type="button"
              className="flex-1 space-x-1"
              onClick={() => {
                handleJoin();
              }}
            >
              <span>Enter</span>
              <LogIn height={16} width={16} />
            </Button>
          </div>
          <Link href={"/"}>
            <Button variant={"link"} className="space-x-4">
              <DoorOpen height={16} width={16} className="mx-2" />
              No, I want to go home!
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
