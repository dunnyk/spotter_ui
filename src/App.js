import "./App.css";
import "./MapComponent.css";

// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import OpenStreetMapViewer from "./components/OpenStreetMapViewer";
import "./App.css"; // Your main CSS file

function App() {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/trip/", {
          current_location: [36.812374486076045, -1.2760919692021566],
          // pickup_location: [36.07746376202207, -0.3017346273660451],
          pickup_location: [35.26852461652837, 0.513816223317221],
          dropoff_location: [39.664199789049384, -4.043061393609565],
          current_cycle: 15,
        });
        setRouteData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading route data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Driver Route Planner</h1>
      </header>

      <main>
        {routeData && (
          <>
            <OpenStreetMapViewer routeData={routeData} />

            {/* Summary Section */}
            <div className="route-summary">
              <h2>OSM Route Summary</h2>
              <p>
                Total Distance: {routeData.route.summary.total_distance} miles
              </p>
              <p>
                Estimated Duration: {routeData.route.summary.total_duration}{" "}
                hours
              </p>
              <div className="stops-summary">
                <p>⛽ Fuel Stops: {routeData.route.summary.fuel_stops}</p>
                <p>🛌 Rest Stops: {routeData.route.summary.rest_stops}</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
