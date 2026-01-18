import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  QrCode,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

// Mock tickets data
const mockTickets = [
  {
    id: "1",
    ticketCode: "TKT-001234",
    event: {
      title: "Tech Innovation Summit 2024",
      date: "2024-12-15T10:00:00",
      location: "Moscone Center, San Francisco",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    },
    purchaseDate: "2024-11-15",
    status: "valid",
    qrData: "EVT-1-TKT-001234-USR-123",
  },
  {
    id: "2",
    ticketCode: "TKT-001456",
    event: {
      title: "Electronic Music Festival",
      date: "2024-12-20T18:00:00",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
    },
    purchaseDate: "2024-11-20",
    status: "valid",
    qrData: "EVT-2-TKT-001456-USR-123",
  },
  {
    id: "3",
    ticketCode: "TKT-000999",
    event: {
      title: "Art Gallery Opening",
      date: "2024-11-30T19:00:00",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    },
    purchaseDate: "2024-11-10",
    status: "used",
    qrData: "EVT-3-TKT-000999-USR-123",
  },
];

const UserTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const upcomingTickets = mockTickets.filter((t) => t.status === "valid");
  const pastTickets = mockTickets.filter((t) => t.status === "used");

  const openQRCode = (ticket) => {
    setSelectedTicket(ticket);
    setQrDialogOpen(true);
  };

  const TicketCard = ({ ticket, isPast = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card variant="elevated" className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-32 sm:h-auto relative">
            <img
              src={ticket.event.image}
              alt={ticket.event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent sm:hidden" />
          </div>
          <CardContent className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={isPast ? "secondary" : "success"}>
                    {isPast ? "Attended" : "Valid"}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-mono">
                    {ticket.ticketCode}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {ticket.event.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(ticket.event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(ticket.event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {ticket.event.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!isPast && (
                  <Button variant="hero" onClick={() => openQRCode(ticket)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your event tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{upcomingTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pastTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Past Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTickets.length > 0 ? (
              upcomingTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <Card variant="elevated" className="p-12 text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming tickets</h3>
                <p className="text-muted-foreground">
                  Browse events and get your tickets today!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastTickets.length > 0 ? (
              pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isPast />
              ))
            ) : (
              <Card variant="elevated" className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No past tickets</h3>
                <p className="text-muted-foreground">
                  Your attended events will appear here.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Ticket QR Code</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-xl">
                <QRCodeSVG
                  value={selectedTicket.qrData}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-lg font-semibold text-foreground">
                  {selectedTicket.ticketCode}
                </p>
                <p className="text-muted-foreground">
                  {selectedTicket.event.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Show this QR code at the event entrance
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserTickets;
