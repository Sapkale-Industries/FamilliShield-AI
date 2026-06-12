// src/screens/AssistantScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// Quick replies
const QUICK_REPLIES = [
  { id: '1', text: 'Check this SMS', icon: 'chatbubble-outline' },
  { id: '2', text: 'UPI Scam?', icon: 'card-outline' },
  { id: '3', text: 'Call 1930', icon: 'call-outline' },
];

const COLORS = {
  bg: '#F0F4FF',
  white: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#5B9EFF',
  success: '#34C97B',
  danger: '#FF5C7A',
  warning: '#FFAA33',
  textPrimary: '#0D1B3E',
  textSecondary: '#7A8BAE',
  textFaint: '#B0BCDA',
  cardBg: '#FFFFFF',
  border: 'rgba(255,255,255,0.7)',
};

const clayCardShadow = Platform.select({
  ios: { shadowColor: '#8AABF7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  android: { elevation: 4 },
});

const AssistantScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI safety assistant. Ask me about suspicious messages, UPI scams, QR code safety, or how to protect your family.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Character floating animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const characterScale = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });

  // Pulse animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------- AI Response (text) ----------
  const sendMessageToAI = async (userMessage, fromVoice = false) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

    let reply = '';
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('sbi') || lowerMsg.includes('reward')) {
      reply = 'This appears to be a classic phishing scam. Banks never ask for OTP or personal details via SMS. Please forward the message to 1930 and delete it.';
    } else if (lowerMsg.includes('upi') || lowerMsg.includes('request')) {
      reply = 'Never approve UPI requests from unknown numbers. Always verify the payee name. If unsure, reject and report.';
    } else if (lowerMsg.includes('call') || lowerMsg.includes('trai')) {
      reply = 'Scammers impersonate TRAI to threaten disconnection. Government agencies never ask for money or personal info over phone. Hang up and call 1930.';
    } else {
      reply = 'I understand your concern. Could you share more details? For immediate help, you can call 1930 (National Cyber Helpline) or save evidence and share with family.';
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: reply,
      isUser: false,
      timestamp: new Date(),
    }]);
    setIsTyping(false);
    scrollToBottom();

    // If this came from voice, speak the reply
    if (fromVoice) {
      await Speech.speak(reply, { language: 'en', pitch: 1.0, rate: 0.9 });
    }
  };

  // ---------- Voice Recording (long press) ----------
  const requestMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow microphone access to use voice chat.');
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stopRecordingAndProcess = async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // ----- Mock: Simulate speech-to-text (replace with real API like Whisper) -----
      // In production, upload the audio file to your backend for STT.
      const mockTranscribedText = "Help me check an SMS I just received";

      // Add user message from voice to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: mockTranscribedText,
        isUser: true,
        timestamp: new Date(),
      }]);
      scrollToBottom();

      // Get AI response and speak it
      await sendMessageToAI(mockTranscribedText, true);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to process voice input');
    }
  };

  // Long press handlers
  const handleLongPress = () => {
    startRecording();
  };

  const handlePressOut = () => {
    if (isRecording) {
      stopRecordingAndProcess();
    }
  };

  // Normal send (tap)
  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    const userMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const textToSend = inputText.trim();
    setInputText('');
    sendMessageToAI(textToSend, false);
    inputRef.current?.blur();
  };

  const handleQuickReply = (text) => {
    setInputText(text);
    setTimeout(() => handleSend(), 100);
  };

  // ---------- File Upload ----------
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        const fileName = result.name;
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: `[Uploaded file: ${fileName}] Please analyze this for scams.`,
          isUser: true,
          timestamp: new Date(),
        }]);
        scrollToBottom();
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const analysis = "I've analyzed the file. No obvious scam indicators found, but always verify the source. For images, avoid scanning unknown QR codes.";
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: analysis,
          isUser: false,
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        scrollToBottom();
      }
    } catch (err) {
      Alert.alert('Error', 'Could not select file');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.assistantRow]}>
      {!item.isUser && (
        <View style={styles.avatar}>
          <LinearGradient colors={['#6AAEFF', '#2563EB']} style={styles.avatarGrad}>
            <Ionicons name="shield-checkmark" size={16} color="#FFF" />
          </LinearGradient>
        </View>
      )}
      <View style={[styles.bubble, item.isUser ? styles.userBubble : styles.assistantBubble, clayCardShadow]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.assistantText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {item.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person-circle" size={32} color={COLORS.primary} />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* 3D Character Background */}
      <Animated.View style={[styles.characterContainer, { transform: [{ translateY }, { scale: characterScale }] }]}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png' }}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Header with back button - navigates to Home */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.appName}>FamiliShield AI</Text>
          <Text style={styles.subtitle}>AI Safety Assistant</Text>
          <Text style={styles.tagline}>I'm watching for threats in real-time.</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        style={styles.chatList}
      />

      {/* Typing indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={[styles.typingBubble, clayCardShadow]}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        </View>
      )}

      {/* Quick replies */}
      <View style={styles.quickRepliesContainer}>
        <FlatList
          horizontal
          data={QUICK_REPLIES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.quickReplyChip} onPress={() => handleQuickReply(item.text)}>
              <Ionicons name={item.icon} size={16} color={COLORS.primary} />
              <Text style={styles.quickReplyText}>{item.text}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesList}
        />
      </View>

      {/* Input area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
            <Ionicons name="attach-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Type your security question..."
            placeholderTextColor={COLORS.textFaint}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() && !isRecording) && styles.sendButtonDisabled]}
            onPress={handleSend}
            onLongPress={handleLongPress}
            onPressOut={handlePressOut}
            delayLongPress={500}
          >
            <Animated.View style={{ transform: [{ scale: isRecording ? pulseAnim : 1 }] }}>
              <Ionicons
                name={isRecording ? 'mic' : 'send'}
                size={20}
                color={(inputText.trim() || isRecording) ? COLORS.white : COLORS.textFaint}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {isRecording && <Text style={styles.voiceHint}>🎙️ Recording... Release to send</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  characterContainer: {
    position: 'absolute',
    top: height * 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    opacity: 0.15,
  },
  characterImage: { width: width * 0.8, height: width * 0.8 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    ...clayCardShadow,
  },
  headerText: { flex: 1, alignItems: 'center' },
  appName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginTop: 2 },
  tagline: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  chatList: { flex: 1, zIndex: 1 },
  messagesList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  avatar: { marginRight: 6 },
  avatarGrad: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  userAvatar: { marginLeft: 6 },
  bubble: { maxWidth: '75%', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  assistantBubble: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 18 },
  userText: { color: COLORS.white },
  assistantText: { color: COLORS.textPrimary },
  timestamp: { fontSize: 9, color: COLORS.textFaint, marginTop: 4, alignSelf: 'flex-end' },
  typingContainer: { paddingHorizontal: 16, marginBottom: 8, zIndex: 2 },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingText: { fontSize: 12, color: COLORS.textSecondary },
  quickRepliesContainer: { marginBottom: 12, zIndex: 2 },
  quickRepliesList: { paddingHorizontal: 16, gap: 10 },
  quickReplyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...clayCardShadow,
  },
  quickReplyText: { fontSize: 13, fontWeight: '500', color: COLORS.textPrimary },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
    zIndex: 2,
  },
  fileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...clayCardShadow,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 80,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...clayCardShadow,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...clayCardShadow,
  },
  sendButtonDisabled: { backgroundColor: COLORS.border },
  voiceHint: { textAlign: 'center', fontSize: 12, color: COLORS.primary, paddingBottom: 8 },
});

export default AssistantScreen;