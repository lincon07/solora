import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import { SuspenseAvatar } from "./suspenseAvatar";

type AvatarStyle =
  | "fun-emoji"
  | "avataaars"
  | "thumbs"
  | "bottts"
  | "pixel-art";

const DEFAULT_SEEDS = [
  "fox","frog","panda","owl","tiger","cat","dog","koala","lion","bear",
  "monkey","sloth","raccoon","penguin","duck","sheep","cow","horse","pig","goat",
];

function dicebearUrl(style: AvatarStyle, seed: string) {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function AvatarPicker(props: {
  value: string | null;
  onSelect: (url: string) => void;
}) {
  const { value, onSelect } = props;

  const [style, setStyle] = React.useState<AvatarStyle>("fun-emoji");
  const [search, setSearch] = React.useState("");
  const [seeds, setSeeds] = React.useState(DEFAULT_SEEDS);

  const filtered = React.useMemo(() => {
    if (!search) return seeds;
    return seeds.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, seeds]);

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">
        Choose an avatar
      </Typography>

      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <IconButton onClick={() => setSeeds(shuffle(seeds))}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={style}
        onChange={(_, v) => v && setStyle(v)}
      >
        <ToggleButton value="fun-emoji">Fun</ToggleButton>
        <ToggleButton value="avataaars">Cartoon</ToggleButton>
        <ToggleButton value="thumbs">Simple</ToggleButton>
        <ToggleButton value="bottts">Robot</ToggleButton>
        <ToggleButton value="pixel-art">Pixel</ToggleButton>
      </ToggleButtonGroup>

      <React.Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 1,
          }}
        >
          {filtered.slice(0, 24).map((seed) => {
            const url = dicebearUrl(style, seed);
            const selected = value === url;

            return (
              <Button
                key={`${style}-${seed}`}
                onClick={() => onSelect(url)}
                variant={selected ? "contained" : "outlined"}
                sx={{ p: 0.5, minWidth: 0 }}
              >
                <SuspenseAvatar
                  src={url}
                  selected={selected}
                />
              </Button>
            );
          })}
        </Box>
      </React.Suspense>
    </Stack>
  );
}
