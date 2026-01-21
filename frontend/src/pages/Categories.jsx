import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/publicService";
import { toast } from "sonner";
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

// Icon mapping for categories
const iconMap = {
  'music': Music,
  'art': Palette,
  'sports': Dumbbell,
  'tech': Lightbulb,
  'food': Utensils,
  'business': Briefcase,
  'education': GraduationCap,
  'charity': Heart,
  'photography': Camera,
  'gaming': Gamepad2,
  'travel': Plane,
  'outdoor': TreePine,
};

// Gradient mapping for categories
const gradientMap = {
  'music': 'from-pink-500 to-rose-500',
  'art': 'from-purple-500 to-indigo-500',
  'sports': 'from-green-500 to-emerald-500',
  'tech': 'from-blue-500 to-cyan-500',
  'food': 'from-orange-500 to-amber-500',
  'business': 'from-slate-500 to-zinc-500',
  'education': 'from-teal-500 to-cyan-500',
  'charity': 'from-red-500 to-pink-500',
  'photography': 'from-violet-500 to-purple-500',
  'gaming': 'from-fuchsia-500 to-pink-500',
  'travel': 'from-sky-500 to-blue-500',
  'outdoor': 'from-lime-500 to-green-500',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Failed to load categories');
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
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
            {categories.map((category, index) => {
              const Icon = iconMap[category.name.toLowerCase()] || Music;
              const gradient = gradientMap[category.name.toLowerCase()] || 'from-pink-500 to-rose-500';

              return (
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
                      <div className="w-full h-full bg-primary/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors text-foreground">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            Browse events in this category
                          </p>
                          <span className="text-sm font-medium text-primary">
                            View Category
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-opacity pointer-events-none`} />
                  </Link>
                </motion.div>
              );
            })}
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
