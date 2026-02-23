import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);

  // Load tickets
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets");
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // Create ticket
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/tickets", {
        title,
        description,
        priority
      });
      setTitle("");
      setDescription("");
      setPriority("Low");
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await API.delete(`/tickets/${id}`);
        fetchTickets();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "High": return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
      default: return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">HelpDesk Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Manage and track your support requests</p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600 hover:border-slate-500"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 sm:p-7 rounded-2xl border border-slate-700 shadow-lg lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-white mb-6">Create New Ticket</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                  <input
                    placeholder="Brief subject..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea
                    placeholder="Details of your issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <button
                  disabled={loading}
                  className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-semibold text-white">Active Tickets ({Array.isArray(tickets) ? tickets.length : 0})</h2>
              <button
                onClick={fetchTickets}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Refresh List
              </button>
            </div>

            {!Array.isArray(tickets) || tickets.length === 0 ? (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-12 lg:p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900/50 mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">No tickets found. Create one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {tickets.map(t => (
                  <div key={t._id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md hover:border-slate-600 transition-colors group relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-white leading-tight">{t.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium rounded-md">
                          {t.status || 'Open'}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 whitespace-pre-wrap">{t.description}</p>

                    <div className="flex justify-end items-center pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-sm px-3 py-1.5 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-lg font-medium transition-all"
                      >
                        Delete Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;