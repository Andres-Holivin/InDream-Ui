import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DocsPage() {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Introduction
        </h1>
        <p className="text-lg text-muted-foreground">
          Accessible shadcn/ui components built with React, TypeScript, and Tailwind CSS.
          Copy-paste ready, and customizable.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Key Features
        </h2>
        <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Composable by design</strong> - Build complex interfaces by combining simple, focused components
          </li>
          <li>
            <strong className="text-foreground">Built on top of shadcn/ui</strong> - Uses the same design principles and styling approach as shadcn/ui
          </li>
          <li>
            <strong className="text-foreground">Copy-paste ready</strong> - Same installation experience as shadcn/ui components
          </li>
          <li>
            <strong className="text-foreground">Fully customizable</strong> - Built with Tailwind CSS and designed to match your design system
          </li>
          <li>
            <strong className="text-foreground">Advanced functionality</strong> - Complex components like data tables with server-side features
          </li>
        </ul>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Why InDream UI?
        </h2>
        <p className="leading-7 text-muted-foreground">
          InDream UI is a collection of fully composable components that extend shadcn/ui.
          These components are accessible and customizable to fit your needs. InDream UI is
          copy-paste ready, no complex setup or configuration required. Every component
          follows WCAG guidelines, includes proper ARIA attributes, and supports keyboard
          navigation out of the box.
        </p>
      </div>

      <div className="flex gap-4 pt-6">
        <Link href="/docs/installation">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/docs/components/data-table">
          <Button size="lg" variant="outline">Browse Components</Button>
        </Link>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Credits
        </h2>
        <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
          <li>
            <a href="https://radix-ui.com/" className="text-foreground underline underline-offset-4 hover:text-foreground/80" target="_blank" rel="noopener noreferrer">
              Radix UI
            </a> - Core components.
          </li>
          <li>
            <a href="https://ui.shadcn.com/" className="text-foreground underline underline-offset-4 hover:text-foreground/80" target="_blank" rel="noopener noreferrer">
              shadcn/ui
            </a> - Components design and registry distribution.
          </li>
          <li>
            <a href="https://tailwindcss.com/" className="text-foreground underline underline-offset-4 hover:text-foreground/80" target="_blank" rel="noopener noreferrer">
              Tailwind CSS
            </a> - Utility-first CSS framework.
          </li>
        </ul>
      </div>
    </div>
  )
}
