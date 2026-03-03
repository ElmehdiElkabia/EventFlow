import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { organizerService } from "@/services/organizerService";
import { toast } from "sonner";

const TicketSales = () => {
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewRes, transactionsRes, eventsRes] = await Promise.all([
        organizerService.getSalesOverview(),
        organizerService.getTransactions(),
        organizerService.getMyEvents(),
      ]);
      setOverview(overviewRes?.data || {});
      setTransactions(transactionsRes?.data || []);
      setEvents(eventsRes?.data || []);
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load sales data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="organizer">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="organizer">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  const totalRevenue = overview?.totalRevenue || 0;
  const totalTickets = overview?.ticketsSold || 0;
  const avgSalesPerDay = Math.round(totalTickets / 30);
  const activeEvents = overview?.activeEvents || 0;

  // Filter transactions based on selected event
  const filteredTransactions = selectedEvent === "all" 
    ? transactions.slice(0, 10)
    : transactions.filter(tx => tx.event === events.find(e => String(e.id) === selectedEvent)?.title).slice(0, 10);

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
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={String(event.id)}>
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
                  {activeEvents}
                </p>
                <p className="text-sm text-muted-foreground">Active Events</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Events Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">My Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {events.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No events found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Tickets Sold</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium text-foreground">
                            {event.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.date}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {event.ticketsSold || 0}
                          </TableCell>
                          <TableCell>
                            <Badge variant={event.status === "approved" ? "success" : "outline"}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {event.price ? `$${event.price}` : "Free"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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
              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
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
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium text-foreground">
                            {tx.buyer}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{tx.event}</TableCell>
                          <TableCell className="text-muted-foreground">{tx.tickets || 1}</TableCell>
                          <TableCell className="font-medium text-foreground">
                            {tx.amount === 0 ? "Free" : `$${typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}`}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {tx.date}
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.status === "completed" ? "success" : "outline"}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TicketSales;
