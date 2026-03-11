import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, MapPin, Download, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ticketService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const formatPrice = (price) => {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }

  return price ? `$${price}` : "Free";
};

const sanitizeFileName = (value) => value.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();

const drawWrappedText = (context, text, x, y, maxWidth, lineHeight) => {
  const words = String(text || "").split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return lines.length;
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ticketService.getMyTickets();
        setTickets(response?.data || []);
      } catch (err) {
        console.error('Request failed');
        const errorMsg = err.response?.data?.message || 'Failed to load tickets';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleDownloadQR = (ticket) => {
    const ticketCode = ticket.qrCode || ticket.id;
    const svg = document.getElementById(`qr-${ticketCode}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const attendeeName = ticket.attendeeName || ticket.userName || user?.name || "Attendee";
    const eventTitle = ticket.eventTitle || "Event Ticket";
    const eventDateTime = [ticket.date, ticket.time].filter(Boolean).join(" • ") || "TBD";
    const ticketType = ticket.ticketType || "Standard";
    const price = formatPrice(ticket.price);
    const location = ticket.location || "Location TBD";

    if (!ctx) {
      toast.error("Unable to generate ticket image.");
      return;
    }
    
    canvas.width = 900;
    canvas.height = 1200;
    
    img.onload = () => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 42px Arial';
      const titleLines = drawWrappedText(ctx, eventTitle, 60, 90, 780, 52);

      ctx.fillStyle = '#475569';
      ctx.font = '24px Arial';
      ctx.fillText(`Ticket #${ticket.id}`, 60, 90 + titleLines * 52 + 20);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(60, 170, 780, 2);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(265, 220, 370, 370);
      ctx.drawImage(img, 285, 240, 330, 330);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('Scan QR for entry', 327, 635);

      const details = [
        ["Attendee", attendeeName],
        ["Date & Time", eventDateTime],
        ["Location", location],
        ["Ticket Type", ticketType],
        ["Price", price],
        ["QR Code", String(ticketCode)],
      ];

      let y = 720;
      details.forEach(([label, value]) => {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(label, 60, y);

        ctx.fillStyle = '#0f172a';
        ctx.font = '26px Arial';
        const detailLines = drawWrappedText(ctx, value, 60, y + 40, 780, 34);
        y += 70 + Math.max(detailLines - 1, 0) * 34;
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(60, 1100, 780, 2);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px Arial';
      ctx.fillText('Generated from EventFlow', 60, 1145);

      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `${sanitizeFileName(eventTitle)}-${ticketCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('Ticket QR downloaded successfully!');
    };

    img.onerror = () => {
      toast.error('Failed to generate ticket QR image.');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return (
      <DashboardLayout role="attendee">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage your event tickets
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="attendee">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage your event tickets
            </p>
          </div>
          <Card variant="glass" className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout role="attendee">
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
                          variant={ticket.status === "valid" ? "success" : "outline"}
                          className="mb-2"
                        >
                          {ticket.status === "valid" ? "Active" : ticket.status}
                        </Badge>
                        <h3 className="text-xl font-semibold text-foreground">
                          {ticket.eventTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">#{ticket.id}</p>
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
                        <p className="font-semibold text-primary text-lg">
                          ${typeof ticket.price === 'number' ? ticket.price.toFixed(2) : ticket.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="lg:w-64 p-6 bg-secondary/50 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-border">
                    <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center mb-4 p-2">
                      <QRCodeSVG
                        id={`qr-${ticket.qrCode}`}
                        value={ticket.qrCode || `TICKET-${ticket.id}`}
                        size={112}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan for entry
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDownloadQR(ticket)}
                    >
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
            <Button variant="hero" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTickets;
