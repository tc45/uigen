"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/create-project";
import { removeFavorite } from "@/actions/favorites";

interface FavoriteCardProps {
  id: string;
  name: string;
  userEmail: string | null;
  createdAt: Date;
  data: string;
  currentUserId?: string | null;
  favoriteUserId?: string | null;
}

export function FavoriteCard({
  id,
  name,
  userEmail,
  createdAt,
  data,
  currentUserId,
  favoriteUserId,
}: FavoriteCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const canDelete = currentUserId && currentUserId === favoriteUserId;

  const handleLoad = async () => {
    setLoading(true);
    try {
      const parsedData = JSON.parse(data);
      const project = await createProject({
        name: `${name} (from favorites)`,
        messages: [],
        data: parsedData,
      });
      router.push(`/${project.id}`);
    } catch (error) {
      console.error("Failed to load favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeFavorite(id);
      setRemoved(true);
    } finally {
      setRemoving(false);
    }
  };

  if (removed) return null;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border border-border rounded-lg p-4 bg-card flex flex-col gap-3 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
          <h3 className="font-medium text-foreground truncate">{name}</h3>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
            onClick={handleRemove}
            disabled={removing}
            title="Remove from favorites"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>By {userEmail ?? "Anonymous"}</p>
        <p>{formattedDate}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 mt-auto"
        onClick={handleLoad}
        disabled={loading || !currentUserId}
        title={!currentUserId ? "Sign in to load this component" : "Open in editor"}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {loading ? "Loading..." : "Open in Editor"}
      </Button>
    </div>
  );
}
