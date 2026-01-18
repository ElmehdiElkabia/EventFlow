import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Sample event data (would come from API)
const eventData = {
  id: "1",
  title: "Tech Innovation Summit 2024",
  description: `Join us for the most anticipated technology conference of the year! The Tech Innovation Summit 2024 brings together industry leaders, visionary entrepreneurs, and tech enthusiasts for a day of insights, networking, and breakthrough discoveries.

Explore the latest advancements in AI, blockchain, quantum computing, and sustainable technology. Hear from keynote speakers who are shaping the future of tech, participate in hands-on workshops, and connect with like-minded professionals.

What to expect:
• Keynote speeches from Fortune 500 tech executives
• Panel discussions on emerging technologies
• Interactive workshops and demos
• Networking sessions with industry leaders
• Exclusive product launches and announcements`,
  date: "December 15, 2024",
  time: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center",
  address: "747 Howard St, San Francisco, CA 94103",
  price: 299,
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
  category: "Technology",
  attendees: 450,
  capacity: 500,
  rating: 4.8,
  reviewCount: 128,
  organizer: {
    name: "TechEvents Global",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    verified: true,
    eventsHosted: 45,
  },
  highlights: [
    "15+ Expert Speakers",
    "Networking Lunch Included",
    "Workshop Materials",
    "Certificate of Attendance",
    "Exclusive Swag Bag",
  ],
};

const EventDetail = () => {
  const { id } = useParams();
  const [ticketCount, setTicketCount] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const spotsLeft = eventData.capacity - eventData.attendees;
  const totalPrice = eventData.price * ticketCount;

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
                    <Badge variant="glass">{eventData.category}</Badge>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{eventData.rating}</span>
                      <span className="text-muted-foreground text-sm">({eventData.reviewCount} reviews)</span>
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

                {/* Highlights */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {eventData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organizer */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Organizer</h2>
                  <Card variant="glass">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={eventData.organizer.avatar}
                          alt={eventData.organizer.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{eventData.organizer.name}</p>
                            {eventData.organizer.verified && (
                              <Badge variant="success" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {eventData.organizer.eventsHosted} events hosted
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Follow</Button>
                    </CardContent>
                  </Card>
                </div>
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
                          ${eventData.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5" />
                        <span>{spotsLeft} spots left</span>
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
