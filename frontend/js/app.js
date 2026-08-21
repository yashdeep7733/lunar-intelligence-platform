// ========================================
// APPLICATION STATE & ROUTING CONTROLLER
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // 1. Initialize Upload Module
    initUploadModule();

    // 2. Navigation Actions
    document.getElementById("new-analysis-btn").addEventListener("click", () => {
        switchViewState("upload-view");
    });

    document.getElementById("back-to-upload-btn").addEventListener("click", () => {
        switchViewState("upload-view");
    });

    // History Nav Triggers
    const historyLink = document.getElementById("sidebar-history-link");
    if (historyLink) {
        historyLink.addEventListener("click", (e) => {
            e.preventDefault();
            renderPublicHistory();
            switchViewState("history-view");
        });
    }

    const topHistoryBtn = document.getElementById("view-history-btn-top");
    if (topHistoryBtn) {
        topHistoryBtn.addEventListener("click", () => {
            renderPublicHistory();
            switchViewState("history-view");
        });
    }

    // 3. Download Dropdown Toggle
    const downloadBtn = document.getElementById("download-report-btn");
    const downloadMenu = document.getElementById("download-menu");

    if (downloadBtn && downloadMenu) {
        downloadBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            downloadMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            downloadMenu.classList.add("hidden");
        });

        downloadMenu.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const format = e.target.getAttribute("data-format");
                exportReport(format);
                downloadMenu.classList.add("hidden");
            });
        });
    }

    // 4. Sidebar Smooth Scrolling
    document.querySelectorAll(".sidebar-nav a:not(.history-nav-item)").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                document.querySelectorAll(".sidebar-nav a").forEach(el => el.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });
}

/**
 * Manages SPA view state transitions
 * @param {string} viewId 
 */
function switchViewState(viewId) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("active");
    });
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add("active");
        window.scrollTo(0, 0);

        // If switching to dashboard view, trigger resize redraw for charts
        if (viewId === "dashboard-view" && currentDashboardData) {
            renderCharts(currentDashboardData);
        }
    }
}

/**
 * Renders the public history section table from analysisHistory array
 */
function renderPublicHistory() {
    const tbody = document.getElementById("history-table-body");
    const emptyState = document.getElementById("history-empty");

    if (!analysisHistory || analysisHistory.length === 0) {
        tbody.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    tbody.innerHTML = analysisHistory.map((item, idx) => {
        const dateStr = new Date(item.processing_info.analysis_date).toLocaleString();
        return `
            <tr>
                <td class="mono">${item.analysis_id}</td>
                <td>${dateStr}</td>
                <td><span class="badge">${item.processing_info.model}</span></td>
                <td><strong>${item.statistics.total_craters}</strong> objects</td>
                <td><span class="hazard-level-badge ${item.hazard.score < 30 ? 'level-safe' : (item.hazard.score < 70 ? 'level-moderate' : 'level-high')}">${item.hazard.level}</span></td>
                <td><button type="button" class="btn btn-sm btn-secondary view-history-item" data-index="${idx}">View Dashboard</button></td>
            </tr>
        `;
    }).join("");

    // Attach click listeners to loaded history items
    tbody.querySelectorAll(".view-history-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"), 10);
            const record = analysisHistory[index];
            if (record) {
                renderDashboard(record);
                switchViewState("dashboard-view");
            }
        });
    });
}

/**
 * Simulated processing loading bar animation
 */
function startProcessingAnimation() {
    const fill = document.getElementById("progress-bar-fill");
    const statusText = document.getElementById("processing-status-text");
    
    fill.style.width = "0%";
    
    const steps = [
        { progress: "25%", text: "Ingesting lunar surface raster telemetry..." },
        { progress: "55%", text: "Executing YOLO11 multi-scale crater bounding boxes..." },
        { progress: "80%", text: "Computing hazard score & size distributions..." },
        { progress: "100%", text: "Finalizing AI analysis report..." }
    ];

    steps.forEach((step, index) => {
        setTimeout(() => {
            fill.style.width = step.progress;
            statusText.textContent = step.text;
        }, (index + 1) * 380);
    });
}