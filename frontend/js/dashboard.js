// ========================================
// DASHBOARD RENDERING & MAPPING MODULE
// ========================================

/**
 * Main dashboard rendering entry point matching the JSON contract.
 * @param {Object} data
 */
function renderDashboard(data) {
    if (!data || !data.success) {
        console.error("Invalid dashboard data contract response");
        return;
    }

    // 1. Header Telemetry
    document.getElementById("header-analysis-id").textContent = data.analysis_id;
    document.getElementById("header-planet").textContent = data.processing_info.planet || "Moon";
    document.getElementById("header-model").textContent = data.processing_info.model || "YOLO11";

    // 2. Statistics & KPIs
    const stats = data.statistics || {};
    document.getElementById("kpi-total-craters").textContent = stats.total_craters ?? 0;
    document.getElementById("kpi-largest-crater").textContent = stats.largest_crater_px ?? 0;
    document.getElementById("kpi-smallest-crater").textContent = stats.smallest_crater_px ?? 0;
    document.getElementById("kpi-avg-crater").textContent = stats.average_crater_px ?? 0;
    document.getElementById("kpi-median-crater").textContent = stats.median_crater_px ?? 0;

    // 3. AI Annotated Image
    const annotatedImg = document.getElementById("annotated-image-output");
    if (data.images && data.images.annotated) {
        // Handle raw base64 or SVG data uri correctly
        const base64Str = data.images.annotated;
        annotatedImg.src = base64Str.startsWith("data:") ? base64Str : `data:image/png;base64,${base64Str}`;
    }

    const res = data.image_resolution || {};
    document.getElementById("res-pill").textContent = `Res: ${res.width || 0}x${res.height || 0}`;
    document.getElementById("time-pill").textContent = `Proc: ${data.processing_info.processing_time || "0s"}`;

    // 4. Hazard Assessment Gauge
    const hazard = data.hazard || { score: 0, level: "Safe" };
    document.getElementById("hazard-score-val").textContent = hazard.score;

    // Animate radial gauge circumference (314 is full circumference for r=50)
    const gaugeCircle = document.getElementById("gauge-progress-circle");
    const strokeOffset = 314 - (314 * hazard.score) / 100;
    gaugeCircle.style.strokeDashoffset = strokeOffset;

    const hazardBadge = document.getElementById("hazard-level-badge");
    hazardBadge.textContent = hazard.level.toUpperCase();
    hazardBadge.className = "hazard-level-badge";
    if (hazard.score < 30) hazardBadge.classList.add("level-safe");
    else if (hazard.score < 70) hazardBadge.classList.add("level-moderate");
    else hazardBadge.classList.add("level-high");

    document.getElementById("hazard-desc").textContent = `Calculated hazard risk index is ${hazard.score}/100 (${hazard.level} risk category) based on spatial obstacle density and slope gradients.`;

    // 5. Confidence Analysis
    const conf = data.confidence || {};
    document.getElementById("conf-avg").textContent = `${Math.round((conf.average || 0) * 100)}%`;
    document.getElementById("conf-high").textContent = `${Math.round((conf.highest || 0) * 100)}%`;
    document.getElementById("conf-low").textContent = `${Math.round((conf.lowest || 0) * 100)}%`;

    // 6. Explainable AI Summary
    const xaiSummary = data.explainable_ai && data.explainable_ai.summary
    ? data.explainable_ai.summary
    : "No AI explanation available for this run.";
    document.getElementById("xai-summary-text").textContent = xaiSummary;

    // 7. Processing Information Panel
    document.getElementById("tech-id").textContent = data.analysis_id;
    document.getElementById("tech-planet").textContent = data.processing_info.planet;
    document.getElementById("tech-model").textContent = data.processing_info.model;
    document.getElementById("tech-time").textContent = data.processing_info.processing_time;
    document.getElementById("tech-date").textContent = new Date(data.processing_info.analysis_date).toLocaleString();
    document.getElementById("tech-res").textContent = `${res.width} × ${res.height} px`;
    document.getElementById("analysis-date-label").textContent = `Date: ${new Date(data.processing_info.analysis_date).toLocaleDateString()}`;

    // 8. Dynamic Crater Table
    renderCraterTable(data.craters || []);

    // 9. Render Charts
    renderCharts(data);
}

/**
 * Dynamically inspects crater keys and renders a robust table.
 * @param {Array} craters
 */
function renderCraterTable(craters) {
    const thead = document.getElementById("crater-table-head");
    const tbody = document.getElementById("crater-table-body");
    const emptyState = document.getElementById("crater-table-empty");
    const countBadge = document.getElementById("table-count-badge");

    countBadge.textContent = `${craters.length} entries`;

    if (!craters || craters.length === 0) {
        thead.innerHTML = "";
        tbody.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    // Extract keys dynamically
    const keys = Object.keys(craters[0]);

    // Build headers cleanly (convert snake_case to Title Case)
    thead.innerHTML = `<tr>${keys.map(k => `<th>${k.replace(/_/g, ' ')}</th>`).join('')}</tr>`;

    // Build rows
    tbody.innerHTML = craters.map(crater => {
        return `<tr>${keys.map(k => `<td>${crater[k] !== undefined ? crater[k] : '-'}</td>`).join('')}</tr>`;
    }).join('');
}
