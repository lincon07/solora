import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Input,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonBase,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  HubInfoContext,
  HubMemberWithTodos,
} from "@renderer/providers/hub-info";

import {
  createTodo,
  updateTodo,
  deleteTodo,
  Todo,
} from "../../../api/todos";

import { createHubMember } from "../../../api/members";
import { AvatarPicker } from "./avatar-picker";

/* =========================================================
* Component
* ========================================================= */

export default function People() {
  const hub = React.useContext(HubInfoContext);

  const [newTaskText, setNewTaskText] =
    React.useState<Record<string, string>>({});

  const [savingTodoIds, setSavingTodoIds] =
    React.useState<Set<string>>(new Set());

  const [deleteTarget, setDeleteTarget] =
    React.useState<{ memberId: string; todo: Todo } | null>(null);

  const [addMemberOpen, setAddMemberOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>("https://api.dicebear.com/7.x/fun-emoji/svg?seed=fox");
  const [addingMember, setAddingMember] = React.useState(false);

  /* ---------------- Guards ---------------- */

  if (!hub) return <Typography>Loading hub…</Typography>;

  const { hubId, members, loading, refreshMembers } = hub;

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!hubId) {
    return <Typography>No hub found</Typography>;
  }

  /* =========================================================
  * Member Creation
  * ========================================================= */

  const handleCreateNewMember = async () => {
    const name = displayName.trim();
    if (name.length < 2) return;

    setAddingMember(true);

    try {
      await createHubMember(hubId, {
        displayName: name,
        role: "member",
        avatarUrl: avatarUrl,
      });

      setDisplayName("");
      setAddMemberOpen(false);
      refreshMembers();
    } catch (err) {
      console.error("Failed to create member", err);
    } finally {
      setAddingMember(false);
    }
  };

  /* =========================================================
  * Todo handlers (unchanged)
  * ========================================================= */

  const handleAddTodo = async (member: HubMemberWithTodos) => {
    const text = newTaskText[member.id]?.trim();
    if (!text) return;

    const tempTodo: Todo = {
      id: crypto.randomUUID(),
      memberId: member.id,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    member.todos.push(tempTodo);
    setNewTaskText((p) => ({ ...p, [member.id]: "" }));

    try {
      await createTodo(hubId, member.id, text);
      refreshMembers();
    } catch { }
  };

  const handleToggleTodo = async (
    _memberId: string,
    todo: Todo
  ) => {
    if (savingTodoIds.has(todo.id)) return;

    setSavingTodoIds((s) => new Set(s).add(todo.id));
    todo.completed = !todo.completed;

    try {
      await updateTodo(hubId, todo.id, {
        completed: todo.completed,
      });
      refreshMembers();
    } finally {
      setSavingTodoIds((s) => {
        const next = new Set(s);
        next.delete(todo.id);
        return next;
      });
    }
  };

  const confirmDeleteTodo = async () => {
    if (!deleteTarget) return;
    const { todo } = deleteTarget;

    setDeleteTarget(null);

    try {
      await deleteTodo(hubId, todo.id);
      refreshMembers();
    } catch { }
  };

  /* =========================================================
  * Render
  * ========================================================= */

  return (
    <>
      <Typography variant="h5" mb={2}>
        People
      </Typography>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {members.map((member) => (
          <Card key={member.id} sx={{ minWidth: 320 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={member.avatarUrl ?? undefined}>
                  {!member.avatarUrl && <PersonIcon />}
                </Avatar>

                <Box>
                  <Typography variant="h6">
                    {member.displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <List dense>
                {member.todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    onClick={() =>
                      handleToggleTodo(member.id, todo)
                    }
                    secondaryAction={
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            memberId: member.id,
                            todo,
                          });
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {todo.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={todo.text} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" spacing={1}>
                <Input
                  fullWidth
                  placeholder="Add a task"
                  value={newTaskText[member.id] ?? ""}
                  onChange={(e) =>
                    setNewTaskText((p) => ({
                      ...p,
                      [member.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTodo(member);
                  }}
                />
                <Button onClick={() => handleAddTodo(member)}>
                  Add
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* Add Person Card */}
        <ButtonBase onClick={() => setAddMemberOpen(true)}>
          <Card
            sx={{
              minWidth: 260,
              height: '100%',
              border: '3.5px dashed',
              borderColor: 'grey.700',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack alignItems="center" spacing={1}>
              <Avatar>
                <Avatar />
              </Avatar>
              <Typography>Add Member</Typography>
            </Stack>
          </Card>
        </ButtonBase>
      </Box>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Member</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* Avatar Preview */}
            <Stack alignItems="center">
              <Avatar
                src={avatarUrl ?? undefined}
                sx={{ width: 72, height: 72 }}
              >
                {!avatarUrl && <PersonIcon />}
              </Avatar>
            </Stack>

            {/* Avatar Picker */}
            <AvatarPicker
              value={avatarUrl}
              onSelect={setAvatarUrl}
            />

            {/* Display Name */}
            <Input
              fullWidth
              autoFocus
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddMemberOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={addingMember || displayName.trim().length < 2}
            onClick={handleCreateNewMember}
          >
            {addingMember ? "Adding…" : "Add Member"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteTodo}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
