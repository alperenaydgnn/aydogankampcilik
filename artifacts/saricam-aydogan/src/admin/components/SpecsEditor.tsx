import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SpecsEditorProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function SpecsEditor({ value, onChange }: SpecsEditorProps) {
  const entries = Object.entries(value);

  const addRow = () => {
    onChange({ ...value, "": "" });
  };

  const updateKey = (oldKey: string, newKey: string, index: number) => {
    const newEntries = entries.map(([k, v], i) =>
      i === index ? [newKey, v] : [k, v]
    );
    onChange(Object.fromEntries(newEntries));
  };

  const updateVal = (key: string, newVal: string, index: number) => {
    const newEntries = entries.map(([k, v], i) =>
      i === index ? [k, newVal] : [k, v]
    );
    onChange(Object.fromEntries(newEntries));
  };

  const removeRow = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(Object.fromEntries(newEntries));
  };

  return (
    <div className="space-y-2">
      {entries.map(([key, val], i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Özellik (örn: Ağırlık)"
            value={key}
            onChange={(e) => updateKey(key, e.target.value, i)}
            className="flex-1"
          />
          <Input
            placeholder="Değer (örn: 2.3 kg)"
            value={val}
            onChange={(e) => updateVal(key, e.target.value, i)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(i)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-2">
        <Plus className="w-4 h-4" />
        Özellik Ekle
      </Button>
    </div>
  );
}
