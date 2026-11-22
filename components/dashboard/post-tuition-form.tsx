"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CalendarClock, ImageIcon, PencilLine } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createTuition,
  updateTuition,
  uploadTuitionBanner,
} from "@/lib/api/tutor-tuitions"
import { authClient } from "@/lib/auth-client"
import type {
  NewTuitionInput,
  TutorPostUsage,
  TutorTuition,
} from "@/lib/types/tuition"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

export function PostTuitionForm({
  usage,
  usageError,
  tuition,
}: {
  usage: TutorPostUsage | null
  usageError: boolean
  tuition?: TutorTuition
}) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = tuition !== undefined
  const cannotPost = !isEditing && usage?.canCreate === false

  function handleBannerChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setError(null)

    if (!file) {
      setBannerFile(null)
      return
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      event.target.value = ""
      setBannerFile(null)
      setError("Choose a JPG or PNG image.")
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      event.target.value = ""
      setBannerFile(null)
      setError("The banner image must be 2 MB or smaller.")
      return
    }

    setBannerFile(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = event.currentTarget

    const token = session?.session.token

    if (!token) {
      const message = "Your session has expired. Please sign in again."
      setError(message)
      toast.error(message)
      return
    }

    if (cannotPost) {
      const message =
        "Your Free plan includes 2 tuition posts. Upgrade to Pro to post more."
      setError(message)
      toast.error(message)
      return
    }

    const formData = new FormData(form)
    const monthlyFee = Number(formData.get("monthlyFee"))
    const daysPerWeek = Number(formData.get("daysPerWeek"))
    const mode = formData.get("mode")

    if (
      !Number.isSafeInteger(monthlyFee) ||
      monthlyFee < 1 ||
      monthlyFee > 1000000 ||
      !Number.isInteger(daysPerWeek) ||
      daysPerWeek < 1 ||
      daysPerWeek > 7
    ) {
      const message = "Enter a valid monthly fee and number of days."
      setError(message)
      toast.error(message)
      return
    }

    if (mode !== "Online" && mode !== "Offline") {
      const message = "Choose Online or Offline tuition mode."
      setError(message)
      toast.error(message)
      return
    }

    const tuitionData: NewTuitionInput = {
      title: String(formData.get("title") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      classLevel: String(formData.get("classLevel") ?? ""),
      mode,
      location: String(formData.get("location") ?? ""),
      monthlyFee,
      daysPerWeek,
      description: String(formData.get("description") ?? ""),
      bannerImage: tuition?.bannerImage ?? null,
    }

    setPending(true)

    try {
      if (bannerFile) {
        tuitionData.bannerImage = await uploadTuitionBanner(
          bannerFile,
          token,
          tuition?.id
        )
      }

      if (tuition) {
        await updateTuition(tuition.id, tuitionData, token)
        toast.success("Tuition updated and sent for admin approval.")
        router.push("/dashboard/tutor/my-tuitions")
        router.refresh()
      } else {
        await createTuition(tuitionData, token)
        toast.success("Tuition submitted for admin approval.")
        form.reset()
        setBannerFile(null)
        router.refresh()
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not submit the tuition. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-[920px] rounded-[20px] border border-line bg-white p-5 sm:p-7">
      {!isEditing && usage ? (
        <div
          role="status"
          className={`mb-5 rounded-xl px-4 py-3.5 ${
            usage.plan === "pro" ? "bg-stat-mint" : "bg-stat-butter"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold tracking-[0.14em] text-ink/70 uppercase">
              {usage.plan === "pro" ? "Pro plan" : "Free plan"}
            </p>
            <p className="text-xs font-semibold text-ink/70">
              {usage.plan === "pro"
                ? "Unlimited posts"
                : `${usage.postsUsed} of 2 posts used`}
            </p>
          </div>
          <p className="mt-1 text-sm text-ink">
            {usage.plan === "pro"
              ? "You can publish as many tuitions as you like."
              : "Your first two tuition posts are included."}
          </p>
          {usage.plan === "free" ? (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-forest transition-[width]"
                style={{
                  width: `${Math.min(100, (usage.postsUsed / 2) * 100)}%`,
                }}
              />
            </div>
          ) : null}
        </div>
      ) : !isEditing && usageError ? (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink"
        >
          Could not check your posting limit. The server will verify your plan
          when you submit.
        </p>
      ) : null}

      {!isEditing && cannotPost ? (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink"
        >
          You have reached the Free plan limit. Upgrade to Pro to post another
          tuition.
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-x-3 gap-y-4 sm:grid-cols-2"
      >
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase sm:col-span-2">
          <PencilLine aria-hidden="true" className="size-3.5 text-forest" />
          Tuition details
        </p>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={120}
            defaultValue={tuition?.title}
            placeholder="e.g. HSC Higher Math Batch"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue={tuition?.subject ?? "Math"}
            className="h-12 w-full rounded-lg border border-line bg-white px-4 text-[15px] text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
          >
            {[
              "Math",
              "Physics",
              "Programming",
              "IELTS",
              "English",
              "Chemistry",
            ].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="classLevel">Class level</Label>
          <select
            id="classLevel"
            name="classLevel"
            required
            defaultValue={tuition?.classLevel ?? "Class 11-12"}
            className="h-12 w-full rounded-lg border border-line bg-white px-4 text-[15px] text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
          >
            {[
              "Class 1-5",
              "Class 6-10",
              "Class 8+",
              "Class 9-10",
              "Class 11-12",
              "Adult",
            ].map((classLevel) => (
              <option key={classLevel} value={classLevel}>
                {classLevel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mode">Mode</Label>
          <select
            id="mode"
            name="mode"
            required
            defaultValue={tuition?.mode ?? "Online"}
            className="h-12 w-full rounded-lg border border-line bg-white px-4 text-[15px] text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            required
            maxLength={120}
            defaultValue={tuition?.location}
            placeholder="Dhanmondi, Dhaka"
          />
        </div>

        <p className="mt-2 flex items-center gap-2 border-t border-line pt-5 text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase sm:col-span-2">
          <CalendarClock aria-hidden="true" className="size-3.5 text-forest" />
          Schedule &amp; fee
        </p>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="monthlyFee">Monthly fee (৳)</Label>
          <Input
            id="monthlyFee"
            name="monthlyFee"
            type="number"
            required
            min={1}
            max={1000000}
            step={1}
            defaultValue={tuition?.monthlyFee}
            placeholder="3500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="daysPerWeek">Days per week</Label>
          <Input
            id="daysPerWeek"
            name="daysPerWeek"
            type="number"
            required
            min={1}
            max={7}
            step={1}
            defaultValue={tuition?.daysPerWeek ?? 3}
          />
        </div>

        <p className="mt-2 flex items-center gap-2 border-t border-line pt-5 text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase sm:col-span-2">
          <ImageIcon aria-hidden="true" className="size-3.5 text-forest" />
          Banner &amp; description
        </p>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bannerImage">Banner image</Label>
          <Input
            id="bannerImage"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleBannerChange}
            className="h-12 border-dashed px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-cream-soft file:px-3 file:py-1 file:text-xs file:font-semibold file:text-ink"
          />
          <p className="text-xs text-ink-soft">
            {bannerFile
              ? `${bannerFile.name} selected`
              : tuition?.bannerImage
                ? "Current banner will be kept unless you choose another image."
                : "JPG or PNG, up to 2 MB. Uploaded securely via ImgBB."}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={2000}
            rows={4}
            defaultValue={tuition?.description}
            placeholder="Describe your batch..."
            className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-ink-soft/60 focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink sm:col-span-2"
          >
            {error}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={pending || cannotPost}
            className="h-11 rounded-full bg-coral px-6 text-sm font-semibold text-ink hover:bg-coral-dark"
          >
            {pending
              ? bannerFile
                ? "Uploading and submitting..."
                : "Submitting..."
              : isEditing
                ? "Save Changes for Review"
                : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  )
}
