import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  Star,
  Bell,
  Loader2,
  AlertCircle,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { ticketService, userService } from "@/services/userService";
import adminService from "@/services/adminService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (user?.role === 'attendee') {
      fetchAttendeeDashboard();
    } else if (user?.role === 'admin') {
      fetchAdminDashboard();
    } else if (user?.role === 'organizer') {
      fetchOrganizerDashboard();
    }
  }, [user?.role]);

  const fetchAttendeeDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ticketsRes, reviewsRes, notificationsRes] = await Promise.all([
        ticketService.getMyTickets(),
        userService.getReviews(),
        userService.getNotifications(),
      ]);

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

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, eventsRes, transactionsRes, statsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getEvents(),
        adminService.getTransactions(),
        adminService.getTransactionStats(),
      ]);

      setAdminStats({
        users: usersRes || [],
        events: eventsRes || [],
        transactions: transactionsRes || [],
        stats: statsRes || {},
      });
      

    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, just show basic info
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch organizer dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
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
          <Button onClick={() => {
            if (user?.role === 'attendee') fetchAttendeeDashboard();
            else if (user?.role === 'admin') fetchAdminDashboard();
            else if (user?.role === 'organizer') fetchOrganizerDashboard();
          }}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    const pendingEvents = adminStats?.events?.filter(e => e.status === 'pending').length || 0;
    const activeUsers = adminStats?.users?.filter(u => u.status === 'active').length || 0;
    const totalRevenue = adminStats?.stats?.totalRevenue || 0;
    const totalTransactions = adminStats?.stats?.totalTransactions || 0;

    return (
      <DashboardLayout role="admin">
        <div className="space-y-8">
          {/* Email Verification Banner */}
          <EmailVerificationBanner />

          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{adminStats?.events?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${Number(totalRevenue || 0).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-cyan-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Events */}
            {pendingEvents > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground">Pending Approvals</CardTitle>
                      <Badge variant="warning">{pendingEvents} events</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      You have {pendingEvents} event{pendingEvents > 1 ? 's' : ''} waiting for approval.
                    </p>
                    <Button variant="hero" asChild className="w-full">
                      <Link to="/dashboard/admin/events">Review Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                    <Link to="/dashboard/transactions" className="text-sm text-primary hover:underline">
                      View All
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adminStats?.transactions?.slice(0, 5).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{txn.event}</p>
                          <p className="text-sm text-muted-foreground">{txn.user}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-foreground">${Number(txn.amount).toFixed(2)}</p>
                          <Badge variant={txn.status === 'completed' ? 'success' : 'secondary'} className="text-xs">
                            {txn.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(!adminStats?.transactions || adminStats.transactions.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">No transactions yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link to="/dashboard/users">
                    <div className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                      <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium text-foreground">Manage Users</p>
                    </div>
                  </Link>
                  <Link to="/dashboard/admin/events">
                    <div className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium text-foreground">Manage Events</p>
                    </div>
                  </Link>
                  <Link to="/dashboard/transactions">
                    <div className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium text-foreground">Transactions</p>
                    </div>
                  </Link>
                  <Link to="/dashboard/analytics">
                    <div className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium text-foreground">Analytics</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Organizer Dashboard
  if (user?.role === 'organizer') {
    return (
      <DashboardLayout role="organizer">
        <div className="space-y-8">
          {/* Email Verification Banner */}
          <EmailVerificationBanner />

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <Card variant="elevated">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Get Started</h3>
              <p className="text-muted-foreground mb-4">
                Create your first event and start selling tickets!
              </p>
              <Button variant="hero" asChild>
                <Link to="/dashboard/events/create">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Attendee Dashboard (existing code)
  return (
    <DashboardLayout role="attendee">
      <div className="space-y-8">
        {/* Email Verification Banner */}
		
        <EmailVerificationBanner />

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
