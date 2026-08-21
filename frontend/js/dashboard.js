// ========================================
// DASHBOARD RENDERING & REPORT EXPORT
// ========================================

let currentDashboardData = null;

function renderDashboard(data) {
    if (!data || !data.success) {
        console.error("Invalid dashboard data contract response");
        return;
    }

    currentDashboardData = data;

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

    // 3. AI Annotated Image (Robust Rendering Fix)
    const annotatedImg = document.getElementById("annotated-image-output");
    if (data.images && data.images.annotated) {
        const imgVal = data.images.annotated;
        if (imgVal.startsWith("data:") || imgVal.startsWith("http")) {
            annotatedImg.src = imgVal;
        } else {
            annotatedImg.src = `data:image/png;base64,${imgVal}`;
        }
    }

    const res = data.image_resolution || {};
    document.getElementById("res-pill").textContent = `Res: ${res.width || 0}x${res.height || 0}`;
    document.getElementById("time-pill").textContent = `Proc: ${data.processing_info.processing_time || "0s"}`;

    // 4. Hazard Assessment Gauge
    const hazard = data.hazard || { score: 0, level: "Safe" };
    document.getElementById("hazard-score-val").textContent = hazard.score;
    
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

    // 9. Render Charts (Histogram & Donut & Confidence)
    renderCharts(data);
}

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
    const keys = Object.keys(craters[0]);

    thead.innerHTML = `<tr>${keys.map(k => `<th>${k.replace(/_/g, ' ')}</th>`).join('')}</tr>`;
    tbody.innerHTML = craters.map(crater => {
        return `<tr>${keys.map(k => `<td>${crater[k] !== undefined ? crater[k] : '-'}</td>`).join('')}</tr>`;
    }).join('');
}

// ========================================
// REPORT DOWNLOAD EXPORT FUNCTIONS
// ========================================

function exportReport(format) {
    if (!currentDashboardData) {
        alert("No active dashboard report available to download.");
        return;
    }

    const reportId = currentDashboardData.analysis_id;
    let fileContent = "";
    let mimeType = "";
    let extension = format;

    if (format === 'json') {
        fileContent = JSON.stringify(currentDashboardData, null, 2);
        mimeType = "application/json";
    } else {
        // Formats: pdf, docx, pptx formatted textual simulation for download blob
        fileContent = `==================================================\n` +
                      ` LUNAR LANDING SITE DETECTION SYSTEM REPORT\n` +
                      ` Format: ${format.toUpperCase()} | ID: ${reportId}\n` +
                      `==================================================\n\n` +
                      `1. PROCESSING TELEMETRY\n` +
                      ` - Planet: ${currentDashboardData.processing_info.planet}\n` +
                      ` - Model: ${currentDashboardData.processing_info.model}\n` +
                      ` - Processing Time: ${currentDashboardData.processing_info.processing_time}\n` +
                      ` - Analysis Date: ${currentDashboardData.processing_info.analysis_date}\n` +
                      ` - Resolution: ${currentDashboardData.image_resolution.width}x${currentDashboardData.image_resolution.height}\n\n` +
                      `2. MISSION STATISTICS\n` +
                      ` - Total Craters: ${currentDashboardData.statistics.total_craters}\n` +
                      ` - Largest Crater: ${currentDashboardData.statistics.largest_crater_px} px\n` +
                      ` - Smallest Crater: ${currentDashboardData.statistics.smallest_crater_px} px\n` +
                      ` - Average Crater: ${currentDashboardData.statistics.average_crater_px} px\n` +
                      ` - Median Crater: ${currentDashboardData.statistics.median_crater_px} px\n\n` +
                      `3. HAZARD ASSESSMENT\n` +
                      ` - Hazard Score: ${currentDashboardData.hazard.score}/100\n` +
                      ` - Hazard Level: ${currentDashboardData.hazard.level}\n\n` +
                      `4. EXPLAINABLE AI SUMMARY\n` +
                      ` ${currentDashboardData.explainable_ai.summary}\n\n` +
                      `==================================================\n` +
                      ` End of Report - LLSDS Autonomous Workstation\n` +
                      `==================================================\n`;
        
        mimeType = format === 'pdf' ? "application/pdf" : (format === 'docx' ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lunar_Analysis_Report_${reportId}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}