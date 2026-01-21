import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const NotAllowed = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Access denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have permission to view this page. Please switch to an account with the appropriate role or return to the dashboard.
        </p>
        <div className="flex gap-3">
          <Link to="/dashboard" className="text-primary hover:underline">Go to dashboard</Link>
          <Link to="/" className="text-muted-foreground hover:underline">Back to home</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotAllowed;
