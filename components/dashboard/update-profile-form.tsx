"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  type UserProfile,
} from "@/lib/api/profile"
import { authClient } from "@/lib/auth-client"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

type ProfileState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; profile: UserProfile }

export function UpdateProfileForm() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const token = session?.session.token
  const [profileState, setProfileState] = useState<ProfileState>({
    status: "loading",
  })
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imagePreviewUrl = useRef<string | null>(null)
  const imageInput = useRef<HTMLInputElement | null>(null)
  const [pending, setPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionPending || !token) return

    let cancelled = false

    getMyProfile(token)
      .then((profile) => {
        if (cancelled) return
        setProfileState({ status: "ready", profile })
        setName(profile.name)
        setPhone(profile.phone)
        setBio(profile.bio)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProfileState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Could not load your profile.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey, sessionPending, token])

  useEffect(
    () => () => {
      if (imagePreviewUrl.current) {
        URL.revokeObjectURL(imagePreviewUrl.current)
      }
    },
    []
  )

  function clearImageSelection() {
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current)
      imagePreviewUrl.current = null
    }

    setImageFile(null)
    setImagePreview(null)
    if (imageInput.current) {
      imageInput.current.value = ""
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    if (!file) return

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      event.target.value = ""
      clearImageSelection()
      toast.error("Choose a JPG or PNG image.")
      return
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      event.target.value = ""
      clearImageSelection()
      toast.error("Choose a non-empty image up to 2 MB.")
      return
    }

    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current)
    }

    imagePreviewUrl.current = URL.createObjectURL(file)
    setImageFile(file)
    setImagePreview(imagePreviewUrl.current)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (profileState.status !== "ready") return

    if (!token) {
      toast.error("Your session has expired. Please sign in again.")
      return
    }

    setPending(true)

    try {
      const image = imageFile
        ? await uploadProfileImage(imageFile, token)
        : profileState.profile.image

      const updatedProfile = await updateMyProfile(
        {
          name,
          phone,
          bio,
          image,
        },
        token
      )

      setProfileState({ status: "ready", profile: updatedProfile })
      setName(updatedProfile.name)
      setPhone(updatedProfile.phone)
      setBio(updatedProfile.bio)
      clearImageSelection()
      toast.success("Your profile has been updated.")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update your profile."
      )
    } finally {
      setPending(false)
    }
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

  if (sessionPending || profileState.status === "loading") {
    return (
      <div
        role="status"
        className="rounded-[20px] border border-line bg-white px-6 py-14 text-center text-sm text-ink-soft"
      >
        Loading your profile...
      </div>
    )
  }

  if (profileState.status === "error") {
    return (
      <div
        role="alert"
        className="rounded-[20px] border border-coral/40 bg-white px-6 py-10 text-center"
      >
        <p className="text-sm text-ink">{profileState.message}</p>
        <Button
          type="button"
          onClick={() => {
            setProfileState({ status: "loading" })
            setRefreshKey((value) => value + 1)
          }}
          className="mt-4 h-10 rounded-full bg-coral px-5 text-ink hover:bg-coral-dark"
        >
          Try again
        </Button>
      </div>
    )
  }

  const { profile } = profileState
  const roleName = profile.role.charAt(0).toUpperCase() + profile.role.slice(1)

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[760px] rounded-[20px] border border-line bg-white p-5 sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-line pb-5">
        <UserAvatar
          name={name || profile.name}
          image={imagePreview ?? profile.image}
          size="2xl"
          className="ring-4 ring-cream-soft"
        />
        <div>
          <p className="text-base font-semibold text-ink">
            {name || profile.name}
          </p>
          <p className="text-xs text-ink-soft">
            {roleName} · {profile.email}
          </p>
          <input
            ref={imageInput}
            id="profile-image"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleImageChange}
            disabled={pending}
            className="sr-only"
          />
          <label
            htmlFor="profile-image"
            className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-full border border-ink-soft/60 px-4 text-sm font-medium text-ink transition-colors focus-within:ring-2 focus-within:ring-forest hover:bg-cream"
          >
            Upload photo (ImgBB)
          </label>
          <p className="mt-2 text-xs text-ink-soft">
            {imageFile
              ? `${imageFile.name} selected`
              : "JPG or PNG, up to 2 MB"}
          </p>
        </div>
      </div>

      <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            name="name"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={pending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-email">Email (read-only)</Label>
          <Input
            id="profile-email"
            type="email"
            value={profile.email}
            readOnly
            className="cursor-not-allowed bg-cream-soft"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            name="phone"
            type="tel"
            maxLength={30}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={pending}
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-role">Role (read-only)</Label>
          <Input
            id="profile-role"
            value={roleName}
            readOnly
            className="cursor-not-allowed bg-cream-soft"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <textarea
            id="profile-bio"
            name="bio"
            maxLength={500}
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            disabled={pending}
            placeholder="Short introduction..."
            className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-5 h-10 rounded-full bg-ink px-6 text-white hover:bg-forest"
      >
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
