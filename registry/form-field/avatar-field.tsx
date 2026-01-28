import { useRef, useState, type InputHTMLAttributes, type MutableRefObject } from "react";
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Camera, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export interface AvatarFieldProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    fallback?: string;
    initialUrl?: string;
}

export function AvatarField<T extends FieldValues>({ 
    name, 
    control, 
    label,
    fallback = "A",
    initialUrl,
    ...props 
}: AvatarFieldProps<T>) {
    // File inputs must remain uncontrolled; drop any value prop passed in
    const { value: _, ...safeProps } = props;
    void _; // Explicitly mark as intentionally unused
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isInitialDeleted, setIsInitialDeleted] = useState(false);
    const value = useWatch({
        control,
        name,
    });
    
    const currentUrl = typeof value === 'string' ? value : (isInitialDeleted ? null : initialUrl);

    const getFile = (): File | null => {
        if (!value) return null;
        
        // Check for FileList
        if (typeof value === 'object' && value !== null && 'length' in value && typeof value.length === 'number' && value.length > 0) {
            return (value as FileList)[0];
        }
        
        // Check for File (has name, size, type properties)
        if (
            typeof value === 'object' && 
            value !== null && 
            'name' in value && 
            'size' in value && 
            'type' in value &&
            typeof (value as File).name === 'string'
        ) {
            return value as File;
        }
        
        return null;
    };

    const getPreviewUrl = (): string | null => {
        const file = getFile();
        if (file) {
            return URL.createObjectURL(file);
        }
        return currentUrl ?? null;
    };

    if (props.disabled === true) {
        const previewUrl = getPreviewUrl();
        
        return (
            <div className="py-2 px-3">
                {label && <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>}
                <Avatar className="h-20 w-20">
                    <AvatarImage src={previewUrl || undefined} alt="Avatar" />
                    <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
            </div>
        );
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange, ref, value, ...field } }) => {
                void value; // Explicitly mark as intentionally unused
                const previewUrl = getPreviewUrl();
                const hasFile = !!(getFile() || currentUrl);
                
                const handleDelete = () => {
                    onChange(null);
                    setIsInitialDeleted(true);
                    // Clear the file input without setting a non-empty value programmatically
                    if (fileInputRef.current) fileInputRef.current.value = '';
                };
                
                const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    onChange(files && files.length > 0 ? files[0] : null);
                    setIsInitialDeleted(false);
                    props.onChange?.(e);
                };
                
                return (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={previewUrl || undefined} alt="Avatar" />
                                <AvatarFallback>{fallback}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex flex-col gap-2">
                                {hasFile ? (
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <label htmlFor={`${name}-upload`}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <span className="cursor-pointer">
                                                        <Camera className="h-4 w-4 mr-2" />
                                                        Change
                                                    </span>
                                                </Button>
                                                <Input
                                                    id={`${name}-upload`}
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    {...field}
                                                    {...safeProps}
                                                    onChange={handleFileSelect}
                                                    ref={(node) => {
                                                        fileInputRef.current = node;
                                                        if (typeof ref === 'function') {
                                                            ref(node);
                                                        } else if (ref) {
                                                            // react-hook-form may supply a mutable ref
                                                            (ref as MutableRefObject<HTMLInputElement | null>).current = node;
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDelete}
                                            hidden
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <FormControl>
                                        <label htmlFor={`${name}-upload`}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <span className="cursor-pointer">
                                                    <Camera className="h-4 w-4 mr-2" />
                                                    Upload Photo
                                                </span>
                                            </Button>
                                            <Input
                                                id={`${name}-upload`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                {...field}
                                                {...safeProps}
                                                onChange={handleFileSelect}
                                                ref={(node) => {
                                                    fileInputRef.current = node;
                                                    if (typeof ref === 'function') {
                                                        ref(node);
                                                    } else if (ref) {
                                                        (ref as MutableRefObject<HTMLInputElement | null>).current = node;
                                                    }
                                                }}
                                            />
                                        </label>
                                    </FormControl>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or WEBP. Max 2MB.
                                </p>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
