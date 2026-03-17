"use client";

type CameraCaptureInputProps = {
  onFileSelected: (file: File) => void;
};

export function CameraCaptureInput({ onFileSelected }: CameraCaptureInputProps) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl bg-[var(--text-strong)] px-4 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90">
      Tirar foto
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
