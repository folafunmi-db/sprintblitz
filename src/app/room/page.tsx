"use client";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Balancer from "react-wrap-balancer";
import { Copy } from "lucide-react";
import { configureAbly, useChannel, usePresence } from "@ably-labs/react-hooks";
import { Types } from "ably";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  closestPoint,
  copyToClipboard,
  getCurrentURL,
  votingPoints,
} from "@/lib/utils";
import { v4 } from "uuid";
import LeaveRoom from "@/components/modals/leave-room";
import { MembersType } from "@/store/members";
import Footer from "@/components/footer";
import VotersCard from "@/components/voters-card";
import { Lottie } from "@crello/react-lottie";
import confetti from "@/lotties/confetti.json";

export default function Room({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const members = useGlobalStore((state) => state.members);
  // const estimate = useGlobalStore((state) => state.estimate);
  // const addMember = useGlobalStore((state) => state.addMember);

  // const numberOfEstimates =
  //   members.filter((item) => item.estimate)?.length ?? 0;

  const router = useRouter();

  const { toast } = useToast();

  const roomId = searchParams?.id;
  const roomName = searchParams?.name;
  const userName = searchParams?.user;
  const isModerator = searchParams?.role === "1";

  const currentUrl = getCurrentURL();

  const joinRoute = `/join?id=${roomId}&name=${encodeURIComponent(
    roomName as string
  )}`;
  // const roomRoute = `/room?id=${roomId}&name=${roomName}&user=${userName}`;
  // const roomUrl = `${currentUrl}${roomRoute}`;
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

  const [members, setMembers] = React.useState<MembersType[]>([]);

  const numberOfEstimates =
    members.filter((item) => item?.estimate)?.length ?? 0;

  const estimate = (name: string, estimate: number | string) => {
    const innerMembers = members;
    const memberIndex = innerMembers.findIndex((item) => item.name === name);
    innerMembers[memberIndex].estimate = estimate;

    setMembers(innerMembers);
  };

  const addMember = (args: MembersType) => {
    setMembers((prev) => [...prev, args]);
  };

  const handleDeleteMember = (name: string) => {
    channel.publish("delete", { text: name });
  };

  const deleteMember = ({ name }: { name: string }) => {
    const newMembers = members.filter((item) => item?.name === name);
    setMembers(newMembers);

    if (userName === name) {
      router.push("/");
      toast({
        title: "You were removed by the moderator",
        duration: Infinity,
      });
    }
  };

  const clearEstimates = () => {
    // const innerMembers = members;
    // const cleared = innerMembers.map((item) =>
    //   item.estimate ? { ...item, estimate: "" } : item
    // );

    setMembers([]);
    setRevealEstimates(false);
  };

  const [messages, updateMessages] = React.useState<Types.Message[]>([]);

  const [channel] = useChannel(roomId as string, (message) => {
    updateMessages((prev) => [...prev, message]);
  });

  React.useEffect(() => {
    let message = messages.pop();
    let messageName = message?.name ?? "";

    switch (messageName) {
      case "clear":
        clearEstimates();
        break;
      case "reveal":
        setRevealEstimates(true);
        break;
      case "estimated":
        if (message?.clientId) {
          if (!members.find((item) => item.name === message?.clientId)?.name) {
            addMember({
              estimate: message?.data?.text,
              name: message?.clientId,
              role: "member",
              roomId: roomId as string,
            });
          }
          if (members.find((item) => item.name === message?.clientId)?.name) {
            estimate(message?.clientId, message?.data?.text);
          }
        }
        break;
      case "delete":
        deleteMember({
          name: message?.data?.text,
        });
        break;
      default:
        break;
    }
  }, [messages]);

  const [presenceData] = usePresence(roomId as string);

  const handleLeaveClick = async () => {
    channel?.presence.leave();
    channel?.presence.unsubscribe();
    channel?.unsubscribe();
    router.push("/");
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

  const findEstimate = (name: string) => {
    const esitmate = members.find((item) => item.name === name)?.estimate ?? "";
    return esitmate;
  };

  const findAverage = (decimals = 2) => {
    const length = members.filter((item) => item.role).length ?? "1";
    const sum = members.reduce((a, b) => a + Number(b.estimate), 0);
    return (sum / length).toFixed(decimals);
  };

  const [revealEstimates, setRevealEstimates] = React.useState(false);

  return (
    <main className="text-zinc-800 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 flex min-h-screen flex-col items-center justify-start p-4">
      <Nav />
      <div className="w-full flex-col flex justify-center items-center gap-3">
        <div className="flex justify-center md:justify-between flex-col md:flex-row items-center w-full gap-2 text-2xl md:text-4xl mt-4 font-bold text-center mx-auto">
          <div className="max-w-xl w-full md:w-[45%]">
            <h1 className="overflow-x-hidden text-ellipsis leading-[55px] w-full hidden md:block text-center md:text-left">
              {roomName}
            </h1>

            <Balancer className="leading-[40px] overflow-x-hidden text-ellipsis block md:!hidden w-full text-center md:text-left">
              {roomName}
            </Balancer>
          </div>

          <div className="flex justify-center md:justify-end items-center gap-2 w-full flex-wrap">
            <Button
              variant={"outline"}
              type="button"
              className="space-x-1"
              onClick={() => {
                copyToClipboard(joinUrl);
                toast({ description: "Copied room link!", duration: 2500 });
              }}
            >
              <p className="hidden md:block">Copy link</p>
              <Copy height={16} width={16} />
            </Button>

            <LeaveRoom handleLeaveClick={handleLeaveClick} />
          </div>
        </div>

        <div className="w-full flex justify-center items-center flex-col gap-2">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {isModerator && (
              <div className="flex justify-center items-center flex-wrap space-x-2">
                <Button
                  disabled={numberOfEstimates === 0 || revealEstimates}
                  type="button"
                  onClick={() => {
                    setRevealEstimates(true);
                    channel.publish("reveal", { text: "" });
                    toast({
                      title: `Average: ${findAverage(2)}`,
                      description: `Closest Point: ${closestPoint(
                        Number(findAverage(2))
                      )}`,
                      duration: Infinity,
                    });
                  }}
                  className="relative"
                >
                  <Lottie
                    config={{
                      animationData: confetti,
                      loop: false,
                      autoplay: false,
                    }}
                    playingState={revealEstimates ? "playing" : "stopped"}
                    style={{
                      position: "absolute",
                      pointerEvents: "none",
                    }}
                    width={"200px"}
                    height={"200px"}
                  />
                  Reveal
                </Button>
                <Button
                  disabled={numberOfEstimates === 0}
                  variant={"destructive"}
                  type="button"
                  onClick={() => {
                    clearEstimates();
                    channel.publish("clear", { text: "" });
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full my-2">
          <ul className="w-full grid grid-cols-fit70 gap-4 place-items-center">
            {presenceData.map((msg) => (
              <li
                key={v4()}
                className="max-w-[70px] flex justify-center items-center"
              >
                <VotersCard
                  name={msg.clientId}
                  currentUserName={userName as string}
                  estimate={findEstimate(msg.clientId)}
                  revealEstimates={revealEstimates}
                  handleDeleteMember={handleDeleteMember}
                  isModerator={isModerator}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!isModerator && (
        <div className="top-[100vh] sticky mb-12 w-full flex-col flex justify-center items-center gap-3">
          <p className="text-sm">Give your estimate here 👇</p>
          <div className="flex flex-wrap w-full justify-center items-center gap-4">
            {votingPoints.map((points) => (
              <Button
                onClick={() => {
                  channel.publish("estimated", { text: points });
                }}
                key={v4()}
                variant="outline"
                className={`!bg-zinc-900:90 !dark:bg-zinc-50:90`}
              >
                {points}
              </Button>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
