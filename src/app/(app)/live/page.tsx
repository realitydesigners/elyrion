"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  useRoomContext,
  useParticipants,
  useConnectionState,
  VideoTrack,
  TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  HiPlay,
  HiUsers,
  HiChatBubbleLeftRight,
  HiPaperAirplane,
  HiChevronDown,
  HiMicrophone,
  HiOutlineMicrophone,
  HiXMark,
} from "react-icons/hi2";
import { createClient } from "@/lib/supabase/client";

type ChatMessage = { id: string; author: string; text: string; at: string };

export default function LivePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [livekit, setLivekit] = useState<{
    url?: string;
    token?: string;
    roomName?: string;
  }>({});

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

  useEffect(() => {
    fetch(`/api/livekit/token?role=viewer`)
      .then((r) => r.json())
      .then(setLivekit)
      .catch(() => setLivekit({}));
  }, []);

  useEffect(() => {
    if (!livekit.roomName) return;
    const supabase = createClient();
    const room = livekit.roomName;

    supabase
      .from("chat_messages")
      .select("id, user_name, message, created_at")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setMessages(
            data.map(
              (d: {
                id: string;
                user_name: string | null;
                message: string;
                created_at: string;
              }) => ({
                id: d.id,
                author: d.user_name ?? "Member",
                text: d.message,
                at: new Date(d.created_at).toLocaleTimeString(),
              })
            )
          );
        }
      });

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
          const d = payload.new as {
            id: string;
            user_name: string | null;
            message: string;
            created_at: string;
          };
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

  if (!livekit.url || !livekit.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-300 font-medium">Connecting to stream...</p>
          <p className="text-blue-400/60 text-sm">
            Please wait while we establish connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={livekit.url}
      token={livekit.token}
      connect
      audio
      video={false}
      className="h-screen w-full"
    >
      <div className="flex flex-col h-screen bg-slate-900">
        <RoomAudioRenderer />
        <LivePageContent
          messages={messages}
          chatText={chatText}
          setChatText={setChatText}
          sendMessage={sendMessage}
          showChat={showChat}
          setShowChat={setShowChat}
        />
      </div>
    </LiveKitRoom>
  );
}

function LivePageContent({
  messages,
  chatText,
  setChatText,
  sendMessage,
  showChat,
  setShowChat,
}: {
  messages: ChatMessage[];
  chatText: string;
  setChatText: (text: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}) {
  const participants = useParticipants();
  const connectionState = useConnectionState();
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const videoTracks = tracks.filter(
    (track): track is TrackReference =>
      track.publication !== undefined &&
      track.publication.trackSid !== undefined &&
      (track.source === Track.Source.ScreenShare ||
        track.source === Track.Source.Camera)
  );

  const isConnected = connectionState === "connected";

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-blue-500/20 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-300 font-medium text-sm">LIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className="relative p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <HiChatBubbleLeftRight className="h-5 w-5 text-blue-400" />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {messages.length > 9 ? "9+" : messages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-black relative">
          {!isConnected ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-blue-300 font-medium">Connecting...</p>
              </div>
            </div>
          ) : videoTracks.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center space-y-4 p-6">
                <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <HiPlay className="h-8 w-8 text-blue-400" />
                </div>
                <p className="font-medium text-white">Waiting for stream</p>
                <p className="text-sm text-blue-400/60">
                  The instructor will begin shortly
                </p>
              </div>
            </div>
          ) : (
            <VideoGridProfessional tracks={videoTracks} />
          )}

          {/* Controls Overlay - Mobile */}
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <ViewerControlsMobile />
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex absolute bottom-4 left-4 right-4 items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <ViewerControlsDesktop />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-500/20 bg-black/80 backdrop-blur-sm">
                <HiUsers className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300 font-medium text-sm">
                  {participants.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 bg-black/80 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-red-300 font-medium text-sm">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel - Desktop */}
        {showChat && (
          <div className="hidden lg:flex flex-col w-full lg:w-96 border-l border-blue-500/20 bg-slate-800/80 backdrop-blur-sm">
            <ChatPanel
              messages={messages}
              chatText={chatText}
              setChatText={setChatText}
              sendMessage={sendMessage}
            />
          </div>
        )}

        {/* Chat Panel - Mobile (Overlay) */}
        {showChat && (
          <div className="lg:hidden absolute inset-0 z-20 flex flex-col bg-slate-900">
            <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
              <h3 className="font-semibold text-white">Live Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 rounded-lg hover:bg-slate-800"
              >
                <HiXMark className="h-5 w-5 text-white" />
              </button>
            </div>
            <ChatPanel
              messages={messages}
              chatText={chatText}
              setChatText={setChatText}
              sendMessage={sendMessage}
            />
          </div>
        )}
      </div>
    </>
  );
}

function VideoGridProfessional({ tracks }: { tracks: TrackReference[] }) {
  if (tracks.length === 0) return null;

  const screenShareTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare
  );
  const cameraTrack = tracks.find((t) => t.source === Track.Source.Camera);

  return (
    <div className="w-full h-full relative">
      {screenShareTrack && (
        <div className="absolute inset-0">
          <VideoTrack
            trackRef={screenShareTrack}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-white text-xs font-medium">Screen Share</span>
          </div>
        </div>
      )}
      {cameraTrack && (
        <div
          className={`absolute ${
            screenShareTrack
              ? "bottom-4 right-4 w-64 h-48 md:w-80 md:h-60 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl"
              : "inset-0"
          }`}
        >
          <VideoTrack
            trackRef={cameraTrack}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-white text-xs font-medium">Instructor</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewerControlsMobile() {
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
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all duration-200 touch-manipulation ${
        isMicEnabled
          ? "bg-white text-slate-900 border-white/20 shadow-lg"
          : "bg-slate-700/90 text-slate-300 border-slate-600/30"
      }`}
    >
      {isMicEnabled ? (
        <>
          <HiMicrophone className="h-5 w-5" />
          <span className="hidden sm:inline">Mic On</span>
        </>
      ) : (
        <>
          <HiOutlineMicrophone className="h-5 w-5" />
          <span className="hidden sm:inline">Mic Off</span>
        </>
      )}
    </button>
  );
}

function ViewerControlsDesktop() {
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

function ChatPanel({
  messages,
  chatText,
  setChatText,
  sendMessage,
}: {
  messages: ChatMessage[];
  chatText: string;
  setChatText: (text: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}) {
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
    <>
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

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div
          ref={containerRef}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
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
          {!atBottom && messages.length > 0 && (
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
          )}
        </div>
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-6 touch-manipulation"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
