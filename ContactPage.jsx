import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ContactPage() {
  const [psychologists, setPsychologists] = useState([]);
  const [searchLocation, setSearchLocation] = useState("Gandhinagar");
  const [showMap, setShowMap] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.2156, lng: 72.6369 }); 

  const samplePsychologists = [
    {
      name: "Dr. Rajesh Sharma",
      specialization: "Clinical Psychology",
      experience: "15+ years",
      address: "Sector 21, Gandhinagar",
      phone: "+91-98250-12345",
      rating: 4.8,
      availability: "Mon-Sat, 9AM-6PM"
    },
    {
      name: "Dr. Priya Patel",
      specialization: "Counseling Psychology",
      experience: "10+ years", 
      address: "Sector 16, Gandhinagar",
      phone: "+91-98250-67890",
      rating: 4.6,
      availability: "Mon-Fri, 10AM-7PM"
    },
    {
      name: "Dr. Amit Kumar",
      specialization: "Child Psychology",
      experience: "12+ years",
      address: "GH-4, Gandhinagar", 
      phone: "+91-98250-24680",
      rating: 4.9,
      availability: "Daily, 8AM-8PM"
    }
  ];

  useEffect(() => {
    setPsychologists(samplePsychologists);
  }, []);

  const handleCallHelpline = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleGetDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`);
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  const handlePsychologistClick = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setMapCenter({ 
      lat: 23.2156 + (Math.random() - 0.05), 
      lng: 72.6369 + (Math.random() - 0.05) 
    });
    setShowMap(true);
  };

  const handleSearchPsychologists = () => {
    setLoading(true);
    // In real app, this would call an API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const emergencyHelplines = [
    {
      name: "National Suicide Prevention Helpline",
      number: "9152987821",
      description: "24/7 crisis support",
      type: "emergency"
    },
    {
      name: "Vandrevala Foundation Helpline", 
      number: "18602662345",
      description: "Mental health support",
      type: "crisis"
    },
    {
      name: "Snehi Foundation",
      number: "1800-233-3330",
      description: "Counseling services",
      type: "support"
    }
  ];

  const mentalHealthHelplines = [
    {
      name: "iCall",
      number: "9152987821",
      description: "Psychological counseling",
      timing: "24/7"
    },
    {
      name: "YourDOST",
      number: "1800-123-4567", 
      description: "Youth mental health support",
      timing: "24/7"
    },
    {
      name: "Parivartan",
      number: "1800-121-3667",
      description: "Mental health awareness",
      timing: "24/7"
    },
    {
      name: "Lifeline Foundation",
      number: "1800-419-9828",
      description: "Depression and suicide prevention",
      timing: "24/7"
    }
  ];

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1200px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "10px" }}>
          🆘 Mental Health Support & Crisis Helplines
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
          You are not alone. Help is available 24/7.
        </p>
      </div>

      {/* Emergency Crisis Section */}
      <div style={{
        backgroundColor: "#ffebee",
        border: "2px solid #f44336",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#c62828", marginBottom: "15px" }}>
          🚨 EMERGENCY CRISIS SUPPORT
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          {emergencyHelplines.map((helpline, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ffcdd2"
            }}>
              <h3 style={{ color: "#d32f2f", marginBottom: "8px" }}>
                {helpline.name}
              </h3>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#d32f2f", marginBottom: "5px" }}>
                📞 {helpline.number}
              </div>
              <p style={{ color: "#666", marginBottom: "10px" }}>
                {helpline.description}
              </p>
              <button
                onClick={() => handleCallHelpline(helpline.number)}
                style={{
                  backgroundColor: "#d32f2f",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%"
                }}
              >
                Call Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mental Health Helplines */}
      <div style={{
        backgroundColor: "#e3f2fd",
        borderRadius: "10px", 
        padding: "20px",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#1976d2", marginBottom: "15px" }}>
          📞 Mental Health Helplines
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "15px" }}>
          {mentalHealthHelplines.map((helpline, index) => (
            <div key={index} style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #bbdefb"
            }}>
              <h3 style={{ color: "#1976d2", marginBottom: "8px" }}>
                {helpline.name}
              </h3>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1976d2", marginBottom: "5px" }}>
                📞 {helpline.number}
              </div>
              <p style={{ color: "#666", marginBottom: "8px" }}>
                {helpline.description}
              </p>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
                ⏰ {helpline.timing}
              </div>
              <button
                onClick={() => handleCallHelpline(helpline.number)}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px", 
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Call
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div style={{
        backgroundColor: "#f0f8ff",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "30px",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ color: "#1976d2", margin: "0" }}>
            🗺️ Interactive Psychologist Map
          </h2>
          <button
            onClick={toggleMapView}
            style={{
              backgroundColor: showMap ? "#dc3545" : "#28a745",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {showMap ? "📋 List View" : "🗺️ Map View"}
          </button>
        </div>

        {showMap ? (
          <div style={{ height: "400px", borderRadius: "8px", overflow: "hidden" }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDs6-73wEQJ1Y9YBPYIQZZRSAIbYkifwsE&q=psychologists+in+${searchLocation}&center=${mapCenter.lat},${mapCenter.lng}&zoom=13`}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "8px" }}
              allowFullScreen
              title="Psychologists Map"
            />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
            {psychologists.map((psychologist, index) => (
              <div 
                key={index} 
                onClick={() => handlePsychologistClick(psychologist)}
                style={{
                  backgroundColor: selectedPsychologist?.name === psychologist.name ? "#e3f2fd" : "white",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                  <h3 style={{ color: "#2c3e50", margin: "0" }}>
                    {psychologist.name}
                  </h3>
                  <div style={{ 
                    backgroundColor: "#4CAF50", 
                    color: "white", 
                    padding: "4px 8px", 
                    borderRadius: "12px", 
                    fontSize: "12px" 
                  }}>
                    ⭐ {psychologist.rating}
                  </div>
                </div>
                
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", color: "#555" }}>Specialization:</span>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{psychologist.specialization}</span>
                </div>
                
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", color: "#555" }}>Experience:</span>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{psychologist.experience}</span>
                </div>
                
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", color: "#555" }}>📍 Address:</span>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{psychologist.address}</span>
                </div>
                
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", color: "#555" }}>📞 Phone:</span>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{psychologist.phone}</span>
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ fontWeight: "bold", color: "#555" }}>⏰ Availability:</span>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{psychologist.availability}</span>
                </div>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => handleCallHelpline(psychologist.phone)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => handleGetDirections(psychologist.address)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white", 
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    �️ Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Controls */}
        {showMap && (
          <div style={{ 
            position: "absolute", 
            top: "20px", 
            right: "20px", 
            backgroundColor: "white", 
            padding: "10px", 
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}>
            <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
              <strong>Map Controls:</strong>
            </div>
            <button
              onClick={() => setMapCenter({ lat: 23.2156, lng: 72.6369 })}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                marginRight: "5px"
              }}
            >
              🏠 Reset View
            </button>
            <button
              onClick={toggleMapView}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              📋 List View
            </button>
          </div>
        )}
      </div>

      
      {/* Disclaimer */}
      <div style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "8px",
        padding: "15px",
        marginTop: "20px",
        textAlign: "center"
      }}>
        <p style={{ color: "#856404", margin: "0", fontSize: "14px" }}>
          <strong>Important:</strong> If you're in immediate danger or having suicidal thoughts, 
          please call emergency services or go to the nearest hospital immediately.
        </p>
      </div>
    </div>
  );
}

export default ContactPage;
