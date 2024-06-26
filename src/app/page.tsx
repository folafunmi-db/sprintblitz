"use client";

//som
import { Logo } from "@/components/assets/svg/logo";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Balancer from "react-wrap-balancer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import * as React from "react";
import { v5 } from "uuid";
import { copyToClipboard, getCurrentURL } from "@/lib/utils";
import { ArrowUpRight, Copy, Plus } from "lucide-react";
import { useGlobalStore } from "@/store";
import Footer from "@/components/footer";
import { ErrorBoundary } from "@highlight-run/react";

export default function Home() {
  const router = useRouter();
  const [room, setRoom] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [show, setShow] = React.useState(false);

  const currentUrl = getCurrentURL();
  const { toast } = useToast();

  const roomId = v5(room, v5.URL);
  const joinRoute = `/join?id=${roomId}&name=${encodeURIComponent(room)}`;
  const roomRoute = `/room?id=${roomId}&name=${room}&user=${encodeURIComponent(
    userName
  )}&role=1`;
  const roomUrl = `${currentUrl}${roomRoute}`;
  const joinUrl = `${currentUrl}${joinRoute}`;

  const createRoom = useGlobalStore((state) => state.addRoom);

  return (
    <ErrorBoundary>
      <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4 pb-0">
        <Nav />
        <div className="w-full flex justify-center items-center gap-3">
          <div className="w-full max-w-3xl text-6xl mt-4 font-bold text-center mx-auto">
            <div className="mx-auto grid place-items-center">
              <Logo width="200" height="200" showBg={false} />
            </div>
            <Balancer>Planning a sprint? Create a room here.</Balancer>
            <div className="mx-auto my-10 flex w-full max-w-md items-center space-x-2">
              <Input
                name="user-name"
                placeholder="Your name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !!userName && !!room) {
                    setShow(true);
                  }
                }}
              />

              <Input
                name="room-name"
                placeholder="Room name"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !!userName && !!room) {
                    setShow(true);
                  }
                }}
              />

              <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger asChild disabled={!room}>
                  <Button
                    className="space-x-1"
                    type="button"
                    disabled={!room || !userName}
                    onClick={() => {
                      createRoom({
                        closedAt: null,
                        createdAt: new Date(Date.now()),
                        id: roomId,
                        link: roomUrl,
                        members: [],
                        moderator: [],
                        name: room,
                        numberOfMembers: 0,
                        scope: "public",
                      });
                    }}
                  >
                    <span>Create </span>
                    <Plus height={16} width={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Room Details</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col justify-start items-start gap-4 py-4">
                    <div className="flex font-semibold justify-start items-center space-x-2">
                      <p className="whitespace-nowrap">Your name:</p>{" "}
                      <span className="font-normal text-sm">{userName}</span>
                    </div>
                    <div className="flex font-semibold justify-start items-center space-x-2">
                      <p className="whitespace-nowrap">Room name:</p>{" "}
                      <span className="font-normal text-sm">{room}</span>
                    </div>
                    <div className="flex font-semibold justify-start items-center space-x-2">
                      <p className="whitespace-nowrap">Room ID:</p>{" "}
                      <span className="font-normal text-sm">{roomId}</span>
                    </div>
                  </div>
                  <DialogFooter className="flex w-full gap-2">
                    <Button
                      variant={"secondary"}
                      type="button"
                      className="flex-1 space-x-1"
                      onClick={() => {
                        copyToClipboard(joinUrl);
                        toast({
                          description: "Copied room link!",
                          duration: 2500,
                        });
                      }}
                    >
                      <span>Copy link</span>
                      <Copy height={16} width={16} />
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 space-x-1"
                      onClick={() => {
                        router.push(roomRoute);
                      }}
                    >
                      <span>Go to room</span>
                      <ArrowUpRight height={16} width={16} />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
