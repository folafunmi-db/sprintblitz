"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Balancer from "react-wrap-balancer";
import { Copy, LogOut } from "lucide-react";
import * as Ably from "ably/promises";
import { configureAbly, useChannel, usePresence } from "@ably-labs/react-hooks";
import * as React from "react";
import { useRouter } from "next/navigation";
import { copyToClipboard, getCurrentURL, votingPoints } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 } from "uuid";

export default function Room({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [show, setShow] = React.useState(false);
  const router = useRouter();

  const { toast } = useToast();

  const roomId = searchParams?.id;
  const roomName = searchParams?.name;
  const userName = searchParams?.user;
  const currentUrl = getCurrentURL();

  const joinRoute = `/join?id=${roomId}&name=${roomName}`;
  const roomRoute = `/room?id=${roomId}&name=${roomName}&user=${userName}`;
  const roomUrl = `${currentUrl}${roomRoute}`;
  const joinUrl = `${currentUrl}${joinRoute}`;

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
    if (!(userName && roomId && roomName)) {
      toast({
        title: "Welcome",
        description: `${userName} joined the ${roomName}${
          !roomName?.includes("room") ? " room" : ""
        }.`,
        duration: 5000,
      });
    }
  }, [userName, roomName]);

  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4">
      <Nav />
      <div className="w-full flex-col flex justify-center items-center gap-3">
        <div className="w-full max-w-xl text-6xl my-2 font-bold text-center mx-auto">
          <Balancer>{roomName}</Balancer>
        </div>
        <div className="w-full flex justify-center items-center flex-wrap gap-2">
          {!true ? (
            <Button type="button" onClick={() => {}}>
              Start voting
            </Button>
          ) : (
            <Button type="button" onClick={() => {}}>
              Reveal votes
            </Button>
          )}

          <Button
            variant={"outline"}
            type="button"
            className="space-x-1"
            onClick={() => {
              copyToClipboard(joinUrl);
              toast({ description: "Copied room link!", duration: 5000 });
            }}
          >
            <Copy height={16} width={16} />
          </Button>

          <Dialog open={show} onOpenChange={setShow}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setShow(true);
                }}
                variant={"destructive"}
                className=""
              >
                <LogOut height={16} width={16} className="" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Leave Room</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col justify-start items-start gap-4 py-4">
                <div className="flexjustify-start items-center space-x-2">
                  <p className="">Are you sure you want to leave?</p>{" "}
                </div>
              </div>
              <DialogFooter className="flex w-full">
                <Button
                  variant={"secondary"}
                  type="button"
                  className="flex-1 space-x-1"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  <span>No, I want to stay!</span>
                </Button>
                <Button
                  variant={"destructive"}
                  type="button"
                  className="flex-1 space-x-1"
                  onClick={() => {
                    handleLeaveClick();
                  }}
                >
                  <span>Yes, I want to leave!</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full grid auto-rows-auto justify-center align-center">
          <ul>
            {presenceData.map((msg, index) => (
              <li key={index}>{msg.clientId}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="top-[100vh] sticky w-full flex-col flex justify-center items-center gap-3">
        <p className="">Vote here 👇</p>
        <div className="flex w-full justify-center items-center gap-4">
          {votingPoints.map((i) => (
            <Button
              onClick={() => {
                channel.publish("voted", { text: i });
              }}
              key={v4()}
              variant="outline"
              className={`!bg-zinc-900:90 !dark:bg-zinc-50:90`}
            >
              {i}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
