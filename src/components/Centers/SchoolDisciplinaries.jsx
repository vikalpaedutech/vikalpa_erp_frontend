
// import React, {
//   useEffect, useState, useContext, useMemo, useCallback, useRef
// } from "react";
// import Select from "react-select";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import Region from "../Students/Region.json";
// import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import {
//   createSchoolDisciplinaryRecord,
//   GetSchoolDisciplinaryData,
// } from "../../service/Centers/SchoolDisciplinaries";
// import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";

// // ─────────────────────────────────────────────────────────────────────────────
// const STATUS_CONFIG = {
//   Poor:      { variant: "danger",  icon: "📉", label: "Poor",      bg: "#fff5f5", color: "#c62828", border: "#ffcdd2" },
//   Average:   { variant: "warning", icon: "📊", label: "Average",   bg: "#fffde7", color: "#e65100", border: "#ffe0b2" },
//   Good:      { variant: "primary", icon: "📈", label: "Good",      bg: "#e8eaf6", color: "#283593", border: "#c5cae9" },
//   Excellent: { variant: "success", icon: "🌟", label: "Excellent", bg: "#f1f8e9", color: "#2e7d32", border: "#c8e6c9" },
// };
// const STATUS_ORDER = ["Poor", "Average", "Good", "Excellent"];

// const getTodayStr = () => {
//   const d = new Date();
//   return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
// };

// const rsStyles = {
//   control: (base, state) => ({
//     ...base, minHeight: 31, height: 31, fontSize: "0.82rem", borderRadius: 8,
//     borderColor: state.isFocused ? "#3949ab" : "#ced4da",
//     boxShadow: state.isFocused ? "0 0 0 2px rgba(57,73,171,0.18)" : "none",
//     "&:hover": { borderColor: "#3949ab" }, cursor: "text",
//   }),
//   valueContainer: (base) => ({ ...base, padding: "0 8px" }),
//   input:          (base) => ({ ...base, margin: 0, padding: 0 }),
//   indicatorsContainer: (base) => ({ ...base, height: 31 }),
//   indicatorSeparator: () => ({ display: "none" }),
//   dropdownIndicator: (base) => ({ ...base, padding: "0 6px" }),
//   clearIndicator:    (base) => ({ ...base, padding: "0 4px" }),
//   menu:    (base) => ({ ...base, fontSize: "0.82rem", zIndex: 9999 }),
//   option:  (base, state) => ({
//     ...base,
//     background: state.isSelected ? "#3949ab" : state.isFocused ? "#e8eaf6" : "#fff",
//     color: state.isSelected ? "#fff" : "#263238", padding: "6px 12px",
//   }),
//   placeholder: (base) => ({ ...base, color: "#adb5bd" }),
//   singleValue: (base) => ({ ...base, color: "#263238" }),
// };
// // ─────────────────────────────────────────────────────────────────────────────

// export const SchoolDisciplinaries = () => {
//   const { userData }                       = useContext(UserContext);
//   const { schoolContext, batchContext }    = useContext(DistrictBlockSschoolContextV2);
//   const { startDate }                      = useContext(DateNDateRangeContext);

//   const effectiveDate  = startDate || getTodayStr();
//   const effectiveBatch = batchContext?.batch ?? batchContext ?? null;

//   const [disciplinaryData, setDisciplinaryData] = useState([]);
//   const [optimistic, setOptimistic]             = useState({});
//   const [postingKey, setPostingKey]             = useState(null);
//   const [fetchLoading, setFetchLoading]         = useState(false);
//   const [toast, setToast]                       = useState(null);
//   const [showBatchModal, setShowBatchModal]      = useState(false);
//   const [viewMode, setViewMode]                 = useState("table"); // "table" | "card"

//   const [filterDistrict, setFilterDistrict] = useState(null);
//   const [filterSchool, setFilterSchool]     = useState("");
//   const [showUnmarkedOnly, setShowUnmarkedOnly] = useState(false);

//   const toastTimer = useRef(null);

//   // ── static derived data ───────────────────────────────────────────────────
//   const activeCenters = useMemo(() => Region.filter((r) => !r.isCenterClosed), []);

//   const districtOptions = useMemo(() => {
//     const map = new Map();
//     activeCenters.forEach((c) => { if (!map.has(c.districtId)) map.set(c.districtId, c.districtName); });
//     return Array.from(map.entries())
//       .map(([id, name]) => ({ value: id, label: name }))
//       .sort((a, b) => a.label.localeCompare(b.label));
//   }, [activeCenters]);

//   // ── server record map ─────────────────────────────────────────────────────
//   const serverRecordMap = useMemo(() => {
//     const m = new Map();
//     disciplinaryData.forEach((d) => m.set(d._id, d.schoolDisciplinaryData ?? []));
//     return m;
//   }, [disciplinaryData]);

//   // ── count helpers ─────────────────────────────────────────────────────────
//   const getCount = useCallback((oid, status, batch) => {
//     const real  = (serverRecordMap.get(oid) ?? []).filter((r) => r.status === status && (!batch || r.batch === batch)).length;
//     const delta = optimistic?.[oid]?.[status] ?? 0;
//     return real + delta;
//   }, [serverRecordMap, optimistic]);

//   const getTotal = useCallback((oid, batch) => {
//     const real  = (serverRecordMap.get(oid) ?? []).filter((r) => !batch || r.batch === batch).length;
//     const delta = Object.values(optimistic?.[oid] ?? {}).reduce((s, v) => s + v, 0);
//     return real + delta;
//   }, [serverRecordMap, optimistic]);

//   // ── filtered + sorted rows ────────────────────────────────────────────────
//   const filteredCenters = useMemo(() => {
//     let list = activeCenters;
//     if (filterDistrict) list = list.filter((c) => c.districtId === filterDistrict.value);
//     if (filterSchool.trim()) list = list.filter((c) => c.schoolName.toLowerCase().includes(filterSchool.trim().toLowerCase()));
//     if (showUnmarkedOnly) list = list.filter((c) => getTotal(c._id?.$oid ?? c._id, effectiveBatch) === 0);
//     return [...list].sort((a, b) => a.districtName.localeCompare(b.districtName) || a.schoolName.localeCompare(b.schoolName));
//   }, [activeCenters, filterDistrict, filterSchool, showUnmarkedOnly, getTotal, effectiveBatch]);

