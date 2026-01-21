import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Search,
  Ticket,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { ticketService } from "@/services/userService";
import { toast } from "sonner";

const UpcomingEvents = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketService.getMyTickets();
      const validTickets = (response.data.data || []).filter(t => t.status === 'valid');
      setTickets(validTickets);
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err);
      setError(err.response?.data?.message || 'Failed to load upcoming events');
      toast.error('Failed to load upcoming events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = tickets.filter((ticket) =>
    ticket.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchUpcomingEvents}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
        {filteredEvents.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No events match your search"
                  : "You don't have any upcoming events. Browse and get tickets now!"}
              </p>
              {!searchQuery && (
                <Button variant="hero" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="elevated" className="group">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Valid</Badge>
                          <Badge variant="outline">{ticket.ticketType}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {ticket.eventTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{ticket.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Ticket className="w-4 h-4" />
                          <span>Ticket: {ticket.qrCode}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard/my-tickets">
                          View Ticket
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpcomingEvents;
