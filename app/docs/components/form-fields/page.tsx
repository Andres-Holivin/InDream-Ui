"use client"

import { useForm } from "react-hook-form"
import { InputField } from "@/registry/form-field/input-field"
import { TextAreaField } from "@/registry/form-field/text-area-field"
import { PasswordField } from "@/registry/form-field/password-field"
import { SelectField } from "@/registry/form-field/select-field"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

type FormValues = {
  email: string
  bio: string
  password: string
  role: string
}

export default function FormFieldsPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      bio: "",
      password: "",
      role: "",
    },
  })
  
  const { control, handleSubmit } = form

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Form Fields</h1>
        <p className="text-lg text-muted-foreground">
          React Hook Form field components with built-in validation, labels, and error handling.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-10 first:mt-0">Installation</h2>
        <CodeBlock code="npx shadcn@latest add indream-ui/form-field" language="bash" />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Input Field</h2>
        <p className="leading-7 text-muted-foreground">
          Text input with automatic disabled state display.
        </p>
        <ComponentPreview
          code={`import { InputField } from "@/registry/form-field/input-field"

<InputField
  name="email"
  control={control}
  label="Email"
  placeholder="you@example.com"
/>`}
        >
          <Form {...form}>
            <form className="space-y-4 max-w-md">
              <InputField
                name="email"
                control={control}
                label="Email"
                placeholder="you@example.com"
              />
            </form>
          </Form>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Text Area Field</h2>
        <p className="leading-7 text-muted-foreground">
          Multi-line text input with disabled state display.
        </p>
        <ComponentPreview
          code={`import { TextAreaField } from "@/registry/form-field/text-area-field"

<TextAreaField
  name="bio"
  control={control}
  label="Bio"
  rows={4}
/>`}
        >
          <Form {...form}>
            <form className="space-y-4 max-w-md">
              <TextAreaField
                name="bio"
                control={control}
                label="Bio"
                rows={4}
                placeholder="Tell us about yourself"
              />
            </form>
          </Form>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Password Field</h2>
        <p className="leading-7 text-muted-foreground">
          Password input with toggle visibility button.
        </p>
        <ComponentPreview
          code={`import { PasswordField } from "@/registry/form-field/password-field"

<PasswordField
  name="password"
  control={control}
  label="Password"
/>`}
        >
          <Form {...form}>
            <form className="space-y-4 max-w-md">
              <PasswordField
                name="password"
                control={control}
                label="Password"
                placeholder="Enter password"
              />
            </form>
          </Form>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Select Field</h2>
        <p className="leading-7 text-muted-foreground">
          Dropdown select with options.
        </p>
        <ComponentPreview
          code={`import { SelectField } from "@/registry/form-field/select-field"

<SelectField
  name="role"
  control={control}
  label="Role"
  placeholder="Select a role"
  options={[
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Guest", value: "guest" },
  ]}
/>`}
        >
          <Form {...form}>
            <form className="space-y-4 max-w-md">
              <SelectField
                name="role"
                control={control}
                label="Role"
                placeholder="Select a role"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                ]}
              />
            </form>
          </Form>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Full Example</h2>
        <ComponentPreview
          code={`import { useForm } from "react-hook-form"

const { control, handleSubmit } = useForm()

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <InputField
    name="email"
    control={control}
    label="Email"
  />
  <PasswordField
    name="password"
    control={control}
    label="Password"
  />
  <SelectField
    name="role"
    control={control}
    label="Role"
    options={roles}
  />
  <Button type="submit">Submit</Button>
</form>`}
        >
          <Form {...form}>
            <form 
              onSubmit={handleSubmit((data) => console.log(data))} 
              className="space-y-4 max-w-md"
            >
              <InputField
                name="email"
                control={control}
                label="Email"
                placeholder="you@example.com"
              />
              <PasswordField
                name="password"
                control={control}
                label="Password"
                placeholder="Enter password"
              />
              <SelectField
                name="role"
                control={control}
                label="Role"
                placeholder="Select a role"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                ]}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ComponentPreview>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">API Reference</h2>
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
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">name</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Path&lt;T&gt;</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">control</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Control&lt;T&gt;</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
              <tr className="m-0 border-t p-0">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">label</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">string</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          All fields extend their respective HTML element props.
        </p>
      </div>
    </div>
  )
}
