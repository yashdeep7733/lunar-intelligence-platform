// ========================================
// APPLICATION STATE & ROUTING CONTROLLER
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // 1. Initialize Google Sign-In Event
    const signinBtn = document.getElementById("google-signin-btn");
    signinBtn.addEventListener("click", async () => {
        try {
            signinBtn.textContent = "Authenticating personnel...";
            const res = await signInWithGoogle();
            if (res.success) {
                document.getElementById("user-display-email").textContent = res.user.email;
                document.getElementById("dash-user-email").textContent = res.user.email;
                switchViewState("upload-view");
            }
        } catch (err) {
            alert("Authentication failed.");
            signinBtn.textContent = "Sign in with Google (Personnel Auth)";
        }
    });

    // 2. Logout Handlers
    document.getElementById("logout-btn").addEventListener("click", () => {
        switchViewState("login-view");
    });

    document.getElementById("new-analysis-btn").addEventListener("click", () => {
        switchViewState("upload-view");
    });

    // 3. Initialize Upload Module listeners
    initUploadModule();

    // 4. Sidebar Smooth Scrolling
    document.querySelectorAll(".sidebar-nav a").forEach(anchor => {
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
    }
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
        }, (index + 1) * 450);
    });
}
