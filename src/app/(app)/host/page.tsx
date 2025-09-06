"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useTracks,
  ControlBar,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export default function HostPage() {
  const [livekit, setLivekit] = useState<{
    url?: string;
    token?: string;
    roomName?: string;
  }>({});
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    fetch(`/api/livekit/token?role=host`)
      .then((r) => r.json())
      .then((data) => {
        setLivekit(data);
        setConnecting(false);
      })
      .catch(() => setConnecting(false));
  }, []);

  return (
    <div className="min-h-screen p-4 lg:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Host Control Room</h1>
        <div className="text-white/60 text-sm">
          Tip: Share your screen to present slides.
        </div>
      </div>
      {connecting ? (
        <div className="h-[60vh] flex items-center justify-center text-white/60">
          Connecting…
        </div>
      ) : livekit.url && livekit.token ? (
        <LiveKitRoom
          serverUrl={livekit.url}
          token={livekit.token}
          connect
          audio
          video
        >
          <RoomAudioRenderer />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3">
            <div className="relative w-full aspect-video bg-black/60">
              <HostVideoGrid />
            </div>
            <div className="space-y-2">
              <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                <ControlBar />
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                <div className="text-sm text-white/70">
                  Room: {livekit.roomName}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        window.location.origin + "/live"
                      )
                    }
                  >
                    Copy Viewer Link
                  </Button>
                  <Button variant="secondary">End Class</Button>
                </div>
              </div>
            </div>
          </div>
        </LiveKitRoom>
      ) : (
        <div className="h-[60vh] flex items-center justify-center text-red-400">
          No LiveKit configuration
        </div>
      )}
    </div>
  );
}

function HostVideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: true },
  ]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full h-full">
      {tracks.map((trackRef) => (
        <div
          key={trackRef.publication?.trackSid ?? Math.random()}
          className="relative"
        >
          <VideoTrack
            trackRef={trackRef}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
