// import { useState } from "react";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// const App = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a CSV file");

//     const formData = new FormData();
//     formData.append("csv", file);

//     try {
//       setLoading(true);

//       const res = await fetch(  `${API_BASE_URL}/mail/send-mails`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       alert(data.message);
//     } catch (err) {
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>📧 Automated Email Sender</h1>
//         <p style={styles.subtitle}>
//           Upload a CSV file to send automated emails
//         </p>

//         <label style={styles.fileBox}>
//           <input
//             type="file"
//             accept=".csv"
//             style={{ display: "none" }}
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           {file ? `📄 ${file.name}` : "📂 Choose CSV File"}
//         </label>

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           style={{
//             ...styles.button,
//             ...(loading ? styles.buttonDisabled : {}),
//           }}
//         >
//           {loading ? (
//             <span style={styles.loader}></span>
//           ) : (
//             "Send Emails"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------- STYLES ---------------- */

// const styles = {
//   page: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background:
//       "linear-gradient(135deg, #667eea, #764ba2, #6b8dd6)",
//     backgroundSize: "400% 400%",
//     animation: "gradientBG 10s ease infinite",
//   },

//   card: {
//     background: "#fff",
//     padding: "40px",
//     borderRadius: "16px",
//     width: "360px",
//     textAlign: "center",
//     boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
//     animation: "fadeUp 0.8s ease",
//   },

//   title: {
//     marginBottom: "10px",
//     color: "#333",
//   },

//   subtitle: {
//     fontSize: "14px",
//     color: "#666",
//     marginBottom: "25px",
//   },

//   fileBox: {
//     display: "block",
//     padding: "14px",
//     border: "2px dashed #764ba2",
//     borderRadius: "10px",
//     cursor: "pointer",
//     color: "#764ba2",
//     marginBottom: "20px",
//     transition: "all 0.3s",
//   },

//   button: {
//     width: "100%",
//     padding: "12px",
//     border: "none",
//     borderRadius: "10px",
//     fontSize: "16px",
//     color: "#fff",
//     background:
//       "linear-gradient(135deg, #667eea, #764ba2)",
//     cursor: "pointer",
//     transition: "transform 0.2s, box-shadow 0.2s",
//   },

//   buttonDisabled: {
//     opacity: 0.7,
//     cursor: "not-allowed",
//   },

//   loader: {
//     width: "22px",
//     height: "22px",
//     border: "3px solid rgba(255,255,255,0.4)",
//     borderTop: "3px solid #fff",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     display: "inline-block",
//   },
// };

// /* ---------------- ANIMATIONS ---------------- */

// const styleSheet = document.styleSheets[0];
// styleSheet.insertRule(`
// @keyframes fadeUp {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// `, styleSheet.cssRules.length);

// styleSheet.insertRule(`
// @keyframes spin {
//   to { transform: rotate(360deg); }
// }
// `, styleSheet.cssRules.length);

// styleSheet.insertRule(`
// @keyframes gradientBG {
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// }
// `, styleSheet.cssRules.length);

// export default App;


import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  /* ---------------- CSS (SAFE FOR VITE) ---------------- */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /* ---------------- HANDLER ---------------- */
  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");
    if (!subject.trim()) return alert("Please enter email subject");
    if (!body.trim()) return alert("Please enter email body");

    const formData = new FormData();
    formData.append("csv", file);
    formData.append("subject", subject);
    formData.append("body", body);

    try {
      setLoading(true);
      setSentEmails([]); // reset previous results

      const res = await fetch(`${API_BASE_URL}/mail/send-mails`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setSentEmails(data.sentEmails || []);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📧 Automated Email Sender</h1>
        <p style={styles.subtitle}>
          Upload a CSV and send personalized emails
        </p>

        {/* SUBJECT */}
        <input
          type="text"
          placeholder="Email Subject (e.g. Welcome {{name}})"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />

        {/* BODY */}
        <textarea
          placeholder={`Email Body (use {{name}})\n\nHi {{name}},\nWelcome to our platform!`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          style={styles.textarea}
        />

        {/* CSV */}
        <label style={styles.fileBox}>
          <input
            type="file"
            accept=".csv"
            hidden
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
          {loading ? <span style={styles.loader} /> : "Send Emails"}
        </button>

        <p style={styles.hint}>
          CSV format: <b>from,name</b>
        </p>

        {/* ================= SENT EMAILS ================= */}
        {sentEmails.length > 0 && (
          <div style={styles.resultBox}>
            <h3 style={styles.resultTitle}>
              ✅ Emails Sent ({sentEmails.length})
            </h3>
            <div style={styles.emailList}>
              {sentEmails.map((email, index) => (
                <div key={index} style={styles.emailItem}>
                  {email}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2, #6b8dd6)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 10s ease infinite",
  },
  card: {
    background: "#fff",
    padding: "36px",
    borderRadius: "16px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    animation: "fadeUp 0.8s ease",
  },
  title: { marginBottom: "8px", color: "#333" },
  subtitle: { fontSize: "14px", color: "#666", marginBottom: "18px" },
  
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
  },
  fileBox: {
    padding: "14px",
    border: "2px dashed #764ba2",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#764ba2",
    marginBottom: "16px",
    display: "block",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  buttonDisabled: { opacity: 0.7, cursor: "not-allowed" },
  loader: {
    width: "22px",
    height: "22px",
    border: "3px solid rgba(255,255,255,0.4)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
  hint: { marginTop: "10px", fontSize: "12px", color: "#777" },

  /* Sent emails */
  resultBox: {
    marginTop: "24px",
    textAlign: "left",
  },
  resultTitle: {
    fontSize: "14px",
    marginBottom: "8px",
    color: "#16a34a",
  },
  emailList: {
    maxHeight: "160px",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px",
    background: "#f9fafb",
  },
  emailItem: {
    fontSize: "13px",
    padding: "4px 0",
    borderBottom: "1px dashed #e5e7eb",
  },
};

export default App;


