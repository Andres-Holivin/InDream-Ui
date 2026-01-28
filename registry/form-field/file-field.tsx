import { useState, type InputHTMLAttributes } from "react";
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface FileFieldProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    showPreview?: boolean;
    showDownload?: boolean;
    showDelete?: boolean;
    initialUrl?: string;
}

export function FileField<T extends FieldValues>({ 
    name, 
    control, 
    label, 
    showPreview = true, 
    showDownload = true,
    showDelete = true,
    initialUrl,
    ...props 
}: FileFieldProps<T>) {
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

    const getFileName = () => {
        const file = getFile();
        if (file) return file.name;
        if (currentUrl) {
            return currentUrl.split('/').pop()?.split('?')[0] || currentUrl;
        }
        return '-';
    };

    const handlePreview = () => {
        const file = getFile();
        
        if (file) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } else if (currentUrl) {
            window.open(currentUrl, '_blank');
        }
    };

    const handleDownload = () => {
        const file = getFile();
        
        if (file) {
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (currentUrl) {
            const link = document.createElement('a');
            link.href = currentUrl;
            link.download = getFileName();
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (props.disabled === true) {
        const file = getFile();
        const hasFile = file || currentUrl;

        return (
            <div className="py-2 px-3">
                {label && <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>}
                <div className="flex items-center gap-2">
                    <span>{getFileName()}</span>
                    {hasFile && (
                        <div className="flex gap-1">
                            {showPreview && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreview}
                                    className="h-7 px-2"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            )}
                            {showDownload && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="h-7 px-2"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange, ...field } }) => {
                const file = getFile();
                const hasFile = !!(file || currentUrl);
                
                const handleDelete = () => {
                    onChange(null);
                    setIsInitialDeleted(true);
                    // Clear the file input
                    const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
                    if (input) input.value = '';
                };
                
                return (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        {hasFile ? (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {getFileName()}
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    {showPreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePreview}
                                            className="h-9 px-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {showDownload && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownload}
                                            className="h-9 px-2"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {showDelete && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDelete}
                                            className="h-9 px-2"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <FormControl>
                                <Input
                                    type="file"
                                    {...field}
                                    {...props}
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        onChange(files && files.length > 0 ? files[0] : null);
                                        setIsInitialDeleted(false);
                                        props.onChange?.(e);
                                    }}
                                />
                            </FormControl>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
