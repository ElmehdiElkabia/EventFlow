import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Search,
  Edit,
  Trash2,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const mockReviews = [
  {
    id: "1",
    event: "Electronic Music Festival",
    eventImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
    rating: 5,
    comment:
      "Absolutely incredible experience! The lineup was amazing, the production was top-notch, and the crowd energy was unmatched. Can't wait for next year!",
    date: "2024-12-05T10:30:00",
    helpful: 24,
  },
  {
    id: "2",
    event: "Tech Innovation Summit",
    eventImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    rating: 4,
    comment:
      "Great speakers and valuable insights. Networking opportunities were excellent. The only downside was the long registration queue.",
    date: "2024-11-28T15:20:00",
    helpful: 12,
  },
  {
    id: "3",
    event: "Art Exhibition Opening",
    eventImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400",
    rating: 5,
    comment:
      "A beautiful collection of contemporary art. The venue was stunning and the artists were present to discuss their work. Highly recommend!",
    date: "2024-11-15T19:45:00",
    helpful: 8,
  },
];

const MyReviews = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  const filteredReviews = reviews.filter((review) =>
    review.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingReview) {
      setReviews(
        reviews.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: editForm.rating, comment: editForm.comment }
            : r
        )
      );
      toast.success("Review updated successfully");
      setEditDialogOpen(false);
    }
  };

  const handleDelete = (id) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      setReviews(reviews.filter((r) => r.id !== reviewToDelete));
      toast.success("Review deleted");
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setEditForm({ ...editForm, rating: star })}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Reviews</h1>
          <p className="text-muted-foreground">Manage your event reviews and ratings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2 fill-primary" />
              <p className="text-2xl font-bold text-foreground">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <ThumbsUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {reviews.reduce((acc, r) => acc + r.helpful, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Helpful Votes</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {reviews.filter((r) => r.rating === 5).length}
              </p>
              <p className="text-sm text-muted-foreground">5-Star Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-32 sm:h-auto relative overflow-hidden">
                    <img
                      src={review.eventImage}
                      alt={review.event}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          {renderStars(review.rating)}
                          <Badge variant="secondary">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {review.helpful} helpful
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{review.event}</h3>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(review)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Attend events and share your experience"}
            </p>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Rating</label>
                <div className="mt-2">{renderStars(editForm.rating, true)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Your Review</label>
                <Textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
              <Button variant="hero" className="w-full" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this review? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;
