"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const { toast } = useToast()
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [submitted, setSubmitted] = React.useState(false)

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = "Please enter your name."
    if (!form.email.trim()) next.email = "Please enter your email."
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Please enter a valid email address."
    if (!form.subject.trim()) next.subject = "Please enter a subject."
    if (!form.message.trim()) next.message = "Please enter a message."
    return next
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitted(true)
    setForm(EMPTY_FORM)
    toast({
      title: "Message received",
      description: "Thanks — this is a demo form, nothing was sent.",
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitted && (
        <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-brand-dark-green">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <span>Thanks — this is a demo form, nothing was sent.</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-brand-dark-green">
            Name
          </label>
          <Input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-brand-dark-green">
            Email
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm font-medium text-brand-dark-green">
          Subject
        </label>
        <Input
          id="contact-subject"
          name="subject"
          value={form.subject}
          onChange={handleChange("subject")}
          placeholder="What's this about?"
          aria-invalid={Boolean(errors.subject)}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-brand-dark-green">
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange("message")}
          placeholder="Tell us a little more..."
          className="min-h-32"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <MithoButton type="submit" size="lg" className="w-full sm:w-auto">
        Send message
      </MithoButton>
    </form>
  )
}
