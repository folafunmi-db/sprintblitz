"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Balancer from "react-wrap-balancer";
import * as React from "react";
import { DoorOpen, LogIn } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function Join({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [becomeModerator, setBecomeModerator] = useState(false);

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

  const roomRoute = `/room?id=${roomId}&name=${roomName}&user=${username}${
    becomeModerator ? "&role=1" : ""
  }`;

  const handleJoin = () => {
    router.push(roomRoute);
  };

  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4 pb-0">
      <Nav />
      <div className="w-full flex justify-center items-center gap-3">
        <div className="w-full max-w-3xl mt-2 text-center mx-auto">
          <Balancer className="text-4xl font-bold">
            Join the {roomName} {!roomName?.includes("room") && " room"}.
            <br />
            What&apos;s your name?
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
              disabled={!username}
              onClick={() => {
                handleJoin();
              }}
            >
              <span>Enter</span>
              <LogIn height={16} width={16} />
            </Button>
          </div>

          <div className="text-sm my-4 flex justify-center items-center gap-2">
            <Switch
              checked={becomeModerator}
              onCheckedChange={setBecomeModerator}
            />
            <p className="">Join as a moderator</p>
          </div>
          <Button
            onClick={() => {
              router.push("/");
            }}
            variant={"link"}
            className="space-x-4"
          >
            <DoorOpen height={16} width={16} className="mx-2" />
            No, I want to go home!
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
