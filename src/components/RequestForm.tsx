import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { CarrierRequest } from "../types";

export default function RequestForm() {
  const [form, setForm] = useState({ parentName:"", phone:"", babyAge:"", carrierType:"", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const request: CarrierRequest = { ...form, status: "open", createdAt: Date.now() };
    await addDoc(collection(db, "requests"), request);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <div style={styles.success}>
      ✅ הבקשה נשלחה! מתנדב יצור איתך קשר בקרוב 💜
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>פתיחת בקשה / Open a Request</h2>

      <label>שם ההורה / Parent Name</label>
      <input name="parentName" required value={form.parentName} onChange={handleChange} style={styles.input} />

      <label>טלפון / Phone</label>
      <input name="phone" required value={form.phone} onChange={handleChange} style={styles.input} />

      <label>גיל התינוק / Baby Age</label>
      <input name="babyAge" required placeholder="e.g. 3 months" value={form.babyAge} onChange={handleChange} style={styles.input} />

      <label>סוג מנשא מבוקש / Carrier Type</label>
      <select name="carrierType" required value={form.carrierType} onChange={handleChange} style={styles.input}>
        <option value="">-- בחר / Select --</option>
        <option value="soft-structured">Soft Structured (SSC)</option>
        <option value="wrap">Wrap / עטיפה</option>
        <option value="ring-sling">Ring Sling</option>
        <option value="meh-dai">Mei Dai</option>
        <option value="any">כל סוג / Any</option>
      </select>

      <label>הערות / Notes</label>
      <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={styles.input} />

      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? "שולח..." : "שליחת בקשה / Submit"}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { display:"flex", flexDirection:"column", gap:"10px", maxWidth:"500px",
    margin:"0 auto", padding:"24px", background:"white", borderRadius:"12px",
    boxShadow:"0 2px 12px rgba(0,0,0,0.1)" },
  input: { padding:"10px", borderRadius:"6px", border:"1px solid #ccc", fontSize:"1rem", width:"100%", boxSizing:"border-box" },
  btn: { background:"#6d4c8e", color:"white", border:"none", padding:"12px",
    borderRadius:"8px", fontSize:"1rem", cursor:"pointer" },
  success: { textAlign:"center", fontSize:"1.2rem", padding:"32px", color:"#6d4c8e" },
};