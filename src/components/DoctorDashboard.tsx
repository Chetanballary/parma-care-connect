import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, FilePlus, CheckCircle, Mail } from "lucide-react";
import { format } from "date-fns";

const DoctorDashboard = ({ profile }: { profile: any }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [recordDialog, setRecordDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recordForm, setRecordForm] = useState({ title: "", description: "", record_type: "blood_test" });
  const { toast } = useToast();

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: appts } = await supabase.from("appointments").select("*").eq("doctor_id", session.user.id).order("appointment_date", { ascending: true });
    if (appts) {
      setAppointments(appts);
      const patientIds = [...new Set(appts.map(a => a.patient_id))];
      if (patientIds.length > 0) {
        const { data: pts } = await supabase.from("profiles").select("*").in("user_id", patientIds);
        if (pts) setPatients(pts);
      }
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    fetchData();
    toast({ title: `Appointment ${status}` });
  };

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !selectedPatient) return;

    const { error } = await supabase.from("patient_records").insert({
      patient_id: selectedPatient,
      doctor_id: session.user.id,
      title: recordForm.title,
      description: recordForm.description,
      record_type: recordForm.record_type,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Record added successfully" });
      setRecordDialog(false);
      setRecordForm({ title: "", description: "", record_type: "blood_test" });
    }
  };

  const getPatientName = (patientId: string) => {
    const p = patients.find(pt => pt.user_id === patientId);
    return p?.full_name || "Unknown Patient";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dr. {profile?.full_name || "Doctor"}</h1>
          <p className="text-muted-foreground">{profile?.specialization || "Medical Professional"}</p>
        </div>
        <Dialog open={recordDialog} onOpenChange={setRecordDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2"><FilePlus className="h-4 w-4" /> Add Patient Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Patient Record</DialogTitle></DialogHeader>
            <form onSubmit={addRecord} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.user_id} value={p.user_id}>{p.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <Select value={recordForm.record_type} onValueChange={v => setRecordForm({ ...recordForm, record_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_test">Blood Test</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="lab_report">Lab Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={recordForm.title} onChange={e => setRecordForm({ ...recordForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description / Results</Label>
                <Textarea value={recordForm.description} onChange={e => setRecordForm({ ...recordForm, description: e.target.value })} rows={4} />
              </div>
              <Button type="submit" className="w-full">Save Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
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
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(appt => (
                <div key={appt.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{getPatientName(appt.patient_id)}</p>
                    <p className="text-sm capitalize text-muted-foreground">{appt.appointment_type.replace("_", " ")} — {format(new Date(appt.appointment_date), "PPP 'at' p")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={appt.status === "pending" ? "bg-accent/20 text-accent-foreground" : appt.status === "confirmed" ? "bg-primary/15 text-primary" : "bg-success/15 text-success"}>{appt.status}</Badge>
                    {appt.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, "confirmed")}>Confirm</Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(appt.id, "cancelled")} className="text-destructive">Cancel</Button>
                      </>
                    )}
                    {appt.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateStatus(appt.id, "completed")}>Complete</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
