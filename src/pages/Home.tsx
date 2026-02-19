import RequestForm from "../components/RequestForm";

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1>🤱 גמ״ח מנשאים</h1>
        <p style={styles.subtitle}>Baby Carrier Lending Library</p>
        <p style={styles.desc}>
          אנחנו קבוצת מתנדבים שמשאילה מנשאים לתינוקות בחינם לקהילה.<br/>
          We lend baby carriers for free to families in our community.
        </p>
      </section>

      <section style={styles.howItWorks}>
        <h2>איך זה עובד? / How it works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>📝<br/>מלאי טופס<br/><small>Fill the form below</small></div>
          <div style={styles.step}>📞<br/>מתנדב יצור קשר<br/><small>A volunteer contacts you</small></div>
          <div style={styles.step}>🎽<br/>קבלו מנשא<br/><small>Receive a carrier</small></div>
        </div>
      </section>

      <section style={styles.formSection}>
        <RequestForm />
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily:"'Segoe UI', sans-serif", background:"#f8f4fc", minHeight:"100vh" },
  hero: { textAlign:"center", padding:"48px 24px 24px", background:"#6d4c8e", color:"white" },
  subtitle: { fontSize:"1.2rem", opacity:0.85, marginTop:0 },
  desc: { fontSize:"1rem", lineHeight:"1.8", maxWidth:"500px", margin:"0 auto" },
  howItWorks: { textAlign:"center", padding:"32px 24px" },
  steps: { display:"flex", justifyContent:"center", gap:"32px", flexWrap:"wrap", marginTop:"16px" },
  step: { fontSize:"1.1rem", lineHeight:"1.8", padding:"16px", background:"white",
    borderRadius:"12px", minWidth:"120px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)" },
  formSection: { padding:"24px" },
};