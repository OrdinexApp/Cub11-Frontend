"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  defaultMuted?: boolean;
  showControls?: boolean;
  showAudioToggle?: boolean;
  playbackRate?: number;
  notReadyMessage?: string;
  onPlayingChange?: (playing: boolean) => void;
  registerVideoRef?: (el: HTMLVideoElement | null) => void;
  children?: React.ReactNode;
}

type LoadState = "idle" | "loading" | "ready" | "error";

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = true,
  loop = true,
  defaultMuted = true,
  showControls = true,
  showAudioToggle = false,
  playbackRate = 1,
  notReadyMessage = "Your video is still rendering. It will appear here as soon as it's ready.",
  onPlayingChange,
  registerVideoRef,
  children,
}: VideoPlayerProps) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const [loadState, setLoadState] = React.useState<LoadState>(
    src ? "loading" : "idle",
  );
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(defaultMuted);
  const [hovered, setHovered] = React.useState(false);

  const setVideoRef = React.useCallback(
    (el: HTMLVideoElement | null) => {
      ref.current = el;
      registerVideoRef?.(el);
    },
    [registerVideoRef],
  );

  // When src changes (e.g. job completes and video_url appears), force the
  // video element to fully re-initialize. Without this, Chrome will hold
  // onto stale state and show a black frame on top of the new src.
  React.useEffect(() => {
    setLoadState(src ? "loading" : "idle");
    const v = ref.current;
    if (!v || !src) return;
    v.load();
    if (autoPlay) {
      // play() may reject if user hasn't interacted with the page; muted
      // autoplay is allowed in all browsers, so we ensure that first.
      v.muted = true;
      setMuted(true);
      void v.play().catch(() => {
        // Autoplay was blocked; user can click the big play button.
      });
    }
  }, [src, autoPlay]);

  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = playbackRate;
  }, [playbackRate, src]);

  React.useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  function togglePlay() {
    const v = ref.current;
    if (!v || loadState === "error" || loadState === "idle") return;
    if (v.paused || v.ended) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  function toggleMute() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  if (!src) {
    return (
      <div
        className={cn(
          "relative grid place-items-center bg-black text-center text-white/70",
          className,
        )}
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="600px"
            className="object-cover opacity-30"
          />
        )}
        <div className="relative z-10 max-w-[80%] px-4">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-2 text-xs leading-snug">{notReadyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative bg-black overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/*
        Render the poster as a real <img> underneath the video. Even if the
        video decodes black for any reason (browser quirk, partial download,
        codec hiccup), the user still sees the thumbnail rather than a blank
        black rectangle. The video sits on top and covers it once playing.
      */}
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="600px"
          unoptimized
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/*
        key={src} forces React to drop the previous <video> element and create
        a fresh one whenever the source changes (e.g. when the job completes
        and a real video_url replaces an empty placeholder). Without this,
        Chrome holds stale decoder state and renders a black frame.

        Note: we deliberately omit crossOrigin="anonymous". It's only needed
        for canvas pixel access; for plain playback it triggers strict CORS
        validation that can fail (or be cached without CORS metadata) and
        results in the video silently rendering as black.
      */}
      <video
        key={src}
        ref={setVideoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload={autoPlay ? "auto" : "metadata"}
        controls={showControls}
        onLoadStart={() => setLoadState("loading")}
        onLoadedData={() => setLoadState("ready")}
        onCanPlay={() => setLoadState("ready")}
        onError={() => setLoadState("error")}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {children}

      <AnimatePresence>
        {loadState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30"
          >
            <Loader2 className="h-7 w-7 animate-spin text-white/80" />
          </motion.div>
        )}

        {loadState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-black/70 text-center text-white px-4"
          >
            <div>
              <AlertTriangle className="mx-auto h-7 w-7 text-amber-400" />
              <p className="mt-2 text-sm font-medium">Video isn&apos;t ready yet</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                The render finished but the file isn&apos;t reachable. It usually
                appears within a few seconds — try refreshing the page.
              </p>
              <button
                type="button"
                onClick={() => {
                  const v = ref.current;
                  if (!v) return;
                  setLoadState("loading");
                  v.load();
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showControls && loadState !== "error" && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 grid place-items-center"
        >
          <AnimatePresence>
            {(loadState === "ready" && (!playing || hovered)) && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                className="grid h-16 w-16 place-items-center rounded-full bg-white/85 text-zinc-900 shadow-2xl"
              >
                {playing ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}

      {showAudioToggle && loadState === "ready" && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
