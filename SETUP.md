# FaceMoji Setup Instructions

Complete setup guide for the FaceMoji Real-time Face Detection Web Application.

## 📋 Prerequisites

Before setting up FaceMoji, ensure you have the following:

### Hardware Requirements
- **Camera**: Webcam or built-in camera
- **RAM**: Minimum 4GB (8GB recommended)
- **CPU**: Modern processor (Intel i5/AMD Ryzen 5 or better)
- **Storage**: 50MB free space for models and cache

### Software Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Web Browser**: Chrome 61+, Firefox 55+, Safari 11+, or Edge 79+
- **Web Server**: Any local server (WAMP, XAMPP, Node.js, Python, etc.)

## 🚀 Installation Methods

### Method 1: WAMP Server (Windows - Recommended)

Since you're using WAMP, this is the easiest method:

1. **Start WAMP Server**
   ```
   - Click the WAMP icon in system tray
   - Ensure all services are green (running)
   - If orange/red, restart services
   ```

2. **Copy Files**
   ```
   - Copy the entire 'facemoji' folder to: C:\wamp64\www\
   - Final path should be: C:\wamp64\www\facemoji\
   ```

3. **Access Application**
   ```
   - Open browser and navigate to: http://localhost/facemoji
   - Or: http://127.0.0.1/facemoji
   ```

4. **Grant Permissions**
   ```
   - Allow camera access when prompted
   - Wait for models to load (first time only)
   ```

### Method 2: XAMPP Server (Cross-platform)

1. **Install XAMPP**
   - Download from: https://www.apachefriends.org/
   - Install with default settings

2. **Start Services**
   ```
   - Open XAMPP Control Panel
   - Start Apache service
   - MySQL not required for this app
   ```

3. **Deploy Files**
   ```
   - Copy 'facemoji' folder to: C:\xampp\htdocs\
   - Final path: C:\xampp\htdocs\facemoji\
   ```

4. **Access**
   ```
   URL: http://localhost/facemoji
   ```

### Method 3: Node.js HTTP Server

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Install HTTP Server**
   ```bash
   npm install -g http-server
   ```

3. **Start Server**
   ```bash
   cd path/to/facemoji
   http-server -p 8000 -c-1
   ```

4. **Access**
   ```
   URL: http://localhost:8000
   ```

### Method 4: Python HTTP Server

#### Python 3.x
```bash
cd path/to/facemoji
python -m http.server 8000
```

#### Python 2.x
```bash
cd path/to/facemoji
python -m SimpleHTTPServer 8000
```

**Access**: http://localhost:8000

### Method 5: Live Server (VS Code)

1. **Install VS Code Extension**
   - Search for "Live Server" by Ritwick Dey
   - Install the extension

2. **Open Project**
   ```
   - Open facemoji folder in VS Code
   - Right-click on index.html
   - Select "Open with Live Server"
   ```

3. **Access**
   ```
   Automatically opens in browser
   URL: http://127.0.0.1:5500
   ```

## 🔧 Configuration

### Browser Settings

#### Chrome
1. **Camera Permissions**
   ```
   - Go to Settings → Privacy and Security → Site Settings
   - Click Camera → Allow sites to ask to use your camera
   - Add localhost to allowed sites if needed
   ```

2. **HTTPS/Localhost Exception**
   ```
   Chrome automatically allows camera on localhost
   For other domains, HTTPS is required
   ```

#### Firefox
1. **Camera Permissions**
   ```
   - Go to Preferences → Privacy & Security
   - Scroll to Permissions → Camera
   - Ensure "Block new requests" is unchecked
   ```

2. **Enable Camera**
   ```
   - Visit the app URL
   - Click the camera icon in address bar
   - Select "Always Allow" for localhost
   ```

#### Safari
1. **Camera Access**
   ```
   - Safari → Preferences → Websites → Camera
   - Set localhost to "Allow"
   ```

2. **Security Settings**
   ```
   - Ensure "Prevent cross-site tracking" allows localhost
   - May need to disable some privacy features for development
   ```

### Server Configuration

#### Apache (WAMP/XAMPP)
For optimal performance, add these to `.htaccess`:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set caching headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 🌐 Network Configuration

### Firewall Settings
Ensure these ports are open:
- **Port 80**: HTTP traffic
- **Port 443**: HTTPS traffic (if using SSL)
- **Custom ports**: If using non-standard ports (8000, 3000, etc.)

### Router Configuration
For network access beyond localhost:
1. **Port Forwarding**: Forward web server port
2. **Local Network Access**: Use machine's IP address
3. **Dynamic DNS**: For remote access (advanced)

