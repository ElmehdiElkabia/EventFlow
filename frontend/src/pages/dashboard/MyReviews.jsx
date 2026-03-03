import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Search, Loader2, AlertCircle, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { userService, ticketService } from "@/services/userService";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    event_id: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
    fetchAttendedEvents();
  }, []);

  const fetchAttendedEvents = async () => {
    try {
      const response = await ticketService.getMyTickets();
      const tickets = response?.data || [];
      // Get unique events from tickets
      const uniqueEvents = tickets.reduce((acc, ticket) => {
        if (!acc.find(e => e.id === ticket.event_id)) {
          acc.push({
            id: ticket.event_id,
            title: ticket.eventTitle
          });
        }
        return acc;
      }, []);
      setAttendedEvents(uniqueEvents);
    } catch (err) {
      console.error("Failed to fetch attended events:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getReviews();
      setReviews(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      const errorMsg = err.response?.data?.message || "Failed to load reviews";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!formData.event_id) {
      toast.error("Please select an event");
      return;
    }
    
    if (!formData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      await userService.createReview(formData);
      toast.success("Review submitted successfully!");
      setDialogOpen(false);
      setFormData({ event_id: "", rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error("Failed to submit review:", err);
      const errorMsg = err.response?.data?.message || "Failed to submit review";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) =>
    review.event_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchReviews}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Reviews</h1>
            <p className="text-muted-foreground">Manage your event reviews and ratings</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmitReview}>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience at the event
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="event">Select Event</Label>
                    <Select
                      value={formData.event_id}
                      onValueChange={(value) => setFormData({ ...formData, event_id: value })}
                    >
                      <SelectTrigger id="event">
                        <SelectValue placeholder="Choose an event you attended" />
                      </SelectTrigger>
                      <SelectContent>
                        {attendedEvents.map((event) => (
                          <SelectItem key={event.id} value={String(event.id)}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              star <= formData.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts about the event..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredReviews.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No reviews match your search"
                  : "You haven't written any reviews yet. Attend events and share your experience!"}
              </p>
              {!searchQuery && (
                <Button variant="hero" onClick={() => (window.location.href = "/events")}>
                  Browse Events
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {review.event_title}
                          </h3>
                          {renderStars(review.rating)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;