//   // ── fetch ─────────────────────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     setFetchLoading(true);
//     try {
//       const res = await GetSchoolDisciplinaryData({ date: effectiveDate, unqUserObjectId:userData?._id });
//       if (res?.status === "Ok") { setDisciplinaryData(res.data); setOptimistic({}); }
//     } catch { showToast("Failed to fetch data", "danger"); }
//     finally  { setFetchLoading(false); }
//   }, [effectiveDate]);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ── mark handler ──────────────────────────────────────────────────────────
//   const handleMark = useCallback(async (center, status) => {
//     if (!effectiveBatch) { setShowBatchModal(true); return; }
//     const oid    = center._id?.$oid ?? center._id;
//     const rowKey = `${oid}-${status}`;
//     setPostingKey(rowKey);

//     setOptimistic((prev) => ({
//       ...prev,
//       [oid]: { ...(prev[oid] ?? {}), [status]: (prev[oid]?.[status] ?? 0) + 1 },
//     }));

//     const payload = {
//       district_block_schoolsObjectId: oid,
//       subject: schoolContext?.schoolName ?? null,
//       batch: effectiveBatch,
//       status, remark: null,
//       unqUserObjectId: userData?._id,
//     };

//     try {
//       const res = await createSchoolDisciplinaryRecord(payload);
//       if (res?.status === "Ok") {
//         setDisciplinaryData((prev) => {
//           const exists = prev.some((d) => d._id === oid);
//           if (!exists) return [...prev, { _id: oid, schoolDisciplinaryData: [{ status, batch: effectiveBatch }] }];
//           return prev.map((school) =>
//             school._id !== oid ? school : {
//               ...school,
//               schoolDisciplinaryData: [...(school.schoolDisciplinaryData || []), { status, batch: effectiveBatch }],
//             }


             
//           );
//         });
//         setOptimistic((prev) => {
//           const next = { ...prev };
//           if (next[oid]?.[status]) {
//             next[oid][status]--;
//             if (next[oid][status] <= 0) delete next[oid][status];
//             if (Object.keys(next[oid]).length === 0) delete next[oid];
//           }
//           return next;
//         });

//             const currentDate = new Date().toISOString().split("T")[0]; // "2026-06-18"

//          if (startDate === currentDate) {
//         await ClaimGamificationPoint(
//         {

//         pointType:"disciplinary",
//         date: new Date().toISOString().split("T")[0],
//         batch: batchContext?.batch || batchContext,
//         schoolId: schoolContext?.schoolId,
//         district_block_schoolsObjectId:oid,
//         unqObjectId: userData?._id,

//         }
//         )
//          }
//       } else {
//         rollback(oid, status);
//         showToast("Failed to save record", "danger");
//       }
//     } catch { rollback(oid, status); showToast("Error posting data", "danger"); }
//     finally  { setPostingKey(null); }
//   }, [effectiveBatch, schoolContext, userData]);

//   const rollback = (oid, status) =>
//     setOptimistic((prev) => ({
//       ...prev,
//       [oid]: { ...(prev[oid] ?? {}), [status]: Math.max(0, (prev[oid]?.[status] ?? 1) - 1) },
//     }));

//   const showToast = (message, type = "success") => {
//     if (toastTimer.current) clearTimeout(toastTimer.current);
//     setToast({ message, type });
//     toastTimer.current = setTimeout(() => setToast(null), 3000);
//   };

//   const footerTotals = useMemo(() => STATUS_ORDER.reduce((acc, status) => {
//     acc[status] = disciplinaryData.reduce(
//       (sum, d) => sum + (d.schoolDisciplinaryData?.filter(
//         (r) => r.status === status && (!effectiveBatch || r.batch === effectiveBatch)
//       ).length ?? 0), 0
//     );
//     return acc;
//   }, {}), [disciplinaryData, effectiveBatch]);

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f4f6fb" }}>

//       {/* Header */}
//       <div style={S.header}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
//           <div>
//             <h4 className="mb-0 fw-bold" style={{ letterSpacing: "0.5px", fontSize: "1.28rem" }}>
//               🏫 School Disciplinary Tracker
//             </h4>
//             <small style={{ opacity: 0.72 }}>Mark and monitor disciplinary status across all active centers</small>
//           </div>
//           {/* View toggle */}
//           <div style={{ display: "flex", background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 3, gap: 2 }}>
//             {[
//               { mode: "table", icon: "⊞", label: "Table" },
//               { mode: "card",  icon: "❏", label: "Cards" },
//             ].map(({ mode, icon, label }) => (
//               <button
//                 key={mode}
//                 onClick={() => setViewMode(mode)}
//                 style={{
//                   background: viewMode === mode ? "#fff" : "transparent",
//                   color: viewMode === mode ? "#1a237e" : "rgba(255,255,255,0.75)",
//                   border: "none", borderRadius: 8, padding: "5px 14px",
//                   fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
//                   transition: "all 0.18s", whiteSpace: "nowrap",
//                   boxShadow: viewMode === mode ? "0 1px 6px rgba(0,0,0,0.12)" : "none",
//                 }}
//               >
//                 {icon} {label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Filter bar */}
//       <div style={S.filterBar}>
//         <div style={{ minWidth: 165 }}><SingleDatePicker /></div>
//         <div style={{ minWidth: 165 }}><Batch_drop_down /></div>
//         <div style={{ minWidth: 190 }}>
//           <Select options={districtOptions} value={filterDistrict} onChange={setFilterDistrict}
//             placeholder="All Districts" isClearable styles={rsStyles} />
//         </div>
//         <input
//           type="text" className="form-control form-control-sm"
//           placeholder="🔍 Search school…"
//           style={{ minWidth: 180, borderRadius: 8, fontSize: "0.82rem", height: 31 }}
//           value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}
//         />
//         <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", whiteSpace: "nowrap",
//           fontSize: "0.8rem", color: showUnmarkedOnly ? "#c62828" : "#546e7a",
//           fontWeight: showUnmarkedOnly ? 700 : 400, userSelect: "none" }}>
//           <input type="checkbox" checked={showUnmarkedOnly} onChange={(e) => setShowUnmarkedOnly(e.target.checked)}
//             style={{ accentColor: "#c62828", width: 14, height: 14 }} />
//           0-marked only
//         </label>
//         {(filterDistrict || filterSchool || showUnmarkedOnly) && (
//           <button className="btn btn-sm btn-outline-secondary"
//             style={{ borderRadius: 8, fontSize: "0.78rem", whiteSpace: "nowrap", height: 31 }}
//             onClick={() => { setFilterDistrict(null); setFilterSchool(""); setShowUnmarkedOnly(false); }}>
//             ✕ Clear
//           </button>
//         )}
//         <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={fetchData}
//           disabled={fetchLoading} style={{ borderRadius: 8, whiteSpace: "nowrap", height: 31 }}>
//           {fetchLoading ? <><span className="spinner-border spinner-border-sm me-1" />Refreshing…</> : <>🔄 Refresh</>}
//         </button>
//       </div>

