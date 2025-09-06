"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type Comment = { id: string; author: string; text: string; at: string };

export default function ArchiveDetailPage() {
  const params = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  async function addComment() {
    const comment = text.trim();
    if (!comment) return;
    const supabase = createClient();
    await supabase
      .from("video_comments")
      .insert({ video_id: params.id, comment });
    setText("");
  }

  useEffect(() => {
    const supabase = createClient();
    const videoId = params.id;
    supabase
      .from("video_comments")
      .select("id, user_name, comment, created_at")
      .eq("video_id", videoId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setComments(
            data.map((d: any) => ({
              id: d.id,
              author: d.user_name ?? "Member",
              text: d.comment,
              at: new Date(d.created_at).toLocaleString(),
            }))
          );
        }
      });
    const channel = supabase
      .channel("video-comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "video_comments",
          filter: `video_id=eq.${videoId}`,
        },
        (payload) => {
          const d: any = payload.new;
          setComments((prev) => [
            ...prev,
            {
              id: d.id,
              author: d.user_name ?? "Member",
              text: d.comment,
              at: new Date(d.created_at).toLocaleString(),
            },
          ]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  return (
    <div className="min-h-screen px-6 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <a href="/archive" className="hover:text-white">
            Archive
          </a>
          <span>/</span>
          <span className="text-white">Class {params.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/archive"
            className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm"
          >
            Back
          </a>
          <button className="rounded-lg bg-white text-neutral-900 px-3 py-1.5 text-sm">
            Mark Complete
          </button>
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="relative w-full aspect-video bg-black/60 flex items-center justify-center">
          <span className="text-white/60">VOD player placeholder</span>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-medium text-white/90">{c.author}</span>
                  <span className="text-white/40 px-2">{c.at}</span>
                  <div className="text-white/80">{c.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment"
                rows={4}
              />
              <Button onClick={addComment}>Post comment</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-white/80 text-sm">
              <li>PDF notes (coming soon)</li>
              <li>Links and references</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
