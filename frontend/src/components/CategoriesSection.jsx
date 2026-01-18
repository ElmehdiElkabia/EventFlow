import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Music, Palette, Briefcase, GraduationCap, Heart, Utensils, Dumbbell, Camera } from "lucide-react";

const categories = [
  { id: "music", name: "Music & Concerts", icon: Music, count: 234, color: "from-purple-500 to-pink-500" },
  { id: "arts", name: "Arts & Culture", icon: Palette, count: 156, color: "from-blue-500 to-cyan-500" },
  { id: "business", name: "Business & Networking", icon: Briefcase, count: 189, color: "from-amber-500 to-orange-500" },
  { id: "education", name: "Education & Workshops", icon: GraduationCap, count: 312, color: "from-green-500 to-emerald-500" },
  { id: "charity", name: "Charity & Causes", icon: Heart, count: 87, color: "from-rose-500 to-red-500" },
  { id: "food", name: "Food & Drink", icon: Utensils, count: 145, color: "from-yellow-500 to-amber-500" },
  { id: "sports", name: "Sports & Fitness", icon: Dumbbell, count: 203, color: "from-teal-500 to-green-500" },
  { id: "photography", name: "Film & Photography", icon: Camera, count: 98, color: "from-indigo-500 to-purple-500" },
];

const CategoriesSection = () => {
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
