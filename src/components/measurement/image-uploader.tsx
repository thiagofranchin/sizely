"use client";

type ImageUploaderProps = {
  onFileSelected: (file: File) => void;
};

export function ImageUploader({ onFileSelected }: ImageUploaderProps) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]">
      Enviar imagem
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
