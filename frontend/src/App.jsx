import React, { useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "recruiter") {
        setPage("recruiter");
        loadJobs();
      } else {
        setPage("jobseeker");
        loadJobs();
      }

      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const loadJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      setMessage("Unable to load jobs");
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await API.get(
        `/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = res.data;
      setApplicants(
        Array.isArray(data) ? data : data.applications || []
      );
      setPage("applicants");
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load applicants"
      );
    }
  };

  const applyJob = async (jobId) => {
    try {
      const res = await API.post(
        `/applications/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message || "Application submitted successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Application failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setPage("home");
    setMessage("Logged out successfully");
  };

  return (
    <div className="container">
      <nav>
        <h2>JobPortal</h2>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={logout}>Logout</button>
      </nav>

      {page === "home" && (
        <section className="hero">
          <h1>Welcome to JobPortal</h1>
          <p>Find Your Dream Job</p>
          <button onClick={() => setPage("login")}>Login</button>
        </section>
      )}

      {page === "login" && (
        <div className="register-box">
          <h2>User Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {page === "jobseeker" && (
        <section className="jobs">
          <h1>Jobseeker Dashboard</h1>
          <h2>Available Jobs</h2>

          {jobs.map(job => (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p>Company: {job.company}</p>
              <p>Location: {job.location}</p>
              <p>Salary: {job.salary}</p>
              <button onClick={() => applyJob(job._id)}>
                Apply Now
              </button>
            </div>
          ))}
        </section>
      )}

      {page === "recruiter" && (
        <section className="jobs">
          <h1>Recruiter Dashboard</h1>
          <h2>Your Posted Jobs</h2>

          {jobs.map(job => (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p>Company: {job.company}</p>
              <p>Location: {job.location}</p>
              <button onClick={() => viewApplicants(job._id)}>
                View Applicants
              </button>
            </div>
          ))}
        </section>
      )}

      {page === "applicants" && (
        <section className="jobs">
          <h1>Applicants List</h1>

          {applicants.length === 0 && (
            <p>No applicants found for this job.</p>
          )}

          {applicants.map((item, index) => (
            <div className="job-card" key={item._id || index}>
              <h3>{item.user?.name || "Jobseeker"}</h3>
              <p>Email: {item.user?.email || "Not available"}</p>
              <p>Status: {item.status || "Pending"}</p>
            </div>
          ))}

          <button onClick={() => setPage("recruiter")}>
            Back to Dashboard
          </button>
        </section>
      )}

      <p>{message}</p>
    </div>
  );
}

export default App;