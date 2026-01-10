// MembersManagement.tsx
import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
} from "@mui/material"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"
import AddIcon from "@mui/icons-material/Add"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useContext, useMemo, useRef, useState, useEffect } from "react"
import {
  HubInfoContext,
  HubInfoContextType,
} from "@renderer/providers/hub-info"
import {
  deleteHubMember,
  updateHubMember,
  createHubMember,
} from "../../../api/members"
import { usePairing } from "@renderer/hooks/usePairing"
import { PairQRCode } from "./pairing/DevicePairQRCode"

/* =========================================================
 * Helpers
 * ========================================================= */

function initialsFromName(name?: string | null) {
  const n = (name ?? "").trim()
  if (!n) return "?"
  const parts = n.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  return (first + last).toUpperCase() || "?"
}

/**
 * ✅ IMPORTANT:
 * Blob URLs are ONLY for local preview.
 * Never store them in DB or send them to backend as avatarUrl.
 */
function sanitizeAvatarUrl(url?: string | null) {
  const u = (url ?? "").trim()
  if (!u) return null
  if (u.startsWith("blob:")) return null
  return u
}

/* =========================================================
 * PAGE
 * ========================================================= */

export default function MembersManagement() {
  return (
    <Card sx={{ width: "100%", maxWidth: 900 }}>
      <CardHeader title="Members Management" />
      <CardContent>
        <Typography color="text.secondary" mb={2}>
          Manage hub members, roles, and avatars.
        </Typography>
        <MembersTable />
      </CardContent>
    </Card>
  )
}

/* =========================================================
 * TABLE
 * ========================================================= */

