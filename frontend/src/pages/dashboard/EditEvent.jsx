import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Users, Image, ArrowLeft, Loader2, AlertCircle, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { organizerService } from "@/services/organizerService";
import { categoryService } from "@/services/publicService";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [ticketTypes, setTicketTypes] = useState([
    { name: "General Admission", price: "", quantity: "" }
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    capacity: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchEvent();
    loadCategories();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizerService.getEvent(id);
      const event = response?.data || response || {};
      
      console.log('Event data received:', event); // Debug log
      
      // Helper function to format datetime for input
      const formatDatetime = (dateStr) => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return "";
          // Format as YYYY-MM-DDTHH:MM for datetime-local input
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return "";
        }
      };
      
      setFormData({
        title: event.title || "",
        description: event.description || "",
        date: formatDatetime(event.start_date),
        endDate: formatDatetime(event.end_date),
        location: event.location || "",
        capacity: event.capacity ? String(event.capacity) : "",
        categoryId: event.category_id ? String(event.category_id) : "",
        imageUrl: event.image_url || "",
      });
      
      // Load ticket types
      if (event.ticket_types && event.ticket_types.length > 0) {
        setTicketTypes(event.ticket_types.map(tt => ({
          name: tt.name || "",
          price: tt.price ? String(tt.price) : "",
          quantity: tt.quantity ? String(tt.quantity) : ""
        })));
      }
      
      // Set image preview if exists
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
    } catch (err) {
      console.error('Request failed');
      setError(err.response?.data?.message || "Failed to load event");
      toast.error(err.response?.data?.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const list = response?.data || response || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Request failed');
      toast.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTicketTypeChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }]);
  };

  const removeTicketType = (index) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    } else {
      toast.error("At least one ticket type is required");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate ticket types
      const validTicketTypes = ticketTypes.filter(tt => tt.name && tt.price && tt.quantity);
      if (validTicketTypes.length === 0) {
        toast.error("Please add at least one valid ticket type");
        setIsSubmitting(false);
        return;
      }

      // Calculate total capacity from all ticket types
      const totalCapacity = validTicketTypes.reduce((sum, tt) => sum + Number(tt.quantity), 0);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('end_date', formData.endDate || formData.date);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('capacity', totalCapacity);
      formDataToSend.append('category_id', Number(formData.categoryId));
      formDataToSend.append('latitude', '');
      formDataToSend.append('longitude', '');
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Append all ticket types
      validTicketTypes.forEach((ticketType, index) => {
        formDataToSend.append(`ticket_types[${index}][name]`, ticketType.name);
        formDataToSend.append(`ticket_types[${index}][price]`, Number(ticketType.price));
        formDataToSend.append(`ticket_types[${index}][quantity]`, Number(ticketType.quantity));
      });

      await organizerService.updateEvent(id, formDataToSend);
      toast.success("Event updated successfully!");
      navigate("/dashboard/my-events");
    } catch (err) {
      console.error('Request failed');
      console.error('Request failed');
      const errorMessage = err.response?.data?.message || "Failed to update event";
      const errors = err.response?.data?.errors;
      
      if (errors) {
        // Display validation errors
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="organizer">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="organizer">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchEvent}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="organizer">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Event</h1>
            <p className="text-muted-foreground">Update your event details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                    disabled={loadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date & Time *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Venue Name *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Moscone Center"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, San Francisco, CA 94105"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Ticket className="w-5 h-5 text-primary" />
                  Ticket Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypes.map((ticketType, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4 bg-secondary/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Ticket Type {index + 1}</h4>
                      {ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ticket-name-${index}`}>Ticket Name *</Label>
                        <Select
                          value={ticketType.name}
                          onValueChange={(value) => handleTicketTypeChange(index, 'name', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ticket type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Admission">General Admission</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                            <SelectItem value="Early Bird">Early Bird</SelectItem>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Group">Group</SelectItem>
                            <SelectItem value="Family">Family</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ticket-price-${index}`}>Price ($) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id={`ticket-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            value={ticketType.price}
                            onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ticket-quantity-${index}`}>Quantity *</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id={`ticket-quantity-${index}`}
                            type="number"
                            min="1"
                            placeholder="100"
                            value={ticketType.quantity}
                            onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTicketType}
                  className="w-full"
                >
                  + Add Another Ticket Type
                </Button>
              </CardContent>
            </Card>

            {/* Event Image */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Image className="w-5 h-5 text-primary" />
                  Event Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a new image or keep the existing one
                  </p>
                </div>
                {imagePreview && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditEvent;
