import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"

// Shared across the landing page and /bills so the brand typography
// (paper/ink civic-document system, see theme.css) stays identical
// everywhere it's used.

export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
})

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
})

export const themeFontVariables = `${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`
