"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import {
  HiMicrophone,
  HiOutlineMicrophone,
  HiVideoCamera,
  HiVideoCameraSlash,
  HiComputerDesktop,
  HiPhoneXMark,
  HiPlay,
  HiUsers,
  HiLink,
  HiStop,
  HiSignal,
  HiEye,
  HiCog6Tooth,
  HiSparkles,
} from "react-icons/hi2";

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
    <div className="min-h-screen ">
      {/* Enhanced Professional Banner */}
      <div className="relative overflow-hidden -mt-6">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 -mt-1 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {/* Enhanced Logo/Icon */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                </div>

                {/* Title and Description */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 text-blue-300">
                      <HiSparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Live Streaming Studio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center mt-2">
              {/* Connection Status */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                <div className="relative">
                  <HiSignal className="h-5 w-5 text-green-400" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400 animate-ping"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-green-300 font-semibold text-sm">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {connecting ? (
          <div className="h-[60vh] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-6"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Initializing Studio
            </h3>
            <p className="text-blue-300">
              Setting up your professional broadcasting environment...
            </p>
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
            <div className=" w-fulgap-6">
              {/* Main Video Area */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
                  <div className="relative w-full aspect-video bg-black">
                    <HostVideoGrid />
                  </div>
                  {/* Video Status Bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-white text-sm font-medium">
                        Broadcasting Live
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
                      <HiEye className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">2 viewers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div className="space-y-4 mt-4">
                {/* Host Controls */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <HiCog6Tooth className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Broadcasting Controls
                      </h3>
                      <p className="text-xs text-blue-300">
                        Manage your live session
                      </p>
                    </div>
                  </div>
                  <HostControls />
                </div>

                {/* Room Info & Actions */}
                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <HiUsers className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Session Details
                      </h3>
                      <p className="text-xs text-blue-300">
                        Room: {livekit.roomName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          window.location.origin + "/live"
                        )
                      }
                      className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-200"
                    >
                      <HiLink className="h-4 w-4 mr-2" />
                      Copy Viewer Link
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-200"
                    >
                      <HiStop className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </LiveKitRoom>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <HiSignal className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Connection Error
            </h3>
            <p className="text-red-300/60">
              Unable to connect to LiveKit service
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HostVideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);
  const realTracks = tracks.filter(
    (t) => t.publication && t.publication.trackSid
  );
  return (
    <div className=" w-full h-full p-3">
      {realTracks.map((t) => (
        <div
          key={t.publication!.trackSid}
          className="relative bg-slate-900 rounded-xl overflow-hidden border border-blue-500/20"
        >
          <VideoTrack
            trackRef={t as any}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-white text-xs font-medium">
              {t.source === Track.Source.ScreenShare
                ? "Screen Share"
                : "Host Camera"}
            </span>
          </div>
          {t.source === Track.Source.Camera && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-blue-200 text-xs font-medium">You</span>
            </div>
          )}
        </div>
      ))}
      {realTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-blue-300/60 h-full">
          <div className="h-20 w-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <HiPlay className="h-10 w-10 text-blue-400" />
          </div>
          <p className="font-semibold text-lg">Ready to Broadcast</p>
          <p className="text-sm text-blue-400/60 mt-1">
            Turn on your camera or share your screen to begin
          </p>
        </div>
      ) : null}
    </div>
  );
}

function HostControls() {
  const room = useRoomContext();
  const router = useRouter();
  const localParticipant = room.localParticipant;

  const isMicEnabled = localParticipant.isMicrophoneEnabled;
  const isCamEnabled = localParticipant.isCameraEnabled;

  async function toggleMic() {
    if (localParticipant.isMicrophoneEnabled)
      await room.localParticipant.setMicrophoneEnabled(false);
    else await room.localParticipant.setMicrophoneEnabled(true);
  }
  async function toggleCam() {
    if (localParticipant.isCameraEnabled)
      await room.localParticipant.setCameraEnabled(false);
    else await room.localParticipant.setCameraEnabled(true);
  }
  async function shareScreen() {
    await room.localParticipant.setScreenShareEnabled(true);
  }
  function leave() {
    room.disconnect();
    router.push("/");
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Microphone Control */}
      <button
        onClick={toggleMic}
        className={`group relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium border transition-all duration-200 ${
          isMicEnabled
            ? "bg-white text-slate-900 border-white/20 shadow-lg"
            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isMicEnabled ? (
            <>
              <HiMicrophone className="h-5 w-5" />
              <span>Mic On</span>
            </>
          ) : (
            <>
              <HiOutlineMicrophone className="h-5 w-5" />
              <span>Mic Off</span>
            </>
          )}
        </div>
      </button>

      {/* Camera Control */}
      <button
        onClick={toggleCam}
        className={`group relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium border transition-all duration-200 ${
          isCamEnabled
            ? "bg-white text-slate-900 border-white/20 shadow-lg"
            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isCamEnabled ? (
            <>
              <HiVideoCamera className="h-5 w-5" />
              <span>Camera On</span>
            </>
          ) : (
            <>
              <HiVideoCameraSlash className="h-5 w-5" />
              <span>Camera Off</span>
            </>
          )}
        </div>
      </button>

      {/* Screen Share */}
      <button
        onClick={shareScreen}
        className="group relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium border bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30 transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-2">
          <HiComputerDesktop className="h-5 w-5" />
          <span>Share Screen</span>
        </div>
      </button>

      {/* Leave Session */}
      <button
        onClick={leave}
        className="group relative overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold bg-red-500/90 hover:bg-red-500 text-white border border-red-400/20 transition-all duration-200"
      >
        <div className="flex items-center justify-center gap-2">
          <HiPhoneXMark className="h-5 w-5" />
          <span>Leave</span>
        </div>
      </button>
    </div>
  );
}
