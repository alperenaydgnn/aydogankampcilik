import { useState, useRef, useEffect, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BlurImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Optional class for the outer wrapper. */
  wrapperClassName?: string;
  /** Aspect ratio (e.g. "4/3"). When set, wrapper uses CSS aspect-ratio. */
  aspectRatio?: string;
  /** Fade duration in ms. Default 480. */
  fadeMs?: number;
};

/**
 * `<BlurImage>` — image with a soft blur-up reveal.
 *
 * Drop-in `<img>` replacement: same props, but renders a low-opacity blurred
 * placeholder until the image is fully decoded, then crossfades the real image
 * in with a brief blur-to-crisp transition. Keeps existing layout/behaviour.
 */
export function BlurImage({
  src,
  alt = "",
  className,
  wrapperClassName,
  aspectRatio,
  fadeMs = 480,
  loading = "lazy",
  decoding = "async",
  onLoad,
  onError,
  style,
  ...rest
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // If image is already cached, mark loaded after mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={aspectRatio ? { aspectRatio, ...style } : style}
    >
      {/* Skeleton/placeholder layer */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 bg-muted/60 skeleton"
          aria-hidden
        />
      )}

      {/* Errored fallback */}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground/30" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* Real image */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setErrored(true);
          onError?.(e);
        }}
        style={{
          transition: `opacity ${fadeMs}ms ease, filter ${fadeMs}ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)`,
          opacity: loaded ? 1 : 0,
          filter: loaded ? "blur(0)" : "blur(14px)",
        }}
        className={cn(
          "block w-full h-full object-cover",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
