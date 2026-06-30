import { getAllFavorites } from "@/actions/favorites";
import { getUser } from "@/actions";
import { FavoriteCard } from "@/components/favorites/FavoriteCard";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FavoritesPage() {
  const [favorites, user] = await Promise.all([getAllFavorites(), getUser()]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <h1 className="text-xl font-semibold text-foreground">
              Favorite Components
            </h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {favorites.length} saved
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Generate a component and click the heart icon in the preview to
              save it here.
            </p>
            <Link
              href="/"
              className="mt-4 text-sm text-primary hover:underline"
            >
              Start generating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite.id}
                id={favorite.id}
                name={favorite.name}
                userEmail={favorite.userEmail}
                createdAt={favorite.createdAt}
                data={favorite.data}
                currentUserId={user?.id ?? null}
                favoriteUserId={favorite.userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
