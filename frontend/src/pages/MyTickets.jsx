import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, MapPin, Download } from "lucide-react";
import { motion } from "framer-motion";

const tickets = [
  {
    id: "TKT-001",
    eventTitle: "Tech Innovation Summit 2024",
    date: "Dec 15, 2024",
    time: "9:00 AM",
    location: "San Francisco Convention Center",
    ticketType: "VIP Pass",
    price: "$299",
    status: "active",
    qrCode: "QRCODE123456",
  },
  {
    id: "TKT-002",
    eventTitle: "Electronic Music Festival",
    date: "Dec 20, 2024",
    time: "6:00 PM",
    location: "Miami Beach Amphitheater",
    ticketType: "General Admission",
    price: "$150",
    status: "active",
    qrCode: "QRCODE789012",
  },
  {
    id: "TKT-003",
    eventTitle: "Yoga & Wellness Retreat",
    date: "Jan 5, 2025",
    time: "7:00 AM",
    location: "Sedona Retreat Center",
    ticketType: "Full Weekend",
    price: "$450",
    status: "upcoming",
    qrCode: "QRCODE345678",
  },
];

const MyTickets = () => {
  return (
    <DashboardLayout role="user">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your event tickets
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid gap-6">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Ticket Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge
                          variant={ticket.status === "active" ? "success" : "outline"}
                          className="mb-2"
                        >
                          {ticket.status}
                        </Badge>
                        <h3 className="text-xl font-semibold text-foreground">
                          {ticket.eventTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{ticket.id}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-medium text-foreground">
                            {ticket.date} • {ticket.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium text-foreground">{ticket.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Ticket Type</p>
                        <p className="font-medium text-foreground">{ticket.ticketType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-semibold text-primary text-lg">{ticket.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="lg:w-64 p-6 bg-secondary/50 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-border">
                    <div className="w-32 h-32 bg-background rounded-xl flex items-center justify-center mb-4">
                      <QrCode className="w-24 h-24 text-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan for entry
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tickets yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Browse events and get your first ticket!
            </p>
            <Button variant="hero">Browse Events</Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTickets;
