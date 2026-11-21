"use client"

import { RotateCw, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { DataRow, DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getAdminUsers,
  updateAdminUserRole,
  type AdminUser,
} from "@/lib/api/admin-users"
import { authClient } from "@/lib/auth-client"

type UserListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; users: AdminUser[] }

export function AdminUsers() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [userList, setUserList] = useState<UserListState>({ status: "loading" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<AdminUser["role"]>("student")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getAdminUsers(token)
      .then((users) => {
        if (!cancelled) setUserList({ status: "ready", users })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setUserList({
            status: "error",
            message:
              error instanceof Error ? error.message : "Could not load users.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  function beginRoleEdit(user: AdminUser) {
    setEditingId(user.id)
    setSelectedRole(user.role === "student" ? "tutor" : "student")
  }

  async function saveRole(user: AdminUser) {
    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    setSavingId(user.id)

    try {
      await updateAdminUserRole(user.id, selectedRole, token)
      setUserList((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              users: current.users.map((item) =>
                item.id === user.id ? { ...item, role: selectedRole } : item
              ),
            }
          : current
      )
      setEditingId(null)
      toast.success(`${user.name}'s role was updated.`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update user role."
      )
    } finally {
      setSavingId(null)
    }
  }

  function refreshUsers() {
    setUserList({ status: "loading" })
    setRefreshKey((value) => value + 1)
  }

  if (!sessionPending && !token) {
    return (
      <div
        role="alert"
        className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center text-sm text-ink"
      >
        Your session has expired. Please sign in again.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {userList.status === "ready"
            ? `${userList.users.length} ${
                userList.users.length === 1 ? "account" : "accounts"
              }`
            : "Platform accounts"}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={refreshUsers}
          disabled={userList.status === "loading" || sessionPending}
          className="h-10 gap-2 rounded-full border-line bg-white px-4 text-ink"
        >
          <RotateCw aria-hidden="true" className="size-4" />
          Refresh
        </Button>
      </div>

      {sessionPending || userList.status === "loading" ? (
        <TableSkeleton columns={4} />
      ) : userList.status === "error" ? (
        <div
          role="alert"
          className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
        >
          <p className="text-sm text-ink">{userList.message}</p>
          <button
            type="button"
            onClick={refreshUsers}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-forest hover:bg-cream-soft"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </button>
        </div>
      ) : userList.users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No accounts yet"
          description="Student and tutor accounts will appear here after they sign up."
        />
      ) : (
        <DataTable columns={["User", "Role", "Plan", "Actions"]}>
          {userList.users.map((user) => {
            const isEditing = editingId === user.id
            const isSaving = savingId === user.id

            return (
              <DataRow key={user.id}>
                <td className="px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink sm:px-6">
                  {user.role === "student" ? "Student" : "Tutor"}
                </td>
                <td className="px-5 py-4 text-ink sm:px-6">
                  {user.plan === "pro" ? "Pro" : "Free"}
                </td>
                <td className="px-5 py-4 sm:px-6">
                  {isEditing ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <label className="sr-only" htmlFor={`role-${user.id}`}>
                        New role for {user.name}
                      </label>
                      <select
                        id={`role-${user.id}`}
                        value={selectedRole}
                        onChange={(event) =>
                          setSelectedRole(
                            event.target.value as AdminUser["role"]
                          )
                        }
                        disabled={isSaving}
                        className="h-9 rounded-full border border-line bg-white px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-forest"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                      </select>
                      <Button
                        type="button"
                        onClick={() => saveRole(user)}
                        disabled={isSaving || selectedRole === user.role}
                        className="h-9 rounded-full bg-forest px-4 text-white hover:bg-forest/90"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={isSaving}
                        className="h-9 rounded-full border-line px-4 text-ink"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => beginRoleEdit(user)}
                        disabled={savingId !== null}
                        className="h-9 rounded-full border-ink-soft/60 px-4 text-ink hover:bg-cream"
                      >
                        Change role
                      </Button>
                    </div>
                  )}
                </td>
              </DataRow>
            )
          })}
        </DataTable>
      )}
    </div>
  )
}
