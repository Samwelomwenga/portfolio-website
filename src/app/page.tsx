"use client"

import dynamic from "next/dynamic"

const AppRoot = dynamic(() => import("@/app-root").then(mod => mod.AppRoot), {
  ssr: false,
})

export default function Page() {
  return <AppRoot />
}
