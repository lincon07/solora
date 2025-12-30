import { api } from "./client";

export type Todo = {
  id: string;
  memberId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
};

export async function fetchTodos(
  hubId: string,
  memberId: string
) {
  return api<{ todos: Todo[] }>(
    `/hub/${hubId}/todos?memberId=${memberId}`
  );
}

export async function createTodo(
  hubId: string,
  memberId: string,
  text: string
) {
  return api<{ todo: Todo }>(`/hub/${hubId}/todos`, {
    method: "POST",
    body: JSON.stringify({ memberId, text }),
  });
}

export async function updateTodo(
  hubId: string,
  todoId: string,
  patch: Partial<Pick<Todo, "completed" | "text">>
) {
  return api(`/hub/${hubId}/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteTodo(
  hubId: string,
  todoId: string
) {
  return api(`/hub/${hubId}/todos/${todoId}`, {
    method: "DELETE",
  });
}
