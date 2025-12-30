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
  DialogContentText,
  DialogActions,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddIcon from "@mui/icons-material/Add";
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

/* =========================================================
 * Component
 * ========================================================= */

export default function People() {
  const hub = React.useContext(HubInfoContext);

  const [newTaskText, setNewTaskText] =
    React.useState<Record<string, string>>({});
  const [savingTodoIds, setSavingTodoIds] =
    React.useState<Set<string>>(new Set());

  const [deleteTarget, setDeleteTarget] = React.useState<{
    memberId: string;
    todo: Todo;
  } | null>(null);

  /* ---------------- Guards ---------------- */

  if (!hub) {
    return <Typography>Loading hub…</Typography>;
  }

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
   * Optimistic helpers
   * ========================================================= */

  const optimisticToggle = (memberId: string, todoId: string) => {
    hub.members = hub.members.map((m) =>
      m.id !== memberId
        ? m
        : {
            ...m,
            todos: m.todos.map((t) =>
              t.id === todoId
                ? { ...t, completed: !t.completed }
                : t
            ),
          }
    );
  };

  const optimisticAdd = (memberId: string, todo: Todo) => {
    hub.members = hub.members.map((m) =>
      m.id !== memberId
        ? m
        : { ...m, todos: [...m.todos, todo] }
    );
  };

  const optimisticDelete = (memberId: string, todoId: string) => {
    hub.members = hub.members.map((m) =>
      m.id !== memberId
        ? m
        : {
            ...m,
            todos: m.todos.filter((t) => t.id !== todoId),
          }
    );
  };

  /* =========================================================
   * Actions
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

    optimisticAdd(member.id, tempTodo);
    setNewTaskText((p) => ({ ...p, [member.id]: "" }));

    try {
      await createTodo(hubId, member.id, text);
      refreshMembers(); // background sync
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };

  const handleToggleTodo = async (
    memberId: string,
    todo: Todo
  ) => {
    if (savingTodoIds.has(todo.id)) return;

    setSavingTodoIds((s) => new Set(s).add(todo.id));
    optimisticToggle(memberId, todo.id);

    try {
      await updateTodo(hubId, todo.id, {
        completed: !todo.completed,
      });
      refreshMembers();
    } catch (err) {
      console.error("Failed to toggle todo", err);
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

    const { memberId, todo } = deleteTarget;

    optimisticDelete(memberId, todo.id);
    setDeleteTarget(null);

    try {
      await deleteTodo(hubId, todo.id);
      refreshMembers();
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
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
              {/* Header */}
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

              <Typography variant="subtitle2" mb={1}>
                Tasks
              </Typography>

              <List dense>
                {member.todos.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography color="text.secondary">
                          No tasks yet
                        </Typography>
                      }
                    />
                  </ListItem>
                )}

                {member.todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    disableGutters
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
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
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      handleToggleTodo(member.id, todo)
                    }
                  >
                    <ListItemIcon>
                      {todo.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: todo.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {todo.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 1 }} />

              {/* Add task */}
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
                    if (e.key === "Enter") {
                      handleAddTodo(member);
                    }
                  }}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddTodo(member)}
                >
                  Add
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* Add Person */}
        <Card
          sx={{
            minWidth: 260,
            border: "2px dashed",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Avatar sx={{ border: "1px dashed" }}>
              <AddIcon />
            </Avatar>
            <Typography color="text.secondary">
              Add Person
            </Typography>
          </Stack>
        </Card>
      </Box>

      {/* ================= Delete Confirm Dialog ================= */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
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