function MembersTable() {
  const hub = useContext(HubInfoContext) as HubInfoContextType
  const { hubId, members, refreshMembers } = hub

  const [editTarget, setEditTarget] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const hasOwner = members?.some((m: any) => m.role === "owner")

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "displayName",
        cell: ({ row }) => {
          const raw = row.original?.avatarUrl as string | null | undefined
          const safeAvatar = sanitizeAvatarUrl(raw) ?? undefined

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={safeAvatar}>
                {safeAvatar ? null : initialsFromName(row.original?.displayName)}
              </Avatar>

              <Stack spacing={0} sx={{ minWidth: 0 }}>
                <Typography noWrap>{row.original?.displayName ?? "Unknown"}</Typography>
                {raw?.startsWith("blob:") && (
                  <Typography fontSize={11} color="warning.main" noWrap>
                    Local preview detected (not stored)
                  </Typography>
                )}
              </Stack>
            </Stack>
          )
        },
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: (info) => (
          <Chip
            size="small"
            label={info.getValue() === "owner" ? "Owner" : "Member"}
            color={info.getValue() === "owner" ? "primary" : "default"}
          />
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "isActive",
        cell: (info) => (info.getValue() ? "Active" : "Inactive"),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const isOwner = row.original.role === "owner"
          return (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setEditTarget(row.original)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                color="error"
                disabled={isOwner}
                onClick={() => setDeleteTarget(row.original)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      {/* ADD MEMBER BUTTON */}
      <Stack direction="row" justifyContent="flex-end" mb={1}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          disabled={!hubId}
        >
          Add Member
        </Button>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{
                    padding: 8,
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: 8, verticalAlign: "middle" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MEMBER DIALOG */}
      <AddMemberDialog
        key={addOpen ? "open" : "closed"} // forces remount
        open={addOpen}
        hubId={hubId!}
        onClose={() => setAddOpen(false)}
        onCreated={refreshMembers}
      />

      {/* EDIT MEMBER */}
      {editTarget && (
        <EditMemberDialog
          member={editTarget}
          hubId={hubId!}
          hasOwner={hasOwner}
          onClose={() => setEditTarget(null)}
          onSaved={refreshMembers}
        />
      )}

      {/* DELETE MEMBER */}
      {deleteTarget && (
        <Dialog open onClose={() => setDeleteTarget(null)}>
          <DialogTitle>Remove member?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                await deleteHubMember(hubId!, deleteTarget.id)
                setDeleteTarget(null)
                refreshMembers()
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

/* =========================================================
 * ADD MEMBER DIALOG
 * - Allows choosing a local image for PREVIEW
 * - Does NOT store blob URL in DB (IMPORTANT)
 * ========================================================= */

function AddMemberDialog({
  hubId,
  open,
  onClose,
  onCreated,
}: {
  hubId: string
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [displayName, setDisplayName] = useState("")
  const [lockedUserId, setLockedUserId] = useState<string | null>(null)

  // avatar picking (preview only)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const pairing = usePairing({
    type: "member",
    hubId,
    onResolved: ({ userId }) => {
      if (userId) setLockedUserId(userId)
    },
  })

  const handlePick = (file: File) => {
    setAvatarFile(file)

    // revoke old preview
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)

    // local preview URL (OK)
    setAvatarPreview(URL.createObjectURL(file))
  }

  // reset on close
  useEffect(() => {
    if (!open) {
      setDisplayName("")
      setLockedUserId(null)
      setAvatarFile(null)
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(null)
      pairing.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function handleCreate() {
    if (!lockedUserId || !displayName.trim()) return

    /**
     * ✅ FIX:
     * Do NOT store avatarPreview (blob URL) in DB.
     * For now, create member WITHOUT avatarUrl.
     * Later: implement upload endpoint and store returned public URL.
     */
    await createHubMember(hubId, {
      userId: lockedUserId,
      displayName: displayName.trim(),
      avatarUrl: null, // ✅ NEVER send blob:
    })

    onCreated()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Hub Member</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handlePick(file)
              // allow picking same file twice
              e.currentTarget.value = ""
            }}
          />

          {/* clickable avatar (preview) */}
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={avatarPreview ?? undefined}
              sx={{
                width: 72,
                height: 72,
                cursor: "pointer",
                "&:hover": { opacity: 0.85 },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {!avatarPreview && <PersonIcon />}
            </Avatar>

            <Typography variant="caption" color="text.secondary">
              Click to pick avatar (preview only). To save avatar permanently, you need upload.
            </Typography>
          </Stack>

          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
          />

          {!pairing.pairing && (
            <Button variant="outlined" onClick={pairing.start}>
              Generate QR Code
            </Button>
          )}

          {pairing.pairing && (
            <>
              <PairQRCode
                qr={pairing.qr}
                code={pairing.pairing.pairingCode}
                pairingId={pairing.pairing.pairingId}
              />

              {lockedUserId && (
                <Typography color="success.main" textAlign="center">
                  User linked successfully ✔
                </Typography>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!lockedUserId || !displayName.trim()}
          onClick={handleCreate}
        >
          Create Member
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* =========================================================
 * EDIT MEMBER DIALOG
 * - Allows pasting a PUBLIC URL
 * - Blocks blob: URLs from being saved
 * ========================================================= */

function EditMemberDialog({
  member,
  hubId,
  hasOwner,
  onClose,
  onSaved,
}: any) {
  const [name, setName] = useState(member.displayName)
  const [role, setRole] = useState(member.role)
  const [avatarUrl, _setAvatarUrl] = useState<string | null>(member.avatarUrl)

  const isCurrentOwner = member.role === "owner"

  const safePreview = sanitizeAvatarUrl(avatarUrl) ?? undefined

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Member</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack alignItems="center">
            <Avatar src={safePreview} sx={{ width: 80, height: 80 }}>
              {!safePreview && initialsFromName(name)}
            </Avatar>

            {avatarUrl?.startsWith("blob:") && (
              <Typography mt={1} fontSize={12} color="warning.main">
                blob: URLs can’t be saved. Paste a public https:// image URL instead.
              </Typography>
            )}
          </Stack>

          <TextField
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Profile Image URL"
            value={avatarUrl ?? ""}
            onChange={(e) => _setAvatarUrl(e.target.value)}
            helperText="Optional. Paste a public https:// image URL (blob: will be ignored)."
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="owner" disabled={hasOwner && !isCurrentOwner}>
                Owner
              </MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={async () => {
            const safe = sanitizeAvatarUrl(avatarUrl)

            await updateHubMember(hubId!, member.id, {
              displayName: name.trim(),
              role,
              avatarUrl: safe, // ✅ never blob:
            })

            onSaved()
            onClose()
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
