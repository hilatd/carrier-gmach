import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthState } from "../hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import type { CarrierRequest } from "../types";

export default function Dashboard() {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CarrierRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "handled">("open");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as CarrierRequest)));
    });
  }, []);

  const filtered = requests.filter(r => filter === "all" ? true : r.status === filter);

  if (loading) return <div style={{ textAlign:"center", padding:"48px" }}>טוען...</div>;

  return (
    <div style={styles.page}>
      <h2>לוח בקשות / Requests Dashboard</h2>
      <div style={styles.filters}>
        {(["open","handled","all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, background: filter === f ? "#6d4c8e" : "#eee",
              color: filter === f ? "white" : "#333" }}>
            {f === "open" ? "פתוחות" : f === "handled" ? "טופלו" : "הכל"}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {filtered.length === 0
          ? <p>אין בקשות / No requests</p>
          : filtered.map(r => <RequestCard key={r.id} request={r} />)
        }
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding:"24px", background:"#f8f4fc", minHeight:"100vh" },
  filters: { display:"flex", gap:"10px", marginBottom:"20px" },
  filterBtn: { padding:"8px 18px", borderRadius:"20px", border:"none", cursor:"pointer", fontWeight:"bold" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:"16px" },
};