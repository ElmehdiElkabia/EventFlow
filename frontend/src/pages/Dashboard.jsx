import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  Star,
  Bell,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { ticketService, userService } from "@/services/userService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (user?.role === 'attendee') {
      fetchDashboardData();
    } else {
      // Non-attendees don't hit attendee-only endpoints
      setTickets([]);
      setReviews([]);
      setNotifications([]);
      setLoading(false);
    }
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ticketsRes, reviewsRes, notificationsRes] = await Promise.all([
        ticketService.getMyTickets(),
        userService.getReviews(),
        userService.getNotifications(),
      ]);

      // api interceptor returns the envelope; actual payload is in .data
      setTickets(ticketsRes.data || []);
      setReviews(reviewsRes.data || []);
      setNotifications(notificationsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "My Tickets",
      value: tickets.length.toString(),
      icon: Ticket,
    },
    {
      title: "Upcoming Events",
      value: tickets.filter(t => t.status === 'valid').length.toString(),
      icon: Calendar,
    },
    {
      title: "Reviews Written",
      value: reviews.length.toString(),
      icon: Star,
    },
    {
      title: "Notifications",
      value: notifications.filter(n => !n.read_at).length.toString(),
      icon: Bell,
    },
  ];

  const upcomingTickets = tickets.filter(t => t.status === 'valid').slice(0, 5);

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
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Events */}
        {upcomingTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Upcoming Events</CardTitle>
                  <Badge variant="outline">{upcomingTickets.length} tickets</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ticket.eventTitle}</p>
                        <p className="text-sm text-muted-foreground">{ticket.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={ticket.status === 'valid' ? 'success' : 'secondary'}>
                          {ticket.ticketType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Reviews */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-secondary/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-foreground">{review.event_title}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {tickets.length === 0 && reviews.length === 0 && (
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by browsing events and purchasing tickets!
              </p>
              <Button variant="hero" onClick={() => window.location.href = '/events'}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
