import { Highlight } from "@highlight-run/next";
import { CONSTANTS } from "./constants";

export const withHighlight = Highlight({
  projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID || "",
});