## 🔒 Security Considerations

### HTTPS Setup (Production)

#### Self-signed Certificate (Development)
```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Use with Node.js HTTPS server
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

#### Let's Encrypt (Production)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure web server to use certificates
```

### Privacy Settings
1. **Disable Analytics**: No tracking in this app
2. **Local Processing**: All data stays on device
3. **Camera Permissions**: Grant only to trusted domains
4. **Clear Storage**: Regularly clear browser data if needed

## 📱 Mobile Setup

### iOS Safari
1. **Camera Permission**
   ```
   - Settings → Safari → Camera
   - Set to "Ask" or "Allow"
   ```

2. **Access App**
   ```
   - Open Safari
   - Navigate to server URL
   - Grant camera permission when prompted
   ```

### Android Chrome
1. **Camera Permission**
   ```
   - Chrome → Settings → Site Settings → Camera
   - Ensure enabled for localhost
   ```

2. **Performance**
   ```
   - Close other apps for better performance
   - Use in landscape mode for larger view
   ```

## 🔧 Troubleshooting Setup

### Common Setup Issues

#### "This site can't be reached"
**Solutions:**
1. Verify web server is running
2. Check URL spelling (localhost vs 127.0.0.1)
3. Ensure correct port number
4. Check firewall settings

#### "Camera access denied"
**Solutions:**
1. Refresh page and grant permission
2. Check browser camera settings
3. Ensure no other apps using camera
4. Try different browser

#### "Failed to load models"
**Solutions:**
1. Check internet connection
2. Verify CDN access (face-api.js)
3. Disable ad blockers temporarily
4. Clear browser cache

#### Poor Performance
**Solutions:**
1. Close unnecessary browser tabs
2. Reduce detection sensitivity
3. Lower max faces setting
4. Use Chrome for better performance

### Advanced Troubleshooting

#### Enable Debug Mode
Add to browser console:
```javascript
// Enable verbose logging
localStorage.setItem('facemoji-debug', 'true');

// Check loaded models
console.log(faceapi.nets);

// Monitor performance
console.log('FPS:', window.faceMojiApp.fpsDisplay);
```

#### Network Diagnostics
```bash
# Test server connectivity
curl -I http://localhost/facemoji

# Check port status
netstat -an | grep :80

# Ping localhost
ping localhost
```

#### Camera Diagnostics
```javascript
// List available cameras
navigator.mediaDevices.enumerateDevices()
  .then(devices => console.log(devices));

// Test camera access
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => console.log('Camera works!'))
  .catch(err => console.error('Camera error:', err));
```

## 📊 Performance Optimization

### System Optimization
1. **Close Background Apps**: Free up system resources
2. **Update Drivers**: Ensure latest camera and graphics drivers
3. **Browser Updates**: Use latest browser version
4. **Memory Management**: Restart browser periodically

### Application Settings
1. **Detection Sensitivity**: Start with 0.5, adjust as needed
2. **Max Faces**: Reduce if performance is poor
3. **Emotion Detection**: Disable if not needed
4. **Canvas Size**: Automatically optimized

### Network Optimization
1. **Local Hosting**: Always use local server
2. **CDN Caching**: Models cached after first load
3. **Compression**: Enable gzip compression
4. **Minification**: Files already optimized

## 🚀 Production Deployment

### Web Hosting
1. **Upload Files**: All files to web root
2. **HTTPS Required**: For camera access
3. **CDN Configuration**: Ensure external resources load
4. **Analytics**: Add Google Analytics if desired

### Domain Setup
1. **DNS Configuration**: Point domain to server
2. **SSL Certificate**: Install valid SSL certificate
3. **Server Configuration**: Optimize for production
4. **Monitoring**: Set up uptime monitoring

## 📞 Support Resources

### Documentation
- **README.md**: Main project documentation
- **Inline Comments**: Detailed code documentation
- **face-api.js Docs**: https://github.com/justadudewhohacks/face-api.js

### Community
- **Stack Overflow**: Tag questions with 'face-api.js'
- **GitHub Issues**: Report bugs and feature requests
- **MDN Web Docs**: Web API references

### Professional Support
For commercial deployments or custom modifications, consider:
- **Code Review**: Professional code audit
- **Performance Optimization**: Custom optimizations
- **Feature Development**: Additional capabilities
- **Integration Support**: Embed in existing systems

---

**Setup Complete! 🎉**

Your FaceMoji application should now be running successfully. Enjoy real-time face detection with privacy-first design!
