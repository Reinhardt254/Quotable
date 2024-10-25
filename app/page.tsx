"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const categories = ["Inspiration", "Success", "Life", "Love", "Wisdom"];

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (quoteId: number) => {
    const newFavorites = favorites.includes(quoteId)
      ? favorites.filter(id => id !== quoteId)
      : [...favorites, quoteId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(quoteId) ? "Removed from favorites" : "Added to favorites",
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

  const filteredQuotes = selectedCategory === "All"
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Daily Inspiration</h1>
        <p className="text-muted-foreground">
          Discover wisdom from the world's greatest minds
        </p>
      </section>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuotes.map((quote) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
                  onClick={() => toggleFavorite(quote.id)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(quote.id) ? "fill-current text-red-500" : ""
                    }`}
                  />
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
      </div>

      <div className="mt-12 text-center">
        <Button className="group">
          Load More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}