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
  TreePine,
  Code,
  UtensilsCrossed,
  FolderOpen,
  BookOpen,
  Trophy,
  Film,
  Megaphone,
  Users,
  Sparkles,
  Coffee,
  ShoppingBag,
  Mic,
  PartyPopper,
  Theater,
  Laugh,
  Wine,
  Baby,
  Shirt,
  Car,
  Home,
  Globe,
  Rocket
} from "lucide-react";

// Icon mapping for categories
const iconMap = {
  camera: Camera,
  code: Code,
  music: Music,
  art: Palette,
  sports: Dumbbell,
  tech: Code,
  food: UtensilsCrossed,
  business: Briefcase,
  education: GraduationCap,
  charity: Heart,
  photography: Camera,
  gaming: Gamepad2,
  travel: Plane,
  outdoor: TreePine,
  wellness: Heart,
  fitness: Dumbbell,
  science: Lightbulb,
  entertainment: Film,
  networking: Users,
  fashion: Shirt,
  automotive: Car,
  realestate: Home,
  marketing: Megaphone,
  finance: Trophy,
  startup: Rocket,
  design: Palette,
  writing: BookOpen,
  comedy: Laugh,
  theater: Theater,
  festival: PartyPopper,
  conference: Users,
  workshop: Lightbulb,
  seminar: BookOpen,
  concert: Mic,
  exhibition: Camera,
  competition: Trophy,
  party: Wine,
  kids: Baby,
  shopping: ShoppingBag,
  coffee: Coffee,
  international: Globe,
  community: Users,
  culture: Globe,
  family: Users,
  night: Sparkles,
  palette: Palette,
  dumbbell: Dumbbell,
  lightbulb: Lightbulb,
  utensils: UtensilsCrossed,
  briefcase: Briefcase,
  graduation: GraduationCap,
  graduationcap: GraduationCap,
  heart: Heart,
  gamepad: Gamepad2,
  gamepad2: Gamepad2,
  plane: Plane,
  treepine: TreePine,
  utensilscrossed: UtensilsCrossed,
  folderopen: FolderOpen,
  folder: FolderOpen,
  bookopen: BookOpen,
  book: BookOpen,
  trophy: Trophy,
  film: Film,
  megaphone: Megaphone,
  users: Users,
  sparkles: Sparkles,
  shoppingbag: ShoppingBag,
  mic: Mic,
  partypopper: PartyPopper,
  laugh: Laugh,
  wine: Wine,
  baby: Baby,
  shirt: Shirt,
  car: Car,
  home: Home,
  globe: Globe,
  rocket: Rocket,
};

// Gradient mapping for categories (by icon name)
const gradientMap = {
  'camera': 'from-violet-500 to-purple-500',
  'code': 'from-blue-500 to-cyan-500',
  'music': 'from-pink-500 to-rose-500',
  'art': 'from-purple-500 to-indigo-500',
  'sports': 'from-green-500 to-emerald-500',
  'tech': 'from-blue-500 to-cyan-500',
  'food': 'from-orange-500 to-amber-500',
  'business': 'from-slate-600 to-zinc-700',
  'education': 'from-teal-500 to-cyan-500',
  'charity': 'from-red-500 to-pink-500',
  'photography': 'from-violet-500 to-purple-500',
  'gaming': 'from-fuchsia-500 to-pink-500',
  'travel': 'from-sky-500 to-blue-500',
  'outdoor': 'from-lime-500 to-green-500',
  'wellness': 'from-rose-500 to-pink-500',
  'fitness': 'from-emerald-500 to-teal-500',
  'science': 'from-indigo-500 to-blue-500',
  'entertainment': 'from-purple-500 to-fuchsia-500',
  'networking': 'from-cyan-500 to-blue-500',
  'fashion': 'from-pink-500 to-purple-500',
  'automotive': 'from-gray-600 to-slate-700',
  'realestate': 'from-amber-500 to-orange-600',
  'marketing': 'from-blue-500 to-indigo-500',
  'finance': 'from-green-600 to-emerald-700',
  'startup': 'from-violet-500 to-purple-600',
  'design': 'from-indigo-500 to-purple-500',
  'writing': 'from-teal-500 to-cyan-500',
  'comedy': 'from-yellow-500 to-orange-500',
  'theater': 'from-red-500 to-rose-500',
  'festival': 'from-pink-500 to-fuchsia-500',
  'conference': 'from-blue-600 to-indigo-600',
  'workshop': 'from-cyan-500 to-teal-500',
  'seminar': 'from-slate-500 to-gray-600',
  'concert': 'from-rose-500 to-pink-600',
  'exhibition': 'from-purple-500 to-violet-500',
  'competition': 'from-yellow-500 to-amber-600',
  'party': 'from-fuchsia-500 to-purple-600',
  'kids': 'from-pink-400 to-rose-400',
  'shopping': 'from-orange-500 to-red-500',
  'coffee': 'from-amber-700 to-orange-800',
  'international': 'from-blue-500 to-sky-500',
  'community': 'from-green-500 to-teal-500',
  'culture': 'from-indigo-500 to-violet-500',
  'family': 'from-emerald-500 to-green-500',
  'night': 'from-purple-600 to-indigo-700',
  'palette': 'from-purple-500 to-indigo-500',
  'dumbbell': 'from-green-500 to-emerald-500',
  'lightbulb': 'from-yellow-500 to-amber-500',
  'utensils': 'from-orange-500 to-amber-500',
  'briefcase': 'from-slate-600 to-zinc-700',
  'graduation': 'from-teal-500 to-cyan-500',
  'graduationcap': 'from-teal-500 to-cyan-500',
  'heart': 'from-red-500 to-pink-500',
  'gamepad': 'from-fuchsia-500 to-pink-500',
  'gamepad2': 'from-fuchsia-500 to-pink-500',
  'plane': 'from-sky-500 to-blue-500',
  'treepine': 'from-lime-500 to-green-500',
  'utensilscrossed': 'from-orange-500 to-amber-500',
  'folderopen': 'from-blue-500 to-indigo-500',
  'folder': 'from-blue-500 to-indigo-500',
  'bookopen': 'from-teal-500 to-cyan-500',
  'book': 'from-teal-500 to-cyan-500',
  'trophy': 'from-yellow-500 to-amber-600',
  'film': 'from-purple-500 to-fuchsia-500',
  'megaphone': 'from-blue-500 to-indigo-500',
  'users': 'from-cyan-500 to-blue-500',
  'sparkles': 'from-purple-600 to-indigo-700',
  'shoppingbag': 'from-orange-500 to-red-500',
  'mic': 'from-rose-500 to-pink-600',
  'partypopper': 'from-pink-500 to-fuchsia-500',
  'laugh': 'from-yellow-500 to-orange-500',
  'wine': 'from-fuchsia-500 to-purple-600',
  'baby': 'from-pink-400 to-rose-400',
  'shirt': 'from-pink-500 to-purple-500',
  'car': 'from-gray-600 to-slate-700',
  'home': 'from-amber-500 to-orange-600',
  'globe': 'from-blue-500 to-sky-500',
  'rocket': 'from-violet-500 to-purple-600',
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
              const Icon = iconMap[category.icon?.toLowerCase()] || Music;
              const gradient = gradientMap[category.icon?.toLowerCase()] || gradientMap[category.name?.toLowerCase()] || 'from-pink-500 to-rose-500';

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