//       {/* Toast */}
//       {toast && (
//         <div style={S.toastWrap}>
//           <div className={`alert alert-${toast.type} shadow-lg mb-0 py-2 px-3`}
//             style={{ borderRadius: 10, fontSize: "0.84rem" }}>
//             {toast.message}
//           </div>
//         </div>
//       )}

//       {/* Batch modal */}
//       {showBatchModal && (
//         <div style={S.backdrop} onClick={() => setShowBatchModal(false)}>
//           <div style={S.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={{ fontSize: "2.4rem", marginBottom: 8 }}>📋</div>
//             <h5 style={{ fontWeight: 700, color: "#1a237e", marginBottom: 6 }}>Batch Not Selected</h5>
//             <p style={{ color: "#546e7a", fontSize: "0.88rem", marginBottom: 20 }}>
//               Please select a <strong>batch</strong> before marking disciplinary status.
//             </p>
//             <button className="btn btn-primary btn-sm px-4" style={{ borderRadius: 20 }}
//               onClick={() => setShowBatchModal(false)}>
//               Got it
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div style={{ padding: "18px 20px 32px" }}>
//         {/* Meta row */}
//         <div style={{ marginBottom: 12, fontSize: "0.79rem", color: "#7986cb", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
//           <span>Showing <strong>{filteredCenters.length}</strong> of <strong>{activeCenters.length}</strong> active centers</span>
//           <span style={{ color: "#90a4ae" }}>
//             📅 {new Date(effectiveDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
//           </span>
//           {effectiveBatch && (
//             <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 12, padding: "1px 10px", fontWeight: 700, fontSize: "0.76rem" }}>
//               Batch: {effectiveBatch}
//             </span>
//           )}
//         </div>

//         {fetchLoading ? (
//           <div className="text-center py-5 text-muted">
//             <div className="spinner-border text-primary mb-3" />
//             <div style={{ fontSize: "0.85rem" }}>Loading disciplinary data…</div>
//           </div>
//         ) : viewMode === "table" ? (
//           /* ══════════════════ TABLE VIEW ══════════════════ */
//           <div style={S.tableCard}>
//             <div style={{ overflowX: "auto" }}>
//               <table className="table table-hover mb-0" style={{ fontSize: "0.875rem" }}>
//                 <thead>
//                   <tr style={{ background: "linear-gradient(90deg,#e8eaf6 0%,#f3f4fd 100%)", borderBottom: "2px solid #c5cae9" }}>
//                     <th style={th}>#</th>
//                     <th style={th}>District</th>
//                     <th style={th}>Block</th>
//                     <th style={th}>School Name</th>
//                     <th style={{ ...th, textAlign: "center" }}>
//                       Mark Status
//                       {effectiveBatch && (
//                         <span style={{ display: "block", fontWeight: 400, color: "#7986cb", fontSize: "0.69rem", textTransform: "none", letterSpacing: 0 }}>
//                           counts for batch: {effectiveBatch}
//                         </span>
//                       )}
//                     </th>
//                     <th style={{ ...th, textAlign: "center" }}>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCenters.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="text-center py-5 text-muted">
//                         <div style={{ fontSize: "2rem" }}>🔍</div>
//                         <div style={{ fontSize: "0.85rem" }}>No centers match your filters.</div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredCenters.map((center, idx) => (
//                       <TableRow key={center._id?.$oid ?? center._id}
//                         center={center} idx={idx}
//                         getCount={getCount} getTotal={getTotal}
//                         handleMark={handleMark} postingKey={postingKey}
//                         effectiveBatch={effectiveBatch} />
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Footer */}
//             <div style={S.footer}>
//               <span style={{ fontWeight: 700, color: "#3949ab" }}>{activeCenters.length} centers</span>
//               <span style={S.divider} />
//               {STATUS_ORDER.map((status) => {
//                 const cfg = STATUS_CONFIG[status];
//                 return (
//                   <span key={status} style={{ background: cfg.bg, color: cfg.color, borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.77rem" }}>
//                     {cfg.icon} {footerTotals[status]} {cfg.label}
//                   </span>
//                 );
//               })}
//             </div>
//           </div>
//         ) : (
//           /* ══════════════════ CARD VIEW ══════════════════ */
//           <>
//             {filteredCenters.length === 0 ? (
//               <div className="text-center py-5 text-muted">
//                 <div style={{ fontSize: "2.5rem" }}>🔍</div>
//                 <div style={{ fontSize: "0.88rem" }}>No centers match your filters.</div>
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
//                 {filteredCenters.map((center, idx) => (
//                   <CenterCard key={center._id?.$oid ?? center._id}
//                     center={center} idx={idx}
//                     getCount={getCount} getTotal={getTotal}
//                     handleMark={handleMark} postingKey={postingKey}
//                     effectiveBatch={effectiveBatch} />
//                 ))}
//               </div>
//             )}
//             {/* Footer summary for card view */}
//             <div style={{ ...S.footer, borderRadius: 12, marginTop: 20, border: "1px solid #e8eaf6" }}>
//               <span style={{ fontWeight: 700, color: "#3949ab" }}>{activeCenters.length} centers</span>
//               <span style={S.divider} />
//               {STATUS_ORDER.map((status) => {
//                 const cfg = STATUS_CONFIG[status];
//                 return (
//                   <span key={status} style={{ background: cfg.bg, color: cfg.color, borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.77rem" }}>
//                     {cfg.icon} {footerTotals[status]} {cfg.label}
//                   </span>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Memoised Table Row ────────────────────────────────────────────────────────
// const TableRow = React.memo(({ center, idx, getCount, getTotal, handleMark, postingKey, effectiveBatch }) => {
//   const oid   = center._id?.$oid ?? center._id;
//   const total = getTotal(oid, effectiveBatch);
//   return (
//     <tr>
//       <td style={td}>
//         <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: "0.74rem" }}>
//           {idx + 1}
//         </span>
//       </td>
//       <td style={td}><span style={{ color: "#5c6bc0", fontWeight: 600 }}>{center.districtName}</span></td>
//       <td style={td}><span style={{ color: "#78909c", fontSize: "0.81rem" }}>{center.blockName}</span></td>
//       <td style={td}><span style={{ fontWeight: 600, color: "#263238" }}>{center.schoolName}</span></td>
//       <td style={{ ...td, textAlign: "center" }}>
//         <div className="d-flex gap-1 justify-content-center flex-wrap">
//           {STATUS_ORDER.map((status) => {
//             const cfg     = STATUS_CONFIG[status];
//             const rowKey  = `${oid}-${status}`;
//             const posting = postingKey === rowKey;
//             const cnt     = getCount(oid, status, effectiveBatch);
//             return (
//               <button key={status} className={`btn btn-${cfg.variant} btn-sm`}
//                 style={{ borderRadius: 20, fontSize: "0.72rem", padding: "3px 10px", fontWeight: 600, minWidth: 82, opacity: posting ? 0.65 : 1 }}
//                 disabled={posting} onClick={() => handleMark(center, status)}
//                 title={`Mark ${center.schoolName} as ${status}`}>
//                 {posting ? <span className="spinner-border spinner-border-sm" /> : (
//                   <>{cfg.icon} {cfg.label}{cnt > 0 && (
//                     <span style={{ background: "rgba(255,255,255,0.35)", borderRadius: 10, padding: "0 5px", marginLeft: 4, fontSize: "0.67rem", fontWeight: 800 }}>
//                       {cnt}
//                     </span>
//                   )}</>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </td>
//       <td style={{ ...td, textAlign: "center" }}>
//         {total > 0 ? (
//           <span style={{ background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", borderRadius: 20, padding: "3px 14px", fontWeight: 700, fontSize: "0.81rem", display: "inline-block", minWidth: 36 }}>
//             {total}
//           </span>
//         ) : <span style={{ color: "#cfd8dc" }}>—</span>}
//       </td>
//     </tr>
//   );
// });

