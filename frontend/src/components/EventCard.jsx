import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  price,
  image,
  category,
  attendees,
  capacity,
  rating,
  featured = false,
}) => {
  const spotsLeft = capacity - attendees;
  const isSoldOut = spotsLeft <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/events/${id}`}>
        <Card
          variant="elevated"
          className={`group overflow-hidden hover:scale-[1.02] transition-all duration-300 ${
            featured ? "ring-2 ring-primary/50" : ""
          }`}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="glass">{category}</Badge>
            </div>

            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-gradient-primary border-0">Featured</Badge>
              </div>
            )}

            {/* Price */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-lg font-bold text-foreground">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{date} • {time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{attendees}/{capacity}</span>
                </div>
                {rating && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {isSoldOut ? (
                <Badge variant="secondary">Sold Out</Badge>
              ) : spotsLeft <= 10 ? (
                <Badge variant="warning">{spotsLeft} spots left</Badge>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EventCard;
