import { ConvexClientProvider } from "@/components/convex-client-provider"

export default function BillsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>
}
