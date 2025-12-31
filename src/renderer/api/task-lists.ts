/* ---------- helpers ---------- */

import { API_BASE } from "@renderer/utils/api_url"
import { hubAuthHeaders } from "@renderer/utils/headers"

/* ---------- types ---------- */

export interface HubTaskList {
    id: string
    hubId: string
    name: string
    color: string
    iconKey: string
    isArchived: boolean
    createdAt: string
}

export interface HubTask {
    id: string
    hubId: string
    listId: string
    title: string
    isDone: boolean
    createdAt: string
    completedAt?: string | null
    createdByMemberId?: string | null
}

/* ---------- Task Lists ---------- */

/** Get all active task lists for hub */
export async function fetchTaskLists(hubId: string) {
    const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists`, {
        headers: hubAuthHeaders(),
    })

    if (!res.ok) {
        throw new Error("Failed to fetch task lists")
    }

    const data = await res.json()
    return data.lists as HubTaskList[]
}

/** Create new task list */
export async function createTaskList(
    hubId: string,
    data: {
        name: string
        color?: string
        iconKey?: string
    }
) {
    const res = await fetch(`${API_BASE}/hub/${hubId}/task-lists`, {
        method: "POST",
        headers: {
            ...hubAuthHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Failed to create task list")
    }

    const json = await res.json()
    return json.list as HubTaskList
}

/** Archive task list */
export async function archiveTaskList(
    hubId: string,
    listId: string
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/task-lists/${listId}/archive`,
        {
            method: "PATCH",
            headers: hubAuthHeaders(),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to archive task list")
    }

    return res.json()
}

/** Delete task list */
export async function deleteTaskList(
    hubId: string,
    listId: string
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/task-lists/${listId}`,
        {
            method: "DELETE",
            headers: hubAuthHeaders(),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to delete task list")
    }

    return res.json()
}

/* ---------- Tasks ---------- */

/** Get tasks for a list */
export async function fetchTasks(
    hubId: string,
    listId: string
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/task-lists/${listId}/tasks`,
        {
            headers: hubAuthHeaders(),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to fetch tasks")
    }

    const data = await res.json()
    return data.tasks as HubTask[]
}

/** Create task */
export async function createTask(
    hubId: string,
    listId: string,
    title: string
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/task-lists/${listId}/tasks`,
        {
            method: "POST",
            headers: {
                ...hubAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to create task")
    }

    const data = await res.json()
    return data.task as HubTask
}

/** Toggle task done */
export async function updateTaskStatus(
    hubId: string,
    taskId: string,
    isDone: boolean
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/tasks/${taskId}`,
        {
            method: "PATCH",
            headers: {
                ...hubAuthHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isDone }),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to update task")
    }

    const data = await res.json()
    return data.task as HubTask
}

/** Delete task */
export async function deleteTask(
    hubId: string,
    taskId: string
) {
    const res = await fetch(
        `${API_BASE}/hub/${hubId}/tasks/${taskId}`,
        {
            method: "DELETE",
            headers: hubAuthHeaders(),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to delete task")
    }

    return res.json()
}
