"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { reviews, getInitials, getAverageRating, Review } from "@/data/reviews";

const VISIBLE_COUNT = 3; // Cards visible at once on desktop
const AUTO_CYCLE_INTERVAL = 4000; // ms

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="p-5 h-full flex flex-col border-border/40 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
      <Quote className="h-6 w-6 text-blue-200 mb-3 shrink-0" />
      <p className="text-sm text-foreground/80 leading-relaxed flex-1 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shrink-0">
          {getInitials(review.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{review.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {review.location} • {review.route}
          </p>
        </div>
        <StarRating rating={review.rating} size={12} />
      </div>
    </Card>
  );
}

function ReviewFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [route, setRoute] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      location: location.trim() || "India",
      route: route.trim() || "—",
      rating,
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    onSubmit(newReview);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setLocation("");
      setRoute("");
      setRating(5);
      setText("");
      onClose();
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <Star className="h-8 w-8 text-green-600 fill-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your review has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">Share Your Experience</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your booking experience
              </p>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium mb-1 block">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i + 1)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        i < (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted-foreground/30"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Route</label>
                <input
                  type="text"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  placeholder="e.g. DEL → BOM"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience with Gola Bhai Travels..."
                rows={3}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Review
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [displayReviews, setDisplayReviews] = useState<Review[]>([]);

  // Initialize with shuffled reviews
  useEffect(() => {
    const shuffled = [...reviews].sort(() => Math.random() - 0.5);
    setDisplayReviews(shuffled);
  }, []);

  const maxIndex = Math.max(0, displayReviews.length - VISIBLE_COUNT);

  // Auto-cycle
  useEffect(() => {
    if (isPaused || displayReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, displayReviews.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNewReview = (review: Review) => {
    setDisplayReviews((prev) => [review, ...prev]);
    setCurrentIndex(0);
  };

  const avgRating = getAverageRating();
  const visibleCards = displayReviews.slice(currentIndex, currentIndex + VISIBLE_COUNT);

  // Handle edge case when we're near the end
  if (visibleCards.length < VISIBLE_COUNT && displayReviews.length >= VISIBLE_COUNT) {
    const needed = VISIBLE_COUNT - visibleCards.length;
    visibleCards.push(...displayReviews.slice(0, needed));
  }

  return (
    <section
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <StarRating rating={5} size={20} />
            <span className="text-sm font-semibold text-yellow-600">
              {avgRating} out of 5
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Loved by Travelers Across India
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Over {reviews.length}+ happy customers have booked their flights with us.
            Here&apos;s what they say.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goPrev}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border/60 shadow-md hover:shadow-lg hover:bg-blue-50 transition-all"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 sm:px-8">
            {visibleCards.map((review) => (
              <div key={`${review.id}-${currentIndex}`} className="animate-in fade-in slide-in-from-right-2 duration-500">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          <button
            onClick={goNext}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border/60 shadow-md hover:shadow-lg hover:bg-blue-50 transition-all"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: Math.min(10, Math.ceil(displayReviews.length / VISIBLE_COUNT)) }).map((_, i) => {
            const groupIndex = i * VISIBLE_COUNT;
            const isActive = currentIndex >= groupIndex && currentIndex < groupIndex + VISIBLE_COUNT;
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(groupIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-blue-600" : "w-2 bg-blue-600/20 hover:bg-blue-600/40"
                }`}
                aria-label={`Go to review group ${i + 1}`}
              />
            );
          })}
        </div>

        {/* Write Review CTA */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setIsFormOpen(true)}
            className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleNewReview}
      />
    </section>
  );
}
