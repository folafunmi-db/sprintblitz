import { create } from "zustand";
import { createRoomSlice, RoomSlice } from "./room";
import { createMembersSlice, MembersSlice } from "./members";

export const useGlobalStore = create<MembersSlice & RoomSlice>()((...a) => ({
  ...createMembersSlice(...a),
  ...createRoomSlice(...a),
}));
