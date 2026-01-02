import * as React from "react"
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Popover,
  ButtonBase,
  Divider,
} from "@mui/material"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

import { HubCalendar } from "../../../api/calender"

type Props = {
  calendars: HubCalendar[]
  activeCalendarId: string | null
  onChange: (calendarId: string) => void
  onCreate: () => void
  onDelete?: (calendar: HubCalendar) => void
}

export function CalendarSelector({
  calendars,
  activeCalendarId,
  onChange,
  onCreate,
  onDelete,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const active =
    calendars.find((c) => c.id === activeCalendarId) ?? calendars[0]

  return (
    <>
      {/* TRIGGER */}
      <ButtonBase
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: active?.color ?? "transparent",
          }}
        />
        <Typography fontSize={13} fontWeight={600}>
          {active?.name ?? "Calendar"}
        </Typography>
        <ExpandMoreIcon fontSize="small" />
      </ButtonBase>

      {/* POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 240,
            borderRadius: 2,
            p: 0.5,
          },
        }}
      >
        <Stack spacing={0.25}>
          {calendars.map((cal) => {
            const isActive = cal.id === activeCalendarId

            return (
              <Stack
                key={cal.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => {
                  onChange(cal.id)
                  setAnchorEl(null)
                }}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: isActive ? "action.selected" : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: cal.color,
                    }}
                  />
                  <Typography fontSize={13}>{cal.name}</Typography>
                </Stack>

                {onDelete && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(cal)
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            )
          })}

          <Divider sx={{ my: 0.5 }} />

          {/* CREATE NEW CALENDAR */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={() => {
              setAnchorEl(null)
              onCreate()
            }}
            sx={{
              px: 1,
              py: 0.75,
              borderRadius: 1,
              cursor: "pointer",
              color: "primary.main",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <AddIcon fontSize="small" />
            <Typography fontSize={13} fontWeight={600}>
              Create new calendar
            </Typography>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}
