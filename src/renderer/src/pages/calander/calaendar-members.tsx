import { HubMember } from "@api/members"


export interface CalaendarMembersPageProps {
    members: HubMember[]
}

export default function CalaendarMembersPage(props: CalaendarMembersPageProps) {
    return (
        <>
        {props.members.map((member) => (
            <div key={member.displayName}>
            </div>
        ))}
        </>
    )
}