import { StateCreator } from "zustand";
import { MembersSlice, MembersType } from "../members";
import { RoomScope } from "../types";

type RoomType = {
  id: string | number;
  name: string;
  link: string;
  scope: RoomScope;
  moderator: (string | number)[];
  numberOfMembers: number;
  members: MembersType[];
  createdAt: Date | null;
  closedAt: Date | null;
};

export type RoomSlice = RoomSliceGeneric<RoomType>;

export interface RoomSliceGeneric<T> {
  rooms: T[];
  addRoom: (roomDetails: T) => void;
  closeRoom: (roomId: string) => void;
  changeAccess: (roomId: string, scope: RoomScope) => void;
}

export const createRoomSlice: StateCreator<
  RoomSlice & MembersSlice,
  [],
  [],
  RoomSlice
> = (set) => ({
  rooms: [],
  addRoom: (roomDetails) => {
    set((state) => {
      return {
        rooms: [...state.rooms, roomDetails],
      };
    });
  },
  changeAccess: (roomId, scope) => {
    set((state) => {
      const res = state.rooms;
      const objIndex = res.findIndex((item) => item.id === roomId);
      res[objIndex].scope = scope;
      return {
        rooms: res,
      };
    });
  },
  closeRoom: (roomId) => {
    set((state) => {
      const res = state.rooms;
      const objIndex = res.findIndex((item) => item.id === roomId);
      res[objIndex].closedAt = new Date(Date.now());
      return {
        rooms: res,
      };
    });
  },
});
