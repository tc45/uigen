"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import { addFavorite } from "@/actions/favorites";

interface FavoriteButtonProps {
  user?: { id: string; email: string } | null;
  projectName?: string;
}

export function FavoriteButton({ user, projectName }: FavoriteButtonProps) {
  const { fileSystem } = useFileSystem();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user) return;

    const files = fileSystem.getAllFiles();
    if (files.size === 0) return;

    setLoading(true);
    try {
      const data = JSON.stringify(fileSystem.serialize());
      const result = await addFavorite({
        name: projectName || "Untitled Component",
        data,
      });
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground cursor-not-allowed opacity-50"
        title="Sign in to add favorites"
        disabled
      >
        <Heart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 transition-colors ${saved ? "text-red-500 hover:text-red-500" : "text-muted-foreground hover:text-red-400"}`}
      title={saved ? "Added to favorites!" : "Add to favorites"}
      onClick={handleFavorite}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 transition-all ${saved ? "fill-current scale-110" : ""}`} />
    </Button>
  );
}
