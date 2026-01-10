import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
} from "@mui/material"

type CalendarMember = {
  id: string
  displayName: string
  avatarUrl?: string | null
}

type Props = {
  open: boolean
  initialStart?: Date | null
  initialEnd?: Date | null
  members: CalendarMember[]
  onClose: () => void
  onCreate: (data: {
    title: string
    startAt: Date
    endAt: Date
    color: string
    createdByMemberId: string
  }) => Promise<void> | void
}

const EVENT_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ef4444"]

function toLocal(date: Date) {
  return date.toISOString().slice(0, 16)
}

export function CreateEventDialog({
  open,
  initialStart,
  initialEnd,
  members,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = React.useState("")
  const [start, setStart] = React.useState<Date | null>(null)
  const [end, setEnd] = React.useState<Date | null>(null)
  const [color, setColor] = React.useState(EVENT_COLORS[0])
  const [creatorId, setCreatorId] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    const base = initialStart ?? new Date()
    setTitle("")
    setStart(base)
    setEnd(initialEnd ?? new Date(base.getTime() + 3600000))
    setCreatorId(members[0]?.id ?? "")
  }, [open, initialStart, initialEnd, members])

  const submit = async () => {
    if (!title || !start || !end || !creatorId) return
    await onCreate({ title, startAt: start, endAt: end, color, createdByMemberId: creatorId })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <TextField
            label="Start"
            type="datetime-local"
            value={start ? toLocal(start) : ""}
            onChange={(e) => setStart(new Date(e.target.value))}
          />

          <TextField
            label="End"
            type="datetime-local"
            value={end ? toLocal(end) : ""}
            onChange={(e) => setEnd(new Date(e.target.value))}
          />

          <Typography fontSize={13} fontWeight={600}>
            Event creator
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={creatorId}
            onChange={(_, v) => v && setCreatorId(v)}
          >
            {members.map((m) => (
              <ToggleButton key={m.id} value={m.id}>
                <Avatar src={m.avatarUrl ?? undefined} sx={{ width: 20, height: 20, mr: 1 }} />
                {m.displayName}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
