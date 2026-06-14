import Link from "next/link"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { PageHero } from "@/features/static/components/page-hero"

const faqs = [
  {
    id: "what-is-mitho",
    question: "What is Mitho Cha?",
    answer:
      "Mitho Cha is a Nepal-focused food discovery platform. We help you find trusted restaurants, cafes, and local food spots across Nepal — backed by real reviews from people who actually eat there.",
  },
  {
    id: "how-to-add",
    question: "How do I add my business?",
    answer:
      "You can submit your business through our Add Business form. Once submitted, our team reviews it before it goes live. Listing your business is free.",
  },
  {
    id: "how-to-claim",
    question: "How do I claim a listing I own?",
    answer:
      "If your business is already listed and you want to manage it, use the Claim Business flow. You'll be asked to verify ownership. Once approved, you can update your details, photos, and hours.",
  },
  {
    id: "how-to-review",
    question: "How do I leave a review?",
    answer:
      "Open any business page and scroll to the Reviews section. You need to be signed in to write a review. We ask that reviews reflect a genuine visit — see our Community Guidelines for what's allowed.",
  },
  {
    id: "review-removal",
    question: "Can I get a review removed?",
    answer:
      "Business owners cannot remove reviews. If you believe a review violates our guidelines — for example, it's fake or contains personal attacks — contact us and our team will look into it.",
  },
  {
    id: "account",
    question: "How do I sign in or create an account?",
    answer:
      "Mitho Cha uses Google sign-in. Click the sign-in button and continue with your Google account — no separate password needed.",
  },
  {
    id: "delete-account",
    question: "How do I delete my account?",
    answer:
      "You can request account deletion from your profile settings. We'll remove your personal data in line with our Privacy Policy. Anonymised review content may be retained to preserve the integrity of business ratings.",
  },
]

export function HelpPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <PageHero
          eyebrow="Help Center"
          title="How can we help?"
          subtitle="Find answers to the most common questions below. If you need something else, reach out to us directly."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Help Center" }]}
        />

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="divide-y divide-border rounded-xl border border-border bg-white">
              {faqs.map((faq) => (
                <div key={faq.id} className="px-6 py-6">
                  <h2 className="text-base font-semibold text-brand-dark-green">{faq.question}</h2>
                  <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-surface-soft px-6 py-8 text-center">
              <h2 className="text-lg font-semibold text-brand-dark-green">Still have a question?</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Our team is happy to help. Drop us a message and we'll get back to you.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-dark-green px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark-green/90"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
