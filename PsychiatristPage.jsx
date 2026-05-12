import { useState, useEffect } from "react";

function PsychiatristPage() {
  const [psychiatrists, setPsychiatrists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchPsychiatrists = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/psychiatrists");
        const data = await response.json();
        setPsychiatrists(data.psychiatrists || []);
      } catch (error) {
        console.error("Failed to fetch psychiatrists:", error);
        setPsychiatrists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychiatrists();
  }, []);

  const filteredPsychiatrists = psychiatrists.filter((p) =>
    (p.name || "").toLowerCase().includes(searchLocation.toLowerCase()) ||
    (p.specialty || "").toLowerCase().includes(searchLocation.toLowerCase()) ||
    (p.location || "").toLowerCase().includes(searchLocation.toLowerCase())
  );

  const handleContact = (p) => {
    alert(`Contact Dr. ${p.name}\nPhone: ${p.contact}\nEmail: ${p.email}`);
  };

  const handleGetDirections = (location) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(location)}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column" }}>
        <div>Loading psychiatrists...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Find a Psychiatrist Near You</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, specialty, or location..."
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {filteredPsychiatrists.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              background: "#fff"
            }}
          >
            <h3>{p.name}</h3>
            <p><strong>{p.specialty}</strong></p>

            <p>📍 {p.location}</p>
            <p>⭐ {p.rating} ({p.experience})</p>

            <p>{p.availability}</p>

            <p>
              <strong>Languages:</strong>{" "}
              {Array.isArray(p.languages) ? p.languages.join(", ") : "N/A"}
            </p>

            <p><strong>Fee:</strong> {p.consultationFee}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => handleContact(p)}>Contact</button>
              <button onClick={() => handleGetDirections(p.location)}>
                Directions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPsychiatrists.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p>No psychiatrists found</p>
        </div>
      )}
    </div>
  );
}

export default PsychiatristPage;