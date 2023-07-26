import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  name: string;
  currentUserName: string;
  estimate: string | number;
  revealEstimates: boolean;
  handleDeleteMember: (name: string) => void;
  isModerator: boolean;
};

const VotersCard: React.FC<Props> = (props) => {
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeName = (name: string) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    if (!name) {
      current.delete("user");
    } else {
      current.set("user", name);
    }

    // cast to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    if (typeof window !== "undefined") {
      window.location.replace(`${pathname}${query}`);
    }
  };

  return (
    <div className="flex flex-col gap-1 justify-center items-center text-xs ">
      <div
        className={`${
          props.estimate ? "card" : "bg-zinc-300"
        } h-[100px] w-[80px] flex relative flex-col justify-center items-center text-xs rounded-md p-3`}
      >
        {props.isModerator && props.name !== props.currentUserName && (
          <Trash2
            onClick={() => {
              props.handleDeleteMember(props.name);
            }}
            className="absolute top-1 right-1 bg-gray-500 hover:bg-black transition text-white rounded-[4px] cursor-pointer p-1 w-5 h-5"
          />
        )}
        {props.revealEstimates && props.estimate && (
          <div className="text-zinc-800 text-3xl font-semibold p-1 rounded bg-gray-50">
            {props.estimate}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-1">
        <p className="truncate w-[60px] text-center">{props.name}</p>

        {props.currentUserName === props.name && (
          <Dialog open={show} onOpenChange={setShow}>
            <DialogTrigger asChild>
              <Pencil width={14} height={14} className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change name</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col justify-start items-start gap-4 py-4">
                <Input
                  name="user-name"
                  placeholder="Your new name"
                  value={newUserName}
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !!newUserName) {
                      changeName(newUserName);
                      setLoading(true);
                    }
                  }}
                />
              </div>
              <DialogFooter className="flex w-full gap-2">
                <Button
                  variant={"secondary"}
                  type="button"
                  className="flex-1 space-x-1"
                  disabled={!newUserName || loading}
                  onClick={() => {
                    changeName(newUserName);
                    setLoading(true);
                  }}
                >
                  <span>
                    {loading
                      ? "Updating"
                      : newUserName
                      ? `Yes, change my name to ${newUserName}`
                      : "Change name"}
                  </span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default VotersCard;
