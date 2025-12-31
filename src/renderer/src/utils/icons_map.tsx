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
