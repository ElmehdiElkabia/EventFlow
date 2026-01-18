import { useState, useEffect, useRef } from "react";
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
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  Search,
  Users,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

// Mock data
const mockEvents = [
  { id: "1", title: "Tech Innovation Summit 2024", checkedIn: 425, total: 450 },
  { id: "2", title: "Electronic Music Festival", checkedIn: 2100, total: 2800 },
  { id: "3", title: "Startup Pitch Competition", checkedIn: 150, total: 180 },
];

const recentCheckIns = [
  { id: "1", name: "John Smith", ticket: "TKT-001234", time: "Just now", status: "success" },
  { id: "2", name: "Sarah Johnson", ticket: "TKT-001235", time: "2 min ago", status: "success" },
  { id: "3", name: "Mike Davis", ticket: "TKT-001230", time: "5 min ago", status: "already" },
];

const CheckIn = () => {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0].id);
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [checkInResult, setCheckInResult] = useState({ status: null, message: "", attendee: "" });
  const scannerRef = useRef(null);

  const currentEvent = mockEvents.find((e) => e.id === selectedEvent);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const startScanner = () => {
    setScannerActive(true);
    setTimeout(() => {
      try {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scannerRef.current.render(onScanSuccess, onScanFailure);
      } catch (error) {
        console.error("Failed to start scanner:", error);
        toast.error("Failed to start camera. Please check permissions.");
      }
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const onScanSuccess = (decodedText) => {
    processCheckIn(decodedText);
    stopScanner();
  };

  const onScanFailure = (error) => {
    // Ignore failures, they happen frequently during scanning
    console.debug("QR scan failed:", error);
  };

  const processCheckIn = (code) => {
    // Simulate check-in process
    const random = Math.random();
    if (random > 0.7) {
      setCheckInResult({
        status: "already",
        message: "Ticket already checked in",
        attendee: "John Smith",
      });
      toast.warning("This ticket has already been checked in!");
    } else if (random > 0.1) {
      setCheckInResult({
        status: "success",
        message: "Check-in successful!",
        attendee: "Sarah Johnson",
      });
      toast.success("Check-in successful!");
    } else {
      setCheckInResult({
        status: "error",
        message: "Invalid or expired ticket",
        attendee: "",
      });
      toast.error("Invalid ticket code!");
    }

    setTimeout(() => {
      setCheckInResult({ status: null, message: "", attendee: "" });
    }, 3000);
  };

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      processCheckIn(manualCode);
      setManualCode("");
    }
  };

  return (
    <DashboardLayout role="organizer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Check-in</h1>
          <p className="text-muted-foreground">Scan tickets to check in attendees</p>
        </div>

        {/* Event Selector & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Select Event</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentEvent?.checkedIn}
                  </p>
                  <p className="text-sm text-muted-foreground">Checked In</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentEvent && currentEvent.total - currentEvent.checkedIn}
                  </p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scanner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <QrCode className="w-5 h-5 text-primary" />
                QR Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden bg-secondary relative">
                {scannerActive ? (
                  <div id="qr-reader" className="w-full h-full" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Camera not active</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {scannerActive ? (
                  <Button variant="outline" onClick={stopScanner}>
                    Stop Scanner
                  </Button>
                ) : (
                  <Button variant="hero" onClick={startScanner}>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Scanner
                  </Button>
                )}
              </div>

              {/* Manual Entry */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3">Or enter ticket code manually:</p>
                <form onSubmit={handleManualCheckIn} className="flex gap-2">
                  <Input
                    placeholder="Enter ticket code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                  <Button type="submit" variant="default">
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              {/* Result Feedback */}
              <AnimatePresence>
                {checkInResult.status && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-xl text-center ${
                      checkInResult.status === "success"
                        ? "bg-emerald-500/20 border border-emerald-500/50"
                        : checkInResult.status === "already"
                        ? "bg-amber-500/20 border border-amber-500/50"
                        : "bg-destructive/20 border border-destructive/50"
                    }`}
                  >
                    {checkInResult.status === "success" ? (
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    ) : checkInResult.status === "already" ? (
                      <Users className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                    )}
                    <p className="font-semibold text-foreground">{checkInResult.message}</p>
                    {checkInResult.attendee && (
                      <p className="text-muted-foreground">{checkInResult.attendee}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Recent Check-ins */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCheckIns.map((checkIn) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          checkIn.status === "success"
                            ? "bg-emerald-500/20"
                            : "bg-amber-500/20"
                        }`}
                      >
                        {checkIn.status === "success" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Users className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{checkIn.name}</p>
                        <p className="text-sm text-muted-foreground">{checkIn.ticket}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={checkIn.status === "success" ? "success" : "warning"}
                      >
                        {checkIn.status === "success" ? "Checked In" : "Duplicate"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{checkIn.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckIn;
