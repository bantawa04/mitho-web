import { ImageResponse } from "next/og"
import { getAbsoluteUrl } from "@/lib/seo"

export const alt = "Mitho Cha"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #ecf8f1 0%, #fff8eb 100%)",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(0, 121, 54, 0.1)",
            borderRadius: 999,
            height: 520,
            position: "absolute",
            right: -120,
            top: -170,
            width: 520,
          }}
        />
        <div
          style={{
            background: "rgba(245, 125, 0, 0.12)",
            borderRadius: 999,
            bottom: -180,
            height: 430,
            left: -110,
            position: "absolute",
            width: 430,
          }}
        />
        <div
          style={{
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.86)",
            border: "1px solid rgba(0, 121, 54, 0.14)",
            borderRadius: 48,
            boxShadow: "0 28px 80px rgba(0, 54, 28, 0.14)",
            display: "flex",
            height: 260,
            justifyContent: "center",
            padding: 56,
            width: 760,
          }}
        >
          <img
            alt="Mitho Cha"
            src={getAbsoluteUrl("/brand/logo-primary-green.svg")}
            style={{
              height: 170,
              objectFit: "contain",
              width: 560,
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
