import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="InDream UI" width={128} height={128} className="h-32 w-32" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            InDream UI
          </h1>
          <p className="text-xl text-muted-foreground">
            Beautifully designed components built with React and Tailwind CSS.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/docs">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/docs/components/data-table">
            <Button size="lg" variant="outline">
              Browse Components
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and shadcn/ui
          </p>
        </div>
      </div>
    </div>
  )
}
