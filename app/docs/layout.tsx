"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchPlaceholder } from "@/components/search-placeholder"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Menu, X, Github } from "lucide-react"
import { useState, useEffect } from "react"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Data Table", href: "/docs/components/data-table" },
      { title: "Form Fields", href: "/docs/components/form-fields" },
    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          

          <div className="flex flex-1 items-center justify-between px-4 md:px-6">
            
          <div className="mr-4 flex md:mr-6 justify-around items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src="/logo.png" alt="InDream UI" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold">InDream UI</span>
            </Link>
          </div>
            <nav className="flex items-center space-x-1">
              <Link
                href="https://github.com/Andres-Holivin/InDream-Ui"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className=" flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-14 z-40 -ml-2 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r bg-background transition-transform duration-200 md:sticky md:block",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="relative h-full py-6 pl-8 pr-6 lg:py-8">
            <nav className="space-y-6">
              {navigation.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h4 className="mb-2 rounded-md px-2 py-1 text-sm font-semibold">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 text-sm transition-all hover:bg-accent",
                            isActive
                              ? "font-medium text-foreground bg-accent"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 px-8 ">
          <div className="w-full min-w-0">
            {children}
            
            <Separator className="my-8" />
            
            {/* Footer */}
            <footer className="mt-8 pb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Built with{" "}
                  <a
                    href="https://ui.shadcn.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    shadcn/ui
                  </a>
                  . The source code is available on{" "}
                  <a
                    href="https://github.com/Andres-Holivin/InDream-Ui"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
