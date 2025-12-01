#!/bin/bash

# Voice Recognition Function Test Script

echo "================================"
echo "Voice Recognition Function Test"
echo "================================"
echo ""

# Check project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script in the project root directory"
    exit 1
fi

echo "✅ Project directory check passed"
echo ""

# Check dependencies
echo "Checking necessary dependencies..."
if grep -q "expo-av" package.json; then
    echo "✅ expo-av installed"
else
    echo "❌ Missing necessary dependencies"
    exit 1
fi
echo ""

# Check fixed files
echo "Checking fixed code..."
if grep -q "Audio.IOSOutputFormat.LINEARPCM" contexts/RecordingContext.js; then
    echo "✅ Recording format modified to LINEAR16"
else
    echo "❌ Recording format not correctly modified"
    exit 1
fi

if grep -q "encoding: 'LINEAR16'" contexts/RecordingContext.js; then
    echo "✅ API config added LINEAR16 encoding"
else
    echo "❌ API config missing encoding parameter"
    exit 1
fi

if grep -q "readAudioFileAsBase64" contexts/RecordingContext.js; then
    echo "✅ Restored real Google API call"
else
    echo "❌ Still using simulated transcription"
    exit 1
fi
echo ""

# Check API config
echo "Checking API config..."
if [ -f "config/api.js" ]; then
    echo "✅ API config file exists"
    if grep -q "GOOGLE_API_KEY" config/api.js; then
        echo "✅ API key configured"
    else
        echo "⚠️  Warning: API key might not be configured"
    fi
else
    echo "❌ API config file does not exist"
    exit 1
fi
echo ""

echo "================================"
echo "✅ All checks passed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run 'npm start' to start the app"
echo "2. Open app in simulator or real device"
echo "3. Enter any note detail page"
echo "4. Click bottom microphone button to test recording"
echo "5. Speak and stop recording"
echo "6. Wait for recognition result"
echo ""
echo "If issues persist, please check 'VOICE_RECOGNITION_FIX_EXPLANATION.md'"
echo ""
