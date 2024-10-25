"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Success"
  },
  {
    id: 2,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life"
  },
  // Add more quotes as needed
];

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFromFavorites = (quoteId: number) => {
    const newFavorites = favorites.filter(id => id !== quoteId);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    
    toast({
      title: "Removed from favorites",
      duration: 2000,
    });
  };

  const shareQuote = async (quote: { text: string; author: string }) => {
    try {
      await navigator.share({
        text: `"${quote.text}" - ${quote.author}`,
      });
    } catch (error) {
      toast({
        title: "Copied to clipboard!",
        duration: 2000,
      });
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    }
  };

  const favoriteQuotes = quotes.filter(quote => favorites.includes(quote.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Favorite Quotes</h1>
        <p className="text-muted-foreground">
          {favoriteQuotes.length === 0
            ? "Start collecting your favorite quotes!"
            : "Your personal collection of inspiring quotes"}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {favoriteQuotes.map((quote) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col justify-between">
                <div>
                  <p className="text-lg mb-4">&ldquo;{quote.text}&rdquo;</p>
                  <p className="text-sm text-muted-foreground">- {quote.author}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromFavorites(quote.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => shareQuote(quote)}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {favoriteQuotes.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            You haven't saved any quotes yet.
          </p>
          <Button href="/" variant="default">
            Discover Quotes
          </Button>
        </div>
      )}
    </div>
  );
}