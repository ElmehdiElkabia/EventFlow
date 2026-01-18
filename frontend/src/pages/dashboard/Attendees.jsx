import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Download,
  Mail,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const mockEvents = [
  { id: "all", title: "All Events" },
  { id: "1", title: "Tech Innovation Summit 2024" },
  { id: "2", title: "Electronic Music Festival" },
  { id: "3", title: "Startup Pitch Competition" },
];

const mockAttendees = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    ticketCode: "TKT-001234",
    event: "Tech Innovation Summit 2024",
    purchaseDate: "2024-11-15",
    status: "checked_in",
    checkedInAt: "2024-12-15T10:15:00",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    ticketCode: "TKT-001235",
    event: "Tech Innovation Summit 2024",
    purchaseDate: "2024-11-20",
    status: "checked_in",
    checkedInAt: "2024-12-15T10:30:00",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.d@example.com",
    ticketCode: "TKT-001236",
    event: "Electronic Music Festival",
    purchaseDate: "2024-11-18",
    status: "pending",
    checkedInAt: null,
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily.b@example.com",
    ticketCode: "TKT-001237",
    event: "Electronic Music Festival",
    purchaseDate: "2024-11-22",
    status: "pending",
    checkedInAt: null,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    ticketCode: "TKT-001238",
    event: "Startup Pitch Competition",
    purchaseDate: "2024-11-25",
    status: "checked_in",
    checkedInAt: "2024-12-18T14:05:00",
  },
];

const Attendees = () => {
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAttendees = mockAttendees.filter((attendee) => {
    const matchesEvent = selectedEvent === "all" || attendee.event === mockEvents.find(e => e.id === selectedEvent)?.title;
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter;
    return matchesEvent && matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredAttendees.length,
    checkedIn: filteredAttendees.filter((a) => a.status === "checked_in").length,
    pending: filteredAttendees.filter((a) => a.status === "pending").length,
  };

  return (
    <DashboardLayout role="organizer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendees</h1>
            <p className="text-muted-foreground">Manage your event attendees</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Attendees</p>
                  </div>
                </div>
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
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.checkedIn}</p>
                    <p className="text-sm text-muted-foreground">Checked In</p>
                  </div>
                </div>
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
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ticket code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Ticket Code</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checked In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{attendee.name}</p>
                            <p className="text-sm text-muted-foreground">{attendee.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {attendee.ticketCode}
                        </TableCell>
                        <TableCell>{attendee.event}</TableCell>
                        <TableCell>
                          {new Date(attendee.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={attendee.status === "checked_in" ? "success" : "warning"}
                          >
                            {attendee.status === "checked_in" ? "Checked In" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attendee.checkedInAt
                            ? new Date(attendee.checkedInAt).toLocaleTimeString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredAttendees.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No attendees found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Attendees;