// // ── Memoised Card ─────────────────────────────────────────────────────────────
// const CenterCard = React.memo(({ center, idx, getCount, getTotal, handleMark, postingKey, effectiveBatch }) => {
//   const oid   = center._id?.$oid ?? center._id;
//   const total = getTotal(oid, effectiveBatch);

//   return (
//     <div style={{
//       background: "#fff", borderRadius: 14,
//       boxShadow: "0 2px 14px rgba(40,53,147,0.08)",
//       border: "1px solid #e8eaf6", overflow: "hidden",
//       display: "flex", flexDirection: "column",
//       transition: "box-shadow 0.18s",
//     }}>
//       {/* Card header */}
//       <div style={{
//         background: "linear-gradient(135deg,#e8eaf6 0%,#f3f4fd 100%)",
//         padding: "12px 16px", borderBottom: "1px solid #dde1f4",
//         display: "flex", alignItems: "flex-start", gap: 10,
//       }}>
//         {/* Index badge */}
//         <span style={{
//           background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff",
//           borderRadius: 8, padding: "3px 9px", fontWeight: 700, fontSize: "0.72rem",
//           flexShrink: 0, marginTop: 2,
//         }}>
//           {idx + 1}
//         </span>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ fontWeight: 700, color: "#1a237e", fontSize: "0.88rem", lineHeight: 1.3, marginBottom: 3 }}
//             title={center.schoolName}>
//             {center.schoolName}
//           </div>
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
//             <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 10, padding: "1px 8px", fontSize: "0.72rem", fontWeight: 600 }}>
//               📍 {center.districtName}
//             </span>
//             <span style={{ color: "#90a4ae", fontSize: "0.72rem" }}>
//               {center.blockName}
//             </span>
//           </div>
//         </div>
//         {/* Total badge */}
//         {total > 0 && (
//           <span style={{
//             background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff",
//             borderRadius: 20, padding: "3px 11px", fontWeight: 700, fontSize: "0.78rem",
//             flexShrink: 0,
//           }}>
//             {total}
//           </span>
//         )}
//       </div>

//       {/* Status buttons */}
//       <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
//         {/* Per-status rows */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//           {STATUS_ORDER.map((status) => {
//             const cfg     = STATUS_CONFIG[status];
//             const rowKey  = `${oid}-${status}`;
//             const posting = postingKey === rowKey;
//             const cnt     = getCount(oid, status, effectiveBatch);
//             return (
//               <button key={status}
//                 onClick={() => handleMark(center, status)}
//                 disabled={posting}
//                 title={`Mark as ${status}`}
//                 style={{
//                   display: "flex", alignItems: "center", justifyContent: "space-between",
//                   background: cfg.bg, border: `1.5px solid ${cfg.border}`,
//                   borderRadius: 10, padding: "8px 12px",
//                   cursor: posting ? "not-allowed" : "pointer",
//                   opacity: posting ? 0.65 : 1,
//                   transition: "transform 0.1s, box-shadow 0.1s",
//                   width: "100%",
//                 }}>
//                 <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", fontWeight: 700, color: cfg.color }}>
//                   {posting
//                     ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
//                     : <span>{cfg.icon}</span>}
//                   {cfg.label}
//                 </span>
//                 <span style={{
//                   background: cnt > 0 ? cfg.color : "#e0e0e0",
//                   color: cnt > 0 ? "#fff" : "#9e9e9e",
//                   borderRadius: 20, minWidth: 22, height: 22,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: "0.72rem", fontWeight: 800, padding: "0 6px",
//                   transition: "background 0.2s",
//                 }}>
//                   {cnt}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Total row */}
//         <div style={{
//           marginTop: 2, background: "#f8f9fe", borderRadius: 8, border: "1px solid #e8eaf6",
//           padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
//           fontSize: "0.76rem",
//         }}>
//           <span style={{ color: "#78909c", fontWeight: 600 }}>Total marks today</span>
//           <span style={{
//             background: total > 0 ? "linear-gradient(135deg,#1a237e,#3949ab)" : "#eeeeee",
//             color: total > 0 ? "#fff" : "#9e9e9e",
//             borderRadius: 20, padding: "2px 12px", fontWeight: 700, fontSize: "0.78rem",
//           }}>
//             {total || "None"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// });

