"use client"

import { useState } from "react"
import { CodeBlock } from "./code-block"
import { Button } from "@/components/ui/button"
import { Eye, Code } from "lucide-react"

interface ComponentPreviewProps {
  children: React.ReactNode
  code: string
}

export function ComponentPreview({ children, code }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="group relative my-4 flex flex-col space-y-2">
      <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            {showCode ? (
              <>
                <Code className="h-4 w-4" />
                <span>Code</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="h-7 text-xs"
          >
            {showCode ? "Preview" : "Code"}
          </Button>
        </div>
        <div className={showCode ? "" : "p-6"}>
          {showCode ? (
            <CodeBlock code={code} />
          ) : (
            <div className="flex min-h-[200px] w-full items-center justify-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
