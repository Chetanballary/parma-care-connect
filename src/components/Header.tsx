import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">MedCare</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/book-appointment" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Book Appointment</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <Link to="/auth"><Button variant="outline" size="sm">Log In</Button></Link>
              <Link to="/auth?tab=signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/book-appointment" className="text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>Book Appointment</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMenuOpen(false)}><Button variant="outline" size="sm" className="w-full">Log In</Button></Link>
                <Link to="/auth?tab=signup" onClick={() => setMenuOpen(false)}><Button size="sm" className="w-full">Sign Up</Button></Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
