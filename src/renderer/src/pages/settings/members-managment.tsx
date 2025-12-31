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

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useContext, useMemo, useState } from "react";
import { HubInfoContext, HubInfoContextType } from "@renderer/providers/hub-info";
import { deleteHubMember, updateHubMember } from "../../../api/members";
import { AvatarPicker } from "../dashboard/avatar-picker";

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
          label={info?.getValue() === "owner" ? "Owner" : "Member"}
          color={info.getValue() === "owner" ? "primary" : "default"}
        />
      ),
    },
    {
      id: "todos",
      header: "Todos",
      cell: ({ row }) => row.original.todos?.length ?? 0,
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{ padding: 8, textAlign: "left", borderBottom: "1px solid #ddd" }}
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

      {editTarget && (
        <EditMemberDialog
          member={editTarget}
          hubId={hubId!}
          hasOwner={hasOwner}
          onClose={() => setEditTarget(null)}
          onSaved={refreshMembers}
        />
      )}

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
          {/* Avatar preview */}
          <Stack alignItems="center">
            <Avatar
              src={avatarUrl ?? undefined}
              sx={{ width: 80, height: 80 }}
            >
              {!avatarUrl && <PersonIcon />}
            </Avatar>
          </Stack>

          {/* Avatar picker (Suspense-enabled) */}
          <AvatarPicker
            value={avatarUrl}
            onSelect={setAvatarUrl}
          />

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
