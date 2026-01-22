import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "./Navbar";
import Footer from "./Footer";

/* Fix Leaflet marker icons */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* -----------------------------
   Global Styles
------------------------------ */
if (!document.getElementById("alumni-map-styles")) {
  const style = document.createElement("style");
  style.id = "alumni-map-styles";
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      70% { transform: scale(1.5); opacity: 0; }
      100% { opacity: 0; }
    }

    .custom-div-icon {
      background: transparent !important;
      border: none !important;
    }

    .alumni-popup {
      max-height: 220px;
      overflow-y: auto;
    }

    /* Scrollbar for popup */
    .alumni-popup::-webkit-scrollbar {
      width: 6px;
    }
    .alumni-popup::-webkit-scrollbar-thumb {
      background-color: rgba(100,100,100,0.3);
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

/* -----------------------------
   Fly To Animation
------------------------------ */
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 9, { duration: 1.2 });
  }, [position, map]);
  return null;
}

/* -----------------------------
   Uppercase Logic (except email)
------------------------------ */
const toUpper = (value) => {
  if (!value) return value;
  return value.toString().toUpperCase();
};

/* -----------------------------
   Alumni Map Component
------------------------------ */
export default function AlumniMap() {
  const [alumni, setAlumni] = useState([]);
  const [locationType, setLocationType] = useState("current");
  const [focusCoords, setFocusCoords] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/alumni/allAlumni", {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImlicmFoaW1tb2hhbW1lZDMyODRAZ21haWwuY29tIiwiaWF0IjoxNzY5MTA1MTk4LCJleHAiOjE3NjkxMTIzOTh9.kxlGgvfMSe0FVO2ivheJFO000Wm4KtCffMe6UFhwVXI",
        },
      })
      .then((res) => setAlumni(res.data.content || []))
      .catch(console.error);
  }, []);

  const getLatLng = (a) => {
    if (locationType === "current")
      return a.currentAddressLatitude && a.currentAddressLongitude
        ? [a.currentAddressLatitude, a.currentAddressLongitude]
        : null;

    if (locationType === "permanent")
      return a.permanentAddressLatitude && a.permanentAddressLongitude
        ? [a.permanentAddressLatitude, a.permanentAddressLongitude]
        : null;

    return a.graduationCollegeLatitude && a.graduationCollegeLongitude
      ? [a.graduationCollegeLatitude, a.graduationCollegeLongitude]
      : null;
  };

  const groupedLocations = useMemo(() => {
    const map = {};
    alumni.forEach((a) => {
      const coords = getLatLng(a);
      if (!coords) return;
      const key = coords.join(",");
      map[key] ??= { coords, alumni: [] };
      map[key].alumni.push(a);
    });
    return Object.values(map);
  }, [alumni, locationType]);

  return (
    <>
      <Navbar />
      <div style={page}>
        {/* Controls */}
        {/* <div style={controls} className=" bg-[#888c92] ">
          {["CURRENT", "PERMANENT", "GRADUATION"].map((t) => (
            <div key={t} className={` cursor-pointer hover:bg-black rounded-sm hover:text-white text-sm font-semibold font-sans pl-2 py-0.5 ${locationType === t.toLocaleLowerCase() ? ' bg-black text-white' : ''}`}  onClick={() => {
              setLocationType(t.toLowerCase());}}>
              {t}
              </div>
          ))}
        </div> */}
          {/* // <label key={t} style={radioLabel}>
          //   <input
          //     type="radio"
          //     checked={locationType === t.toLowerCase()}
          //     onChange={() => setLocationType(t.toLowerCase())}
          //   />{" "}
          //   {t}
          // </label> */}

        {/* Map */}
        <div style={mapCard}>

          <div style={floatingControls}>
            {["CURRENT", "PERMANENT", "GRADUATION"].map((t) => (
              <div
                key={t}
                className={`cursor-pointer text-sm font-semibold px-4 py-2 rounded-lg transition-all
                  ${
                    locationType === t.toLowerCase()
                      ? "bg-black text-white shadow-lg"
                      : "bg-white/90 hover:bg-black hover:text-white"
                  }`}
                onClick={() => setLocationType(t.toLowerCase())}
              >
                {t}
              </div>
            ))}
          </div>

          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <FlyTo position={focusCoords} />

            {groupedLocations.map((group, idx) => {
              // Dynamic marker color based on location type
              let gradient;

              if (locationType === "current")
                gradient = "linear-gradient(135deg, #2563EB, #4F46E5)";
              else if (locationType === "permanent")
                gradient = "linear-gradient(135deg, #16A34A, #059669)";
              else if (locationType === "graduation")
                gradient = "linear-gradient(135deg, #7C3AED, #DB2777)";


              const icon = L.divIcon({
                className: "custom-div-icon",
                iconSize: [42, 42],
                iconAnchor: [21, 21],
                html: `
                  <div style="
                    position:relative;
                    width:42px;height:42px;
                    border-radius:50%;
                    background:${gradient};
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:#fff;
                    font-weight:700;
                    box-shadow:0 10px 25px rgba(0,0,0,.35);
                    transition: transform 0.2s;
                  ">
                    ${group.alumni.length}
                    <span style="
                      position:absolute;
                      inset:-6px;
                      border-radius:50%;
                      background:rgba(255,255,255,0.25);
                      animation:pulse 2s infinite;
                    "></span>
                  </div>
                `,
              });

              return (
                <Marker
                  key={idx}
                  position={group.coords}
                  icon={icon}
                  eventHandlers={{
                    click: () => setFocusCoords(group.coords),
                  }}
                >
                  <Popup maxWidth={320}>
                    <div className="alumni-popup">
                      <strong>{group.alumni.length} ALUMNI</strong>
                      <hr />
                      {group.alumni.map((a) => (
                        <div
                          key={a.id}
                          style={alumniRow}
                          onClick={() => setSelectedAlumni(a)}
                        >
                          <b>{toUpper(a.fullName)}</b>
                          <div style={muted}>{toUpper(a.graduationCollegeName)}</div>
                          <div style={muted}>
                            BATCH {a.batchNumber} • {a.batchPassingYear}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Alumni Dialog */}
        {selectedAlumni && (
          <div style={dialogOverlay} onClick={() => setSelectedAlumni(null)}>
            <div style={dialog} onClick={(e) => e.stopPropagation()}>
              <button style={dialogClose} onClick={() => setSelectedAlumni(null)}>
                ✕
              </button>

              <div style={avatar}>{toUpper(selectedAlumni.fullName?.charAt(0))}</div>

              <h2>{toUpper(selectedAlumni.fullName)}</h2>
              <div style={dialogMuted}>{toUpper(selectedAlumni.organization)}</div>

              <div style={badgeRow}>
                <span style={badge}>BATCH {selectedAlumni.batchNumber}</span>
                <span style={badge}>{selectedAlumni.batchPassingYear}</span>
              </div>

              <div style={infoGrid}>
                <Info label="EMAIL" value={selectedAlumni.email} />
                <Info label="PHONE" value={toUpper(selectedAlumni.phoneNo)} />
                <Info label="COLLEGE" value={toUpper(selectedAlumni.graduationCollegeName)} />
                <Info
                  label="CURRENT ADDRESS"
                  value={toUpper(
                    `${selectedAlumni.currentAddressCity}, ${selectedAlumni.currentAddressState}`
                  )}
                />
                <Info
                  label="PERMANENT ADDRESS"
                  value={toUpper(
                    `${selectedAlumni.permanentAddressCity}, ${selectedAlumni.permanentAddressState}`
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
      </>
  );
}

/* -----------------------------
   Info Component
------------------------------ */
function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* -----------------------------
   Styles
------------------------------ */
const page = {
  margin: "0 auto",
  fontFamily: "'Inter', sans-serif",
  height: "86vh",
  display: 'flex',
  flexDirection: 'row',
};

const title = {
  marginBottom: 20,
  fontSize: 32,
  fontWeight: 700,
  color: "#4338ca",
  textAlign: "center",
  textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
};

const floatingControls = {
  position: "absolute",
  bottom: 100,
  right: 15,
  zIndex: 1000,
  display: "flex",
  paddingBottom: "20px",
  flexDirection: "column",
  gap: 8,
  padding: 10,
  borderRadius: 10,
  background: "white",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};

const controls = {
  display: "flex",
  width: '150px',
  flexDirection: 'column',
  gap: 20,
  padding: '16px 10px',
};

const radioLabel = {
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const mapCard = {
  zIndex: '10 !important',
  flex: 1,
  height: '100%',
  overflow: "hidden",
};

const alumniRow = {
  padding: "10px 8px",
  cursor: "pointer",
  transition: "background 0.2s",
};

const muted = {
  fontSize: 12,
  color: "#6b7280",
};

/* Dialog */
const dialogOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const dialog = {
  background: "#fff",
  borderRadius: 24,
  padding: 32,
  width: "90%",
  maxWidth: 520,
  boxShadow: "0 50px 100px rgba(0,0,0,.35)",
  position: "relative",
  textAlign: "center",
  transition: "transform 0.2s",
};

const dialogClose = {
  position: "absolute",
  right: 20,
  top: 18,
  border: "none",
  background: "transparent",
  fontSize: 22,
  cursor: "pointer",
};

const avatar = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
  fontWeight: 700,
  margin: "0 auto 16px",
};

const badgeRow = {
  display: "flex",
  justifyContent: "center",
  gap: 12,
  margin: "16px 0 24px",
};

const badge = {
  padding: "6px 14px",
  borderRadius: 999,
  background: "#eef2ff",
  color: "#4338ca",
  fontSize: 12,
  fontWeight: 600,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
  textAlign: "left",
};

const dialogMuted = {
  color: "#6b7280",
  fontSize: 14,
};
