import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  async function load() {
    setMsg("");
    const res = await fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const data = await res.json();
    setRows(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  async function update(empPSC, empTagId) {
    setMsg("");
    const res = await fetch(`http://localhost:5000/api/employees/${empPSC}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ empTagId }),
    });

    if (res.ok) {
      setMsg(`Updated ${empPSC}`);
    } else {
      setMsg("Update failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Employees</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {msg && <p>{msg}</p>}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>empPSC</th>
            <th>empTagId</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.empPSC}>
              <td>{r.empPSC}</td>
              <td>
                <input
                  value={r.empTagId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRows((prev) =>
                      prev.map((x) => (x.empPSC === r.empPSC ? { ...x, empTagId: v } : x))
                    );
                  }}
                />
              </td>
              <td>
                <button onClick={() => update(r.empPSC, r.empTagId ?? "")}>
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
