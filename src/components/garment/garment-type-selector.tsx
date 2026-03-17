import type { GarmentTypeDefinition, GarmentTypeId } from "@/lib/types/measurement";

type GarmentTypeSelectorProps = {
  garmentTypes: GarmentTypeDefinition[];
  selectedGarmentTypeId: GarmentTypeId | null;
  onSelect: (garmentTypeId: GarmentTypeId) => void;
};

export function GarmentTypeSelector({
  garmentTypes,
  selectedGarmentTypeId,
  onSelect,
}: GarmentTypeSelectorProps) {
  return (
    <div className="grid gap-3">
      {garmentTypes.map((garmentType) => {
        const isSelected = garmentType.id === selectedGarmentTypeId;

        return (
          <button
            key={garmentType.id}
            type="button"
            onClick={() => onSelect(garmentType.id)}
            className={`rounded-[24px] border px-5 py-4 text-left transition ${
              isSelected
                ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                : "border-[var(--border-soft)] bg-[var(--surface)] hover:bg-[var(--surface-alt)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-[var(--font-space-grotesk)] text-lg font-medium text-[var(--text-strong)]">
                  {garmentType.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  {garmentType.description}
                </p>
              </div>
              <span className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-medium text-[var(--text-soft)]">
                {garmentType.measurements.length} medidas
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
