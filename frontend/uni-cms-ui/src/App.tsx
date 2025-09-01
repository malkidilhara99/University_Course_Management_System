import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import StudentsView from "./AppStudents";
import Courses from "./Courses";
import Registrations from "./Registrations";
import Results from "./Results";

export default function App() {
  return (
    <Router>
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <nav style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Link to="/students"><button>Students</button></Link>
          <Link to="/courses"><button>Courses</button></Link>
          <Link to="/registrations"><button>Registrations</button></Link>
          <Link to="/results"><button>Results</button></Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsView />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}
