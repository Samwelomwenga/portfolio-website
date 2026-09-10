import { ImageResponse } from "next/og"
import { profile } from "@/portfolio-data"

export const alt = `${profile.name} — ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#30d158" }}>
          $ whoami
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 104, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 46, color: "#9aa0a6" }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", marginTop: 56, fontSize: 30, color: "#5f6368" }}>
          {`${profile.location} · samwelomwenga.com`}
        </div>
      </div>
    ),
    size,
  )
}
