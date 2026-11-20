"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

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

  if (userList.status === "loading" || sessionPending) {
    return (
      <div
        role="status"
        className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
      >
        Loading users...
      </div>
    )
  }

  if (userList.status === "error") {
    return (
      <div
        role="alert"
        className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
      >
        <p className="text-sm text-ink">{userList.message}</p>
        <Button
          type="button"
          onClick={refreshUsers}
          className="mt-4 h-10 rounded-full bg-coral px-5 text-ink hover:bg-coral-dark"
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <section
      aria-label="User management"
      className="overflow-hidden rounded-[20px] border border-line bg-white px-5 sm:px-6"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold tracking-[0.08em] text-ink-soft uppercase">
              <th scope="col" className="py-5 pr-5">
                User
              </th>
              <th scope="col" className="px-5 py-5">
                Role
              </th>
              <th scope="col" className="px-5 py-5">
                Plan
              </th>
              <th scope="col" className="py-5 pl-5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.users.map((user) => {
              const isEditing = editingId === user.id
              const isSaving = savingId === user.id

              return (
                <tr
                  key={user.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="py-3.5 pr-5">
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
                  <td className="px-5 py-3.5 text-ink">
                    {user.role === "student" ? "Student" : "Tutor"}
                  </td>
                  <td className="px-5 py-3.5 text-ink">
                    {user.plan === "pro" ? "Pro" : "Free"}
                  </td>
                  <td className="py-3.5 pl-5 text-right">
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => beginRoleEdit(user)}
                        disabled={savingId !== null}
                        className="h-9 rounded-full border-ink-soft/60 px-4 text-ink hover:bg-cream"
                      >
                        Change role
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {userList.users.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">
          No student or tutor accounts found.
        </p>
      ) : null}
    </section>
  )
}
