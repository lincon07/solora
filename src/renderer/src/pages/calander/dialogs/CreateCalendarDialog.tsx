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
  Divider,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"

type HubMember = {
  id: string
  displayName: string
  role?: string
}

type Props = {
  open: boolean
  defaultColor?: string

  hubMembers: HubMember[]

  onClose: () => void
  onCreate: (data: {
    name: string
    color: string
    ownerMemberId: string
    hubMembersIds: string[]
  }) => Promise<void> | void
}

export function CreateCalendarDialog({
  open,
  defaultColor = "#3b82f6",
  hubMembers,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState(defaultColor)
  const [ownerMemberId, setOwnerMemberId] = React.useState("")
  const [members, setMembers] = React.useState<Set<string>>(new Set())
  const [saving, setSaving] = React.useState(false)

  /* ---------- reset on open ---------- */
  React.useEffect(() => {
    if (!open) return

    setName("")
    setColor(defaultColor)
    setSaving(false)

    const defaultOwner =
      hubMembers.find((m) => m.role === "owner")?.id ??
      hubMembers[0]?.id ??
      ""

    setOwnerMemberId(defaultOwner)
    setMembers(new Set(defaultOwner ? [defaultOwner] : []))
  }, [open, defaultColor, hubMembers])

  /* ---------- helpers ---------- */
  const toggleMember = (id: string) => {
    setMembers((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* ---------- ensure owner is included ---------- */
  React.useEffect(() => {
    if (!ownerMemberId) return
    setMembers((prev) => new Set(prev).add(ownerMemberId))
  }, [ownerMemberId])

  const canSubmit =
    name.trim().length >= 2 &&
    color.trim().length >= 3 &&
    ownerMemberId.length > 0 &&
    members.size > 0 &&
    !saving

  const submit = async () => {
    if (!canSubmit) return
    setSaving(true)

    try {
      await onCreate({
        name: name.trim(),
        color: color.trim(),
        ownerMemberId,
        hubMembersIds: Array.from(members),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Calendar</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            autoFocus
            label="Calendar name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={saving}
            helperText="Hex like #3b82f6"
          />

          <Divider />

          <Typography fontWeight={600}>Calendar owner</Typography>

          <List dense disablePadding>
            {hubMembers.map((m) => (
              <ListItem key={m.id} disablePadding>
                <ListItemButton
                  selected={ownerMemberId === m.id}
                  onClick={() => setOwnerMemberId(m.id)}
                >
                  <ListItemText
                    primary={m.displayName}
                    secondary={m.role === "owner" ? "Hub owner" : undefined}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <Typography fontWeight={600}>Calendar members</Typography>

          <List dense disablePadding>
            {hubMembers.map((m) => {
              const checked = members.has(m.id)
              const isOwner = m.id === ownerMemberId

              return (
                <ListItem key={m.id} disablePadding>
                  <ListItemButton
                    onClick={() => toggleMember(m.id)}
                    disabled={isOwner}
                  >
                    <Checkbox
                      edge="start"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText
                      primary={m.displayName}
                      secondary={isOwner ? "Owner (always included)" : undefined}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit}>
          {saving ? "Creating…" : "Create calendar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
