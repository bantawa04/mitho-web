import { Chivo, Poppins } from "next/font/google"
export const poppins = Poppins({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const chivo = Chivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-chivo",
})