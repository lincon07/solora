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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useContext, useMemo, useState } from "react";
import { HubInfoContext, HubInfoContextType } from "@renderer/providers/hub-info";
import { deleteHubMember, updateHubMember, createHubMember } from "../../../api/members";
import { usePairing } from "@renderer/hooks/usePairing";
import { PairQRCode } from "./pairing/DevicePairQRCode";

/* ========================================================= */

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
  );
}

/* ========================================================= */

function MembersTable() {
  const hub = useContext(HubInfoContext) as HubInfoContextType;
  const { hubId, members, refreshMembers } = hub;

  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const hasOwner = members?.some((m) => m.role === "owner");

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: "name",
      header: "Name",
      accessorKey: "displayName",
      cell: ({ row }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={row.original.avatarUrl ?? undefined}>
            {!row.original.avatarUrl && <PersonIcon />}
          </Avatar>
          <Typography>{row.original.displayName}</Typography>
        </Stack>
      ),
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
        const isOwner = row.original.role === "owner";
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
        );
      },
    },
  ], [members]);

  const table = useReactTable({
    data: members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* ADD MEMBER BUTTON */}
      <Stack direction="row" justifyContent="flex-end" mb={1}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
        >
          Add Member
        </Button>
      </Stack>

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
                    borderBottom: "1px solid #ddd",
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
                <td key={cell.id} style={{ padding: 8 }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MEMBER DIALOG */}
<AddMemberDialog
  key={addOpen ? "open" : "closed"} // 🔥 forces remount
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
                await deleteHubMember(hubId!, deleteTarget.id);
                setDeleteTarget(null);
                refreshMembers();
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

/* ========================================================= */
/* ADD MEMBER DIALOG */
/* ========================================================= */

function AddMemberDialog({
  hubId,
  open,
  onClose,
  onCreated,
}: {
  hubId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [lockedUserId, setLockedUserId] = useState<string | null>(null);

  const pairing = usePairing({
    type: "member",
    hubId,
    onResolved: ({ userId }) => {
      if (userId) setLockedUserId(userId);
    },
  });

  async function handleCreate() {
    if (!lockedUserId) return;

    await createHubMember(hubId, {
      userId: lockedUserId,
      displayName,
    });

    onCreated();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Hub Member</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack alignItems="center">
            <Avatar sx={{ width: 64, height: 64 }}>
              <PersonIcon />
            </Avatar>
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
          disabled={!lockedUserId || !displayName}
          onClick={handleCreate}
        >
          Create Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ========================================================= */
/* EDIT MEMBER DIALOG (UNCHANGED LOGIC) */
/* ========================================================= */

function EditMemberDialog({
  member,
  hubId,
  hasOwner,
  onClose,
  onSaved,
}: any) {
  const [name, setName] = useState(member.displayName);
  const [role, setRole] = useState(member.role);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(member.avatarUrl);

  const isCurrentOwner = member.role === "owner";

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Member</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack alignItems="center">
            <Avatar src={avatarUrl ?? undefined} sx={{ width: 80, height: 80 }}>
              {!avatarUrl && <PersonIcon />}
            </Avatar>
          </Stack>


          <TextField
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem
                value="owner"
                disabled={hasOwner && !isCurrentOwner}
              >
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
            await updateHubMember(hubId!, member.id, {
              displayName: name,
              role,
              avatarUrl,
            });
            onSaved();
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
