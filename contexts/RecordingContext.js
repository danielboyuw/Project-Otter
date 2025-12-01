import React, { createContext, useState, useContext, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';
import { GOOGLE_API_KEY, GOOGLE_SPEECH_API_URL } from '../config/api';

const RecordingContext = createContext();

export const useRecording = () => useContext(RecordingContext);

// Helper function: read audio file and convert to base64
async function readAudioFileAsBase64(uri) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                // Remove data URL prefix, keep only base64 data
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

export const RecordingProvider = ({ children }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [transcriptionHandler, setTranscriptionHandler] = useState(null);

    // Register a handler to receive the transcribed text
    const registerHandler = useCallback((handler) => {
        console.log('Context: Registering handler');
        setTranscriptionHandler(() => handler);
    }, []);

    const unregisterHandler = useCallback(() => {
        console.log('Context: Unregistering handler');
        setTranscriptionHandler(null);
    }, []);

    async function startRecording() {
        try {
            console.log('Context: Requesting permissions..');
            if (!permissionResponse || permissionResponse.status !== 'granted') {
                const perm = await requestPermission();
                if (perm.status !== 'granted') {
                    Alert.alert('Permission needed', 'Please grant microphone permission to record audio.');
                    return;
                }
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Context: Starting recording..');
            // Use LINEAR16 (PCM) format, supported by Google Speech API
            const recordingOptions = {
                android: {
                    extension: '.wav',
                    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
                    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.wav',
                    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            };

            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
            setIsRecording(true);
            console.log('Context: Recording started with LINEAR16 format');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording: ' + err.message);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        console.log('Context: Stopping recording..');
        setIsRecording(false);

        try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            console.log('Context: Recording stopped and stored at', uri);
            setRecording(undefined);

            // Use Google Speech-to-Text API for real voice recognition
            setIsProcessing(true);
            if (transcriptionHandler) {
                console.log('Context: Calling Google Speech-to-Text API');
                try {
                    // Read audio file and convert to base64
                    const base64Audio = await readAudioFileAsBase64(uri);
                    console.log('Context: Base64 audio length:', base64Audio.length);

                    // Call Google Speech-to-Text API
                    const response = await fetch(`${GOOGLE_SPEECH_API_URL}?key=${GOOGLE_API_KEY}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            config: {
                                encoding: 'LINEAR16',  // Explicitly specify LINEAR16 encoding
                                sampleRateHertz: 16000,
                                languageCode: 'zh-CN',
                                alternativeLanguageCodes: ['en-US', 'zh-TW'],
                                enableAutomaticPunctuation: true,
                            },
                            audio: {
                                content: base64Audio,
                            },
                        }),
                    });

                    const result = await response.json();
                    console.log('Context: API response:', JSON.stringify(result, null, 2));

                    // Check API error
                    if (result.error) {
                        console.error('Context: API error:', result.error);
                        Alert.alert(
                            'API Error',
                            `Error Code: ${result.error.code || 'N/A'}\n\n` +
                            `Error Message: ${result.error.message || 'Unknown Error'}\n\n` +
                            `Status: ${result.error.status || 'N/A'}`
                        );
                        setIsProcessing(false);
                        return;
                    }

                    // Handle recognition results
                    if (result.results && result.results.length > 0) {
                        const transcript = result.results[0].alternatives[0].transcript;
                        console.log('Context: Recognized text:', transcript);

                        // Create multi-language text object (can call translation API in real application)
                        // Note: Must include transcription property as NoteDetailScreen expects this field
                        const recognizedText = {
                            transcription: transcript,  // NoteDetailScreen uses this field to save text
                            english: transcript,
                            simplifiedChinese: transcript,
                            traditionalChinese: transcript,
                            italian: transcript,
                            spanish: transcript,
                            japanese: transcript,
                            korean: transcript
                        };

                        transcriptionHandler(recognizedText);
                    } else {
                        console.log('Context: No transcription results');
                        Alert.alert(
                            'Tip',
                            'Unable to recognize voice content, please try again\n\n' +
                            'Possible reasons:\n' +
                            '- Recording time too short\n' +
                            '- Environment too noisy\n' +
                            '- Speech not clear enough'
                        );
                    }
                    setIsProcessing(false);
                } catch (error) {
                    console.error('Context: API error:', error);
                    Alert.alert('Error', 'Voice recognition failed: ' + error.message);
                    setIsProcessing(false);
                }
            } else {
                console.log('Context: No handler registered');
                Alert.alert('Tip', 'Recording saved, but no active note page to receive text');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
            setIsProcessing(false);
        }
    }

    const toggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    return (
        <RecordingContext.Provider value={{
            isRecording,
            isProcessing,
            toggleRecording,
            registerHandler,
            unregisterHandler
        }}>
            {children}
        </RecordingContext.Provider>
    );
};
