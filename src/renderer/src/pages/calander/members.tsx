import { HubMember } from "@api/members"
import { Avatar, ButtonBase, Stack } from "@mui/material"

export interface CalaendarMembersPageProps {
  members: HubMember[]
  selectedIds: string[]
  onToggle: (memberId: string) => void
}

export default function CalaendarMembersPage({
  members,
  selectedIds,
  onToggle,
}: CalaendarMembersPageProps) {
  return (
    <Stack direction="row" spacing={0.75}>
      {members.map((member) => {
        const active = selectedIds.includes(member.id)

        return (
          <ButtonBase
            key={member.id}
            onClick={() => onToggle(member.id)}
            sx={{
              borderRadius: "50%",
              overflow: "hidden",
              opacity: active ? 1 : 0.35,
              transform: active ? "scale(1)" : "scale(0.95)",
              transition: "all 0.15s ease",
            }}
          >
            <Avatar
  src={member.avatarUrl ?? undefined}
  alt={member.displayName}
>
  {member.displayName?.[0]?.toUpperCase() ?? "?"}
</Avatar>

          </ButtonBase>
        )
      })}
    </Stack>
  )
}
