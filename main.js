const URL = "https://teachablemachine.withgoogle.com/models/3rvPso0KE/";

let model, labelContainer, maxPredictions;

// Theme logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeButtonText(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButtonText(newTheme);
    });
}

function updateThemeButtonText(theme) {
    if (themeToggleBtn) {
        themeToggleBtn.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
}

// Image upload logic (only if elements exist)
const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');

if (uploadBtn && imageUpload) {
    uploadBtn.addEventListener('click', () => imageUpload.click());

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                
                // Re-analyze when a new image is uploaded
                await initAndPredict();
            };
            reader.readAsDataURL(file);
        }
    });
}

async function initAndPredict() {
    if (!model) {
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = "Loading AI Model...";
        }
        
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
        try {
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            
            labelContainer = document.getElementById("label-container");
            if (labelContainer) {
                labelContainer.innerHTML = '';
                for (let i = 0; i < maxPredictions; i++) {
                    const predictionBar = document.createElement("div");
                    predictionBar.className = "prediction-bar-container";
                    predictionBar.innerHTML = `
                        <div class="prediction-label">
                            <span class="class-name">Class</span>
                            <span class="probability">0%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 0%"></div>
                        </div>
                    `;
                    labelContainer.appendChild(predictionBar);
                }
            }
        } catch (error) {
            console.error("Model loading failed:", error);
            if (uploadBtn) uploadBtn.textContent = "Error Loading Model";
            return;
        }
        
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.textContent = "Upload Another Image";
        }
    }
    
    await predict();
}

async function predict() {
    if (!model || !imagePreview || !labelContainer) return;
    
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(imagePreview);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0) + "%";
        
        const barContainer = labelContainer.childNodes[i];
        if (barContainer) {
            const classNameEl = barContainer.querySelector('.class-name');
            const probabilityEl = barContainer.querySelector('.probability');
            const fillEl = barContainer.querySelector('.progress-bar-fill');
            
            if (classNameEl) classNameEl.textContent = className;
            if (probabilityEl) probabilityEl.textContent = probability;
            if (fillEl) fillEl.style.width = probability;
        }
    }
}
