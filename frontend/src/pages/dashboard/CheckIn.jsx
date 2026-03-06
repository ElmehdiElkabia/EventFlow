import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { attendeeService } from "@/services/attendeeService";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, Loader2, QrCode, Search, Ticket, Users, RefreshCcw } from "lucide-react";

const CheckIn = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!eventId) {
      setError("Event not found");
      setLoading(false);
      return;
    }
    loadData();
    return () => stopScanner();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const attendeeResponse = await attendeeService.getAttendees(eventId);
      const attendeeData = attendeeResponse || [];
      setAttendees(attendeeData);
      // Extract event info from first attendee's event object
      if (attendeeData.length > 0 && attendeeData[0].event) {
        setEvent(attendeeData[0].event);
      } else {
        setEvent(null);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to load attendees";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setScanning(false);
    setScannerError(null);
  };

  const startScanner = async () => {
    if (scannerRef.current) {
      return;
    }

    try {
      setScannerError(null);
      setScanning(true); // Set scanning to true first to render the div
      
      // Wait for next tick to ensure DOM is updated
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Check if the element exists
      const element = document.getElementById("qr-reader");
      if (!element) {
        throw new Error("QR reader element not found. Please try again.");
      }
      
      // Check if the page is served over HTTPS or localhost
      const isSecureContext = window.isSecureContext;
      if (!isSecureContext) {
        const errorMsg = "Camera requires HTTPS or localhost. Please use a secure connection.";
        setScannerError(errorMsg);
        setScanning(false);
        toast.error(errorMsg);
        return;
      }

      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = "Camera not supported in this browser. Please use Chrome, Firefox, or Safari.";
        setScannerError(errorMsg);
        setScanning(false);
        toast.error(errorMsg);
        return;
      }

      // Request camera permission explicitly
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment" // Prefer back camera on mobile
          } 
        });
        // Stop the stream immediately as Html5QrcodeScanner will request it again
        stream.getTracks().forEach(track => track.stop());
      } catch (permError) {
        console.error("Camera permission error:", permError);
        let errorMsg = "Camera access denied. ";
        
        if (permError.name === "NotAllowedError") {
          errorMsg += "Please allow camera permissions in your browser settings.";
        } else if (permError.name === "NotFoundError") {
          errorMsg += "No camera found on this device.";
        } else if (permError.name === "NotReadableError") {
          errorMsg += "Camera is already in use by another application.";
        } else if (permError.name === "OverconstrainedError") {
          errorMsg += "Camera doesn't meet the requirements.";
        } else {
          errorMsg += permError.message || "Unknown camera error.";
        }
        
        setScannerError(errorMsg);
        setScanning(false);
        toast.error(errorMsg);
        return;
      }

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [0], // QR_CODE
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true
      };
      
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        /* verbose */ false
      );

      scannerRef.current.render(
        async (decodedText) => {
          console.log("QR Code scanned:", decodedText);
          await processCheckIn(decodedText);
        },
        (error) => {
          // Ignore scanning errors (happens constantly when no QR in view)
          if (error && !error.includes("NotFoundException")) {
            console.warn("Scanner error:", error);
          }
        }
      );

      toast.success("Camera started successfully!");
      
    } catch (err) {
      console.error("Failed to start scanner:", err);
      const errorMsg = err.message || "Failed to start camera. Please refresh and try again.";
      setScannerError(errorMsg);
      setScanning(false);
      toast.error(errorMsg);
    }
  };

  const processCheckIn = async (code) => {
    try {
      console.log("Processing check-in for code:", code);
      console.log("Available attendees:", attendees.map(a => ({ 
        id: a.id, 
        name: a.name, 
        ticketCode: a.ticketCode 
      })));
      
      // Try to find attendee by ticket code first (from QR), then by attendee ID (manual entry)
      let attendee = attendees.find((a) => 
        a.ticketCode && String(a.ticketCode).toLowerCase() === String(code).toLowerCase()
      );
      
      // If not found by ticket code, try by attendee ID for manual entry
      if (!attendee) {
        attendee = attendees.find((a) => String(a.id) === String(code));
      }

      if (!attendee) {
        console.error("No attendee found for code:", code);
        toast.error("Ticket or attendee not found. Please check the code.");
        return;
      }

      console.log("Found attendee:", attendee);

      if (attendee.status === "checked_in") {
        toast.warning(`${attendee.name} is already checked in.`);
        return;
      }

      await attendeeService.checkInAttendee(attendee.id);
      toast.success(`✓ Checked in ${attendee.name}`, {
        description: `Ticket: ${attendee.ticketCode || attendee.id}`
      });
      await loadData();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Check-in failed.";
      toast.error(errorMsg);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!manualCode) return;
    await processCheckIn(manualCode);
    setManualCode("");
  };

  const filteredAttendees = useMemo(() => {
    if (!searchTerm) return attendees;
    const term = searchTerm.toLowerCase();
    return attendees.filter(
      (a) =>
        a.name?.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term) ||
        String(a.id).includes(term)
    );
  }, [attendees, searchTerm]);

  const checkedInCount = attendees.filter((a) => a.status === "checked_in").length;
  const recentCheckIns = attendees
    .filter((a) => a.status === "checked_in")
    .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt))
    .slice(0, 5);

  return (
    <DashboardLayout role="organizer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link to="/dashboard/my-events" className="hover:underline">
                My Events
              </Link>
              <span>/</span>
              <span>Check-in</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <QrCode className="h-7 w-7" />
              Check-in
            </h1>
            <p className="text-muted-foreground mt-1">
              Scan tickets and manage attendee check-ins for this event.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard/my-events">Back to Events</Link>
            </Button>
            <Button onClick={loadData} variant="outline">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={scanning ? stopScanner : startScanner} variant={scanning ? "destructive" : "default"}>
              {scanning ? (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Stop Scanner
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Start QR Scanner
                </>
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading event and attendees...</span>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadData}>Retry</Button>
            </CardContent>
          </Card>
        ) : !event ? (
          <Card>
            <CardHeader>
              <CardTitle>Event not found</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{event?.title || "Event"}</CardTitle>
                    <CardDescription>
                      Manage check-ins for {attendees.length} registered attendees.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{event?.status || "live"}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Total Attendees
                      </div>
                      <div className="text-2xl font-semibold">{attendees.length}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        Checked In
                      </div>
                      <div className="text-2xl font-semibold">{checkedInCount}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/40">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ticket className="h-4 w-4" />
                        Pending
                      </div>
                      <div className="text-2xl font-semibold">
                        {attendees.length - checkedInCount}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <QrCode className="h-5 w-5" />
                          QR Scanner
                        </CardTitle>
                        <CardDescription>
                          Scan ticket QR codes to check in attendees instantly.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-lg border flex items-center justify-center bg-muted/30 overflow-hidden">
                          {scanning ? (
                            <div id="qr-reader" className="w-full h-full" />
                          ) : scannerError ? (
                            <div className="text-center space-y-3 p-4">
                              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                                <Camera className="h-8 w-8 text-destructive" />
                              </div>
                              <div>
                                <p className="font-medium text-destructive">Camera Error</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  {scannerError}
                                </p>
                              </div>
                              <Button onClick={startScanner} size="lg" variant="outline">
                                <Camera className="w-4 h-4 mr-2" />
                                Try Again
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center space-y-3 p-4">
                              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                <Camera className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Camera Scanner Ready</p>
                                <p className="text-sm text-muted-foreground">
                                  Click to start scanning
                                </p>
                              </div>
                              <Button onClick={startScanner} size="lg">
                                <Camera className="w-4 h-4 mr-2" />
                                Start Scanner
                              </Button>
                            </div>
                          )}
                        </div>
                        {scanning && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <p>Point camera at ticket QR code</p>
                            </div>
                            <div className="text-xs text-center text-muted-foreground">
                              Camera is active and ready to scan
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Manual Check-in</CardTitle>
                        <CardDescription>Enter ticket/attendee ID to check in.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleManualCheckIn} className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter ticket code or attendee ID"
                              value={manualCode}
                              onChange={(e) => setManualCode(e.target.value)}
                            />
                            <Button type="submit">Check-in</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Enter the ticket code (e.g., TKT-xxxxx) from the QR code or attendee ID.
                          </p>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendees</CardTitle>
                  <CardDescription>Search and confirm check-ins.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredAttendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">{attendee.email}</div>
                          {attendee.ticketCode && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Ticket: {attendee.ticketCode}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              attendee.status === "checked_in" ? "default" : "secondary"
                            }
                          >
                            {attendee.status === "checked_in" ? "Checked in" : "Pending"}
                          </Badge>
                          {attendee.status !== "checked_in" && (
                            <Button
                              size="sm"
                              onClick={() => processCheckIn(attendee.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Check-in
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredAttendees.length === 0 && (
                      <div className="text-center text-muted-foreground py-6">
                        No attendees found.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Check-ins</CardTitle>
                  <CardDescription>Latest confirmed attendees.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AnimatePresence>
                    {recentCheckIns.map((attendee) => (
                      <motion.div
                        key={attendee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {attendee.checkedInAt || "Just now"}
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {recentCheckIns.length === 0 && (
                    <p className="text-sm text-muted-foreground">No check-ins yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Date</span>
                    <span>{event?.start_date || event?.date || "TBD"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span>{event?.location || "TBD"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge variant="outline">{event?.status || "live"}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CheckIn;
