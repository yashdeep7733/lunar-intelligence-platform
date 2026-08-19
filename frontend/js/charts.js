// ========================================
// CHARTS & VISUALIZATIONS MODULE (Vanilla JS / Canvas / SVG)
// ========================================

/**
 * Renders Crater Diameter Distribution line/bar chart using HTML Canvas.
 * @param {Array} diameters
 */
function renderCharts(data) {
    renderDiameterChart(data.chart_data.diameters);
    renderSizeDistributionChart(data.size_distribution);
    renderConfidenceChart(data.confidence.values);
}

function renderDiameterChart(diameters) {
    const canvas = document.getElementById("diameter-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!diameters || diameters.length === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Inter";
        ctx.fillText("No diameter data available", 20, 40);
        return;
    }

    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;

    const maxVal = Math.max(...diameters, 150);
    const stepX = width / (diameters.length - 1 || 1);

    // Draw grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();
    }

    // Plot line & points
    ctx.beginPath();
    diameters.forEach((val, index) => {
        const x = padding + index * stepX;
        const y = padding + height - (val / maxVal) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw glowing data points
        diameters.forEach((val, index) => {
            const x = padding + index * stepX;
            const y = padding + height - (val / maxVal) * height;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#0f172a";
            ctx.fill();
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
}

function renderSizeDistributionChart(sizeDist) {
    const wrapper = document.getElementById("size-donut-chart");
    if (!wrapper) return;

    const small = sizeDist.small || 0;
    const medium = sizeDist.medium || 0;
    const large = sizeDist.large || 0;
    const total = small + medium + large || 1;

    const smallPct = (small / total) * 100;
    const mediumPct = (medium / total) * 100;
    const largePct = (large / total) * 100;

    // SVG Donut implementation
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const createSlice = (percent, color) => {
        if (percent === 0) return '';
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        const pathData = `M ${startX * 40 + 50} ${startY * 40 + 50} A 40 40 0 ${largeArcFlag} 1 ${endX * 40 + 50} ${endY * 40 + 50}`;
        return `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="20" />`;
    };

    cumulativePercent = 0;
    const svgContent = `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" stroke-width="20"/>
    ${createSlice(smallPct / 100, '#38bdf8')}
    ${createSlice(mediumPct / 100, '#f59e0b')}
    ${createSlice(largePct / 100, '#ef4444')}
    </svg>
    `;

    wrapper.innerHTML = svgContent;

    document.getElementById("size-small-val").textContent = small;
    document.getElementById("size-medium-val").textContent = medium;
    document.getElementById("size-large-val").textContent = large;
}

function renderConfidenceChart(values) {
    const container = document.getElementById("confidence-bar-chart");
    if (!container) return;

    if (!values || values.length === 0) {
        container.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">No confidence array data</span>';
        return;
    }

    container.innerHTML = values.map(val => {
        const heightPct = Math.max(val * 100, 10);
        return `<div class="conf-bar" style="height: ${heightPct}%;" title="Confidence: ${(val * 100).toFixed(1)}%"></div>`;
    }).join("");
}
