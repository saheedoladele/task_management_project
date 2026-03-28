import { forwardRef, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";

export type TextInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  type?: "text" | "email";
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return <Input ref={ref} type={type} className={className} {...props} />;
  },
);
TextInput.displayName = "TextInput";
