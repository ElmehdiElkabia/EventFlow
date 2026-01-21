import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Music, Palette, Briefcase, GraduationCap, Heart, Utensils, Dumbbell, Camera, Loader2 } from "lucide-react";
import { categoryService } from "@/services/publicService";
import { toast } from "sonner";

// Icon mapping for categories
const iconMap = {
  "Music": Music,
  "Arts": Palette,
  "Business": Briefcase,
  "Education": GraduationCap,
  "Charity": Heart,
  "Food": Utensils,
  "Sports": Dumbbell,
  "Photography": Camera,
  "Technology": Briefcase,
  "Health": Heart,
};

// Color mapping for gradients
const colorMap = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-green-500 to-emerald-500",
  "from-rose-500 to-red-500",
  "from-yellow-500 to-amber-500",
  "from-teal-500 to-green-500",
  "from-indigo-500 to-purple-500",
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoryService.getCategories();
        
        // API returns: { success: true, message: "Success", data: [...] }
        const categoriesData = response.data || [];
        
        // Map categories with icons and colors
        const mappedCategories = categoriesData.map((cat, index) => ({
          ...cat,
          icon: iconMap[cat.name] || Briefcase,
          color: cat.gradient || colorMap[index % colorMap.length],
        }));
        
        setCategories(mappedCategories.slice(0, 8)); // Limit to 8 for homepage
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

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null; // Silently hide categories section if error or empty
  }
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Categories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find events that match your interests from our diverse range of categories
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link to={`/events?category=${category.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-elevated">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} events
                  </p>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
