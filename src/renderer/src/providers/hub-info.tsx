import React from "react"
import { fetchHubMe } from "../../api/hub"
import { fetchHubMembers, HubMember } from "../../api/members"
import { fetchTodos, Todo } from "../../api/todos"

/* =========================================================
 * Types
 * ========================================================= */

export type HubMemberWithTodos = HubMember & {
  todos: Todo[]
}

export interface HubInfoContextType {
  hubId?: string
  paired: boolean
  members: HubMemberWithTodos[]
  loading: boolean
  refreshMembers: () => Promise<void>
}

export const HubInfoContext =
  React.createContext<HubInfoContextType | null>(null)

/* =========================================================
 * Provider
 * ========================================================= */

export const HubInfoProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [hubId, setHubId] = React.useState<string>()
  const [paired, setPaired] = React.useState(false)
  const [members, setMembers] = React.useState<HubMemberWithTodos[]>([])
  const [loading, setLoading] = React.useState(true)

  /* ---------------- Load Hub ---------------- */

  React.useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const me = await fetchHubMe()

        if (!mounted) return

        // ✅ Not paired
        if (!me || !me.hub?.id) {
          setHubId(undefined)
          setPaired(false)
          setLoading(false)
          return
        }

        // ✅ Paired
        setHubId(me.hub.id)
        setPaired(true)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch hub:", err)
        setPaired(false)
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  /* ---------------- Load Members + Todos ---------------- */

  const refreshMembers = React.useCallback(async () => {
    if (!hubId) return

    setLoading(true)

    try {
      const res = await fetchHubMembers(hubId)

      const hydrated = await Promise.all(
        res.members.map(async (member) => {
          try {
            const todosRes = await fetchTodos(hubId, member.id)
            return { ...member, todos: todosRes.todos ?? [] }
          } catch {
            return { ...member, todos: [] }
          }
        })
      )

      setMembers(hydrated)
    } catch (err) {
      console.error("Failed to load members:", err)
    } finally {
      setLoading(false)
    }
  }, [hubId])

  React.useEffect(() => {
    if (!hubId) return
    refreshMembers()
  }, [hubId, refreshMembers])

  return (
    <HubInfoContext.Provider
      value={{
        hubId,
        paired,
        members,
        loading,
        refreshMembers,
      }}
    >
      {children}
    </HubInfoContext.Provider>
  )
}
