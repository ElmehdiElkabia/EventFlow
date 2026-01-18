import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Events",
    value: "23",
    change: "+3",
    trend: "up",
    icon: Calendar,
  },
  {
    title: "Tickets Sold",
    value: "2,847",
    change: "+18.2%",
    trend: "up",
    icon: Ticket,
  },
  {
    title: "Total Attendees",
    value: "12,489",
    change: "+8.1%",
    trend: "up",
    icon: Users,
  },
];

const recentEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit",
    date: "Dec 15, 2024",
    ticketsSold: 450,
    revenue: "$134,550",
    status: "active",
  },
  {
    id: "2",
    title: "Electronic Music Festival",
    date: "Dec 20, 2024",
    ticketsSold: 2800,
    revenue: "$420,000",
    status: "active",
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    date: "Dec 18, 2024",
    ticketsSold: 180,
    revenue: "$0",
    status: "active",
  },
  {
    id: "4",
    title: "Art Exhibition Opening",
    date: "Dec 10, 2024",
    ticketsSold: 145,
    revenue: "$3,625",
    status: "completed",
  },
];

const Dashboard = () => {
  // For demo, we'll use 'organizer' role
  const role = "organizer";

  return (
    <DashboardLayout role={role}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Here's what's happening.</p>
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
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Recent Events</CardTitle>
                <Badge variant="outline">Last 30 days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Tickets
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Revenue
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-foreground">{event.title}</p>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{event.date}</td>
                        <td className="py-4 px-4 text-muted-foreground">{event.ticketsSold}</td>
                        <td className="py-4 px-4 text-foreground font-medium">{event.revenue}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={event.status === "active" ? "success" : "secondary"}
                          >
                            {event.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Upcoming Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <Badge variant="outline">{event.ticketsSold} tickets</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Ticket Sales</span>
                      <span className="text-sm font-medium text-foreground">85%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-[85%] rounded-full bg-gradient-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Attendee Satisfaction</span>
                      <span className="text-sm font-medium text-foreground">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-[92%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Check-in Rate</span>
                      <span className="text-sm font-medium text-foreground">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-[78%] rounded-full bg-amber-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
