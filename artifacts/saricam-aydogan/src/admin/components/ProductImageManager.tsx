import { useRef, useState, useCallback } from "react";
import {
  Upload, Star, Trash2, GripVertical,
  Loader2, AlertCircle, ImageOff, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface ProductImageState {
  key: string;
  id?: string;
  url: string;
  previewUrl?: string;
  alt_text: string;
  is_primary: boolean;
  uploading: boolean;
  progress: number;
  error?: string;
  _file?: File;
}

export type ImagesChangeFn =
  | ProductImageState[]
  | ((prev: ProductImageState[]) => ProductImageState[]);

const BUCKET = "product-images";
const MAX_MB = 12;

function makeKey() {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <ImageOff className="w-5 h-5 text-muted-foreground/40" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || "Ürün görseli"}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

interface ProductImageManagerProps {
  value: ProductImageState[];
  onChange: (v: ImagesChangeFn) => void;
}

export function ProductImageManager({ value, onChange }: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const draggedIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isFileDropping, setIsFileDropping] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const supabaseAvailable = !!getSupabase();
  const hasUploading = value.some(img => img.uploading);

  const uploadFile = useCallback(async (file: File, key: string): Promise<string> => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase bağlantısı yok");

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(pct + 12, 80);
      onChange(prev => prev.map(img => img.key === key ? { ...img, progress: pct } : img));
    }, 220);

    try {
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      clearInterval(timer);
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      clearInterval(timer);
      throw err;
    }
  }, [onChange]);

  const addFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;

    const invalid = files.filter(f => !f.type.startsWith("image/"));
    if (invalid.length) {
      toast({ variant: "destructive", title: "Geçersiz dosya türü", description: "Yalnızca görsel dosyaları kabul edilir." });
      return;
    }
    const tooBig = files.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (tooBig.length) {
      toast({ variant: "destructive", title: "Dosya çok büyük", description: `En fazla ${MAX_MB} MB olabilir.` });
      return;
    }

    const newItems: ProductImageState[] = files.map(file => ({
      key: makeKey(),
      url: "",
      previewUrl: URL.createObjectURL(file),
      alt_text: "",
      is_primary: false,
      uploading: true,
      progress: 0,
      _file: file,
    }));

    onChange(prev => {
      const hasPrimary = prev.some(img => img.is_primary);
      return [
        ...prev,
        ...newItems.map((img, i) => ({
          ...img,
          is_primary: !hasPrimary && i === 0 && prev.length === 0,
        })),
      ];
    });

    if (supabaseAvailable) {
      await Promise.all(
        newItems.map(async (item) => {
          try {
            const url = await uploadFile(item._file!, item.key);
            onChange(prev => prev.map(img =>
              img.key === item.key ? { ...img, url, uploading: false, progress: 100 } : img
            ));
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Yükleme başarısız";
            onChange(prev => prev.map(img =>
              img.key === item.key ? { ...img, uploading: false, progress: 0, error: msg } : img
            ));
            toast({ variant: "destructive", title: "Yükleme başarısız", description: msg });
          }
        })
      );
    } else {
      onChange(prev =>
        prev.map(img =>
          newItems.some(ni => ni.key === img.key)
            ? { ...img, url: img.previewUrl ?? "", uploading: false, progress: 100 }
            : img
        )
      );
      toast({ title: "Önizleme modu", description: "Supabase bağlantısı yok — görseller geçici olarak eklendi." });
    }
  }, [supabaseAvailable, uploadFile, onChange, toast]);

  const retry = useCallback(async (key: string) => {
    const item = value.find(img => img.key === key);
    if (!item?._file) {
      onChange(prev => prev.filter(img => img.key !== key));
      return;
    }
    onChange(prev => prev.map(img =>
      img.key === key ? { ...img, error: undefined, uploading: true, progress: 0 } : img
    ));
    try {
      const url = await uploadFile(item._file, key);
      onChange(prev => prev.map(img =>
        img.key === key ? { ...img, url, uploading: false, progress: 100, error: undefined } : img
      ));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Yükleme başarısız";
      onChange(prev => prev.map(img =>
        img.key === key ? { ...img, uploading: false, progress: 0, error: msg } : img
      ));
    }
  }, [value, uploadFile, onChange]);

  const handleZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDropping(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) addFiles(files);
  };

  const handleCardDragStart = (idx: number, e: React.DragEvent) => {
    draggedIdx.current = idx;
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.style.cssText = "width:1px;height:1px;opacity:0;position:fixed;top:0;left:0;pointer-events:none";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  };

  const handleCardDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (draggedIdx.current !== null && draggedIdx.current !== idx) setDragOverIdx(idx);
  };

  const handleCardDrop = (toIdx: number) => {
    const fromIdx = draggedIdx.current;
    if (fromIdx === null || fromIdx === toIdx) return;
    onChange(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    draggedIdx.current = null;
    setDragOverIdx(null);
  };

  const handleCardDragEnd = () => {
    draggedIdx.current = null;
    setDragOverIdx(null);
  };

  const setPrimary = (key: string) => {
    onChange(prev => prev.map(img => ({ ...img, is_primary: img.key === key })));
  };

  const remove = (key: string) => {
    onChange(prev => {
      const next = prev.filter(img => img.key !== key);
      const wasPrimary = prev.find(img => img.key === key)?.is_primary;
      if (wasPrimary && next.length > 0 && !next.some(img => img.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }
      return next;
    });
  };

  const updateAlt = (key: string, alt_text: string) => {
    onChange(prev => prev.map(img => img.key === key ? { ...img, alt_text } : img));
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    try { new URL(u); } catch {
      toast({ variant: "destructive", title: "Geçersiz URL", description: "https:// ile başlayan geçerli bir URL girin." });
      return;
    }
    const hasPrimary = value.some(img => img.is_primary);
    onChange([
      ...value,
      { key: makeKey(), url: u, alt_text: "", is_primary: !hasPrimary && value.length === 0, uploading: false, progress: 100 },
    ]);
    setUrlInput("");
  };

  const readyImages = value.filter(img => !img.uploading && !img.error && img.url);

  return (
    <div className="space-y-5">
      {/* ── Drop zone ── */}
      <div
        role="button"
        tabIndex={0}
        onDrop={handleZoneDrop}
        onDragOver={e => { e.preventDefault(); if (e.dataTransfer.types.includes("Files")) setIsFileDropping(true); }}
        onDragLeave={() => setIsFileDropping(false)}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-7 text-center cursor-pointer select-none transition-all duration-200",
          isFileDropping
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 hover:bg-muted/20 bg-muted/10"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ""; }}
        />
        <div className="flex flex-col items-center gap-2.5 pointer-events-none">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isFileDropping ? "bg-primary/15" : "bg-muted"
          )}>
            <Upload className={cn("w-5 h-5", isFileDropping ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-sm font-medium">Görselleri buraya sürükle ya da tıkla</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WebP, AVIF — maks. {MAX_MB} MB · Birden çok seçilebilir
            </p>
          </div>
          {!supabaseAvailable && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5">
              Supabase bağlantısı yok — görseller kalıcı olarak yüklenemez
            </p>
          )}
        </div>
      </div>

      {/* ── Image grid ── */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((img, idx) => {
            const src = img.previewUrl || img.url;
            const isDragging = draggedIdx.current === idx;
            const isDragTarget = dragOverIdx === idx;

            return (
              <div
                key={img.key}
                draggable={!img.uploading && !img.error}
                onDragStart={e => handleCardDragStart(idx, e)}
                onDragOver={e => handleCardDragOver(idx, e)}
                onDrop={() => handleCardDrop(idx)}
                onDragEnd={handleCardDragEnd}
                className={cn(
                  "relative group rounded-xl overflow-hidden border-2 bg-muted transition-all duration-200",
                  img.is_primary && !img.error ? "border-primary shadow-md" : "border-border",
                  isDragTarget && "ring-2 ring-primary/30 border-primary/60 scale-[1.03]",
                  isDragging && "opacity-40 scale-[0.96]",
                  !img.uploading && !img.error && "cursor-grab active:cursor-grabbing hover:border-primary/40",
                )}
                style={{ aspectRatio: "4/3" }}
              >
                {/* Thumbnail */}
                <Thumb src={src} alt={img.alt_text || `Görsel ${idx + 1}`} />

                {/* Progress overlay */}
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-3">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <div className="w-3/4 h-1.5 bg-white/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${img.progress}%` }}
                      />
                    </div>
                    <span className="text-white text-[11px] font-medium tabular-nums">{img.progress}%</span>
                  </div>
                )}

                {/* Error overlay */}
                {img.error && (
                  <div className="absolute inset-0 bg-destructive/90 flex flex-col items-center justify-center gap-2 p-3">
                    <AlertCircle className="w-5 h-5 text-white" />
                    <p className="text-white text-[10px] text-center leading-tight line-clamp-2">{img.error}</p>
                    <div className="flex gap-3 mt-1">
                      <button type="button" onClick={() => retry(img.key)}
                        className="text-white text-[10px] underline underline-offset-2 hover:no-underline">
                        Tekrar dene
                      </button>
                      <button type="button" onClick={() => remove(img.key)}
                        className="text-white/75 text-[10px] underline underline-offset-2 hover:no-underline">
                        Kaldır
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary badge */}
                {img.is_primary && !img.uploading && !img.error && (
                  <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5 shadow">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Ana
                  </div>
                )}

                {/* Hover action layer */}
                {!img.uploading && !img.error && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-150 pointer-events-none group-hover:pointer-events-auto">
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {!img.is_primary && (
                        <button type="button" title="Ana görsel yap" onClick={() => setPrimary(img.key)}
                          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-amber-500 hover:text-amber-600 shadow-lg transition-transform hover:scale-110">
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button type="button" title="Kaldır" onClick={() => remove(img.key)}
                        className="w-8 h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-destructive shadow-lg transition-transform hover:scale-110">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Drag grip hint */}
                    <div className="absolute top-1.5 right-1.5 text-white/90 opacity-0 group-hover:opacity-100 pointer-events-none">
                      <GripVertical className="w-4 h-4 drop-shadow" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add more tile */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-muted-foreground hover:text-primary"
            style={{ aspectRatio: "4/3" }}
            title="Görsel ekle"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Plus className="w-5 h-5" />
              <span className="text-xs font-medium">Ekle</span>
            </div>
          </button>
        </div>
      )}

      {/* ── Alt text panel ── */}
      {readyImages.length > 0 && (
        <div className="border border-border rounded-xl p-4 bg-muted/10 space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Görsel açıklamaları <span className="font-normal normal-case">(SEO &amp; erişilebilirlik)</span>
          </p>
          <div className="space-y-2">
            {readyImages.map((img, i) => (
              <div key={img.key} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md overflow-hidden border border-border shrink-0 bg-muted">
                  <img
                    src={img.previewUrl || img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0 w-5">
                  {img.is_primary
                    ? <Star className="w-3 h-3 text-primary fill-current" />
                    : <span className="text-[10px] text-muted-foreground/50 tabular-nums">{i + 1}</span>
                  }
                </div>
                <Input
                  placeholder={`Görsel ${i + 1} için kısa açıklama`}
                  value={img.alt_text}
                  onChange={e => updateAlt(img.key, e.target.value)}
                  className="flex-1 text-xs h-8"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── URL paste fallback ── */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-muted-foreground">Veya harici URL yapıştır:</p>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/gorsel.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
            className="flex-1 text-xs h-8"
          />
          <Button type="button" variant="outline" size="sm" onClick={addUrl} className="h-8 shrink-0">
            Ekle
          </Button>
        </div>
      </div>

      {/* ── Footer hints ── */}
      {value.length > 1 && !hasUploading && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <GripVertical className="w-3 h-3 shrink-0" />
          Kartları sürükleyerek sıralayın · ★ simgesine tıklayarak ana görseli değiştirin
        </p>
      )}
      {hasUploading && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          Görseller yükleniyor — lütfen kaydetmeden önce bekleyin…
        </div>
      )}
    </div>
  );
}
