import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Music, 
  Palette, 
  Dumbbell, 
  Lightbulb, 
  Utensils, 
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Gamepad2,
  Plane,
  TreePine
} from "lucide-react";

const categories = [
  {
    id: "music",
    name: "Music & Concerts",
    icon: Music,
    count: 1250,
    description: "Live performances, festivals, and musical gatherings",
    gradient: "from-pink-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop"
  },
  {
    id: "art",
    name: "Art & Culture",
    icon: Palette,
    count: 890,
    description: "Exhibitions, galleries, and cultural experiences",
    gradient: "from-purple-500 to-indigo-500",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop"
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: Dumbbell,
    count: 720,
    description: "Competitions, marathons, and fitness classes",
    gradient: "from-green-500 to-emerald-500",
    image: "https://images.unsplash.com/photo-1461896836934- voices?w=400&h=300&fit=crop"
  },
  {
    id: "tech",
    name: "Technology",
    icon: Lightbulb,
    count: 560,
    description: "Tech conferences, hackathons, and innovation meetups",
    gradient: "from-blue-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
  },
  {
    id: "food",
    name: "Food & Drink",
    icon: Utensils,
    count: 480,
    description: "Culinary experiences, tastings, and food festivals",
    gradient: "from-orange-500 to-amber-500",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    count: 340,
    description: "Networking events, seminars, and professional development",
    gradient: "from-slate-500 to-zinc-500",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop"
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    count: 290,
    description: "Workshops, courses, and learning experiences",
    gradient: "from-teal-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop"
  },
  {
    id: "charity",
    name: "Charity & Causes",
    icon: Heart,
    count: 180,
    description: "Fundraisers, volunteer events, and community initiatives",
    gradient: "from-red-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    count: 150,
    description: "Photo walks, exhibitions, and photography workshops",
    gradient: "from-violet-500 to-purple-500",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop"
  },
  {
    id: "gaming",
    name: "Gaming & Esports",
    icon: Gamepad2,
    count: 220,
    description: "Gaming tournaments, LAN parties, and esports events",
    gradient: "from-fuchsia-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
  },
  {
    id: "travel",
    name: "Travel & Adventure",
    icon: Plane,
    count: 130,
    description: "Group trips, adventure tours, and travel meetups",
    gradient: "from-sky-500 to-blue-500",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop"
  },
  {
    id: "outdoor",
    name: "Outdoor & Nature",
    icon: TreePine,
    count: 200,
    description: "Hiking groups, nature walks, and outdoor activities",
    gradient: "from-lime-500 to-green-500",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Browse by <span className="text-gradient">Category</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover events that match your interests. From music festivals to tech conferences, 
              find your perfect experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link
                  to={`/events?category=${category.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity ">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {category.description}
                        </p>
                        <span className="text-sm font-medium text-primary">
                          {category.count.toLocaleString()} events
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${category.gradient} transition-opacity pointer-events-none`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/50 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse all our events or use the search feature to find exactly what you need.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
            >
              View All Events
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
