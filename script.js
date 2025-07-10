/**
 * FaceMoji - Real-time Face Detection Web Application
 * 
 * This application provides real-time face detection with emotion recognition,
 * built using face-api.js and modern web technologies.
 * 
 * Features:
 * - Real-time face detection and tracking
 * - Emotion recognition (happy, sad, neutral, surprised)
 * - Multiple face support
 * - Camera controls and settings
 * - Responsive design with glassmorphism UI
 * - Privacy-focused (all processing done locally)
 */

class FaceMojiApp {
    constructor() {
        // Application state
        this.isModelLoaded = false;
        this.isCameraActive = false;
        this.isDetectionRunning = false;
        this.currentStream = null;
        this.detectionInterval = null;
        this.lastFrameTime = 0;
        this.fpsCounter = 0;
        this.fpsDisplay = 0;
        
        // Settings
        this.settings = {
            detectionSensitivity: 0.5,
            maxFaces: 5,
            emotionDetectionEnabled: true,
            preferredCamera: null
        };
        
        // Face detection data
        this.lastDetections = [];
        this.emotionData = {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            neutral: 0
        };
        
        // DOM elements
        this.elements = {};
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing FaceMoji...');
            this.initDOMElements();
            this.setupEventListeners();
            
            // Add timeout for model loading
            const modelLoadPromise = this.loadModels();
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Model loading timeout after 30 seconds')), 30000);
            });
            
            await Promise.race([modelLoadPromise, timeoutPromise]);
            
            await this.setupCamera();
            this.showApp();
            this.showToast('success', 'FaceMoji Ready', 'Face detection is now active!');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Handle initialization errors with user-friendly messages
     */
    handleInitializationError(error) {
        let errorMessage = error.message;
        let troubleshootingTips = '';
        
        if (error.message.includes('Model loading timeout')) {
            errorMessage = 'Model loading is taking too long';
            troubleshootingTips = 'Please check your internet connection and try refreshing the page.';
        } else if (error.message.includes('Cannot access face detection models')) {
            errorMessage = 'Cannot download face detection models';
            troubleshootingTips = 'Please check your internet connection and ensure CDNs are not blocked.';
        } else if (error.message.includes('Camera setup failed')) {
            errorMessage = 'Camera access failed';
            troubleshootingTips = 'Please grant camera permission and ensure no other apps are using the camera.';
        }
        
        // Update loading screen with error
        this.elements.loadingProgress.style.width = '0%';
        this.elements.loadingProgress.style.background = '#ef4444';
        this.elements.loadingText.innerHTML = `
            <div style="color: #ef4444; margin-bottom: 10px;">❌ ${errorMessage}</div>
            <div style="font-size: 12px; color: #9ca3af;">${troubleshootingTips}</div>
            <button onclick="location.reload()" style="
                margin-top: 15px; 
                padding: 8px 16px; 
                background: #6366f1; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-size: 14px;
            ">Try Again</button>
        `;
        
        this.showToast('error', 'Initialization Failed', errorMessage);
    }

    /**
     * Get references to DOM elements
     */
    initDOMElements() {
        this.elements = {
            // Main containers
            loadingScreen: document.getElementById('loadingScreen'),
            appContainer: document.getElementById('appContainer'),
            loadingProgress: document.getElementById('loadingProgress'),
            loadingText: document.getElementById('loadingText'),
            
            // Video elements
            video: document.getElementById('videoElement'),
            canvas: document.getElementById('overlayCanvas'),
            videoOverlay: document.getElementById('videoOverlay'),
            noFaceMessage: document.getElementById('noFaceMessage'),
            
            // Status elements
            cameraStatus: document.getElementById('cameraStatus'),
            statusText: document.getElementById('statusText'),
            emotionStatus: document.getElementById('emotionStatus'),
            dominantEmoji: document.getElementById('dominantEmoji'),
            dominantEmotion: document.getElementById('dominantEmotion'),
            faceCount: document.getElementById('faceCount'),
            confidence: document.getElementById('confidence'),
            fpsDisplay: document.getElementById('fpsDisplay'),
            emotionGrid: document.getElementById('emotionGrid'),
            
            // Controls
            toggleCamera: document.getElementById('toggleCamera'),
            captureBtn: document.getElementById('captureBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            
            // Settings modal
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            cameraSelect: document.getElementById('cameraSelect'),
            sensitivityRange: document.getElementById('sensitivityRange'),
            sensitivityValue: document.getElementById('sensitivityValue'),
            maxFacesRange: document.getElementById('maxFacesRange'),
            maxFacesValue: document.getElementById('maxFacesValue'),
            emotionDetection: document.getElementById('emotionDetection'),
            
            // Toast container
            toastContainer: document.getElementById('toastContainer')
        };
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Camera toggle
        this.elements.toggleCamera.addEventListener('click', () => this.toggleCamera());
        
        // Capture screenshot
        this.elements.captureBtn.addEventListener('click', () => this.captureScreenshot());
        
        // Fullscreen toggle
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Settings modal
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.closeSettings.addEventListener('click', () => this.hideSettings());
        
        // Settings controls
        this.elements.sensitivityRange.addEventListener('input', (e) => {
            this.settings.detectionSensitivity = parseFloat(e.target.value);
            this.elements.sensitivityValue.textContent = e.target.value;
        });
        
        this.elements.maxFacesRange.addEventListener('input', (e) => {
            this.settings.maxFaces = parseInt(e.target.value);
            this.elements.maxFacesValue.textContent = e.target.value;
        });
        
        this.elements.emotionDetection.addEventListener('change', (e) => {
            this.settings.emotionDetectionEnabled = e.target.checked;
        });
        
        this.elements.cameraSelect.addEventListener('change', (e) => {
            this.settings.preferredCamera = e.target.value;
            this.switchCamera(e.target.value);
        });
        
        // Modal click outside to close
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.hideSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSettings();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.captureScreenshot();
            } else if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseDetection();
            } else {
                this.resumeDetection();
            }
        });
    }

    /**
     * Load face detection models
     */
    async loadModels() {
        try {
            this.updateLoadingProgress(10, 'Loading face detection models...');
            
            // Try multiple CDN sources for better reliability
            const modelPaths = [
                'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
                'https://unpkg.com/face-api.js@0.22.2/weights',
                'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights',
                './models' // Local fallback
            ];
            
            let modelPath = null;
            let lastError = null;
            
            // Test which CDN is accessible
            for (const path of modelPaths) {
                try {
                    console.log(`Testing model path: ${path}`);
                    this.updateLoadingProgress(15, `Testing ${path}...`);
                    
                    // Test if we can reach the CDN with a simpler approach
                    const testUrl = `${path}/tiny_face_detector_model-weights_manifest.json`;
                    console.log(`Testing URL: ${testUrl}`);
                    
                    // Create timeout promise
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000);
                    });
                    
                    const fetchPromise = fetch(testUrl, {
                        method: 'GET',
                        cache: 'no-cache'
                    });
                    
                    const testResponse = await Promise.race([fetchPromise, timeoutPromise]);
                    
                    if (testResponse.ok || testResponse.status === 200) {
                        modelPath = path;
                        console.log(`Successfully connected to: ${path}`);
                        break;
                    } else {
                        console.warn(`HTTP ${testResponse.status} for ${path}`);
                    }
                } catch (error) {
                    console.warn(`Failed to connect to ${path}:`, error.message);
                    lastError = error;
                    continue;
                }
            }
            
            if (!modelPath) {
                throw new Error(`Cannot access face detection models. Please check your internet connection. Last error: ${lastError?.message}`);
            }
            
            this.updateLoadingProgress(20, 'Downloading models...');
            
            // Load core models with better error handling
            console.log('Loading TinyFaceDetector...');
            await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
            this.updateLoadingProgress(40, 'Face detection model loaded...');
            
            console.log('Loading FaceLandmark68Net...');
            await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
            this.updateLoadingProgress(60, 'Facial landmarks model loaded...');
            
            console.log('Loading FaceRecognitionNet...');
            await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
            this.updateLoadingProgress(80, 'Face recognition model loaded...');
            
            console.log('Loading FaceExpressionNet...');
            await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
            this.updateLoadingProgress(95, 'Expression recognition model loaded...');
            
            this.isModelLoaded = true;
            this.updateLoadingProgress(100, 'All models loaded successfully!');
            console.log('All face detection models loaded successfully!');
            
        } catch (error) {
            console.error('Model loading error:', error);
            this.updateLoadingProgress(0, `Error: ${error.message}`);
            throw new Error(`Failed to load models: ${error.message}`);
        }
    }

    /**
     * Set up camera access
     */
    async setupCamera() {
        try {
            // Get available cameras
            await this.updateCameraList();
            
            // Request camera permission
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                    facingMode: 'user'
                }
            };
            
            if (this.settings.preferredCamera) {
                constraints.video.deviceId = { exact: this.settings.preferredCamera };
            }
            
            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.elements.video.srcObject = this.currentStream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.elements.video.onloadedmetadata = () => {
                    this.elements.video.play();
                    resolve();
                };
            });
            
            this.isCameraActive = true;
            this.updateCameraStatus('active', 'Camera Active');
            this.startDetection();
            
        } catch (error) {
            this.updateCameraStatus('error', 'Camera Error');
            throw new Error(`Camera setup failed: ${error.message}`);
        }
    }

    /**
     * Update camera device list
     */
    async updateCameraList() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            this.elements.cameraSelect.innerHTML = '';
            
            if (videoDevices.length === 0) {
                this.elements.cameraSelect.innerHTML = '<option value="">No cameras found</option>';
                return;
            }
            
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${index + 1}`;
                this.elements.cameraSelect.appendChild(option);
            });
            
        } catch (error) {
            console.error('Failed to enumerate cameras:', error);
        }
    }

    /**
     * Start face detection
     */
    startDetection() {
        if (!this.isModelLoaded || !this.isCameraActive || this.isDetectionRunning) {
            return;
        }
        
        this.isDetectionRunning = true;
        this.detectFaces();
    }

    /**
     * Perform face detection
     */
    async detectFaces() {
        if (!this.isDetectionRunning || this.elements.video.paused || this.elements.video.ended) {
            return;
        }
        
        try {
            // Calculate FPS
            const currentTime = performance.now();
            if (this.lastFrameTime > 0) {
                const deltaTime = currentTime - this.lastFrameTime;
                this.fpsCounter = 1000 / deltaTime;
                this.fpsDisplay = Math.round(this.fpsCounter);
                this.elements.fpsDisplay.textContent = this.fpsDisplay;
            }
            this.lastFrameTime = currentTime;
            
            // Detect faces with expressions
            const detections = await faceapi
                .detectAllFaces(this.elements.video, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: this.settings.detectionSensitivity
                }))
                .withFaceLandmarks()
                .withFaceExpressions();
            
            // Limit number of faces
            const limitedDetections = detections.slice(0, this.settings.maxFaces);
            this.lastDetections = limitedDetections;
            
            // Update UI
            this.updateDetectionUI(limitedDetections);
            this.drawDetections(limitedDetections);
            
            // Continue detection
            requestAnimationFrame(() => this.detectFaces());
            
        } catch (error) {
            console.error('Detection error:', error);
            // Continue despite errors
            setTimeout(() => this.detectFaces(), 100);
        }
    }

    /**
     * Update detection UI elements
     */
    updateDetectionUI(detections) {
        // Update face count
        this.elements.faceCount.textContent = detections.length;
        
        // Update confidence (average of all detections)
        let avgConfidence = 0;
        if (detections.length > 0) {
            const totalConfidence = detections.reduce((sum, det) => sum + det.detection.score, 0);
            avgConfidence = (totalConfidence / detections.length) * 100;
        }
        this.elements.confidence.textContent = `${Math.round(avgConfidence)}%`;
        
        // Show/hide no face message
        if (detections.length === 0) {
            this.elements.videoOverlay.classList.remove('hidden');
        } else {
            this.elements.videoOverlay.classList.add('hidden');
        }
        
        // Update emotion data if enabled
        if (this.settings.emotionDetectionEnabled && detections.length > 0) {
            this.updateEmotionData(detections);
        }
    }

    /**
     * Update emotion detection display
     */
    updateEmotionData(detections) {
        // Reset emotion data
        this.emotionData = {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            neutral: 0
        };
        
        // Aggregate emotions from all faces
        detections.forEach(detection => {
            if (detection.expressions) {
                this.emotionData.happy += detection.expressions.happy || 0;
                this.emotionData.sad += detection.expressions.sad || 0;
                this.emotionData.angry += detection.expressions.angry || 0;
                this.emotionData.fearful += detection.expressions.fearful || 0;
                this.emotionData.disgusted += detection.expressions.disgusted || 0;
                this.emotionData.surprised += detection.expressions.surprised || 0;
                this.emotionData.neutral += detection.expressions.neutral || 0;
            }
        });
        
        // Normalize by number of faces
        if (detections.length > 0) {
            Object.keys(this.emotionData).forEach(emotion => {
                this.emotionData[emotion] /= detections.length;
            });
        }
        
        // Update UI
        this.updateEmotionUI();
    }

    /**
     * Update emotion UI bars
     */
    updateEmotionUI() {
        let dominantEmotion = null;
        let maxValue = 0;
        
        // Emotion emojis mapping
        const emotionEmojis = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fearful: '😨',
            disgusted: '🤢',
            surprised: '😲',
            neutral: '😐'
        };
        
        Object.keys(this.emotionData).forEach(emotion => {
            const emotionItem = this.elements.emotionGrid.querySelector(`[data-emotion="${emotion}"]`);
            if (emotionItem) {
                const fill = emotionItem.querySelector('.emotion-fill');
                const percentage = Math.round(this.emotionData[emotion] * 100);
                const percentageSpan = emotionItem.querySelector('.emotion-percentage');
                
                // Update bar width and percentage text
                fill.style.width = `${percentage}%`;
                percentageSpan.textContent = `${percentage}%`;
                
                // Find dominant emotion
                if (this.emotionData[emotion] > maxValue) {
                    maxValue = this.emotionData[emotion];
                    dominantEmotion = emotion;
                }
                
                // Remove active class
                emotionItem.classList.remove('active');
            }
        });
        
        // Update header emotion status
        if (dominantEmotion && maxValue > 0.2) {
            const emoji = emotionEmojis[dominantEmotion] || '😐';
            this.elements.dominantEmoji.textContent = emoji;
            this.elements.dominantEmotion.textContent = dominantEmotion;
            this.elements.emotionStatus.classList.add('active');
            
            // Highlight dominant emotion in grid if confidence is high enough
            if (maxValue > 0.3) {
                const dominantItem = this.elements.emotionGrid.querySelector(`[data-emotion="${dominantEmotion}"]`);
                if (dominantItem) {
                    dominantItem.classList.add('active');
                }
            }
        } else {
            // Default to neutral when no strong emotion detected
            this.elements.dominantEmoji.textContent = '😐';
            this.elements.dominantEmotion.textContent = 'Neutral';
            this.elements.emotionStatus.classList.remove('active');
        }
    }

    /**
     * Draw detection overlays on canvas
     */
    drawDetections(detections) {
        const canvas = this.elements.canvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match video
        canvas.width = this.elements.video.videoWidth;
        canvas.height = this.elements.video.videoHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw detections
        detections.forEach((detection, index) => {
            const { x, y, width, height } = detection.detection.box;
            const confidence = detection.detection.score;
            
            // Draw bounding box
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
            
            // Draw confidence background
            ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
            ctx.fillRect(x, y - 30, width, 25);
            
            // Draw confidence text
            ctx.fillStyle = 'white';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                `Face ${index + 1} (${Math.round(confidence * 100)}%)`,
                x + width / 2,
                y - 10
            );
            
            // Draw emotion if enabled
            if (this.settings.emotionDetectionEnabled && detection.expressions) {
                const emotions = detection.expressions;
                const topEmotion = Object.keys(emotions).reduce((a, b) => 
                    emotions[a] > emotions[b] ? a : b
                );
                
                if (emotions[topEmotion] > 0.3) {
                    // Get emoji for emotion
                    const emotionEmojis = {
                        happy: '😊',
                        sad: '😢',
                        angry: '😠',
                        fearful: '😨',
                        disgusted: '🤢',
                        surprised: '😲',
                        neutral: '😐'
                    };
                    
                    const emoji = emotionEmojis[topEmotion] || '😐';
                    
                    // Draw emotion background
                    ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
                    ctx.fillRect(x, y + height, width, 35);
                    
                    // Draw emoji
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(emoji, x + 5, y + height + 25);
                    
                    // Draw emotion text
                    ctx.fillStyle = 'white';
                    ctx.font = '14px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(
                        `${topEmotion} (${Math.round(emotions[topEmotion] * 100)}%)`,
                        x + width / 2,
                        y + height + 25
                    );
                }
            }
            
            // Draw landmarks if available
            if (detection.landmarks) {
                ctx.fillStyle = '#ec4899';
                detection.landmarks.positions.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        });
    }

    /**
     * Toggle camera on/off
     */
    async toggleCamera() {
        if (this.isCameraActive) {
            this.stopCamera();
        } else {
            try {
                await this.setupCamera();
            } catch (error) {
                this.showToast('error', 'Camera Error', error.message);
            }
        }
    }

    /**
     * Stop camera
     */
    stopCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        
        this.elements.video.srcObject = null;
        this.isCameraActive = false;
        this.isDetectionRunning = false;
        
        this.updateCameraStatus('inactive', 'Camera Off');
        this.elements.toggleCamera.innerHTML = '<i class="fas fa-video-slash"></i><span>Camera Off</span>';
        
        // Clear canvas
        const ctx = this.elements.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
        
        // Reset UI
        this.elements.faceCount.textContent = '0';
        this.elements.confidence.textContent = '0%';
        this.elements.fpsDisplay.textContent = '0';
        this.elements.videoOverlay.classList.remove('hidden');
    }

    /**
     * Switch to different camera
     */
    async switchCamera(deviceId) {
        if (!deviceId || !this.isCameraActive) return;
        
        try {
            this.stopCamera();
            this.settings.preferredCamera = deviceId;
            await this.setupCamera();
            this.showToast('success', 'Camera Switched', 'Successfully switched camera device');
        } catch (error) {
            this.showToast('error', 'Camera Switch Failed', error.message);
        }
    }

    /**
     * Capture screenshot with detections
     */
    captureScreenshot() {
        if (!this.isCameraActive) {
            this.showToast('warning', 'Camera Not Active', 'Please turn on the camera first');
            return;
        }
        
        try {
            // Create temporary canvas
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Set canvas size
            tempCanvas.width = this.elements.video.videoWidth;
            tempCanvas.height = this.elements.video.videoHeight;
            
            // Draw video frame
            tempCtx.drawImage(this.elements.video, 0, 0);
            
            // Draw detections overlay
            if (this.lastDetections.length > 0) {
                tempCtx.drawImage(this.elements.canvas, 0, 0);
            }
            
            // Create download link
            tempCanvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `facemoji-capture-${Date.now()}.png`;
                link.click();
                URL.revokeObjectURL(url);
                
                this.showToast('success', 'Screenshot Saved', 'Image captured successfully');
            }, 'image/png');
            
        } catch (error) {
            this.showToast('error', 'Capture Failed', error.message);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.elements.appContainer.requestFullscreen().catch(err => {
                this.showToast('error', 'Fullscreen Failed', 'Could not enter fullscreen mode');
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Show settings modal
     */
    showSettings() {
        this.elements.settingsModal.classList.remove('hidden');
        
        // Update settings values
        this.elements.sensitivityRange.value = this.settings.detectionSensitivity;
        this.elements.sensitivityValue.textContent = this.settings.detectionSensitivity;
        this.elements.maxFacesRange.value = this.settings.maxFaces;
        this.elements.maxFacesValue.textContent = this.settings.maxFaces;
        this.elements.emotionDetection.checked = this.settings.emotionDetectionEnabled;
        
        if (this.settings.preferredCamera) {
            this.elements.cameraSelect.value = this.settings.preferredCamera;
        }
    }

    /**
     * Hide settings modal
     */
    hideSettings() {
        this.elements.settingsModal.classList.add('hidden');
    }

    /**
     * Pause detection (for performance)
     */
    pauseDetection() {
        this.isDetectionRunning = false;
    }

    /**
     * Resume detection
     */
    resumeDetection() {
        if (this.isCameraActive && !this.isDetectionRunning) {
            this.startDetection();
        }
    }

    /**
     * Update camera status indicator
     */
    updateCameraStatus(status, text) {
        this.elements.cameraStatus.className = `status-indicator ${status}`;
        this.elements.statusText.textContent = text;
        
        if (status === 'active') {
            this.elements.toggleCamera.innerHTML = '<i class="fas fa-video"></i><span>Camera On</span>';
        }
    }

    /**
     * Update loading progress
     */
    updateLoadingProgress(percentage, text) {
        this.elements.loadingProgress.style.width = `${percentage}%`;
        this.elements.loadingText.textContent = text;
    }

    /**
     * Show main app and hide loading screen
     */
    showApp() {
        setTimeout(() => {
            this.elements.loadingScreen.style.opacity = '0';
            this.elements.loadingScreen.style.visibility = 'hidden';
            this.elements.appContainer.classList.remove('hidden');
        }, 500);
    }

    /**
     * Show toast notification
     */
    showToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

/**
 * Check browser compatibility
 */
function checkBrowserCompatibility() {
    const issues = [];
    
    // Check for required APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        issues.push('Camera access not supported');
    }
    
    if (!window.requestAnimationFrame) {
        issues.push('Animation API not supported');
    }
    
    if (!document.createElement('canvas').getContext('2d')) {
        issues.push('Canvas 2D not supported');
    }
    
    // Check for HTTPS (required for camera access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        issues.push('HTTPS required for camera access');
    }
    
    return issues;
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting FaceMoji initialization...');
    
    // Check browser compatibility
    const compatibilityIssues = checkBrowserCompatibility();
    
    if (compatibilityIssues.length > 0) {
        console.error('Compatibility issues:', compatibilityIssues);
        document.getElementById('loadingText').innerHTML = `
            <div style="color: #ef4444;">❌ Browser compatibility issues:</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                ${compatibilityIssues.join('<br>')}
            </div>
        `;
        return;
    }
    
    // Check if face-api.js is loaded
    let faceApiCheckAttempts = 0;
    const maxAttempts = 10;
    
    const checkFaceApi = () => {
        return new Promise((resolve) => {
            const check = () => {
                faceApiCheckAttempts++;
                console.log(`Checking face-api.js availability (attempt ${faceApiCheckAttempts}/${maxAttempts})...`);
                
                if (typeof faceapi !== 'undefined') {
                    console.log('face-api.js loaded successfully!');
                    resolve(true);
                } else if (faceApiCheckAttempts >= maxAttempts) {
                    console.error('face-api.js failed to load after maximum attempts');
                    resolve(false);
                } else {
                    document.getElementById('loadingText').textContent = 
                        `Loading face-api.js library... (${faceApiCheckAttempts}/${maxAttempts})`;
                    setTimeout(check, 1000);
                }
            };
            check();
        });
    };
    
    const faceApiLoaded = await checkFaceApi();
    
    if (!faceApiLoaded) {
        document.getElementById('loadingText').innerHTML = `
            <div style="color: #ef4444;">❌ Failed to load face-api.js library</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                Please check your internet connection and ensure CDNs are accessible.
            </div>
            <button onclick="location.reload()" style="
                margin-top: 15px; 
                padding: 8px 16px; 
                background: #6366f1; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-size: 14px;
            ">Retry</button>
        `;
        return;
    }
    
    // Initialize the app
    try {
        console.log('Starting FaceMoji app initialization...');
        window.faceMojiApp = new FaceMojiApp();
    } catch (error) {
        console.error('App initialization failed:', error);
        document.getElementById('loadingText').innerHTML = `
            <div style="color: #ef4444;">❌ Failed to initialize application</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                ${error.message}
            </div>
            <button onclick="location.reload()" style="
                margin-top: 15px; 
                padding: 8px 16px; 
                background: #6366f1; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-size: 14px;
            ">Try Again</button>
        `;
    }
});

/**
 * Handle unload events to clean up camera
 */
window.addEventListener('beforeunload', () => {
    if (window.faceMojiApp && window.faceMojiApp.currentStream) {
        window.faceMojiApp.currentStream.getTracks().forEach(track => track.stop());
    }
});
