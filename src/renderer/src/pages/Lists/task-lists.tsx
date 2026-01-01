import * as React from "react"
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
} from "@mui/material"

import AddIcon from "@mui/icons-material/Add"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined"
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined"
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import BackpackOutlinedIcon from "@mui/icons-material/BackpackOutlined"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined"
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined"
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"

import { HubInfoContext } from "@renderer/providers/hub-info"

// ✅ Uses the API layer we created earlier.
// Adjust the import path to match your project.
import {
  fetchTaskLists,
  createTaskList,
  archiveTaskList,
  deleteTaskList,
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask as apiDeleteTask,
  HubTaskList,
  HubTask,
} from "../../../api/task-lists"
import { toast } from "react-toastify"

/* =========================================================
 * Icons
 * ========================================================= */

type IconKey =
  | "checklist"
  | "grocery"
  | "packing"
  | "home"
  | "school"
  | "work"
  | "health"
  | "food"
  | "events"

const ICON_OPTIONS: Array<{
  key: IconKey
  label: string
  icon: React.ReactNode
}> = [
  { key: "checklist", label: "Checklist", icon: <ChecklistRoundedIcon /> },
  { key: "grocery", label: "Grocery", icon: <ShoppingCartOutlinedIcon /> },
  { key: "packing", label: "Packing", icon: <BackpackOutlinedIcon /> },
  { key: "home", label: "Home", icon: <HomeOutlinedIcon /> },
  { key: "school", label: "School", icon: <SchoolOutlinedIcon /> },
  { key: "work", label: "Work", icon: <WorkOutlineOutlinedIcon /> },
  { key: "health", label: "Health", icon: <FavoriteBorderOutlinedIcon /> },
  { key: "food", label: "Food", icon: <LocalDiningOutlinedIcon /> },
  { key: "events", label: "Events", icon: <CelebrationOutlinedIcon /> },
]

function iconFromKey(iconKey?: string) {
  const found = ICON_OPTIONS.find((x) => x.key === iconKey)
  return found?.icon ?? <ChecklistRoundedIcon />
}

function labelFromKey(iconKey?: string) {
  const found = ICON_OPTIONS.find((x) => x.key === iconKey)
  return found?.label ?? "Checklist"
}

/* =========================================================
 * Helpers
 * ========================================================= */

function clampColor(hex?: string) {
  if (!hex) return "#3b82f6"
  // super light validation
  return /^#([0-9a-f]{3}){1,2}$/i.test(hex) ? hex : "#3b82f6"
}

function computeProgress(tasks: HubTask[]) {
  if (!tasks.length) return { done: 0, total: 0, pct: 0 }
  const done = tasks.filter((t) => t.isDone).length
  const total = tasks.length
  const pct = Math.round((done / total) * 100)
  return { done, total, pct }
}

/* =========================================================
 * Dialog State Types
 * ========================================================= */

type CreateListState = {
  open: boolean
  name: string
  color: string
  iconKey: IconKey
}

type RenameListState = {
  open: boolean
  listId: string | null
  name: string
}

type DoneDialogState = {
  open: boolean
  listId: string | null
  listName: string
}

type ConfirmState = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  danger?: boolean
  onConfirm: (() => Promise<void>) | null
}

/* =========================================================
 * Page
 * ========================================================= */

