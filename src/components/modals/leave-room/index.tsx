import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Props = {
  handleLeaveClick: () => void;
};

const LeaveRoom: React.FC<Props> = (props) => {
  const [show, setShow] = React.useState(false);
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setShow(true);
          }}
          className="space-x-1"
          variant={"destructive"}
        >
          <p className="hidden md:block">Leave room</p>
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
        <DialogFooter className="flex w-full gap-2">
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
              props.handleLeaveClick();
            }}
          >
            <span>Yes, I want to leave!</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRoom;
