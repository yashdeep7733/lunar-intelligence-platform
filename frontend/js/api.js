// ========================================
// BACKEND API CONFIGURATION & DATA LAYER
// ========================================
const API_CONFIG = {
    baseURL: "http://192.168.31.253:6600", // e.g. "https://api.lunar-landing.org"
    endpoints: {
        analyze: "/detect"
    }
};

// Toggle mock mode for frontend development/demo purposes
const USE_MOCK_DATA = false;

// Public History Store
let analysisHistory = [];

// ========================================
// MOCK DATA (Matches JSON Contract)
// ========================================
const MOCK_ANALYSIS_DATA = {
    success: true,
    analysis_id: "LLSDS-ANALYZE-84920-X",
    processing_info: {
        planet: "Moon",
        model: "YOLO11-Lunar-v3.2",
        processing_time: "1.42 sec",
        analysis_date: "2026-08-20T14:32:00Z"
    },
    image_resolution: {
        width: 1920,
        height: 1080
    },
    craters: [
        { id: "CR-001", x_center: 450, y_center: 320, diameter_px: 142, confidence: 0.96, size_class: "large", hazard_rating: "Moderate" },
        { id: "CR-002", x_center: 820, y_center: 510, diameter_px: 85, confidence: 0.92, size_class: "medium", hazard_rating: "Low" },
        { id: "CR-003", x_center: 210, y_center: 740, diameter_px: 45, confidence: 0.89, size_class: "small", hazard_rating: "Low" },
        { id: "CR-004", x_center: 1250, y_center: 210, diameter_px: 110, confidence: 0.94, size_class: "large", hazard_rating: "High" },
        { id: "CR-005", x_center: 1500, y_center: 820, diameter_px: 62, confidence: 0.88, size_class: "medium", hazard_rating: "Low" },
        { id: "CR-006", x_center: 630, y_center: 900, diameter_px: 38, confidence: 0.91, size_class: "small", hazard_rating: "Low" }
    ],
    images: {
        annotated: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><rect width='100%' height='100%' fill='%230b1329'/><circle cx='450' cy='320' r='71' fill='none' stroke='%2338bdf8' stroke-width='4'/><text x='450' y='235' fill='%2338bdf8' font-size='20' font-family='monospace' text-anchor='middle'>CR-001 (142px)</text><circle cx='820' cy='510' r='42' fill='none' stroke='%23f59e0b' stroke-width='4'/><text x='820' y='455' fill='%23f59e0b' font-size='20' font-family='monospace' text-anchor='middle'>CR-002 (85px)</text><circle cx='1250' cy='210' r='55' fill='none' stroke='%23ef4444' stroke-width='4'/><text x='1250' y='145' fill='%23ef4444' font-size='20' font-family='monospace' text-anchor='middle'>CR-003 (110px)</text><text x='960' y='540' fill='%2394a3b8' font-size='32' font-family='sans-serif' text-anchor='middle' opacity='0.5'>[ YOLO11 ANNOTATED LUNAR SURFACE ]</text></svg>"
    },
    chart_data: {
        diameters: [38, 45, 62, 85, 110, 142]
    },
    statistics: {
        total_craters: 6,
        largest_crater_px: 142,
        smallest_crater_px: 38,
        average_crater_px: 80,
        median_crater_px: 73
    },
    hazard: {
        score: 34,
        level: "Moderate"
    },
    size_distribution: {
        small: 2,
        medium: 2,
        large: 2
    },
    confidence: {
        average: 0.91,
        highest: 0.96,
        lowest: 0.88,
        values: [0.96, 0.92, 0.89, 0.94, 0.88, 0.91]
    },
    explainable_ai: {
        summary: "YOLO11 lunar analysis indicates a moderately cratered terrain with cluster density concentrated in the southern quadrant. Surface slope variance is within nominal limits for autonomous touchdown, though crater CR-004 presents a localized slope gradient exceeding 15 degrees. Recommended landing ellipse shifted 45 meters northwest."
    }
};

// ========================================
// API COMMUNICATION FUNCTIONS
// ========================================

/**
 * Sends the selected image file to backend for analysis.
 * @param {File} file 
 */
async function analyzeImage(file) {
    let resultData;
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        // Clone mock data with unique ID & timestamp for history testing
        resultData = JSON.parse(JSON.stringify(MOCK_ANALYSIS_DATA));
        resultData.analysis_id = "LLSDS-ANALYZE-" + Math.floor(10000 + Math.random() * 90000);
        resultData.processing_info.analysis_date = new Date().toISOString();
        
        // If file provided, create object URL preview if possible
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            // Optionally substitute annotated image preview if user uploaded custom image
            // Keep SVG mock if none
        }
    } else {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.analyze}`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            resultData = await response.json();
        } catch (error) {
            console.error("Analysis API Error:", error);
            throw error;
        }
    }

    // Push to public history store
    analysisHistory.unshift(resultData);
    return resultData;
}