// // ── Style tokens ──────────────────────────────────────────────────────────────
// const S = {
//   header: {
//     background: "linear-gradient(135deg,#1a237e 0%,#283593 60%,#3949ab 100%)",
//     padding: "20px 28px 16px", color: "#fff",
//     boxShadow: "0 4px 20px rgba(26,35,126,0.18)",
//   },
//   filterBar: {
//     background: "#fff", borderBottom: "1px solid #e3e8f0",
//     padding: "11px 24px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
//   },
//   toastWrap: { position: "fixed", top: 20, right: 24, zIndex: 9999, minWidth: 260 },
//   backdrop:  { position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" },
//   modal:     { background: "#fff", borderRadius: 18, padding: "36px 40px", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", maxWidth: 340, width: "90%" },
//   tableCard: { background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(40,53,147,0.08)", overflow: "hidden" },
//   footer:    { background: "#f8f9fe", borderTop: "1px solid #e8eaf6", padding: "10px 20px", display: "flex", gap: 10, flexWrap: "wrap", fontSize: "0.8rem", alignItems: "center" },
//   divider:   { width: 1, height: 16, background: "#c5cae9", display: "inline-block" },
// };

// const th = { padding: "11px 16px", fontWeight: 700, color: "#3949ab", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", background: "transparent", border: "none" };
// const td = { padding: "10px 16px", verticalAlign: "middle", borderBottom: "1px solid #f0f2fa" };







import React, {
  useEffect, useState, useContext, useMemo, useCallback, useRef
} from "react";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import Region from "../Students/Region.json";
import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import {
  createSchoolDisciplinaryRecord,
  GetSchoolDisciplinaryData,
} from "../../service/Centers/SchoolDisciplinaries";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";

// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Poor:      { variant: "danger",  icon: "📉", label: "Poor",      bg: "#fff5f5", color: "#c62828", border: "#ffcdd2" },
  Average:   { variant: "warning", icon: "📊", label: "Average",   bg: "#fffde7", color: "#e65100", border: "#ffe0b2" },
  Good:      { variant: "primary", icon: "📈", label: "Good",      bg: "#e8eaf6", color: "#283593", border: "#c5cae9" },
  Excellent: { variant: "success", icon: "🌟", label: "Excellent", bg: "#f1f8e9", color: "#2e7d32", border: "#c8e6c9" },
};
const STATUS_ORDER = ["Poor", "Average", "Good", "Excellent"];

const getTodayStr = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
};

const rsStyles = {
  control: (base, state) => ({
    ...base, minHeight: 31, height: 31, fontSize: "0.82rem", borderRadius: 8,
    borderColor: state.isFocused ? "#3949ab" : "#ced4da",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(57,73,171,0.18)" : "none",
    "&:hover": { borderColor: "#3949ab" }, cursor: "text",
  }),
  valueContainer: (base) => ({ ...base, padding: "0 8px" }),
  input:          (base) => ({ ...base, margin: 0, padding: 0 }),
  indicatorsContainer: (base) => ({ ...base, height: 31 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "0 6px" }),
  clearIndicator:    (base) => ({ ...base, padding: "0 4px" }),
  menu:    (base) => ({ ...base, fontSize: "0.82rem", zIndex: 9999 }),
  option:  (base, state) => ({
    ...base,
    background: state.isSelected ? "#3949ab" : state.isFocused ? "#e8eaf6" : "#fff",
    color: state.isSelected ? "#fff" : "#263238", padding: "6px 12px",
  }),
  placeholder: (base) => ({ ...base, color: "#adb5bd" }),
  singleValue: (base) => ({ ...base, color: "#263238" }),
};
// ─────────────────────────────────────────────────────────────────────────────

