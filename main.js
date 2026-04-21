const URL = "https://teachablemachine.withgoogle.com/models/3rvPso0KE/";

let model, labelContainer, maxPredictions;

// Theme logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeButtonText(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
});

function updateThemeButtonText(theme) {
    themeToggleBtn.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

// Image upload logic
const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');

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

async function initAndPredict() {
    if (!model) {
        uploadBtn.disabled = true;
        uploadBtn.textContent = "Loading AI Model...";
        
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        labelContainer = document.getElementById("label-container");
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
        
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Another Image";
    }
    
    await predict();
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(imagePreview);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0) + "%";
        
        const barContainer = labelContainer.childNodes[i];
        barContainer.querySelector('.class-name').textContent = className;
        barContainer.querySelector('.probability').textContent = probability;
        barContainer.querySelector('.progress-bar-fill').style.width = probability;
    }
}
