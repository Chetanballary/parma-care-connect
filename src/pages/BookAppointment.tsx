import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus } from "lucide-react";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({ doctor_id: "", appointment_type: "blood_checkup", appointment_date: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
    };
    checkAuth();

    const fetchDoctors = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("role", "doctor");
      if (data) setDoctors(data);
    };
    fetchDoctors();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }

    const { error } = await supabase.from("appointments").insert({
      patient_id: session.user.id,
      doctor_id: form.doctor_id,
      appointment_type: form.appointment_type,
      appointment_date: new Date(form.appointment_date).toISOString(),
      notes: form.notes,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Appointment booked!", description: "Your appointment request has been submitted." });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <CalendarPlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Book an Appointment</CardTitle>
            <CardDescription>Schedule a blood checkup or consultation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={form.doctor_id} onValueChange={v => setForm({ ...form, doctor_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map(doc => (
                      <SelectItem key={doc.user_id} value={doc.user_id}>
                        Dr. {doc.full_name} {doc.specialization ? `(${doc.specialization})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select value={form.appointment_type} onValueChange={v => setForm({ ...form, appointment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_checkup">Blood Checkup</SelectItem>
                    <SelectItem value="general_checkup">General Checkup</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input type="datetime-local" required value={form.appointment_date} onChange={e => setForm({ ...form, appointment_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea placeholder="Any specific concerns or requirements" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !form.doctor_id}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
