import { StateCreator } from "zustand";
import { RoomSlice } from "../room";
import { UserRole } from "../types";

export type MembersType = {
  roomId: string | number;
  name: string;
  role: UserRole;
  estimate: number | string;
};

export type MembersSlice = MembersSliceGeneric<MembersType>;

export interface MembersSliceGeneric<T> {
  members: T[];
  addMember: (args: T) => void;
  estimate: (name: string, estimate: number | string) => void;
  removeMember: (name: number | string) => void;
}

export const createMembersSlice: StateCreator<
  MembersSlice & RoomSlice,
  [],
  [],
  MembersSlice
> = (set) => ({
  members: [],
  addMember: (args) => {
    set((state) => ({ members: [...state.members, args] }));
  },
  estimate: (name, estimate) => {
    set((state) => {
      const members = state.members;
      const memberIndex = members.findIndex((item) => item.name === name);
      members[memberIndex].estimate = estimate;
      return { members };
    });
  },
  removeMember: (name) => {
    set((state) => ({
      members: state.members.filter((item) => item.name !== name),
    }));
  },
});
