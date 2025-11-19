"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  HiPlay,
  HiUsers,
  HiChatBubbleLeftRight,
  HiHeart,
  HiExclamationTriangle,
  HiPaperAirplane,
  HiChevronDown,
  HiEye,
  HiSignal,
  HiMicrophone,
  HiOutlineMicrophone,
} from "react-icons/hi2";

type ChatMessage = { id: string; author: string; text: string; at: string };
import { createClient } from "@/lib/supabase/client";

export default function LivePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [viewerCount] = useState<number>(2); // placeholder

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = chatText.trim();
    if (!text) return;
    const supabase = createClient();
    await supabase
      .from("chat_messages")
      .insert({ message: text, room: livekit.roomName ?? "elyrion-class" });
    setChatText("");
  }

  const [livekit, setLivekit] = useState<{
    url?: string;
    token?: string;
    roomName?: string;
  }>({});

  useEffect(() => {
    fetch(`/api/livekit/token?role=viewer`)
      .then((r) => r.json())
      .then(setLivekit)
      .catch(() => setLivekit({}));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const room = livekit.roomName ?? "elyrion-class";
    // initial fetch
    supabase
      .from("chat_messages")
      .select("id, user_name, message, created_at")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setMessages(
            data.map((d: any) => ({
              id: d.id,
              author: d.user_name ?? "Member",
              text: d.message,
              at: new Date(d.created_at).toLocaleTimeString(),
            }))
          );
        }
      });
    // realtime
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room=eq.${room}`,
        },
        (payload) => {
          const d: any = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              id: d.id,
              author: d.user_name ?? "Member",
              text: d.message,
              at: new Date(d.created_at).toLocaleTimeString(),
            },
          ]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [livekit.roomName]);

  return (
    <div className="min-h-screen  to-slate-900">
      {/* Professional Header */}
      <div className="  backdrop-blur-sm">
        <div className="w-full mx-auto px-4 lg:px-6 "></div>
      </div>

      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-4 lg:p-6">
        {livekit.url && livekit.token ? (
          <LiveKitRoom
            serverUrl={livekit.url}
            token={livekit.token}
            connect
            audio
            video={false}
          >
            <div className="space-y-4">
              {/* Modern Video Player */}
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
                <div className="relative w-full aspect-video bg-black">
                  <RoomAudioRenderer />
                  <VideoGrid />
                </div>
              </div>
              <div className="flex items-center w-full justify-between">
                <ViewerControls />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg  border border-blue-500/20">
                    <HiEye className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-300 font-medium">{viewerCount}</span>
                    <span className="text-blue-400 text-sm">viewers</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-300 font-medium text-sm">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </LiveKitRoom>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
              <div className="relative w-full aspect-video bg-black">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/20 to-slate-900/80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <span className="text-blue-300 font-medium">
                    Connecting to stream...
                  </span>
                  <span className="text-blue-400/60 text-sm mt-1">
                    Please wait while we establish connection
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center w-full justify-end">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg  border border-blue-500/20">
                  <HiEye className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">{viewerCount}</span>
                  <span className="text-blue-400 text-sm">viewers</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-300 font-medium text-sm">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Chat Panel */}
        <div className="h-[calc(100vh-8rem)] flex flex-col rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <HiChatBubbleLeftRight className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Live Chat</h3>
                <p className="text-xs text-blue-300">Join the conversation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-500/10">
              <HiUsers className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">
                {messages.length}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <ChatList messages={messages} />
            <div className="p-4 border-t border-blue-500/20 bg-slate-900/50">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Share your thoughts..."
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-blue-300/60 pr-12 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400/60">
                    <HiPaperAirplane className="h-4 w-4" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-6"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);
  const realTracks = tracks.filter(
    (t) => t.publication && t.publication.trackSid
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full p-2">
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
                : "Instructor"}
            </span>
          </div>
          {t.source === Track.Source.Camera && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-blue-200 text-xs font-medium">Live</span>
            </div>
          )}
        </div>
      ))}
      {realTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-blue-300/60 h-full">
          <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <HiPlay className="h-8 w-8 text-blue-400" />
          </div>
          <p className="font-medium">Waiting for stream</p>
          <p className="text-sm text-blue-400/40 mt-1">
            The instructor will begin shortly
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ViewerControls() {
  const room = useRoomContext();
  const localParticipant = room.localParticipant;
  const isMicEnabled = localParticipant.isMicrophoneEnabled;

  async function toggleMic() {
    if (localParticipant.isMicrophoneEnabled) {
      await room.localParticipant.setMicrophoneEnabled(false);
    } else {
      await room.localParticipant.setMicrophoneEnabled(true);
    }
  }

  return (
    <button
      onClick={toggleMic}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
        isMicEnabled
          ? "bg-white text-slate-900 border-white/20 shadow-lg"
          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30"
      }`}
    >
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
    </button>
  );
}

function ChatList({ messages }: { messages: ChatMessage[] }) {
  const [atBottom, setAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (atBottom) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, atBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={(e: any) => {
        const el = e.currentTarget as HTMLDivElement;
        const nearBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        setAtBottom(nearBottom);
      }}
      className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-blue-300/60">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <HiChatBubbleLeftRight className="h-6 w-6 text-blue-400" />
          </div>
          <p className="font-medium">No messages yet</p>
          <p className="text-sm text-blue-400/40 mt-1">
            Be the first to say hello!
          </p>
        </div>
      ) : (
        messages.map((m) => (
          <div key={m.id} className="group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {m.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-white text-sm">
                  {m.author}
                </span>
                <span className="text-blue-300/60 text-xs">{m.at}</span>
              </div>
            </div>
            <div className="ml-9 relative">
              <div className="inline-block max-w-full rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-blue-500/10 px-4 py-2.5 text-white/90 backdrop-blur-sm">
                {m.text}
              </div>
            </div>
          </div>
        ))
      )}
      {!atBottom && messages.length > 0 ? (
        <button
          onClick={() => {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="sticky bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 text-xs font-medium shadow-lg border border-blue-400/20 backdrop-blur-sm flex items-center gap-2"
        >
          <HiChevronDown className="h-3 w-3" />
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
