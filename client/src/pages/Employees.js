import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

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
      setMsg(`✓ Updated ${empPSC}`);
    } else {
      setMsg("✗ Update failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div className="employees-header-content">
          <h2>Employees Management</h2>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="employees-content">
        {msg && <div className="employees-message">{msg}</div>}

        {rows.length === 0 ? (
          <div className="employees-table-wrapper">
            <div className="empty-state">
              <p>No employees found</p>
            </div>
          </div>
        ) : (
          <div className="employees-table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Employee PSC</th>
                  <th>Tag ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.empPSC}>
                    <td>{r.empPSC}</td>
                    <td>
                      <input
                        type="text"
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
                      <button className="save-btn" onClick={() => update(r.empPSC, r.empTagId ?? "")}>
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
