"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Check, Copy, Download, ExternalLink, Printer } from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useMyBusiness } from "@/hooks/use-businesses"
import { getPublicBusinessHref } from "@/lib/business-public-href"

interface BusinessQrPageProps {
  businessId: string
}

const QR_SIZE = 360
const QR_DOWNLOAD_SIZE = 1024

function usePublicUrl(businessId: string) {
  const { entry } = useMyBusiness(businessId)
  if (!entry) return null
  const path = getPublicBusinessHref(entry.business)
  // Build absolute URL using current origin (works both server-rendered and client-side)
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return `${origin}${path}`
}

function useQrCanvas(url: string | null) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!url || !canvasRef.current) return
    setReady(false)
    QRCode.toCanvas(canvasRef.current, url, {
      width: QR_SIZE,
      margin: 2,
      color: {
        dark: "#0A4635", // brand-deep-green
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then(() => setReady(true))
      .catch(console.error)
  }, [url])

  return { canvasRef, ready }
}

const MITHO_LOGO_PATH = "/brand/logo-primary-green.svg"
const LOGO_WIDTH = 158
const LOGO_HEIGHT = 64

function downloadQr(url: string, businessName: string) {
  QRCode.toDataURL(url, {
    width: QR_DOWNLOAD_SIZE,
    margin: 2,
    color: { dark: "#0A4635", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  }).then((qrDataUrl) => {
    const padding = 48
    const topSection = LOGO_HEIGHT + 32 // logo + gap
    const bottomSection = 100 // business name + tagline
    const size = QR_DOWNLOAD_SIZE

    const canvas = document.createElement("canvas")
    canvas.width = size + padding * 2
    canvas.height = padding + topSection + size + bottomSection + padding

    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#E8E0D4"
    ctx.lineWidth = 2
    roundRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 24)
    ctx.stroke()

    // Load Mitho logo
    const logoImg = new Image()
    logoImg.crossOrigin = "anonymous"
    logoImg.onload = () => {
      // Draw logo centered at top
      const logoX = (canvas.width - LOGO_WIDTH) / 2
      const logoY = padding
      ctx.drawImage(logoImg, logoX, logoY, LOGO_WIDTH, LOGO_HEIGHT)

      // Draw QR image below logo
      const qrImg = new Image()
      qrImg.onload = () => {
        const qrY = padding + topSection
        ctx.drawImage(qrImg, padding, qrY, size, size)

        // Business name — larger and bolder
        ctx.fillStyle = "#0A4635"
        ctx.font = `bold 36px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(businessName, canvas.width / 2, qrY + size + 44, size)

        // Tagline
        ctx.fillStyle = "#6B7280"
        ctx.font = `20px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
        ctx.fillText("Please leave us a review on Mitho Cha!", canvas.width / 2, qrY + size + 76, size)

        const link = document.createElement("a")
        link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-mitho-qr.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
      qrImg.src = qrDataUrl
    }
    // Fallback: if logo fails to load, proceed without it
    logoImg.onerror = () => {
      const qrImg = new Image()
      qrImg.onload = () => {
        const qrY = padding
        ctx.drawImage(qrImg, padding, qrY, size, size)

        ctx.fillStyle = "#0A4635"
        ctx.font = `bold 36px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(businessName, canvas.width / 2, qrY + size + 44, size)

        ctx.fillStyle = "#6B7280"
        ctx.font = `20px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
        ctx.fillText("Please leave us a review on Mitho Cha!", canvas.width / 2, qrY + size + 76, size)

        const link = document.createElement("a")
        link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-mitho-qr.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
      qrImg.src = qrDataUrl
    }
    logoImg.src = MITHO_LOGO_PATH
  })
}


function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function BusinessQrPage({ businessId }: BusinessQrPageProps) {
  const { entry, isLoading } = useMyBusiness(businessId)
  const publicUrl = usePublicUrl(businessId)
  const { canvasRef, ready } = useQrCanvas(publicUrl)
  const [copied, setCopied] = useState(false)

  const businessName = entry?.business.name ?? ""

  const handleCopy = useCallback(async () => {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [publicUrl])

  const handleDownload = useCallback(() => {
    if (!publicUrl || !businessName) return
    downloadQr(publicUrl, businessName)
  }, [publicUrl, businessName])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="space-y-8 pb-12">
      {/* Page header */}


      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left: actions + info */}
        <div className="space-y-6">
          {/* URL section */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-section-title text-foreground">QR destination</h2>
                <p className="type-meta mt-1">This is the public listing URL encoded in your QR code.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 rounded-[1.2rem] border border-brand-deep-green/10 bg-white px-4 py-3 shadow-[0_6px_18px_rgba(10,70,53,0.04)]">
              <p className="flex-1 truncate text-sm font-mono text-foreground">
                {isLoading ? "Loading…" : (publicUrl ?? "—")}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!publicUrl}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-business-inset hover:text-foreground disabled:opacity-40"
                aria-label="Copy URL"
              >
                {copied ? <Check className="h-4 w-4 text-brand-deep-green" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {publicUrl && (
              <MithoButton variant="ghost" size="sm" className="mt-4" asChild>
                <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
                  Open public listing
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </MithoButton>
            )}
          </section>

          {/* Download & print section */}
          <section className="pt-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h2 className="type-section-title text-foreground">Download &amp; print</h2>
                <p className="type-meta mt-1">Get a high-resolution PNG ready for print.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <MithoButton onClick={handleDownload} disabled={!ready}>
                <Download className="h-4 w-4" />
                Download PNG (1024×1024)
              </MithoButton>
              <MithoButton variant="outline-secondary" onClick={handlePrint} disabled={!ready}>
                <Printer className="h-4 w-4" />
                Print
              </MithoButton>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Place at your counter, front entrance, or on menus.",
                "The PNG is 1024×1024 — high-res enough for A4 prints.",
                "Error correction is set to high so the code scans even if slightly damaged.",
              ].map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-[0.9rem] border border-brand-deep-green/8 bg-surface-business-inset px-4 py-3"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                  <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: QR preview */}
        <div className="flex flex-col items-center">
          <div
            id="qr-print-area"
            className="w-full max-w-[360px] rounded-[2rem] border border-brand-deep-green/10 bg-white p-6 shadow-[0_10px_28px_rgba(10,70,53,0.07)] print:shadow-none"
          >
            {/* Mitho logo */}
            <div className="mb-4 flex flex-col items-center justify-center">
              <img
                src={MITHO_LOGO_PATH}
                alt="Mitho Cha"
                className="h-8 w-auto"
              />
            </div>

            <div className="relative overflow-hidden rounded-[1.25rem] bg-white">
              {/* Skeleton shown while QR is generating */}
              {!ready && (
                <div className="flex h-[360px] w-full items-center justify-center">
                  <div className="h-[320px] w-[320px] animate-pulse rounded-xl bg-brand-soft-beige/60" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className={ready ? "block rounded-[1rem]" : "hidden"}
                aria-label={`QR code linking to ${businessName}'s Mitho Cha page`}
              />
            </div>

            <div className="mt-5 text-center">
              <p className="text-lg font-bold text-brand-dark-green">{businessName || "Your business"}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">Please leave us a review on Mitho Cha!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles injected inline for simplicity */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #qr-print-area { display: flex !important; flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  )
}
