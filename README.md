# FaceMoji - Real-time Face Detection Web App

A modern, responsive web application that performs real-time face detection with emotion recognition using your camera. Built with vanilla JavaScript and face-api.js for maximum performance and privacy.

## 🌟 Features

### Core Functionality
- **Real-time Face Detection**: Detects multiple faces simultaneously with high accuracy
- **Emotion Recognition**: Identifies basic emotions (happy, neutral, surprised, sad)
- **Live Camera Feed**: Automatic camera access with real-time video processing
- **Face Tracking**: Individual face tracking with confidence scores
- **Performance Monitoring**: Real-time FPS display and optimization

### User Interface
- **Modern Glassmorphism Design**: Beautiful, translucent interface with blur effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark interface with colorful accents
- **Smooth Animations**: Subtle animations and transitions throughout
- **Toast Notifications**: User-friendly feedback for all actions

### Privacy & Security
- **Client-side Processing**: All face detection happens locally on your device
- **No Data Transmission**: Your camera feed never leaves your browser
- **HTTPS Support**: Secure camera access with proper encryption
- **Permission Management**: Clear camera permission requests and status

### Advanced Features
- **Multiple Camera Support**: Switch between different camera devices
- **Screenshot Capture**: Save images with face detection overlays
- **Fullscreen Mode**: Immersive face detection experience
- **Customizable Settings**: Adjust detection sensitivity and parameters
- **Keyboard Shortcuts**: Quick access to common functions

## 🚀 Quick Start

### Option 1: Direct File Access
1. Download all files to a folder
2. Serve the files using a local web server (required for camera access)
3. Open `index.html` in a modern browser

### Option 2: Using WAMP/XAMPP (Windows)
1. Copy the `facemoji` folder to your `www` directory (e.g., `C:\wamp64\www\facemoji`)
2. Start your WAMP/XAMPP server
3. Navigate to `http://localhost/facemoji` in your browser

### Option 3: Using Python HTTP Server
```bash
# Navigate to the project folder
cd facemoji

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then open http://localhost:8000 in your browser
```

### Option 4: Using Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project folder and start server
cd facemoji
http-server -p 8000

# Open http://localhost:8000 in your browser
```

## 📋 System Requirements

### Browser Compatibility
- **Chrome 61+** (Recommended)
- **Firefox 55+**
- **Safari 11+**
- **Edge 79+**

### Hardware Requirements
- **Camera**: Built-in or external webcam
- **RAM**: Minimum 4GB (8GB recommended for multiple faces)
- **CPU**: Modern processor with good single-core performance
- **Internet**: Required for initial model download (CDN)

### Network Requirements
- **HTTPS**: Required for camera access (localhost is exempt)
- **CDN Access**: Internet connection needed to load face-api.js models
- **Bandwidth**: ~10MB for initial model download

## 🎮 How to Use

### First Launch
1. **Grant Camera Permission**: Allow access when prompted by your browser
2. **Wait for Model Loading**: The app will download and initialize AI models
3. **Position Yourself**: Face the camera for optimal detection
4. **Enjoy Real-time Detection**: Watch as faces are detected and emotions analyzed

### Controls
- **Space Bar**: Capture screenshot
- **F Key**: Toggle fullscreen mode
- **Escape**: Close modals/settings
- **Camera Button**: Toggle camera on/off
- **Settings Button**: Access configuration options

### Settings Panel
- **Camera Selection**: Choose between available camera devices
- **Detection Sensitivity**: Adjust how sensitive face detection is (0.1-0.9)
- **Max Faces**: Set maximum number of faces to detect (1-10)
- **Emotion Detection**: Enable/disable emotion recognition

## 🔧 Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI Library**: face-api.js v0.22.2
- **Models Used**: 
  - TinyFaceDetector (face detection)
  - FaceLandmark68Net (facial landmarks)
  - FaceRecognitionNet (face recognition)
  - FaceExpressionNet (emotion detection)

### File Structure
```
facemoji/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and animations
├── script.js           # Main JavaScript application
├── README.md           # This documentation
└── SETUP.md           # Detailed setup instructions
```

### Performance Optimizations
- **Efficient Model Loading**: Progressive loading with visual feedback
- **Canvas Optimization**: Hardware-accelerated drawing operations
- **Memory Management**: Proper cleanup of video streams and contexts
- **FPS Throttling**: Adaptive frame rate for optimal performance
- **Lazy Loading**: Models loaded only when needed

### Browser APIs Used
- **MediaDevices API**: Camera access and device enumeration
- **Canvas API**: Drawing detection overlays and landmarks
- **Fullscreen API**: Immersive fullscreen experience
- **Web Audio API**: Future audio processing capabilities
- **File API**: Screenshot download functionality

## 🎨 Customization

### Styling
The app uses CSS custom properties (variables) for easy theming:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #ec4899;  /* Accent color */
    --success-color: #10b981;    /* Success indicators */
    --glass-bg: rgba(255, 255, 255, 0.25); /* Glass effect */
}
```

