"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import NextClassBanner from "@/components/NextClassBanner";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";

type ChatMessage = { id: string; author: string; text: string; at: string };
import { createClient } from "@/lib/supabase/client";

export default function LivePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [viewerCount] = useState<number>(128); // placeholder

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 p-4 lg:p-6">
      <div className="lg:col-span-2 -mt-2">
        <NextClassBanner />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 text-red-300 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live now
            </span>
            <h1 className="text-lg font-semibold">Elyrion Class</h1>
          </div>
          <div className="text-white/60 text-sm">Viewers: {viewerCount}</div>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="relative w-full aspect-video bg-black/60">
            {livekit.url && livekit.token ? (
              <LiveKitRoom
                serverUrl={livekit.url}
                token={livekit.token}
                connect
                audio
              >
                <RoomAudioRenderer />
                <VideoGrid />
              </LiveKitRoom>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/60">Connecting…</span>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button variant="secondary">Reactions</Button>
          <Button variant="outline">Report Issue</Button>
        </div>
      </div>

      <Card className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ChatList messages={messages} />
          <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
            <Input
              placeholder="Say something nice..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function VideoGrid() {
  const tracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: true,
    },
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
      className="flex-1 overflow-y-auto space-y-3 pr-1"
    >
      {messages.map((m) => (
        <div key={m.id} className="text-sm">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-white/90">{m.author}</span>
            <span className="text-white/40 text-xs">{m.at}</span>
          </div>
          <div className="mt-1 inline-block max-w-full rounded-lg bg-white/10 px-3 py-2 text-white/90">
            {m.text}
          </div>
        </div>
      ))}
      {!atBottom ? (
        <button
          onClick={() => {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="sticky bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white text-neutral-900 px-3 py-1 text-xs font-medium shadow"
        >
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
