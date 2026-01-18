import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Ticket,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const mockUpcomingEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    date: "2024-12-15T10:00:00",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    ticketType: "VIP",
    daysUntil: 5,
  },
  {
    id: "2",
    title: "Electronic Music Festival",
    date: "2024-12-20T18:00:00",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
    ticketType: "General",
    daysUntil: 10,
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    date: "2024-12-18T14:00:00",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    ticketType: "Early Bird",
    daysUntil: 8,
  },
  {
    id: "4",
    title: "Art Exhibition Opening",
    date: "2025-01-05T19:00:00",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400",
    ticketType: "General",
    daysUntil: 26,
  },
];

const UpcomingEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = mockUpcomingEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Upcoming Events</h1>
            <p className="text-muted-foreground">Events you're attending soon</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/events">
              Browse More Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{mockUpcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {mockUpcomingEvents.filter((e) => e.daysUntil <= 7).length}
              </p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Ticket className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">VIP Tickets</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {Math.min(...mockUpcomingEvents.map((e) => e.daysUntil))}
              </p>
              <p className="text-sm text-muted-foreground">Days to Next</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search upcoming events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden group">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-auto relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 sm:block hidden" />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={event.daysUntil <= 7 ? "warning" : "secondary"}
                          >
                            {event.daysUntil === 0
                              ? "Today"
                              : event.daysUntil === 1
                              ? "Tomorrow"
                              : `${event.daysUntil} days`}
                          </Badge>
                          <Badge variant="outline">{event.ticketType}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                        <Button variant="hero" size="sm" asChild>
                          <Link to="/dashboard/tickets">
                            <Ticket className="w-4 h-4 mr-1" />
                            View Ticket
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try a different search term" : "Browse events to find your next experience"}
            </p>
            <Button variant="hero" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpcomingEvents;
