import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full border border-white/10", className)}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center bg-[#2a2e4a] text-sm font-semibold text-[#edf0ff]",
        className,
      )}
      {...props}
    />
  );
}