### Detection Parameters
Modify these settings in the JavaScript:

```javascript
// Default settings
this.settings = {
    detectionSensitivity: 0.5,    // 0.1 (sensitive) to 0.9 (strict)
    maxFaces: 5,                  // Maximum faces to detect
    emotionDetectionEnabled: true, // Enable emotion recognition
    preferredCamera: null         // Auto-select camera
};
```

### Adding New Features
The modular architecture makes it easy to extend:

1. **New Emotions**: Add emotion types to the `emotionData` object
2. **Custom Overlays**: Modify the `drawDetections()` method
3. **Additional Models**: Load more face-api.js models in `loadModels()`
4. **UI Enhancements**: Add new components to the settings panel

## 🔒 Privacy & Security

### Data Handling
- **No Server Communication**: All processing happens in your browser
- **No Data Storage**: No personal data is saved or transmitted
- **Local Processing**: Face detection models run entirely on your device
- **Secure Connections**: HTTPS required for camera access

### Permissions
- **Camera Access**: Required for face detection functionality
- **Local Storage**: Used only for saving user preferences
- **No Location**: No geolocation data is accessed or used
- **No Audio**: Only video stream is processed

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
1. **Check Permissions**: Ensure camera access is granted in browser settings
2. **HTTPS Required**: Use `https://` or `localhost` for camera access
3. **Device Conflicts**: Close other apps using the camera
4. **Browser Compatibility**: Try a different browser if issues persist

#### Poor Performance
1. **Reduce Max Faces**: Lower the maximum number of faces to detect
2. **Increase Sensitivity**: Higher threshold values reduce processing load
3. **Close Other Tabs**: Free up system resources
4. **Update Browser**: Ensure you're using the latest browser version

#### Models Not Loading
1. **Internet Connection**: Ensure stable internet for initial download
2. **CDN Access**: Check if content delivery networks are accessible
3. **Firewall/Proxy**: Verify that external resources can be loaded
4. **Clear Cache**: Try refreshing the page and clearing browser cache

### Error Messages
- **"Camera access denied"**: Grant permission in browser settings
- **"HTTPS required"**: Access the app via HTTPS or localhost
- **"No cameras found"**: Check if camera is connected and functioning
- **"Models failed to load"**: Check internet connection and retry

## 🔄 Updates & Maintenance

### Version History
- **v1.0.0**: Initial release with core face detection
- **Current**: Real-time emotion recognition and modern UI

### Future Enhancements
- **Age Detection**: Estimate age ranges from facial features
- **Gender Recognition**: Identify gender characteristics
- **Multiple Model Support**: Additional AI models for enhanced accuracy
- **Video Recording**: Save videos with detection overlays
- **API Integration**: Optional cloud-based advanced features

## 📞 Support

### Getting Help
1. **Check Documentation**: Review this README and SETUP.md
2. **Browser Console**: Check for error messages in developer tools
3. **GitHub Issues**: Report bugs or request features
4. **Community Forums**: Ask questions in web development communities

### Contributing
Contributions are welcome! Please feel free to submit pull requests or report issues.

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for more details.

## 🙏 Acknowledgments

- **face-api.js**: For the excellent face detection library
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the Inter typography
- **MDN Web Docs**: For comprehensive web API documentation

---

**Built with ❤️ for privacy-conscious face detection**

*Your data stays on your device, always.*
