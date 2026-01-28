"use client"

import { Suspense, useState } from "react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import { Separator } from "@/components/ui/separator"
import type { ColumnDef } from "@tanstack/react-table"
import { FullDataTable } from "@/registry/data-table"

type User = {
  id: number
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  },
]

const sampleData: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
]

export default function DataTablePage() {
  const [data,setData] = useState(sampleData)
  const [pagination] = useState({ page: 1, limit: 10, total: 3 })

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Data Table</h1>
        <p className="text-lg text-muted-foreground">
          A powerful data table component with server-side pagination, sorting, filtering, and loading states.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-10 first:mt-0">
          Installation
        </h2>
        <CodeBlock code="npx shadcn@latest add indream-ui/data-table" language="bash" />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Usage
        </h2>
        <CodeBlock 
          code={`import { DataTableV2 } from "@/registry/data-table"
import type { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

export function UsersTable() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  return (
    <FullDataTable
      columns={columns}
      data={data}
      pagination={pagination}
      isLoading={isLoading}
      onQueryChange={(state) => {
        // Fetch data based on state
      }}
    />
  )
}`} 
        />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          Example
        </h2>
        <ComponentPreview
          code={`<FullDataTable
  columns={columns}
  data={data}
  pagination={{ page: 1, limit: 10, total: 3 }}
  onQueryChange={(state) => console.log(state)}
/>`}
        >
          <Suspense fallback={<div className="h-48 rounded-md border" />}>
            <FullDataTable
              columns={columns}
              data={data}
              pagination={pagination}
              onQueryChange={(state) => {
                console.log(state)
                const roleFilter = state.columnFilters.find(filter => filter.id === 'role')?.value
                let filteredData = sampleData
                console.log("Role Filter:", roleFilter)
                if (roleFilter) {
                  filteredData = sampleData.filter(user => user.role === roleFilter)
                }
                console.log("Filtered Data:", filteredData)
                // setData(filteredData)
              }}
            />
          </Suspense>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          With Filtering
        </h2>
        <p className="leading-7 text-muted-foreground">
          Enable column filtering by adding <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">enableColumnFilter: true</code> and <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">meta</code> options to columns.
        </p>
        <CodeBlock 
          code={`const columns: ColumnDef<User>[] = [
  {
    accessorKey: "role",
    header: "Role",
    enableColumnFilter: true,
    meta: {
      variant: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  },
]`} 
        />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
          API Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="m-0 border-t p-0">
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Prop</th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Type</th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Default</th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">columns</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">ColumnDef[]</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">data</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">TData[]</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">pagination</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">RemotePaginationMeta</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">isLoading</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">boolean</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">false</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">onQueryChange</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">(state) =&gt; void</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
