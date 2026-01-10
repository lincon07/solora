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
import CheckIcon from "@mui/icons-material/Check"

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
      {/* Trigger */}
      <ButtonBase
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          height: 40,
          px: 1.25,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: active?.color ?? "transparent",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        <Typography
          fontSize={13}
          fontWeight={700}
          sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {active?.name ?? "Calendar"}
        </Typography>
        <ExpandMoreIcon fontSize="small" />
      </ButtonBase>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1, minWidth: 280 }}>
          <Typography
            fontSize={12}
            fontWeight={800}
            color="text.secondary"
            sx={{ px: 1, py: 0.75, textTransform: "uppercase" }}
          >
            Calendars
          </Typography>

          <Stack spacing={0.5}>
            {calendars.map((cal) => {
              const isActive = cal.id === activeCalendarId

              return (
                <Box
                  key={cal.id}
                  onClick={() => {
                    onChange(cal.id)
                    setAnchorEl(null)
                  }}
                  sx={{
                    px: 1,
                    py: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: isActive ? "action.selected" : undefined,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: cal.color,
                      }}
                    />
                    <Typography fontSize={13} fontWeight={600}>
                      {cal.name}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {isActive && <CheckIcon fontSize="small" />}
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
                </Box>
              )
            })}
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* ✅ Open dialog (parent decides what onCreate does) */}
          <Box
            onClick={() => {
              setAnchorEl(null)
              onCreate()
            }}
            sx={{
              px: 1,
              py: 1,
              borderRadius: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
            }}
          >
            <AddIcon fontSize="small" />
            <Typography fontSize={13} fontWeight={800}>
              Create new calendar
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