export default function TaskListsPage() {
  const hub = React.useContext(HubInfoContext)
  const hubId = hub?.hubId

  const [lists, setLists] = React.useState<HubTaskList[]>([])
  const [listsLoading, setListsLoading] = React.useState(true)

  const [selectedListId, setSelectedListId] = React.useState<string | null>(null)
  const selectedList = React.useMemo(
    () => lists.find((l) => l.id === selectedListId) ?? null,
    [lists, selectedListId]
  )

  const [tasks, setTasks] = React.useState<HubTask[]>([])
  const [tasksLoading, setTasksLoading] = React.useState(false)

  const [filter, setFilter] = React.useState<"all" | "open" | "done">("all")
  const [search, setSearch] = React.useState("")
  const [creatingTaskTitle, setCreatingTaskTitle] = React.useState("")

  const [showArchived, setShowArchived] = React.useState(false)

  const [createList, setCreateList] = React.useState<CreateListState>({
    open: false,
    name: "",
    color: "#3b82f6",
    iconKey: "checklist",
  })

  const [renameList, setRenameList] = React.useState<RenameListState>({
    open: false,
    listId: null,
    name: "",
  })

  const [doneDialog, setDoneDialog] = React.useState<DoneDialogState>({
    open: false,
    listId: null,
    listName: "",
  })

  const [confirm, setConfirm] = React.useState<ConfirmState>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    danger: false,
    onConfirm: null,
  })

  /* ======================================================
   * Load Lists
   * ====================================================== */

  const loadLists = React.useCallback(async () => {
    if (!hubId) return
    setListsLoading(true)
    try {
      const data = await fetchTaskLists(hubId)
      // If your API returns both archived/non-archived, filter here,
      // but ideally the endpoint returns active unless query says otherwise.
      setLists(data)
      if (!selectedListId && data.length) setSelectedListId(data[0].id)
      if (selectedListId && !data.some((l) => l.id === selectedListId)) {
        setSelectedListId(data[0]?.id ?? null)
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load lists")
    } finally {
      setListsLoading(false)
    }
  }, [hubId, selectedListId])

  React.useEffect(() => {
    if (!hubId) return
    void loadLists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId])

  /* ======================================================
   * Load Tasks for Selected List
   * ====================================================== */

  const loadTasks = React.useCallback(
    async (listId: string) => {
      if (!hubId) return
      
      setTasksLoading(true)
      try {
        const data = await fetchTasks(hubId, listId)
        setTasks(data)
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to load tasks")
        setTasks([])
      } finally {
        setTasksLoading(false)
      }
    },
    [hubId]
  )

  React.useEffect(() => {
    if (!hubId || !selectedListId) return
    void loadTasks(selectedListId)
  }, [hubId, selectedListId, loadTasks])

  /* ======================================================
   * Derived
   * ====================================================== */

  const progress = React.useMemo(() => computeProgress(tasks), [tasks])

  const visibleLists = React.useMemo(() => {
    const base = showArchived ? lists : lists.filter((l) => !l.isArchived)
    return base
  }, [lists, showArchived])

  const filteredTasks = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks
      .filter((t) => {
        if (filter === "open") return !t.isDone
        if (filter === "done") return t.isDone
        return true
      })
      .filter((t) => {
        if (!q) return true
        return (t.title ?? "").toLowerCase().includes(q)
      })
  }, [tasks, filter, search])

  const selectedListAccent = clampColor(selectedList?.color)

  /* ======================================================
   * Dialog helpers
   * ====================================================== */

  const openConfirm = (payload: Omit<ConfirmState, "open">) => {
    setConfirm({ open: true, ...payload })
  }

  const closeConfirm = () => {
    setConfirm((p) => ({ ...p, open: false, onConfirm: null }))
  }

  const flashSuccess = (msg: string) => {
    toast.success(msg)
  }

  /* ======================================================
   * Lists CRUD
   * ====================================================== */

  const submitCreateList = async () => {
    if (!hubId) return
    const name = createList.name.trim()
    if (!name) return

    try {
      const list = await createTaskList(hubId, {
        name,
        color: clampColor(createList.color),
        iconKey: createList.iconKey,
      })

      setCreateList({ open: false, name: "", color: "#3b82f6", iconKey: "checklist" })
      await loadLists()

      setSelectedListId(list.id)
      flashSuccess("List created")
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create list")
    }
  }

  const submitRenameList = async () => {
    // NOTE: If you don't have rename endpoint yet, you can add one.
    // For now this just closes and shows an error message.
    toast.error("Rename endpoint not implemented yet (add PATCH /task-lists/:id).")
    setRenameList({ open: false, listId: null, name: "" })
  }

  const doArchiveList = async (listId: string) => {
    if (!hubId) return
    await archiveTaskList(hubId, listId)
    await loadLists()
    flashSuccess("List archived")
  }

  const doDeleteList = async (listId: string) => {
    if (!hubId) return
    await deleteTaskList(hubId, listId)
    await loadLists()
    setTasks([])
    flashSuccess("List deleted")
  }

  /* ======================================================
   * Task CRUD
   * ====================================================== */

  const submitCreateTask = async () => {
    if (!hubId || !selectedListId) return
    const title = creatingTaskTitle.trim()
    if (!title) return

    try {
      const task = await createTask(hubId, selectedListId, title)
      setCreatingTaskTitle("")
      setTasks((prev) => [task, ...prev])
      toast.success("Task created")
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create task")
    }
  }

  const toggleTask = async (task: HubTask) => {
    if (!hubId) return

    // optimistic UI
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isDone: !t.isDone } : t))
    )

    try {
      const updated = await updateTaskStatus(hubId, task.id, !task.isDone)
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch (e: any) {
      // revert
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, isDone: task.isDone } : t))
      )
      toast.error(e?.message ?? "Failed to update task")
      return
    }

    // if now all done, open the "completion" prompt
    const nextTasks = tasks.map((t) => (t.id === task.id ? { ...t, isDone: !t.isDone } : t))
    const nextProgress = computeProgress(nextTasks)
    if (nextProgress.total > 0 && nextProgress.done === nextProgress.total) {
      setDoneDialog({
        open: true,
        listId: selectedListId,
        listName: selectedList?.name ?? "This list",
      })
    }
  }

  const removeTask = async (taskId: string) => {
    if (!hubId) return

    // optimistic remove
    const prev = tasks
    setTasks((p) => p.filter((t) => t.id !== taskId))

    try {
      await apiDeleteTask(hubId, taskId)
      flashSuccess("Task deleted")
    } catch (e: any) {
      setTasks(prev)
      toast.error(e?.message ?? "Failed to delete task")
    }
  }

  /* ======================================================
   * Done prompt actions
   * ====================================================== */

  const handleDoneArchive = async () => {
    if (!doneDialog.listId) return
    openConfirm({
      title: "Archive this list?",
      description:
        "Nice work. Archiving keeps it out of the main view but you can still access it later.",
      confirmText: "Archive",
      onConfirm: async () => {
        await doArchiveList(doneDialog.listId!)
        setDoneDialog({ open: false, listId: null, listName: "" })
        closeConfirm()
      },
    })
  }

  const handleDoneDelete = async () => {
    if (!doneDialog.listId) return
    openConfirm({
      title: "Delete this list?",
      description:
        "This will permanently remove the list and all tasks in it. This can’t be undone.",
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        await doDeleteList(doneDialog.listId!)
        setDoneDialog({ open: false, listId: null, listName: "" })
        closeConfirm()
      },
    })
  }


  /* ======================================================
   * UI
   * ====================================================== */

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gap: 2,
        }}
      >
        {/* ================= Header ================= */}
        <Card
          sx={{
            p: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ position: "relative" }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Task Boards
              </Typography>
              <Typography color="text.secondary">
                Multiple lists (grocery, packing, chores) — with icons, progress, and a “done” flow.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<AddIcon />}
                color="primary"
                label="New List"
                onClick={() =>
                  setCreateList((p) => ({
                    ...p,
                    open: true,
                    name: "",
                    color: "#3b82f6",
                    iconKey: "checklist",
                  }))
                }
              />

              <Chip
                icon={showArchived ? <UnarchiveOutlinedIcon /> : <ArchiveOutlinedIcon />}
                label={showArchived ? "Showing Archived" : "Hide Archived"}
                variant={showArchived ? "filled" : "outlined"}
                onClick={() => setShowArchived((p) => !p)}
              />
            </Stack>
          </Stack>

          {listsLoading && <LinearProgress sx={{ mt: 2,  }} />}

        </Card>

        {/* ================= Body Grid ================= */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: 2,
            minHeight: 0
          }}
        >
          {/* ===== Left: Lists ===== */}
          <Card sx={{  overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={800}>Lists</Typography>
              <Typography variant="body2" color="text.secondary">
                Pick a list to manage tasks.
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 1.5, overflow: "auto" }}>
              <Stack spacing={1}>
                {visibleLists.length === 0 && !listsLoading && (
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight={700}>No lists yet</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create one (Grocery, Packing, etc.)
                    </Typography>
                  </Box>
                )}

                {visibleLists.map((l) => {
                  const isSelected = l.id === selectedListId
                  const accent = clampColor(l.color)
                  const isArchived = !!l.isArchived

                  return (
                    <Card
                      key={l.id}
                      onClick={() => setSelectedListId(l.id)}
                      sx={{
                        cursor: "pointer",
                        p: 1.5,
                        border: isSelected ? `2px solid ${accent}` : "1px solid rgba(255,255,255,0.08)",
                        background: isSelected
                          ? `linear-gradient(120deg, ${accent}22, rgba(255,255,255,0.02))`
                          : "rgba(255,255,255,0.02)",
                        transition: "150ms ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          borderColor: `${accent}`,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            display: "grid",
                            placeItems: "center",
                            background: `${accent}22`,
                            border: `1px solid ${accent}55`,
                          }}
                        >
                          {iconFromKey(l.iconKey)}
                        </Box>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={800} noWrap>
                              {l.name}
                            </Typography>

                            {isArchived && (
                              <Chip
                                size="small"
                                label="Archived"
                                variant="outlined"
                                sx={{ height: 20 }}
                              />
                            )}
                          </Stack>

                          <Typography variant="caption" color="text.secondary" noWrap>
                            {labelFromKey(l.iconKey)} • {accent}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Tooltip title="Rename (needs endpoint)">
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRenameList({ open: true, listId: l.id, name: l.name })
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>

                          {!isArchived && (
                            <Tooltip title="Archive list">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openConfirm({
                                    title: "Archive list?",
                                    description: "This hides it from the main view. You can show archived lists anytime.",
                                    confirmText: "Archive",
                                    onConfirm: async () => {
                                      await doArchiveList(l.id)
                                      closeConfirm()
                                    },
                                  })
                                }}
                              >
                                <ArchiveOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Delete list">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                openConfirm({
                                  title: "Delete list?",
                                  description:
                                    "This permanently removes the list and all tasks inside it. This can’t be undone.",
                                  confirmText: "Delete",
                                  danger: true,
                                  onConfirm: async () => {
                                    await doDeleteList(l.id)
                                    closeConfirm()
                                  },
                                })
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Card>
                  )
                })}
              </Stack>
            </Box>
          </Card>

          {/* ===== Right: Tasks ===== */}
          <Card
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {/* Top bar */}
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      display: "grid",
                      placeItems: "center",
                      background: `${selectedListAccent}22`,
                      border: `1px solid ${selectedListAccent}55`,
                      flexShrink: 0,
                    }}
                  >
                    {iconFromKey(selectedList?.iconKey)}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" fontWeight={900} noWrap>
                      {selectedList?.name ?? "Select a list"}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {progress.done}/{progress.total} done
                      </Typography>

                      <Chip
                        size="small"
                        label={`${progress.pct}%`}
                        sx={{
                          height: 22,
                          background: `${selectedListAccent}22`,
                          border: `1px solid ${selectedListAccent}55`,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={<FilterAltOutlinedIcon />}
                    label={
                      filter === "all" ? "All" : filter === "open" ? "Open" : "Done"
                    }
                    variant="outlined"
                    onClick={() =>
                      setFilter((p) => (p === "all" ? "open" : p === "open" ? "done" : "all"))
                    }
                  />

                  <Chip
                    icon={<SearchOutlinedIcon />}
                    label={search ? "Searching" : "Search"}
                    variant={search ? "filled" : "outlined"}
                    onClick={() => {
                      const next = prompt("Search tasks", search)
                      if (next !== null) setSearch(next)
                    }}
                  />
                </Stack>
              </Stack>

              <Box sx={{ mt: 1.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress.pct}
                  sx={{
                    height: 10,
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Create task row */}
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a task… (e.g., eggs, milk, passports)"
                  value={creatingTaskTitle}
                  onChange={(e) => setCreatingTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void submitCreateTask()
                  }}
                  disabled={!selectedListId}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!selectedListId || !creatingTaskTitle.trim()}
                  onClick={() => void submitCreateTask()}
                >
                  Add
                </Button>
              </Stack>

              {tasksLoading && <LinearProgress sx={{ mt: 2 }} />}
            </Box>

            <Divider />

            {/* Task list */}
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 1.5 }}>
              {!selectedListId ? (
                <Box sx={{ p: 2 }}>
                  <Typography fontWeight={800}>Pick a list</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a task board on the left to begin.
                  </Typography>
                </Box>
              ) : filteredTasks.length === 0 ? (
                <Box sx={{ p: 2 }}>
                  <Typography fontWeight={800}>No tasks</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add your first task above.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {filteredTasks.map((t) => {
                    const done = !!t.isDone

                    return (
                      <ListItem
                        key={t.id}
                        sx={{
                          mb: 1,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)",
                          overflow: "hidden",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ width: "100%" }}>
                          <Tooltip title={done ? "Mark as not done" : "Mark as done"}>
                            <IconButton onClick={() => void toggleTask(t)}>
                              {done ? (
                                <CheckCircleRoundedIcon />
                              ) : (
                                <RadioButtonUncheckedRoundedIcon />
                              )}
                            </IconButton>
                          </Tooltip>

                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={800}
                                sx={{
                                  textDecoration: done ? "line-through" : "none",
                                  opacity: done ? 0.65 : 1,
                                }}
                              >
                                {t.title}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {done ? "Completed" : "Open"}
                              </Typography>
                            }
                          />

                          <ListItemSecondaryAction>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Tooltip title="Delete task">
                                <IconButton
                                  onClick={() =>
                                    openConfirm({
                                      title: "Delete task?",
                                      description: "This removes the task from the list.",
                                      confirmText: "Delete",
                                      danger: true,
                                      onConfirm: async () => {
                                        await removeTask(t.id)
                                        closeConfirm()
                                      },
                                    })
                                  }
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </ListItemSecondaryAction>
                        </Stack>
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* ================= Create List Dialog ================= */}
      <Dialog
        open={createList.open}
        onClose={() => setCreateList((p) => ({ ...p, open: false }))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Task List</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="List name"
              fullWidth
              value={createList.name}
              onChange={(e) => setCreateList((p) => ({ ...p, name: e.target.value }))}
              autoFocus
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Accent color"
                fullWidth
                value={createList.color}
                onChange={(e) => setCreateList((p) => ({ ...p, color: e.target.value }))}
                helperText="Hex like #3b82f6"
              />

              <FormControl fullWidth>
                <InputLabel id="icon-select-label">Icon</InputLabel>
                <Select
                  labelId="icon-select-label"
                  value={createList.iconKey}
                  label="Icon"
                  onChange={(e) => setCreateList((p) => ({ ...p, iconKey: e.target.value as IconKey }))}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <MenuItem key={opt.key} value={opt.key}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ display: "grid", placeItems: "center" }}>{opt.icon}</Box>
                        <Typography>{opt.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Card
              sx={{
                p: 2,
                background: `linear-gradient(120deg, ${clampColor(createList.color)}22, rgba(255,255,255,0.02))`,
                border: `1px solid ${clampColor(createList.color)}55`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    background: `${clampColor(createList.color)}22`,
                    border: `1px solid ${clampColor(createList.color)}55`,
                  }}
                >
                  {iconFromKey(createList.iconKey)}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={900} noWrap>
                    {createList.name.trim() || "Preview List"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {labelFromKey(createList.iconKey)} • {clampColor(createList.color)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateList((p) => ({ ...p, open: false }))}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => void submitCreateList()}
            disabled={!createList.name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= Rename List Dialog ================= */}
      <Dialog
        open={renameList.open}
        onClose={() => setRenameList({ open: false, listId: null, name: "" })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rename List</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Alert severity="info">
              This UI is ready, but you still need a backend rename endpoint.
              Add: <b>PATCH /hub/:hubId/task-lists/:listId</b> with <b>{`{ name }`}</b>.
            </Alert>
            <TextField
              label="New name"
              fullWidth
              value={renameList.name}
              onChange={(e) => setRenameList((p) => ({ ...p, name: e.target.value }))}
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameList({ open: false, listId: null, name: "" })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => void submitRenameList()} disabled={!renameList.name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= "All done" Dialog ================= */}
      <Dialog
        open={doneDialog.open}
        onClose={() => setDoneDialog({ open: false, listId: null, listName: "" })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Everything is checked off 🎉</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            <b>{doneDialog.listName}</b> is complete. What do you want to do?
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<ArchiveOutlinedIcon />}
              label="Move to Archives"
              onClick={() => void handleDoneArchive()}
            />
            <Chip
              icon={<DeleteOutlineIcon />}
              label="Delete List"
              color="error"
              variant="outlined"
              onClick={() => void handleDoneDelete()}
            />
            <Chip
              label="Keep it (do nothing)"
              variant="outlined"
              onClick={() => setDoneDialog({ open: false, listId: null, listName: "" })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDoneDialog({ open: false, listId: null, listName: "" })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= Confirm Dialog ================= */}
      <Dialog open={confirm.open} onClose={closeConfirm} fullWidth maxWidth="xs">
        <DialogTitle>{confirm.title}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{confirm.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button
            variant="contained"
            color={confirm.danger ? "error" : "primary"}
            onClick={async () => {
              try {
                await confirm.onConfirm?.()
              } catch (e: any) {
                toast.error(e?.message ?? "Action failed")
                closeConfirm()
              }
            }}
          >
            {confirm.confirmText ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
