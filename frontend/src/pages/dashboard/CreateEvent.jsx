import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar, MapPin, DollarSign, Users, Image, ArrowLeft, Loader2, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { organizerService } from "@/services/organizerService";
import { categoryService } from "@/services/publicService";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([
    { name: "General Admission", price: "", quantity: "" }
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    address: "",
    capacity: "",
    categoryId: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Request failed');
        setCategoryError(err.response?.data?.message || "Failed to load categories");
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview URL
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

    // Validate category selection
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    // Validate ticket types
    const validTicketTypes = ticketTypes.filter(tt => tt.name && tt.price && tt.quantity);
    if (validTicketTypes.length === 0) {
      toast.error("Please add at least one valid ticket type");
      return;
    }

    // Calculate total capacity from all ticket types
    const totalCapacity = validTicketTypes.reduce((sum, tt) => sum + Number(tt.quantity), 0);

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('date', formData.date);
    payload.append('end_date', formData.endDate || formData.date);
    payload.append('location', formData.location);
    payload.append('address', formData.address);
    payload.append('capacity', totalCapacity);
    payload.append('category_id', Number(formData.categoryId));
    payload.append('latitude', '');
    payload.append('longitude', '');
    
    if (imageFile) {
      payload.append('image', imageFile);
    }
    
    // Append all ticket types as array items
    validTicketTypes.forEach((ticketType, index) => {
      payload.append(`ticket_types[${index}][name]`, ticketType.name);
      payload.append(`ticket_types[${index}][price]`, Number(ticketType.price));
      payload.append(`ticket_types[${index}][quantity]`, Number(ticketType.quantity));
    });

    try {
      await organizerService.createEvent(payload);
      toast.success("Event created successfully. Awaiting admin approval.");
      navigate("/dashboard/my-events");
    } catch (err) {
      console.error('Request failed');
      console.error('Request failed');
      const errorMessage = err.response?.data?.message || "Failed to create event";
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

  return (
    <DashboardLayout role="organizer">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Event</h1>
            <p className="text-muted-foreground">Fill in the details for your new event</p>
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
                  {categoryError ? (
                    <div className="text-sm text-destructive">{categoryError}</div>
                  ) : null}
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                    disabled={loadingCategories || !!categoryError}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCategories ? "Loading..." : categoryError ? "Failed to load categories" : "Select a category"} />
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

            {/* Tickets & Pricing */}
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
                  <Label htmlFor="imageFile">Upload Image</Label>
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
                {imagePreview && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-full object-cover"
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
