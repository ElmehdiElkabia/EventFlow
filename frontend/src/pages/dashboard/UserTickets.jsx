import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Ticket, QrCode, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ticketService } from "@/services/userService";
import { toast } from "sonner";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketService.getMyTickets();
      setTickets(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError(err.response?.data?.message || "Failed to load tickets");
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const upcomingTickets = tickets.filter((t) => t.status === "valid");
  const pastTickets = tickets.filter((t) => t.status === "used");

  const openQRCode = (ticket) => {
    setSelectedTicket(ticket);
    setQrDialogOpen(true);
  };

  const TicketCard = ({ ticket, isPast = false }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={isPast ? "secondary" : "success"}>{isPast ? "Used" : "Valid"}</Badge>
                <span className="text-xs text-muted-foreground">#{ticket.qrCode}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{ticket.eventTitle}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{ticket.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ticket className="w-4 h-4" />
                <span>{ticket.ticketType}</span>
              </div>
            </div>
            {!isPast && (
              <Button variant="outline" size="sm" onClick={() => openQRCode(ticket)} className="w-full sm:w-auto">
                <QrCode className="w-4 h-4 mr-2" />
                View QR Code
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
          <Button onClick={fetchTickets}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your event tickets</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="upcoming">Upcoming ({upcomingTickets.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTickets.length === 0 ? (
              <Card variant="elevated">
                <CardContent className="py-12 text-center">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Tickets</h3>
                  <p className="text-muted-foreground mb-4">You don't have any upcoming event tickets.</p>
                  <Button variant="hero" onClick={() => (window.location.href = "/events")}>
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastTickets.length === 0 ? (
              <Card variant="elevated">
                <CardContent className="py-12 text-center">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Past Tickets</h3>
                  <p className="text-muted-foreground">You haven't attended any events yet.</p>
                </CardContent>
              </Card>
            ) : (
              pastTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} isPast />)
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Event Ticket QR Code</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-xl">
                  <QRCodeSVG value={selectedTicket.qrCode} size={256} />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-medium text-foreground">{selectedTicket.eventTitle}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.date}</p>
                  <p className="text-xs text-muted-foreground">Ticket: {selectedTicket.qrCode}</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Show this QR code at the event entrance for check-in
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserTickets;
