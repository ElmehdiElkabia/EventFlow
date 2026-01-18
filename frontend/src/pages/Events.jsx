import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Arts",
  "Food & Drink",
  "Sports",
  "Health",
  "Education",
];

const allEvents = [
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
	featured: false,
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
	featured: true,
  },
  {
    id: "7",
    title: "AI & Machine Learning Conference",
    description: "Deep dive into the latest advancements in artificial intelligence with top researchers and practitioners.",
    date: "Jan 10, 2025",
    time: "9:00 AM",
    location: "Boston Tech Center",
    price: 399,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    category: "Technology",
    attendees: 380,
    capacity: 400,
    rating: 4.9,
  },
  {
    id: "8",
    title: "Jazz Night Under the Stars",
    description: "An enchanting evening of smooth jazz performances in a beautiful outdoor amphitheater.",
    date: "Jan 15, 2025",
    time: "7:00 PM",
    location: "Central Park Amphitheater",
    price: 85,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
    category: "Music",
    attendees: 600,
    capacity: 800,
    rating: 4.7,
  },
  {
    id: "9",
    title: "Marathon City Run 2025",
    description: "Join thousands of runners in the annual city marathon. All skill levels welcome!",
    date: "Jan 20, 2025",
    time: "6:00 AM",
    location: "City Center Plaza",
    price: 50,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
    category: "Sports",
    attendees: 4500,
    capacity: 5000,
    rating: 4.8,
  },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Discover Events
            </h1>
            <p className="text-muted-foreground text-lg">
              Find your next unforgettable experience
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, venues, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
             
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredEvents.length}</span> events
            </p>
            {selectedCategory !== "All" && (
              <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedCategory("All")}>
                {selectedCategory}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No events found</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
