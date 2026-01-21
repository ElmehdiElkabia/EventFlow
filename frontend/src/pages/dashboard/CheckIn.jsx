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
import { organizerService } from "@/services/organizerService";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, Loader2, QrCode, Search, Ticket, Users } from "lucide-react";

const CheckIn = () => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
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
      const [eventResponse, attendeeResponse] = await Promise.all([
        organizerService.getEvent(eventId),
        attendeeService.getAttendees(eventId),
      ]);
      setEvent(eventResponse.data || eventResponse);
      setAttendees(attendeeResponse.data || attendeeResponse || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load event or attendees");
      toast.error("Failed to load event or attendees.");
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
  };

  const startScanner = () => {
    if (scannerRef.current) {
      return;
    }

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      /* verbose */ false
    );

    scannerRef.current.render(
      async (decodedText) => {
        await processCheckIn(decodedText);
      },
      (err) => {
        console.warn(err);
      }
    );

    setScanning(true);
  };

  const processCheckIn = async (code) => {
    try {
      const attendee = attendees.find((a) => String(a.id) === String(code));

      if (!attendee) {
        toast.error("Attendee not found.");
        return;
      }

      await attendeeService.checkInAttendee(attendee.id);
      toast.success(`Checked in ${attendee.name}`);
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error("Check-in failed.");
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
              Refresh
            </Button>
            <Button onClick={scanning ? stopScanner : startScanner}>
              {scanning ? "Stop Scanner" : "Start Scanner"}
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
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      Manage check-ins for {attendees.length} registered attendees.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{event.status || "live"}</Badge>
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
                        <CardTitle>QR Scanner</CardTitle>
                        <CardDescription>Use the camera to scan QR codes.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-lg border flex items-center justify-center bg-muted/30">
                          {scanning ? (
                            <div id="qr-reader" className="w-full h-full" />
                          ) : (
                            <div className="text-center space-y-2">
                              <Camera className="h-10 w-10 mx-auto text-muted-foreground" />
                              <p className="text-muted-foreground">Scanner is idle</p>
                              <Button onClick={startScanner}>Start Scanner</Button>
                            </div>
                          )}
                        </div>
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
                              placeholder="Enter attendee ID"
                              value={manualCode}
                              onChange={(e) => setManualCode(e.target.value)}
                            />
                            <Button type="submit">Check-in</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tip: IDs are the numbers on attendee rows; QR codes should encode the same.
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
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">{attendee.email}</div>
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
                    <span>{event.start_date || event.date || "TBD"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span>{event.location || "TBD"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge variant="outline">{event.status || "live"}</Badge>
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
