import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    const formData = new FormData();
    formData.append("csv", file);

    try {
      setLoading(true);

      const res = await fetch(  `${API_BASE_URL}/mail/send-mails`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📧 Automated Email Sender</h1>
        <p style={styles.subtitle}>
          Upload a CSV file to send automated emails
        </p>

        <label style={styles.fileBox}>
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? `📄 ${file.name}` : "📂 Choose CSV File"}
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? (
            <span style={styles.loader}></span>
          ) : (
            "Send Emails"
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #667eea, #764ba2, #6b8dd6)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 10s ease infinite",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    animation: "fadeUp 0.8s ease",
  },

  title: {
    marginBottom: "10px",
    color: "#333",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "25px",
  },

  fileBox: {
    display: "block",
    padding: "14px",
    border: "2px dashed #764ba2",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#764ba2",
    marginBottom: "20px",
    transition: "all 0.3s",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    color: "#fff",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  loader: {
    width: "22px",
    height: "22px",
    border: "3px solid rgba(255,255,255,0.4)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
};

/* ---------------- ANIMATIONS ---------------- */

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes spin {
  to { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`, styleSheet.cssRules.length);

export default App;
