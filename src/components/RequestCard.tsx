import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { CarrierRequest } from "../types";

interface Props { request: CarrierRequest; }

export default function RequestCard({ request }: Props) {
  const markHandled = async () => {
    if (!request.id) return;
    await updateDoc(doc(db, "requests", request.id), { status: "handled" });
  };

  const date = new Date(request.createdAt).toLocaleDateString("he-IL");

  return (
    <div style={{ ...styles.card, borderRight: `4px solid ${request.status === "open" ? "#6d4c8e" : "#aaa"}` }}>
      <div style={styles.row}>
        <strong>{request.parentName}</strong>
        <span style={styles.date}>{date}</span>
      </div>
      <div>📞 {request.phone}</div>
      <div>👶 גיל: {request.babyAge}</div>
      <div>🎽 סוג מנשא: {request.carrierType}</div>
      {request.notes && <div>📝 {request.notes}</div>}
      <div style={styles.row}>
        <span style={{ color: request.status === "open" ? "#6d4c8e" : "#aaa" }}>
          {request.status === "open" ? "🟣 פתוח" : "✅ טופל"}
        </span>
        {request.status === "open" && (
          <button onClick={markHandled} style={styles.btn}>סמן כטופל</button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background:"white", borderRadius:"10px", padding:"16px",
    boxShadow:"0 2px 8px rgba(0,0,0,0.08)", display:"flex", flexDirection:"column", gap:"8px" },
  row: { display:"flex", justifyContent:"space-between", alignItems:"center" },
  date: { color:"#888", fontSize:"0.85rem" },
  btn: { background:"#6d4c8e", color:"white", border:"none", padding:"6px 14px",
    borderRadius:"6px", cursor:"pointer", fontSize:"0.85rem" },
};