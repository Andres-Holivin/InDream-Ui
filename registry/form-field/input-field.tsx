
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form'
export interface FormFieldProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
}
export function InputField<T extends FieldValues>({ name, control, label, ...props }: FormFieldProps<T>) {
    const value = useWatch({
        control,
        name,
    })
    if (props.disabled === true) {
        return (
            <div className="py-2 px-3">
                {label && <div className="mb-1 text-sm font-normal text-gray-500">{label}</div>}
                <div className="font-medium">{value === '' || value === undefined ? '-' : value}</div>
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
                        <Input {...field} {...props} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }}
        />
    )
}