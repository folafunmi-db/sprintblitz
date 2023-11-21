"use client";

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
import { copyToClipboard, getCurrentURL } from "@/lib/utils";
import { ArrowUpRight, Copy, Loader2, Plus } from "lucide-react";
import Footer from "@/components/footer";
import { ErrorBoundary } from "@highlight-run/react";

type RoomData = {
  id: number;
  name: string;
} | null;

export default function Home() {
  const router = useRouter();
  const [room, setRoom] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [roomData, setRoomData] = React.useState<RoomData>(null);

  const currentUrl = getCurrentURL();
  const { toast } = useToast();

  const joinRoute = `/join?id=${roomData?.id}&name=${encodeURIComponent(
    roomData?.name ?? ""
  )}`;
  const roomRoute = `/room?id=${roomData?.id}&name=${roomData?.name}`;
  // const roomUrl = `${currentUrl}${roomRoute}`;
  const joinUrl = `${currentUrl}${joinRoute}`;

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch("/retro/api/create-room", {
        method: "POST",
        body: JSON.stringify({
          name: room,
        }),
      });
      const data: RoomData = await res.json();
      setRoomData(data);
      setShow(true);
    } catch (error) {
      setRoomData(null);
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4 pb-0">
        <Nav page="retro" />
        <div className="w-full flex justify-center items-center gap-3">
          <div className="w-full max-w-3xl text-3xl md:text-6xl mt-4 font-bold text-center mx-auto">
            <div className="mx-auto grid place-items-center">
              <Logo width="200" height="200" showBg={false} />
            </div>
            <Balancer>Planning a Retro? Create a room here!</Balancer>
            <div className="mx-auto my-10 flex flex-col md:flex-row w-full max-w-sm items-center gap-2">
              <Input
                name="room-name"
                placeholder="Room name"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !!room) {
                    handleCreateRoom();
                  }
                }}
              />

              <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger asChild disabled={!room}>
                  <Button
                    className="space-x-1 w-full md:w-auto"
                    type="button"
                    disabled={loading || !room}
                    onClick={() => {
                      handleCreateRoom();
                    }}
                  >
                    {loading ? (
                      <>
                        <span>Please wait</span>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <Plus height={16} width={16} />
                        <span>Create </span>
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Room Details</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col justify-start items-start gap-4 py-4">
                    <div className="flex font-semibold justify-start items-center space-x-2">
                      <p className="whitespace-nowrap">Room name:</p>{" "}
                      <span className="font-normal text-sm">
                        {roomData?.name ?? "Unavailable"}
                      </span>
                    </div>
                    <div className="flex font-semibold justify-start items-center space-x-2">
                      <p className="whitespace-nowrap">Room ID:</p>{" "}
                      <span className="font-normal text-sm">
                        {roomData?.id ?? "Unavailable"}
                      </span>
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
                      <Copy height={16} width={16} />
                      <span>Copy link</span>
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 space-x-1"
                      onClick={() => {
                        router.push(roomRoute);
                      }}
                    >
                      <ArrowUpRight height={16} width={16} />
                      <span>Go to room</span>
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
