Write-Host "🐘 Starting MongoDB for LearnKins..." -ForegroundColor Green

# Method 1: Try to start MongoDB service
Write-Host "Method 1: Starting MongoDB service..." -ForegroundColor Yellow
try {
    Start-Service MongoDB -ErrorAction Stop
    Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "❌ Could not start MongoDB service: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 2: Try to start MongoDB manually
Write-Host "Method 2: Starting MongoDB manually..." -ForegroundColor Yellow
try {
    $mongodPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
    if (Test-Path $mongodPath) {
        Start-Process -FilePath $mongodPath -ArgumentList "--dbpath", "C:\data\db" -WindowStyle Hidden
        Write-Host "✅ MongoDB started manually!" -ForegroundColor Green
        Write-Host "💡 MongoDB is running on mongodb://localhost:27017" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "❌ MongoDB executable not found at: $mongodPath" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not start MongoDB manually: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 3: Check if MongoDB is already running
Write-Host "Method 3: Checking if MongoDB is already running..." -ForegroundColor Yellow
try {
    $connection = New-Object System.Net.Sockets.TcpClient("localhost", 27017)
    $connection.Close()
    Write-Host "✅ MongoDB is already running on port 27017!" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "❌ MongoDB is not running on port 27017" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Alternative Solutions:" -ForegroundColor Cyan
Write-Host "1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community" -ForegroundColor White
Write-Host "2. Use MongoDB Atlas (Cloud): https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo" -ForegroundColor White
Write-Host "4. Run as Administrator and try: net start MongoDB" -ForegroundColor White

Write-Host ""
Write-Host "💡 For now, you can use MongoDB Atlas (free cloud database):" -ForegroundColor Yellow
Write-Host "1. Go to https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "2. Create free account" -ForegroundColor White
Write-Host "3. Create cluster and get connection string" -ForegroundColor White
Write-Host "4. Update MONGODB_URI in server/.env" -ForegroundColor White 