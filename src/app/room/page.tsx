"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Balancer from "react-wrap-balancer";
import * as React from "react";
import Link from "next/link";
import { DoorOpen, LogIn, MoveLeft } from "lucide-react";

export default function Room({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [showRoom, setShowRoom] = React.useState(false);
  const [yourName, setYourName] = React.useState("");

  const { toast } = useToast();

  const roomId = searchParams?.id;
  const roomName = searchParams?.name;

  const handleJoin = () => {
    setShowRoom(true);
    toast({
      title: "Welcome",
      description: `${yourName} joined the ${roomName}${
        !roomName?.includes("room") ? " room" : ""
      }.`,
      duration: 5000,
    });
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
              value={yourName}
              onChange={(e) => {
                setYourName(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !!yourName) {
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
