// ========================================
// UPLOAD & FILE INGESTION MODULE
// ========================================

let selectedFile = null;

function initUploadModule() {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const browseBtn = document.getElementById("browse-btn");
    const removeBtn = document.getElementById("remove-file-btn");
    const analyzeBtn = document.getElementById("analyze-btn");
    const dropZoneContent = document.getElementById("drop-zone-content");
    const previewContainer = document.getElementById("preview-container");
    const imagePreview = document.getElementById("image-preview");
    const fileNameEl = document.getElementById("file-name");
    const fileDimensionsEl = document.getElementById("file-dimensions");

    browseBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
    });

    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        if (e.dataTransfer.files.length > 0) {
            handleSelectedFile(e.dataTransfer.files[0]);
        }
    });

    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        resetUploadState();
    });

    analyzeBtn.addEventListener("click", async () => {
        if (!selectedFile && !USE_MOCK_DATA) return;
        
        switchViewState("processing-view");
        startProcessingAnimation();

        try {
            const data = await analyzeImage(selectedFile);
            setTimeout(() => {
                renderDashboard(data);
                switchViewState("dashboard-view");
            }, 600);
        } catch (error) {
            alert("Analysis failed: " + error.message);
            switchViewState("upload-view");
        }
    });

    function handleSelectedFile(file) {
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file format. Please upload PNG, JPG, JPEG, or WEBP lunar imagery.");
            return;
        }

        selectedFile = file;
        fileNameEl.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            
            const img = new Image();
            img.onload = () => {
                fileDimensionsEl.textContent = `Dimensions: ${img.width} × ${img.height} px`;
            };
            img.src = e.target.result;

            dropZoneContent.classList.add("hidden");
            previewContainer.classList.remove("hidden");
            analyzeBtn.removeAttribute("disabled");
        };
        reader.readAsDataURL(file);
    }

    function resetUploadState() {
        selectedFile = null;
        fileInput.value = "";
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        dropZoneContent.classList.remove("hidden");
        analyzeBtn.setAttribute("disabled", "true");
    }
}