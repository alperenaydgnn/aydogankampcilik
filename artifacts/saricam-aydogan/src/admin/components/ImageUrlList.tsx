import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUrlListProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUrlList({ value, onChange }: ImageUrlListProps) {
  const add = () => onChange([...value, ""]);

  const update = (index: number, url: string) => {
    const next = [...value];
    next[index] = url;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.map((url, i) => (
        <div key={i} className="flex gap-2 items-center">
          <div className="flex flex-col shrink-0">
            <button
              type="button"
              title="Yukarı taşı"
              disabled={i === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => moveUp(i)}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Aşağı taşı"
              disabled={i === value.length - 1}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => moveDown(i)}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {url && (
            <div className="w-10 h-10 rounded-md overflow-hidden border border-border shrink-0 bg-muted">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
          <Input
            placeholder="Görsel URL (https://...)"
            value={url}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-2">
        <Plus className="w-4 h-4" />
        Görsel URL Ekle
      </Button>
    </div>
  );
}
