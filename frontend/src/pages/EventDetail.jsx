import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  Share2,
  Heart,
  Ticket,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { eventService } from "@/services/publicService";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvent(id);
        
        // API returns: { success: true, message: "Success", data: {...} }
        setEventData(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Failed to load event');
        toast.error('Event not found');
        
        // Redirect to events page if event not found
        if (err.response?.status === 404) {
          setTimeout(() => navigate('/events'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-background dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <p className="text-muted-foreground mb-4">{error || 'Event not found'}</p>
          <Button variant="outline" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const spotsLeft = eventData.capacity - eventData.highlights.attendees;
  const totalPrice = (eventData.ticketTypes?.[0]?.price || 0) * ticketCount;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleBuyTickets = () => {
    toast.success("Redirecting to checkout...");
    // TODO: Implement checkout flow
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />

      <main className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
          <img
            src={eventData.image}
            alt={eventData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button variant="glass" size="sm" asChild>
              <Link to="/events">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="glass" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={handleWishlist}
              className={isWishlisted ? "text-red-500" : ""}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Title Section */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="glass">{eventData.category?.name || eventData.category}</Badge>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{eventData.highlights?.rating || 0}</span>
                      <span className="text-muted-foreground text-sm">({eventData.highlights?.reviews || 0} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    {eventData.title}
                  </h1>
                </div>

                {/* Event Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <Card variant="glass">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{eventData.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="glass">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium text-foreground">{eventData.time}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="glass" className="sm:col-span-2">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{eventData.location}</p>
                        <p className="text-sm text-muted-foreground">{eventData.address}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About This Event</h2>
                  <div className="prose prose-invert max-w-none">
                    {eventData.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* What's Included */}
                {eventData.ticketTypes && eventData.ticketTypes.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Ticket Types</h2>
                    <div className="space-y-3">
                      {eventData.ticketTypes.map((ticketType) => (
                        <Card key={ticketType.id} variant="glass">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{ticketType.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Available: {ticketType.quantity - ticketType.sold}
                                </p>
                              </div>
                              <p className="text-lg font-bold text-primary">${ticketType.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Ticket Purchase */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <Card variant="elevated" className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Price per ticket</p>
                        <p className="text-3xl font-bold text-foreground">
                          ${eventData.ticketTypes?.[0]?.price || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5" />
                        <span>{spotsLeft > 0 ? spotsLeft : 0} spots left</span>
                      </div>
                    </div>

                    {/* Ticket Quantity */}
                    <div className="mb-6">
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Number of tickets
                      </label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          disabled={ticketCount <= 1}
                        >
                          -
                        </Button>
                        <span className="text-xl font-semibold text-foreground w-12 text-center">
                          {ticketCount}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                          disabled={ticketCount >= 10 || ticketCount >= spotsLeft}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-2xl font-bold text-foreground">${totalPrice}</span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleBuyTickets}
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Get Tickets
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Secure checkout • Instant confirmation
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
