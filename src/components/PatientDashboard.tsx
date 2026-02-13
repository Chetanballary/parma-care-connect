import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, FileText, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-accent text-accent-foreground",
  confirmed: "bg-primary/15 text-primary",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

const PatientDashboard = ({ profile }: { profile: any }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [apptRes, recRes] = await Promise.all([
        supabase.from("appointments").select("*").eq("patient_id", session.user.id).order("appointment_date", { ascending: true }),
        supabase.from("patient_records").select("*").eq("patient_id", session.user.id).order("record_date", { ascending: false }),
      ]);

      if (apptRes.data) setAppointments(apptRes.data);
      if (recRes.data) setRecords(recRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {profile?.full_name || "Patient"}</h1>
          <p className="text-muted-foreground">Manage your health journey</p>
        </div>
        <Link to="/book-appointment">
          <Button className="gap-2">
            <CalendarPlus className="h-4 w-4" /> Book Appointment
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.filter(a => a.status === "pending").length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.filter(a => a.status === "completed").length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{records.length}</p>
              <p className="text-sm text-muted-foreground">Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarPlus className="h-5 w-5 text-primary" /> Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No appointments yet. Book your first one!</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(appt => (
                <div key={appt.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium capitalize">{appt.appointment_type.replace("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(appt.appointment_date), "PPP 'at' p")}</p>
                    {appt.notes && <p className="mt-1 text-sm text-muted-foreground">{appt.notes}</p>}
                  </div>
                  <Badge className={statusColors[appt.status] || ""} variant="secondary">{appt.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No records yet.</p>
          ) : (
            <div className="space-y-3">
              {records.map(rec => (
                <div key={rec.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm capitalize text-muted-foreground">{rec.record_type.replace("_", " ")}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{format(new Date(rec.record_date), "PPP")}</span>
                  </div>
                  {rec.description && <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
