import type { TextareaHTMLAttributes } from "react";
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form'
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export interface TextAreaFieldProps<T extends FieldValues> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
}

export function TextAreaField<T extends FieldValues>({ name, control, label, ...props }: TextAreaFieldProps<T>) {
    const value = useWatch({
        control,
        name,
    })

    if (props.disabled === true) {
        return (
            <div className="py-2 px-3">
                {label && <div className="mb-1 text-sm font-normal text-gray-500">{label}</div>}
                <div className="font-medium whitespace-pre-wrap">{value === '' || value === undefined ? '-' : value}</div>
            </div>
        )
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                return <FormItem>
                    {label && <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>}
                    <FormControl>
                        <Textarea  className={cn("bg-background",props.className)} {...field} {...props} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }}
        />
    )
}
