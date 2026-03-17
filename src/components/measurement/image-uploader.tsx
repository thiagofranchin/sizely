"use client";

import { Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  onFileSelected: (file: File) => void;
};

export function ImageUploader({ onFileSelected }: ImageUploaderProps) {
  return (
    <label className="block">
      <span
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-12 w-full cursor-pointer rounded-full bg-white/80 px-5 text-sm shadow-sm dark:bg-card/80",
        )}
      >
        <Upload className="size-4.5" />
        Enviar imagem
      </span>
      <input
        type="file"
        accept="image/*"
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
