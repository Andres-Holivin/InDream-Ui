import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { type Control, type FieldValues, type Path } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PasswordFieldProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
}

export function PasswordField<T extends FieldValues>({ name, control, label, ...props }: PasswordFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                return <FormItem>
                    {label && <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>}
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                {...field}
                                {...props}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-pressed={showPassword}
                                disabled={props.disabled}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }}
        />
    )
}
