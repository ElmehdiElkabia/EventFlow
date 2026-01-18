import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Ticket,
  Star,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    bio: "Event enthusiast and tech lover. Always looking for the next great experience!",
    joinedDate: "December 2023",
  });

  const stats = [
    { label: "Events Attended", value: 24, icon: Ticket },
    { label: "Reviews Written", value: 18, icon: Star },
    { label: "Badges Earned", value: 5, icon: Award },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Button variant="hero" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-foreground">JD</span>
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{profile.fullName}</h3>
                    <p className="text-muted-foreground">Member since {profile.joinedDate}</p>
                    <Badge variant="outline" className="mt-2">
                      Verified Account
                    </Badge>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{profile.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{profile.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-foreground">{profile.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Purchased ticket",
                    event: "Tech Innovation Summit",
                    date: "2 hours ago",
                  },
                  {
                    action: "Left a review",
                    event: "Electronic Music Festival",
                    date: "3 days ago",
                  },
                  {
                    action: "Attended",
                    event: "Startup Pitch Competition",
                    date: "1 week ago",
                  },
                  {
                    action: "Earned badge",
                    event: "First Review",
                    date: "2 weeks ago",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.event}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
