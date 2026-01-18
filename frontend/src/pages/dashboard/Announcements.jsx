import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Megaphone,
  Send,
  Calendar,
  Users,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const mockAnnouncements = [
  {
    id: "1",
    title: "Event Schedule Update",
    message: "The venue doors will now open at 6 PM instead of 7 PM. Please plan accordingly.",
    event: "Tech Innovation Summit 2024",
    sentAt: "2024-12-10T14:30:00",
    recipientCount: 450,
  },
  {
    id: "2",
    title: "Parking Information",
    message: "Free parking is available at Lot B. Show your ticket for complimentary access.",
    event: "Electronic Music Festival",
    sentAt: "2024-12-08T10:00:00",
    recipientCount: 2800,
  },
  {
    id: "3",
    title: "Weather Advisory",
    message: "Please bring an umbrella as there's a chance of rain. The event will proceed as planned.",
    event: "Startup Pitch Competition",
    sentAt: "2024-12-05T16:45:00",
    recipientCount: 180,
  },
];

const mockEvents = [
  { id: "1", title: "Tech Innovation Summit 2024", attendees: 450 },
  { id: "2", title: "Electronic Music Festival", attendees: 2800 },
  { id: "3", title: "Startup Pitch Competition", attendees: 180 },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    eventId: "",
  });

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!formData.title || !formData.message || !formData.eventId) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedEvent = mockEvents.find((e) => e.id === formData.eventId);
    const newAnnouncement = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      event: selectedEvent?.title || "",
      sentAt: new Date().toISOString(),
      recipientCount: selectedEvent?.attendees || 0,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setFormData({ title: "", message: "", eventId: "" });
    setDialogOpen(false);
    toast.success(`Announcement sent to ${selectedEvent?.attendees} attendees`);
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast.success("Announcement deleted");
  };

  return (
    <DashboardLayout role="organizer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Send updates to your event attendees</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Select Event</label>
                  <Select
                    value={formData.eventId}
                    onValueChange={(value) => setFormData({ ...formData, eventId: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} ({event.attendees} attendees)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your announcement..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <Button variant="hero" className="w-full" onClick={handleSend}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                        <p className="text-muted-foreground">{announcement.message}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{announcement.event}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{announcement.recipientCount} recipients</span>
                          </div>
                          <Badge variant="secondary">
                            {new Date(announcement.sentAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(announcement.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <Card variant="elevated" className="p-12 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No announcements yet</h3>
            <p className="text-muted-foreground mb-6">
              Send your first announcement to keep attendees informed
            </p>
            <Button variant="hero" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
