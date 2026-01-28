import { CodeBlock } from "@/components/code-block"
import { Separator } from "@/components/ui/separator"

export default function InstallationPage() {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Installation
        </h1>
        <p className="text-lg text-muted-foreground">
          How to install dependencies and structure your app.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-10 first:mt-0">
          Requirements
        </h2>
        <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
          <li>React 19+</li>
          <li>Next.js 15+</li>
          <li>Tailwind CSS 4+</li>
          <li>TypeScript</li>
        </ul>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Install shadcn/ui
        </h2>
        <p className="leading-7 text-muted-foreground">
          Initialize shadcn/ui in your project:
        </p>
        <CodeBlock code="npx shadcn@latest init" language="bash" />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Add Components
        </h2>
        <p className="leading-7 text-muted-foreground">
          Install components from the InDream UI registry:
        </p>
        <CodeBlock 
          code="npx shadcn@latest add indream-ui/data-table" 
          language="bash" 
        />
        <p className="text-sm leading-7 text-muted-foreground">
          This will add the component to your project along with all dependencies.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Configure Registry
        </h2>
        <p className="leading-7 text-muted-foreground">
          Add the InDream UI registry to your <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">components.json</code>:
        </p>
        <CodeBlock 
          code={`{
  "registries": {
    "indream-ui": "https://indream-ui.vercel.app/r/registry.json"
  }
}`} 
          language="json" 
        />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Usage
        </h2>
        <p className="leading-7 text-muted-foreground">
          Import and use components in your app:
        </p>
        <CodeBlock 
          code={`import { DataTableV2 } from "@/registry/data-table"

export function MyTable() {
  return (
    <DataTableV2
      columns={columns}
      data={data}
      pagination={pagination}
      onQueryChange={handleQueryChange}
    />
  )
}`} 
          language="tsx" 
        />
      </div>
    </div>
  )
}
