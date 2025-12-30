export type Todo = {
  id: string;
  hubId: string;
  memberId: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number | null;
};

export type HubMember = {
  id: string;
  hubId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;

  // 👇 hydrated client-side
  todos: Todo[];
};
