import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

export default function VolunteerLogin() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("שגיאה בהתחברות / Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>כניסת מתנדבים 🔐</h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Volunteer access only
        </p>
        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20} style={{ marginLeft: "10px" }} />
          התחבר עם Google / Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display:"flex", justifyContent:"center", alignItems:"center",
    minHeight:"80vh", background:"#f8f4fc" },
  card: { display:"flex", flexDirection:"column", alignItems:"center", padding:"40px",
    background:"white", borderRadius:"12px", boxShadow:"0 2px 12px rgba(0,0,0,0.1)" },
  googleBtn: { display:"flex", alignItems:"center", padding:"12px 24px", fontSize:"1rem",
    background:"white", border:"2px solid #ddd", borderRadius:"8px", cursor:"pointer",
    fontWeight:"bold", transition:"box-shadow 0.2s" },
};