import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "../hooks/useAuthState";

export default function Navbar() {
  const { user } = useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🤱 גמ״ח מנשאים</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>לוח בקשות</Link>
            <button onClick={handleLogout} style={styles.btn}>התנתק</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>כניסת מתנדבים</Link>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"12px 24px", background:"#6d4c8e", color:"white" },
  brand: { color:"white", textDecoration:"none", fontSize:"1.3rem", fontWeight:"bold" },
  links: { display:"flex", gap:"16px", alignItems:"center" },
  link: { color:"white", textDecoration:"none" },
  btn: { background:"transparent", border:"1px solid white", color:"white",
    padding:"6px 12px", borderRadius:"6px", cursor:"pointer" },
};