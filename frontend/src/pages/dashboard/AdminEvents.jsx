import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Mock events data for admin
const mockEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    organizer: "John Doe",
    date: "2024-12-15",
    location: "San Francisco, CA",
    capacity: 500,
    price: 299,
    status: "approved",
    submittedAt: "2024-11-10",
  },
  {
    id: "2",
    title: "Blockchain Conference",
    organizer: "Jane Smith",
    date: "2024-12-22",
    location: "New York, NY",
    capacity: 300,
    price: 199,
    status: "pending",
    submittedAt: "2024-12-01",
  },
  {
    id: "3",
    title: "AI Workshop",
    organizer: "Mike Johnson",
    date: "2024-12-18",
    location: "Austin, TX",
    capacity: 50,
    price: 0,
    status: "pending",
    submittedAt: "2024-12-02",
  },
  {
    id: "4",
    title: "Crypto Meetup",
    organizer: "Sarah Davis",
    date: "2024-12-25",
    location: "Miami, FL",
    capacity: 100,
    price: 50,
    status: "rejected",
    submittedAt: "2024-11-28",
  },
];

const AdminEvents = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, eventId: null });
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingEvents = events.filter((e) => e.status === "pending");
  const approvedEvents = events.filter((e) => e.status === "approved");
  const rejectedEvents = events.filter((e) => e.status === "rejected");

  const filteredEvents = (status) =>
    events
      .filter((e) => e.status === status)
      .filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleApprove = (id) => {
    setActionDialog({ open: true, type: "approve", eventId: id });
  };

  const handleReject = (id) => {
    setActionDialog({ open: true, type: "reject", eventId: id });
  };

  const confirmAction = () => {
    if (!actionDialog.eventId) return;

    setEvents(
      events.map((e) =>
        e.id === actionDialog.eventId
          ? { ...e, status: actionDialog.type === "approve" ? "approved" : "rejected" }
          : e
      )
    );

    toast.success(
      actionDialog.type === "approve"
        ? "Event approved successfully!"
        : "Event rejected."
    );

    setActionDialog({ open: false, type: null, eventId: null });
    setRejectionReason("");
  };

  const EventRow = ({ event }) => (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium text-foreground">{event.title}</p>
          <p className="text-sm text-muted-foreground">by {event.organizer}</p>
        </div>
      </TableCell>
      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
      <TableCell>{event.location}</TableCell>
      <TableCell>{event.capacity}</TableCell>
      <TableCell>{event.price === 0 ? "Free" : `$${event.price}`}</TableCell>
      <TableCell>{new Date(event.submittedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge
          variant={
            event.status === "approved"
              ? "success"
              : event.status === "pending"
              ? "warning"
              : "destructive"
          }
        >
          {event.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/events/${event.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          {event.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-500 hover:text-emerald-600"
                onClick={() => handleApprove(event.id)}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/80"
                onClick={() => handleReject(event.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Events</h1>
          <p className="text-muted-foreground">Review and approve event submissions</p>
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
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pendingEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
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
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{approvedEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
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
                  <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{rejectedEvents.length}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events or organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedEvents.length})
            </TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card variant="elevated">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvents(status).map((event) => (
                          <EventRow key={event.id} event={event} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filteredEvents(status).length === 0 && (
                    <div className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No {status} events
                      </h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" ? "Approve Event" : "Reject Event"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve"
                ? "This event will be published and visible to all users."
                : "Please provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.type === "reject" && (
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, eventId: null })}>
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === "approve" ? "hero" : "destructive"}
              onClick={confirmAction}
            >
              {actionDialog.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminEvents;
