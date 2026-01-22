import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterProjectId, setFilterProjectId] = useState("");
  const [filterPSC, setFilterPSC] = useState("");
  const [filterTagId, setFilterTagId] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  async function load() {
    setMsg("");
    
    // Fetch employees
    const empRes = await fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (empRes.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const empData = await empRes.json();
    setAllRows(empData);
    setRows(empData);

    // Fetch projects
    const projRes = await fetch("http://localhost:5000/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Projects Response:", projRes.status);
    if (projRes.ok) {
      const projData = await projRes.json();
      console.log("Projects Data:", projData);
      setProjects(projData);
    } else {
      console.log("Projects fetch failed:", await projRes.text());
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  function applyFilters(psc, tagId, projId) {
    let filtered = allRows;

    if (psc.trim() !== "") {
      filtered = filtered.filter(emp => emp.empPSC.toLowerCase().includes(psc.toLowerCase()));
    }

    if (tagId.trim() !== "") {
      filtered = filtered.filter(emp => emp.empTagId && emp.empTagId.toLowerCase().includes(tagId.toLowerCase()));
    }

    if (projId !== "") {
      filtered = filtered.filter(emp => emp.empProjID === parseInt(projId));
    }

    setRows(filtered);
  }

  function handleProjectFilter(e) {
    const projId = e.target.value;
    setFilterProjectId(projId);
    applyFilters(filterPSC, filterTagId, projId);
  }

  function handlePSCFilter(e) {
    const psc = e.target.value;
    setFilterPSC(psc);
    applyFilters(psc, filterTagId, filterProjectId);
  }

  function handleTagIdFilter(e) {
    const tagId = e.target.value;
    setFilterTagId(tagId);
    applyFilters(filterPSC, tagId, filterProjectId);
  }

  function handleClearFilters() {
    setFilterPSC("");
    setFilterTagId("");
    setFilterProjectId("");
    setRows(allRows);
  }

  async function update(empPSC, empTagId, empProjID) {
    setMsg("");
    const res = await fetch(`http://localhost:5000/api/employees/${empPSC}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ empTagId, empProjID }),
    });

    if (res.ok) {
      setMsg(`✓ Updated ${empPSC}`);
      // Auto-dismiss message after 3 seconds
      setTimeout(() => {
        setMsg("");
      }, 3000);
    } else {
      setMsg("✗ Update failed");
      // Auto-dismiss error message after 3 seconds
      setTimeout(() => {
        setMsg("");
      }, 3000);
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

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="pscFilter">PSC:</label>
            <input
              id="pscFilter"
              type="text"
              placeholder="Search by PSC..."
              value={filterPSC}
              onChange={handlePSCFilter}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="tagIdFilter">Tag ID:</label>
            <input
              id="tagIdFilter"
              type="text"
              placeholder="Search by Tag ID..."
              value={filterTagId}
              onChange={handleTagIdFilter}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="projectFilter">Project:</label>
            <select
              id="projectFilter"
              value={filterProjectId}
              onChange={handleProjectFilter}
              className="project-filter"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.prjSeq} value={p.prjSeq}>
                  {p.prjDesc}
                </option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

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
                  <th>Project</th>
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
                      <select
                        value={r.empProjID ?? ""}
                        onChange={(e) => {
                          const v = e.target.value ? parseInt(e.target.value) : null;
                          setRows((prev) =>
                            prev.map((x) => (x.empPSC === r.empPSC ? { ...x, empProjID: v } : x))
                          );
                        }}
                      >
                        <option value="">-- Select Project --</option>
                        {projects.map((p) => (
                          <option key={p.prjSeq} value={p.prjSeq}>
                            {p.prjDesc}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button 
                        className="save-btn" 
                        onClick={() => update(r.empPSC, r.empTagId ?? "", r.empProjID)}
                      >
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
