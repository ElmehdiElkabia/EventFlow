import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Ticket,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const mockEvents = [
  { id: "all", title: "All Events" },
  { id: "1", title: "Tech Innovation Summit 2024" },
  { id: "2", title: "Electronic Music Festival" },
  { id: "3", title: "Startup Pitch Competition" },
];

const salesData = [
  {
    id: "1",
    event: "Tech Innovation Summit 2024",
    ticketsSold: 450,
    totalCapacity: 500,
    revenue: 134550,
    avgPrice: 299,
    lastSale: "2 hours ago",
  },
  {
    id: "2",
    event: "Electronic Music Festival",
    ticketsSold: 2800,
    totalCapacity: 3000,
    revenue: 420000,
    avgPrice: 150,
    lastSale: "5 min ago",
  },
  {
    id: "3",
    event: "Startup Pitch Competition",
    ticketsSold: 180,
    totalCapacity: 200,
    revenue: 0,
    avgPrice: 0,
    lastSale: "1 day ago",
  },
];

const recentTransactions = [
  {
    id: "1",
    buyer: "John Smith",
    event: "Electronic Music Festival",
    tickets: 2,
    amount: 300,
    date: "2024-12-05T14:30:00",
    status: "completed",
  },
  {
    id: "2",
    buyer: "Sarah Johnson",
    event: "Tech Innovation Summit 2024",
    tickets: 1,
    amount: 299,
    date: "2024-12-05T13:15:00",
    status: "completed",
  },
  {
    id: "3",
    buyer: "Mike Davis",
    event: "Electronic Music Festival",
    tickets: 4,
    amount: 600,
    date: "2024-12-05T12:00:00",
    status: "completed",
  },
  {
    id: "4",
    buyer: "Emily Brown",
    event: "Startup Pitch Competition",
    tickets: 1,
    amount: 0,
    date: "2024-12-05T11:30:00",
    status: "completed",
  },
];

const TicketSales = () => {
  const [selectedEvent, setSelectedEvent] = useState("all");

  const totalRevenue = salesData.reduce((acc, item) => acc + item.revenue, 0);
  const totalTickets = salesData.reduce((acc, item) => acc + item.ticketsSold, 0);
  const avgSalesPerDay = Math.round(totalTickets / 30);

  return (
    <DashboardLayout role="organizer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ticket Sales</h1>
            <p className="text-muted-foreground">Track your ticket sales and revenue</p>
          </div>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    +12.5%
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    +8.2%
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {totalTickets.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {avgSalesPerDay}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Sales/Day</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {salesData.length}
                </p>
                <p className="text-sm text-muted-foreground">Active Events</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sales by Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Sales by Event</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg. Price</TableHead>
                      <TableHead>Last Sale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-foreground">
                          {item.event}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground">{item.ticketsSold}</span>
                            <div className="w-24 h-2 rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-gradient-primary"
                                style={{
                                  width: `${(item.ticketsSold / item.totalCapacity) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.totalCapacity}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          ${item.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.avgPrice === 0 ? "Free" : `$${item.avgPrice}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.lastSale}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium text-foreground">
                          {tx.buyer}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.event}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.tickets}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {tx.amount === 0 ? "Free" : `$${tx.amount}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(tx.date).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">{tx.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TicketSales;
