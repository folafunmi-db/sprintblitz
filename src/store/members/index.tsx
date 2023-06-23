import { StateCreator } from "zustand";
import { RoomSlice } from "../room";
import { UserRole } from "../types";

export type MembersType = {
  id: string | number;
  name: string;
  role: UserRole;
};

export type MembersSlice = MembersSliceGeneric<MembersType>;

export interface MembersSliceGeneric<T> {
  members: T[];
  addMember: (args: T) => void;
  removeMember: (id: number | string) => void;
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
  removeMember: (id) => {
    set((state) => ({
      members: state.members.filter((item) => item.id !== id),
    }));
  },
});
