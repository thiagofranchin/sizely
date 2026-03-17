"use client";

import { Camera } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CameraCaptureInputProps = {
  onFileSelected: (file: File) => void;
};

export function CameraCaptureInput({ onFileSelected }: CameraCaptureInputProps) {
  return (
    <label className="block">
      <span
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-12 w-full cursor-pointer rounded-full px-5 text-sm shadow-sm",
        )}
      >
        <Camera className="size-4.5" />
        Tirar foto
      </span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onFileSelected(file);
          }

          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}
