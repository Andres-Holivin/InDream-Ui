import type { FormFieldProps } from "./input-field";
import { useController, type FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/ui/field";


interface SelectFieldProps<T extends FieldValues> extends FormFieldProps<T> {
  options: {
    label: string;
    value: string;
  }[];
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
}: SelectFieldProps<T>) {
  const { field } = useController({
    name,
    control,
  });
  const [tempValue, setTempValue] = useState<string>(field.value || "");
  function onChange(value: string) {
    setTempValue(value);
  }
  useEffect(() => {
    field.onChange(tempValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempValue]);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={onChange} {...field}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FormItem>
        );
      }}
    />
  );
}
