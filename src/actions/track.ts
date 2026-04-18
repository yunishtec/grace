'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { savedTracks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveTrackAction(track: { youtubeVideoId: string; title: string; thumbnailUrl: string; channel: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED_NODE_ACCESS");
  }

  // Check if track already exists for this user to prevent duplicates
  const existing = await db
    .select()
    .from(savedTracks)
    .where(
       and(
         eq(savedTracks.userId, session.user.id),
         eq(savedTracks.youtubeVideoId, track.youtubeVideoId)
       )
    );

  if (existing.length > 0) {
    return { success: true, message: "Track already exists in Library" };
  }

  // Insert novel track data
  await db.insert(savedTracks).values({
    userId: session.user.id,
    youtubeVideoId: track.youtubeVideoId,
    title: track.title,
    // Add channel to Title or handle in schema if needed. Merging for brevity based on requested schema.
    thumbnailUrl: track.thumbnailUrl,
  });

  revalidatePath('/saved');
  return { success: true };
}

export async function fetchSavedTracksAction() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED_NODE_ACCESS");
  }

  const tracks = await db
    .select()
    .from(savedTracks)
    .where(eq(savedTracks.userId, session.user.id));
    
  return tracks.map(t => ({
     id: t.youtubeVideoId,
     title: t.title,
     thumbnail: t.thumbnailUrl,
     channel: 'LIBRARY_SYNC' // Placeholder for channel if not in DB
  }));
}

export async function removeTrackAction(youtubeVideoId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED_NODE_ACCESS");
  }

  await db.delete(savedTracks).where(
     and(
       eq(savedTracks.userId, session.user.id),
       eq(savedTracks.youtubeVideoId, youtubeVideoId)
     )
  );

  revalidatePath('/saved');
  return { success: true };
}
