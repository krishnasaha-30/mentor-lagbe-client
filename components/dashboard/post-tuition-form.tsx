"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTuition, uploadTuitionBanner } from "@/lib/api/tutor-tuitions"
import { authClient } from "@/lib/auth-client"
import type { NewTuitionInput, TutorPostUsage } from "@/lib/types/tuition"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

export function PostTuitionForm({
  usage,
  usageError,
}: {
  usage: TutorPostUsage | null
  usageError: boolean
}) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cannotPost = usage?.canCreate === false

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

    const tuition: NewTuitionInput = {
      title: String(formData.get("title") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      classLevel: String(formData.get("classLevel") ?? ""),
      mode,
      location: String(formData.get("location") ?? ""),
      monthlyFee,
      daysPerWeek,
      description: String(formData.get("description") ?? ""),
      bannerImage: null,
    }

    setPending(true)

    try {
      if (bannerFile) {
        tuition.bannerImage = await uploadTuitionBanner(bannerFile, token)
      }

      await createTuition(tuition, token)
      toast.success("Tuition submitted for admin approval.")
      form.reset()
      setBannerFile(null)
      router.refresh()
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
      {usage ? (
        <div
          role="status"
          className={`mb-5 rounded-xl px-4 py-3 text-sm ${
            usage.plan === "pro"
              ? "bg-stat-mint text-forest"
              : "bg-stat-butter text-ink"
          }`}
        >
          {usage.plan === "pro"
            ? "Pro plan: unlimited tuition posts."
            : `Free plan: ${usage.postsUsed} of 2 posts used.`}
        </div>
      ) : usageError ? (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink"
        >
          Could not check your posting limit. The server will verify your plan
          when you submit.
        </p>
      ) : null}

      {cannotPost ? (
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="e.g. HSC Higher Math Batch"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue="Math"
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
            defaultValue="Class 11-12"
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
            defaultValue="Online"
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
            placeholder="Dhanmondi, Dhaka"
          />
        </div>

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
            defaultValue={3}
          />
        </div>

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
              : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  )
}