export const SchoolDisciplinaries = () => {
  const { userData }                       = useContext(UserContext);
  const { schoolContext, batchContext }    = useContext(DistrictBlockSschoolContextV2);
  const { startDate }                      = useContext(DateNDateRangeContext);

  // ✅ FIXED: Better handling of effective date and batch
  const effectiveDate  = startDate || getTodayStr();
  const effectiveBatch = batchContext?.batch?.trim() || null;

  const [disciplinaryData, setDisciplinaryData] = useState([]);
  const [optimistic, setOptimistic]             = useState({});
  const [postingKey, setPostingKey]             = useState(null);
  const [fetchLoading, setFetchLoading]         = useState(false);
  const [toast, setToast]                       = useState(null);
  const [showBatchModal, setShowBatchModal]      = useState(false);
  const [viewMode, setViewMode]                 = useState("table"); // "table" | "card"

  const [filterDistrict, setFilterDistrict] = useState(null);
  const [filterSchool, setFilterSchool]     = useState("");
  const [showUnmarkedOnly, setShowUnmarkedOnly] = useState(false);

  const toastTimer = useRef(null);

  // ── static derived data ───────────────────────────────────────────────────
  const activeCenters = useMemo(() => Region.filter((r) => !r.isCenterClosed), []);

  const districtOptions = useMemo(() => {
    const map = new Map();
    activeCenters.forEach((c) => { if (!map.has(c.districtId)) map.set(c.districtId, c.districtName); });
    return Array.from(map.entries())
      .map(([id, name]) => ({ value: id, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [activeCenters]);

  // ── server record map ─────────────────────────────────────────────────────
  const serverRecordMap = useMemo(() => {
    const m = new Map();
    disciplinaryData.forEach((d) => m.set(d._id, d.schoolDisciplinaryData ?? []));
    return m;
  }, [disciplinaryData]);

  // ── count helpers ─────────────────────────────────────────────────────────
  const getCount = useCallback((oid, status, batch) => {
    const real  = (serverRecordMap.get(oid) ?? []).filter((r) => r.status === status && (!batch || r.batch === batch)).length;
    const delta = optimistic?.[oid]?.[status] ?? 0;
    return real + delta;
  }, [serverRecordMap, optimistic]);

  const getTotal = useCallback((oid, batch) => {
    const real  = (serverRecordMap.get(oid) ?? []).filter((r) => !batch || r.batch === batch).length;
    const delta = Object.values(optimistic?.[oid] ?? {}).reduce((s, v) => s + v, 0);
    return real + delta;
  }, [serverRecordMap, optimistic]);

  // ── filtered + sorted rows ────────────────────────────────────────────────
  const filteredCenters = useMemo(() => {
    let list = activeCenters;
    if (filterDistrict) list = list.filter((c) => c.districtId === filterDistrict.value);
    if (filterSchool.trim()) list = list.filter((c) => c.schoolName.toLowerCase().includes(filterSchool.trim().toLowerCase()));
    if (showUnmarkedOnly) list = list.filter((c) => getTotal(c._id?.$oid ?? c._id, effectiveBatch) === 0);
    return [...list].sort((a, b) => a.districtName.localeCompare(b.districtName) || a.schoolName.localeCompare(b.schoolName));
  }, [activeCenters, filterDistrict, filterSchool, showUnmarkedOnly, getTotal, effectiveBatch]);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await GetSchoolDisciplinaryData({ date: effectiveDate, unqUserObjectId:userData?._id });
      if (res?.status === "Ok") { setDisciplinaryData(res.data); setOptimistic({}); }
    } catch { showToast("Failed to fetch data", "danger"); }
    finally  { setFetchLoading(false); }
  }, [effectiveDate, userData?._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── mark handler ──────────────────────────────────────────────────────────
  const handleMark = useCallback(async (center, status) => {
    // ✅ FIXED: Check if batch is selected and show modal
    if (!effectiveBatch) {
      console.log('❌ No batch selected - showing modal');
      setShowBatchModal(true);
      return;
    }

    console.log('✅ Batch selected:', effectiveBatch);
    
    const oid    = center._id?.$oid ?? center._id;
    const rowKey = `${oid}-${status}`;
    setPostingKey(rowKey);

    setOptimistic((prev) => ({
      ...prev,
      [oid]: { ...(prev[oid] ?? {}), [status]: (prev[oid]?.[status] ?? 0) + 1 },
    }));

    const payload = {
      district_block_schoolsObjectId: oid,
      subject: schoolContext?.schoolName ?? null,
      batch: effectiveBatch,
      status, remark: null,
      unqUserObjectId: userData?._id,
    };

    try {
      const res = await createSchoolDisciplinaryRecord(payload);
      if (res?.status === "Ok") {
        setDisciplinaryData((prev) => {
          const exists = prev.some((d) => d._id === oid);
          if (!exists) return [...prev, { _id: oid, schoolDisciplinaryData: [{ status, batch: effectiveBatch }] }];
          return prev.map((school) =>
            school._id !== oid ? school : {
              ...school,
              schoolDisciplinaryData: [...(school.schoolDisciplinaryData || []), { status, batch: effectiveBatch }],
            }
          );
        });
        setOptimistic((prev) => {
          const next = { ...prev };
          if (next[oid]?.[status]) {
            next[oid][status]--;
            if (next[oid][status] <= 0) delete next[oid][status];
            if (Object.keys(next[oid]).length === 0) delete next[oid];
          }
          return next;
        });

        // // ✅ FIXED: Gamification with proper date comparison
        // const currentDate = new Date().toISOString().split("T")[0];
        // console.log('startDate:', startDate);
        // console.log('currentDate:', currentDate);

        // if (currentDate) {
        //   console.log('✅ Dates match! Claiming gamification points...');
        //   await ClaimGamificationPoint({
        //     pointType: "disciplinary",
        //     date: currentDate,
        //     batch: effectiveBatch,
        //     schoolId: schoolContext?.schoolId,
        //     district_block_schoolsObjectId: oid,
        //     unqObjectId: userData?._id,
        //   });
        // } else {
        //   console.log('❌ Dates don\'t match. Skipping gamification.');
        // }
      } else {
        rollback(oid, status);
        showToast("Failed to save record", "danger");
      }
    } catch (error) {
      console.error('Error in handleMark:', error);
      rollback(oid, status); 
      showToast("Error posting data", "danger");
    } finally  { 
      setPostingKey(null); 
    }
  }, [effectiveBatch, schoolContext, userData, startDate]);

  const rollback = (oid, status) =>
    setOptimistic((prev) => ({
      ...prev,
      [oid]: { ...(prev[oid] ?? {}), [status]: Math.max(0, (prev[oid]?.[status] ?? 1) - 1) },
    }));

  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const footerTotals = useMemo(() => STATUS_ORDER.reduce((acc, status) => {
    acc[status] = disciplinaryData.reduce(
      (sum, d) => sum + (d.schoolDisciplinaryData?.filter(
        (r) => r.status === status && (!effectiveBatch || r.batch === effectiveBatch)
      ).length ?? 0), 0
    );
    return acc;
  }, {}), [disciplinaryData, effectiveBatch]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f4f6fb" }}>

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h4 className="mb-0 fw-bold" style={{ letterSpacing: "0.5px", fontSize: "1.28rem" }}>
              🏫 School Disciplinary Tracker
            </h4>
            <small style={{ opacity: 0.72 }}>Mark and monitor disciplinary status across all active centers</small>
          </div>
          {/* View toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 3, gap: 2 }}>
            {[
              { mode: "table", icon: "⊞", label: "Table" },
              { mode: "card",  icon: "❏", label: "Cards" },
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? "#fff" : "transparent",
                  color: viewMode === mode ? "#1a237e" : "rgba(255,255,255,0.75)",
                  border: "none", borderRadius: 8, padding: "5px 14px",
                  fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                  transition: "all 0.18s", whiteSpace: "nowrap",
                  boxShadow: viewMode === mode ? "0 1px 6px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={S.filterBar}>
        <div style={{ minWidth: 165 }}><SingleDatePicker /></div>
        <div style={{ minWidth: 165 }}><Batch_drop_down /></div>
        <div style={{ minWidth: 190 }}>
          <Select options={districtOptions} value={filterDistrict} onChange={setFilterDistrict}
            placeholder="All Districts" isClearable styles={rsStyles} />
        </div>
        <input
          type="text" className="form-control form-control-sm"
          placeholder="🔍 Search school…"
          style={{ minWidth: 180, borderRadius: 8, fontSize: "0.82rem", height: 31 }}
          value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", whiteSpace: "nowrap",
          fontSize: "0.8rem", color: showUnmarkedOnly ? "#c62828" : "#546e7a",
          fontWeight: showUnmarkedOnly ? 700 : 400, userSelect: "none" }}>
          <input type="checkbox" checked={showUnmarkedOnly} onChange={(e) => setShowUnmarkedOnly(e.target.checked)}
            style={{ accentColor: "#c62828", width: 14, height: 14 }} />
          0-marked only
        </label>
        {(filterDistrict || filterSchool || showUnmarkedOnly) && (
          <button className="btn btn-sm btn-outline-secondary"
            style={{ borderRadius: 8, fontSize: "0.78rem", whiteSpace: "nowrap", height: 31 }}
            onClick={() => { setFilterDistrict(null); setFilterSchool(""); setShowUnmarkedOnly(false); }}>
            ✕ Clear
          </button>
        )}
        <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={fetchData}
          disabled={fetchLoading} style={{ borderRadius: 8, whiteSpace: "nowrap", height: 31 }}>
          {fetchLoading ? <><span className="spinner-border spinner-border-sm me-1" />Refreshing…</> : <>🔄 Refresh</>}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={S.toastWrap}>
          <div className={`alert alert-${toast.type} shadow-lg mb-0 py-2 px-3`}
            style={{ borderRadius: 10, fontSize: "0.84rem" }}>
            {toast.message}
          </div>
        </div>
      )}

      {/* ✅ FIXED: Batch Modal with better styling and visibility */}
      {showBatchModal && (
        <div style={S.backdrop} onClick={() => setShowBatchModal(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "2.4rem", marginBottom: 8 }}>📋</div>
            <h5 style={{ fontWeight: 700, color: "#1a237e", marginBottom: 6 }}>Batch Not Selected</h5>
            <p style={{ color: "#546e7a", fontSize: "0.88rem", marginBottom: 20 }}>
              Please select a <strong>batch</strong> before marking disciplinary status.
            </p>
            <button className="btn btn-primary btn-sm px-4" style={{ borderRadius: 20 }}
              onClick={() => setShowBatchModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "18px 20px 32px" }}>
        {/* Meta row */}
        <div style={{ marginBottom: 12, fontSize: "0.79rem", color: "#7986cb", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span>Showing <strong>{filteredCenters.length}</strong> of <strong>{activeCenters.length}</strong> active centers</span>
          <span style={{ color: "#90a4ae" }}>
            📅 {new Date(effectiveDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          {effectiveBatch && (
            <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 12, padding: "1px 10px", fontWeight: 700, fontSize: "0.76rem" }}>
              Batch: {effectiveBatch}
            </span>
          )}
        </div>

        {fetchLoading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary mb-3" />
            <div style={{ fontSize: "0.85rem" }}>Loading disciplinary data…</div>
          </div>
        ) : viewMode === "table" ? (
          /* ══════════════════ TABLE VIEW ══════════════════ */
          <div style={S.tableCard}>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover mb-0" style={{ fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(90deg,#e8eaf6 0%,#f3f4fd 100%)", borderBottom: "2px solid #c5cae9" }}>
                    <th style={th}>#</th>
                    <th style={th}>District</th>
                    <th style={th}>Block</th>
                    <th style={th}>School Name</th>
                    <th style={{ ...th, textAlign: "center" }}>
                      Mark Status
                      {effectiveBatch && (
                        <span style={{ display: "block", fontWeight: 400, color: "#7986cb", fontSize: "0.69rem", textTransform: "none", letterSpacing: 0 }}>
                          counts for batch: {effectiveBatch}
                        </span>
                      )}
                    </th>
                    <th style={{ ...th, textAlign: "center" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCenters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        <div style={{ fontSize: "2rem" }}>🔍</div>
                        <div style={{ fontSize: "0.85rem" }}>No centers match your filters.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredCenters.map((center, idx) => (
                      <TableRow key={center._id?.$oid ?? center._id}
                        center={center} idx={idx}
                        getCount={getCount} getTotal={getTotal}
                        handleMark={handleMark} postingKey={postingKey}
                        effectiveBatch={effectiveBatch} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div style={S.footer}>
              <span style={{ fontWeight: 700, color: "#3949ab" }}>{activeCenters.length} centers</span>
              <span style={S.divider} />
              {STATUS_ORDER.map((status) => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <span key={status} style={{ background: cfg.bg, color: cfg.color, borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.77rem" }}>
                    {cfg.icon} {footerTotals[status]} {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          /* ══════════════════ CARD VIEW ══════════════════ */
          <>
            {filteredCenters.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: "2.5rem" }}>🔍</div>
                <div style={{ fontSize: "0.88rem" }}>No centers match your filters.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
                {filteredCenters.map((center, idx) => (
                  <CenterCard key={center._id?.$oid ?? center._id}
                    center={center} idx={idx}
                    getCount={getCount} getTotal={getTotal}
                    handleMark={handleMark} postingKey={postingKey}
                    effectiveBatch={effectiveBatch} />
                ))}
              </div>
            )}
            {/* Footer summary for card view */}
            <div style={{ ...S.footer, borderRadius: 12, marginTop: 20, border: "1px solid #e8eaf6" }}>
              <span style={{ fontWeight: 700, color: "#3949ab" }}>{activeCenters.length} centers</span>
              <span style={S.divider} />
              {STATUS_ORDER.map((status) => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <span key={status} style={{ background: cfg.bg, color: cfg.color, borderRadius: 12, padding: "2px 10px", fontWeight: 700, fontSize: "0.77rem" }}>
                    {cfg.icon} {footerTotals[status]} {cfg.label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Memoised Table Row ────────────────────────────────────────────────────────
const TableRow = React.memo(({ center, idx, getCount, getTotal, handleMark, postingKey, effectiveBatch }) => {
  const oid   = center._id?.$oid ?? center._id;
  const total = getTotal(oid, effectiveBatch);
  return (
    <tr>
      <td style={td}>
        <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: "0.74rem" }}>
          {idx + 1}
        </span>
      </td>
      <td style={td}><span style={{ color: "#5c6bc0", fontWeight: 600 }}>{center.districtName}</span></td>
      <td style={td}><span style={{ color: "#78909c", fontSize: "0.81rem" }}>{center.blockName}</span></td>
      <td style={td}><span style={{ fontWeight: 600, color: "#263238" }}>{center.schoolName}</span></td>
      <td style={{ ...td, textAlign: "center" }}>
        <div className="d-flex gap-1 justify-content-center flex-wrap">
          {STATUS_ORDER.map((status) => {
            const cfg     = STATUS_CONFIG[status];
            const rowKey  = `${oid}-${status}`;
            const posting = postingKey === rowKey;
            const cnt     = getCount(oid, status, effectiveBatch);
            return (
              <button key={status} className={`btn btn-${cfg.variant} btn-sm`}
                style={{ borderRadius: 20, fontSize: "0.72rem", padding: "3px 10px", fontWeight: 600, minWidth: 82, opacity: posting ? 0.65 : 1 }}
                disabled={posting} onClick={() => handleMark(center, status)}
                title={`Mark ${center.schoolName} as ${status}`}>
                {posting ? <span className="spinner-border spinner-border-sm" /> : (
                  <>{cfg.icon} {cfg.label}{cnt > 0 && (
                    <span style={{ background: "rgba(255,255,255,0.35)", borderRadius: 10, padding: "0 5px", marginLeft: 4, fontSize: "0.67rem", fontWeight: 800 }}>
                      {cnt}
                    </span>
                  )}</>
                )}
              </button>
            );
          })}
        </div>
      </td>
      <td style={{ ...td, textAlign: "center" }}>
        {total > 0 ? (
          <span style={{ background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff", borderRadius: 20, padding: "3px 14px", fontWeight: 700, fontSize: "0.81rem", display: "inline-block", minWidth: 36 }}>
            {total}
          </span>
        ) : <span style={{ color: "#cfd8dc" }}>—</span>}
      </td>
    </tr>
  );
});

// ── Memoised Card ─────────────────────────────────────────────────────────────
const CenterCard = React.memo(({ center, idx, getCount, getTotal, handleMark, postingKey, effectiveBatch }) => {
  const oid   = center._id?.$oid ?? center._id;
  const total = getTotal(oid, effectiveBatch);

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      boxShadow: "0 2px 14px rgba(40,53,147,0.08)",
      border: "1px solid #e8eaf6", overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 0.18s",
    }}>
      {/* Card header */}
      <div style={{
        background: "linear-gradient(135deg,#e8eaf6 0%,#f3f4fd 100%)",
        padding: "12px 16px", borderBottom: "1px solid #dde1f4",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        {/* Index badge */}
        <span style={{
          background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff",
          borderRadius: 8, padding: "3px 9px", fontWeight: 700, fontSize: "0.72rem",
          flexShrink: 0, marginTop: 2,
        }}>
          {idx + 1}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "#1a237e", fontSize: "0.88rem", lineHeight: 1.3, marginBottom: 3 }}
            title={center.schoolName}>
            {center.schoolName}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ background: "#e8eaf6", color: "#3949ab", borderRadius: 10, padding: "1px 8px", fontSize: "0.72rem", fontWeight: 600 }}>
              📍 {center.districtName}
            </span>
            <span style={{ color: "#90a4ae", fontSize: "0.72rem" }}>
              {center.blockName}
            </span>
          </div>
        </div>
        {/* Total badge */}
        {total > 0 && (
          <span style={{
            background: "linear-gradient(135deg,#1a237e,#3949ab)", color: "#fff",
            borderRadius: 20, padding: "3px 11px", fontWeight: 700, fontSize: "0.78rem",
            flexShrink: 0,
          }}>
            {total}
          </span>
        )}
      </div>

      {/* Status buttons */}
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Per-status rows */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {STATUS_ORDER.map((status) => {
            const cfg     = STATUS_CONFIG[status];
            const rowKey  = `${oid}-${status}`;
            const posting = postingKey === rowKey;
            const cnt     = getCount(oid, status, effectiveBatch);
            return (
              <button key={status}
                onClick={() => handleMark(center, status)}
                disabled={posting}
                title={`Mark as ${status}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                  borderRadius: 10, padding: "8px 12px",
                  cursor: posting ? "not-allowed" : "pointer",
                  opacity: posting ? 0.65 : 1,
                  transition: "transform 0.1s, box-shadow 0.1s",
                  width: "100%",
                }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", fontWeight: 700, color: cfg.color }}>
                  {posting
                    ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                    : <span>{cfg.icon}</span>}
                  {cfg.label}
                </span>
                <span style={{
                  background: cnt > 0 ? cfg.color : "#e0e0e0",
                  color: cnt > 0 ? "#fff" : "#9e9e9e",
                  borderRadius: 20, minWidth: 22, height: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, padding: "0 6px",
                  transition: "background 0.2s",
                }}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Total row */}
        <div style={{
          marginTop: 2, background: "#f8f9fe", borderRadius: 8, border: "1px solid #e8eaf6",
          padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: "0.76rem",
        }}>
          <span style={{ color: "#78909c", fontWeight: 600 }}>Total marks today</span>
          <span style={{
            background: total > 0 ? "linear-gradient(135deg,#1a237e,#3949ab)" : "#eeeeee",
            color: total > 0 ? "#fff" : "#9e9e9e",
            borderRadius: 20, padding: "2px 12px", fontWeight: 700, fontSize: "0.78rem",
          }}>
            {total || "None"}
          </span>
        </div>
      </div>
    </div>
  );
});

// ── Style tokens ──────────────────────────────────────────────────────────────
const S = {
  header: {
    background: "linear-gradient(135deg,#1a237e 0%,#283593 60%,#3949ab 100%)",
    padding: "20px 28px 16px", color: "#fff",
    boxShadow: "0 4px 20px rgba(26,35,126,0.18)",
  },
  filterBar: {
    background: "#fff", borderBottom: "1px solid #e3e8f0",
    padding: "11px 24px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
  },
  toastWrap: { position: "fixed", top: 20, right: 24, zIndex: 9999, minWidth: 260 },
  backdrop:  { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.5)", 
    zIndex: 99999, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  modal: { 
    background: "#fff", 
    borderRadius: 18, 
    padding: "36px 40px", 
    textAlign: "center", 
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)", 
    maxWidth: 340, 
    width: "90%",
    zIndex: 100000
  },
  tableCard: { background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(40,53,147,0.08)", overflow: "hidden" },
  footer:    { background: "#f8f9fe", borderTop: "1px solid #e8eaf6", padding: "10px 20px", display: "flex", gap: 10, flexWrap: "wrap", fontSize: "0.8rem", alignItems: "center" },
  divider:   { width: 1, height: 16, background: "#c5cae9", display: "inline-block" },
};

const th = { padding: "11px 16px", fontWeight: 700, color: "#3949ab", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", background: "transparent", border: "none" };
const td = { padding: "10px 16px", verticalAlign: "middle", borderBottom: "1px solid #f0f2fa" };