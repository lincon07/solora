import { Avatar } from "@mui/material";
import { readAvatar } from "./avatarResource";

export function SuspenseAvatar(props: {
  src: string;
  selected?: boolean;
}) {
  readAvatar(props.src);

  return (
    <Avatar
      src={props.src}
      sx={{
        width: 44,
        height: 44,
        border: props.selected ? "2px solid" : "none",
      }}
      imgProps={{ referrerPolicy: "no-referrer" }}
    />
  );
}
