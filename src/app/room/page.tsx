"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { DoorOpen, LogIn, LogOut } from "lucide-react";
import * as Ably from "ably/promises";
import { configureAbly, useChannel, usePresence } from "@ably-labs/react-hooks";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function Room({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const { toast } = useToast();

  const roomId = searchParams?.id;
  const roomName = searchParams?.name;
  const userName = searchParams?.user;

  React.useEffect(() => {
    if (!(userName && roomId && roomName)) {
      router.push("/");
    }
  }, [roomId, roomName]);

  configureAbly({
    key: process.env.NEXT_PUBLIC_ABLY,
    clientId: userName as string,
  });

  const [messages, updateMessages] = React.useState<
    Ably.Types.PresenceMessage[]
  >([]);

  const [channel, ably] = useChannel(roomId as string, (message) => {
    console.log(message);
  });

  const [presenceData, updateStatus] = usePresence(
    roomId as string,
    (presenceUpdate: any) => {
      console.log(presenceUpdate);
    }
  );

  const handleLeaveClick = async () => {
    channel?.presence.leave();
    channel?.presence.unsubscribe();
    channel?.unsubscribe();
    router.push("/");
  };

  const handlePresenceMessage = (message: Ably.Types.PresenceMessage) => {
    updateMessages((prev) => [...prev, message]);
  };

  React.useEffect(() => {
    toast({
      title: "Welcome",
      description: `${userName} joined the ${roomName}${
        !roomName?.includes("room") ? " room" : ""
      }.`,
      duration: 5000,
    });
  }, [userName, roomName]);

  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4">
      <Nav />
      <div className="w-full flex-col flex justify-center items-center gap-3">
        <div className="w-full max-w-xl text-6xl my-2 font-bold text-center mx-auto">
          <Balancer>{roomName}</Balancer>
        </div>
        <Button
          onClick={() => {
            handleLeaveClick();
          }}
          variant={"destructive"}
          className="space-x-4"
        >
          <LogOut height={16} width={16} className="mx-2" />I want to go home!
        </Button>
        <Button
          onClick={() => {
            channel.publish("voted", { text: 1 });
          }}
        >
          1
        </Button>
        <ul>
          {presenceData.map((msg, index) => (
            <li key={index}>{msg.clientId}</li>
          ))}
        </ul>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.data}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
