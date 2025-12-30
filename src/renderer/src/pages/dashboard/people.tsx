import * as React from "react"
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
    Tabs,
    Tab,
    IconButton,
} from "@mui/material"

import PersonIcon from "@mui/icons-material/Person"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AddIcon from "@mui/icons-material/Add"
import { days } from "@renderer/utils/days"



export default function People() {
    const [activeDay, setActiveDay] = React.useState(0)

    const people = [
        {
            name: "Dan",
            color: "#2563eb",
            todosByDay: {
                Mon: ["Trash", "Dishes"],
                Tue: ["Vacuum"],
                Wed: ["Trash"],
                Thu: [],
                Fri: ["Dishes"],
                Sat: [],
                Sun: [],
            },
        },
        {
            name: "Michelle",
            color: "#db2777",
            todosByDay: {
                Mon: ["Laundry"],
                Tue: ["Groceries"],
                Wed: [],
                Thu: ["Meal Prep"],
                Fri: [],
                Sat: [],
                Sun: [],
            },
        },
    ]


    return (
        <>
            {/* ================= People ================= */}
            <Typography variant="h5" mb={2}>
                People
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,
                    mb: 4,
                }}
            >
                {people.map((p) => (
                    <Card key={p.name} sx={{ minWidth: 300, flexShrink: 0 }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: p.color }}>
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="h6">{p.name}</Typography>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Tabs
                                value={activeDay}
                                onChange={(_, v) => setActiveDay(v)}
                                variant="scrollable"
                                scrollButtons={false}
                                sx={{ mb: 1 }}
                            >
                                {days.map((d) => (
                                    <Tab key={d} label={d} />
                                ))}
                            </Tabs>

                            <List dense>
                                {(p.todosByDay[days[activeDay]] || []).map((t) => (
                                    <ListItem key={t}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText primary={t} />
                                    </ListItem>
                                ))}

                                <ListItem>
                                    <ListItemIcon>
                                        <IconButton size="small">
                                            <AddIcon />
                                        </IconButton>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography color="text.secondary">
                                                Add chore
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                ))}

                {/* Add Person */}
                <Card
                    sx={{
                        minWidth: 260,
                        flexShrink: 0,
                        border: "2px dashed",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
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
        </>
    )
}