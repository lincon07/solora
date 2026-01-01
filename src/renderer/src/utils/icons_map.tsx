import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LuggageIcon from "@mui/icons-material/Luggage"
import ChecklistIcon from "@mui/icons-material/Checklist"
import ListIcon from "@mui/icons-material/List"
import { JSX } from "react"

export const TASK_LIST_ICONS: Record<string, JSX.Element> = {
  "shopping-cart": <ShoppingCartIcon />,
  luggage: <LuggageIcon />,
  checklist: <ChecklistIcon />,
  list: <ListIcon />,
}

import {
  WbSunny,
  Cloud,
  CloudQueue,
  Thunderstorm,
  AcUnit,
  Grain,
} from "@mui/icons-material";

export function getWeatherIcon(code: number) {
  if (code === 0) return <WbSunny fontSize="small" />;
  if (code === 1 || code === 2) return <CloudQueue fontSize="small" />;
  if (code === 3) return <Cloud fontSize="small" />;
  if (code >= 51 && code <= 65) return <Grain fontSize="small" />; // rain
  if (code >= 71 && code <= 77) return <AcUnit fontSize="small" />; // snow
  if (code >= 95) return <Thunderstorm fontSize="small" />;

  return <Cloud fontSize="small" />;
}
