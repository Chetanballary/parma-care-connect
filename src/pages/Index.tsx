import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-medical.jpg";
import { CalendarPlus, FileText, Shield, Stethoscope, Users, Mail } from "lucide-react";

const features = [
  { icon: CalendarPlus, title: "Easy Appointments", desc: "Book blood checkups and consultations with just a few clicks" },
  { icon: FileText, title: "Digital Records", desc: "Access your medical history and test results anytime, anywhere" },
  { icon: Shield, title: "Secure & Private", desc: "Your health data is encrypted and protected with enterprise security" },
  { icon: Mail, title: "Email Reports", desc: "Get your test results and records sent directly to your inbox" },
  { icon: Stethoscope, title: "Doctor Portal", desc: "Dedicated dashboard for doctors to manage patients efficiently" },
  { icon: Users, title: "Patient Management", desc: "Complete patient lifecycle from registration to follow-ups" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative mx-auto grid gap-8 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Your Health,{" "}
              <span className="opacity-90">Simplified.</span>
            </h1>
            <p className="max-w-md text-lg text-primary-foreground/80">
              Book appointments, access medical records, and manage your healthcare journey — all in one secure platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth?tab=signup">
                <Button size="lg" variant="secondary" className="font-semibold shadow-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/book-appointment">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Modern healthcare management"
              className="w-full max-w-lg rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">Everything You Need</h2>
          <p className="mt-3 text-muted-foreground">Complete healthcare management for patients and doctors</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i} className="shadow-card transition-all hover:-translate-y-1 hover:shadow-medical">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">Ready to Take Control of Your Health?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Join thousands of patients and doctors using MedCare for seamless healthcare management.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary" className="font-semibold">Sign Up as Patient</Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                Join as Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ParmaConnect. All rights reserved. Your trusted healthcare management platform.
        </div>
      </footer>
    </div>
  );
};

export default Index;
