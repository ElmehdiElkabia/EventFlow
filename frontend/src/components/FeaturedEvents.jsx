import EventCard from "./EventCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Sample events data
const featuredEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    description: "Join industry leaders for a day of insights, networking, and breakthrough technologies shaping our future.",
    date: "Dec 15, 2024",
    time: "9:00 AM",
    location: "San Francisco Convention Center",
    price: 299,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    category: "Technology",
    attendees: 450,
    capacity: 500,
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    title: "Electronic Music Festival",
    description: "Three days of non-stop electronic beats from world-renowned DJs in an immersive environment.",
    date: "Dec 20, 2024",
    time: "6:00 PM",
    location: "Miami Beach Amphitheater",
    price: 150,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
    category: "Music",
    attendees: 2800,
    capacity: 3000,
    rating: 4.9,
    featured: true,
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    description: "Watch the next generation of entrepreneurs compete for $100K in funding and mentorship opportunities.",
    date: "Dec 18, 2024",
    time: "2:00 PM",
    location: "Austin Innovation Hub",
    price: 0,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    category: "Business",
    attendees: 180,
    capacity: 200,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Contemporary Art Exhibition",
    description: "Explore cutting-edge works from emerging artists pushing the boundaries of modern expression.",
    date: "Dec 22, 2024",
    time: "10:00 AM",
    location: "Metropolitan Gallery NYC",
    price: 25,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    category: "Arts",
    attendees: 85,
    capacity: 150,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Gourmet Food & Wine Festival",
    description: "Savor exquisite cuisines and fine wines from top chefs and vineyards around the world.",
    date: "Dec 28, 2024",
    time: "12:00 PM",
    location: "Napa Valley Estates",
    price: 175,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    category: "Food & Drink",
    attendees: 320,
    capacity: 400,
    rating: 4.8,
  },
  {
    id: "6",
    title: "Yoga & Wellness Retreat",
    description: "A transformative weekend of mindfulness, yoga sessions, and holistic wellness practices.",
    date: "Jan 5, 2025",
    time: "7:00 AM",
    location: "Sedona Retreat Center",
    price: 450,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800",
    category: "Health",
    attendees: 45,
    capacity: 50,
    rating: 4.9,
  },
];

const FeaturedEvents = () => {
  return (
    <section className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Featured</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Trending Events
            </h2>
            <p className="text-muted-foreground">
              Don't miss out on the hottest events happening now
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button variant="outline" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
