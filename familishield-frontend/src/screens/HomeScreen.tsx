// src/screens/HomeScreen.tsx – shield animation removed
import React from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------- Design Tokens (claymorphism, light theme) ----------
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
  highlight: 'rgba(255,255,255,0.92)',
};

const clayCardShadow = Platform.select({
  ios: { shadowColor: '#8AABF7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 20 },
  android: { elevation: 6 },
});

// ---------- Helper: Press animation (still used for buttons) ----------
const ClayPress = ({ children, onPress, style, scaleDown = 0.96 }) => {
  const anim = React.useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(anim, { toValue: scaleDown, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const pressOut = () => Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>{children}</Pressable>
    </Animated.View>
  );
};

// ---------- Static Shield (no animation) ----------
function StaticShield() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient colors={['#6AAEFF', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.orbGrad}>
        <Ionicons name="shield-checkmark" size={34} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

// ---------- HOME SCREEN COMPONENT ----------
function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const navigate = (screen) => navigation.navigate(screen);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}>
        
        {/* 1. HEADER */}
        <View style={[styles.header, { paddingHorizontal: 20 }]}>
          <View>
            <Text style={styles.greeting}>Hello User 👋</Text>
            <Text style={styles.tagline}>Your family is protected</Text>
          </View>
          <View style={styles.headerActions}>
            <ClayPress onPress={() => navigate('Notifications')}>
              <View style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                <View style={styles.notifBadge} />
              </View>
            </ClayPress>
            <ClayPress onPress={() => navigate('Profile')}>
              <View style={styles.avatarBtn}>
                <Text style={styles.avatarText}>RA</Text>
              </View>
            </ClayPress>
          </View>
        </View>

        {/* 2. HERO SECTION (static shield) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={[styles.heroCard, clayCardShadow]}>
            <View style={styles.heroHighlight} />
            <View style={styles.heroInner}>
              <StaticShield />
              <View style={styles.heroRight}>
                <View style={styles.protectionPill}>
                  <View style={styles.protectionDot} />
                  <Text style={styles.protectionText}>ALL PROTECTED</Text>
                </View>
                <Text style={styles.heroTitle}>Safe Family Happy Family</Text>
                <Text style={styles.heroDescription}>
                  Check messages, links, QR codes and suspicious requests before taking action.
                </Text>
                <View style={styles.statRow}>
                  <View><Text style={[styles.statValue, { color: COLORS.primary }]}>127</Text><Text style={styles.statLabel}>Scans</Text></View>
                  <View style={styles.statDivider} />
                  <View><Text style={[styles.statValue, { color: COLORS.danger }]}>14</Text><Text style={styles.statLabel}>Blocked</Text></View>
                  <View style={styles.statDivider} />
                  <View><Text style={[styles.statValue, { color: COLORS.success }]}>4</Text><Text style={styles.statLabel}>Members</Text></View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. TALK TO AI ASSISTANT (primary CTA) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ClayPress onPress={() => navigate('Assistant')} scaleDown={0.97}>
            <LinearGradient colors={['#5B9EFF', '#2563EB', '#1746C8']} style={styles.aiCta}>
              <View style={styles.aiIconBubble}><Ionicons name="sparkles" size={24} color={COLORS.primary} /></View>
              <View style={styles.aiTextBlock}>
                <Text style={styles.aiTitle}>Talk to AI Assistant</Text>
                <Text style={styles.aiSubtitle}>Hindi • English • Hinglish • Voice + Text</Text>
              </View>
              <View style={styles.aiArrow}><Ionicons name="arrow-forward" size={20} color="#fff" /></View>
            </LinearGradient>
          </ClayPress>
        </View>

        {/* 4. QUICK ACCESS (2x2 grid) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.toolsGrid}>
            <ClayPress onPress={() => navigate('QRScanner')} style={styles.toolWrapper}>
              <View style={[styles.toolCard, { backgroundColor: '#EBF3FF' }]}>
                <Ionicons name="qr-code-outline" size={32} color={COLORS.primary} />
                <Text style={styles.toolTitle}>Scan QR Code</Text>
                <Text style={styles.toolDesc}>Check Any QR</Text>
              </View>
            </ClayPress>
            <ClayPress onPress={() => navigate('Family')} style={styles.toolWrapper}>
              <View style={[styles.toolCard, { backgroundColor: '#E2FDF0' }]}>
                <Ionicons name="people" size={32} color={COLORS.success} />
                <Text style={styles.toolTitle}>Family Shield</Text>
                <Text style={styles.toolDesc}>Protect your loved ones</Text>
              </View>
            </ClayPress>
            <ClayPress onPress={() => navigate('Emergency')} style={styles.toolWrapper}>
              <View style={[styles.toolCard, { backgroundColor: '#FFF0F3' }]}>
                <Ionicons name="warning" size={32} color={COLORS.danger} />
                <Text style={styles.toolTitle}>Emergency</Text>
                <Text style={styles.toolDesc}>Need urgent help?</Text>
              </View>
            </ClayPress>
            <ClayPress onPress={() => navigate('Premium')} style={styles.toolWrapper}>
              <View style={[styles.toolCard, { backgroundColor: '#FFF8EC' }]}>
                <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
                <Ionicons name="crown" size={32} color={COLORS.warning} />
                <Text style={styles.toolTitle}>Premium</Text>
                <Text style={styles.toolDesc}>Unlock advanced AI</Text>
              </View>
            </ClayPress>
          </View>
        </View>

        {/* 5. SCAM ALERT CARD */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={[styles.alertCard, { backgroundColor: '#FFF5F5', borderLeftColor: COLORS.danger }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
              <Text style={styles.alertTitle}>🚨 Scam Alert</Text>
            </View>
            <Text style={styles.alertText}>
              Fake SBI Reward SMS scam is trending. Thousands of users reported it this week.
            </Text>
            <TouchableOpacity onPress={() => navigate('ScamAlertDetails')}>
              <Text style={styles.alertLink}>Learn More →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. RECENT ACTIVITY */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigate('ActivityHistory')}><Text style={styles.sectionLink}>See all →</Text></TouchableOpacity>
          </View>
          <View style={[styles.activityCard, clayCardShadow]}>
            <View style={styles.cardHighlight} />
            {[
              { id: '1', icon: 'chatbubble-ellipses', title: 'SBI Reward SMS', sub: 'Verified safe', verdict: 'Safe', vBg: '#E2FDF0', vFg: '#059652', time: '2 min ago' },
              { id: '2', icon: 'call', title: 'TRAI Officer Call', sub: 'Scam blocked', verdict: 'Blocked', vBg: '#FFF0F3', vFg: '#C0192E', time: '1 hr ago' },
              { id: '3', icon: 'card', title: 'UPI Request ₹15,000', sub: 'Needs review', verdict: 'Risky', vBg: '#FFF8EC', vFg: '#D97706', time: '3 hr ago' },
            ].map((item, idx) => (
              <ClayPress key={item.id} onPress={() => navigate('Assistant')} scaleDown={0.98}>
                <View style={[styles.activityRow, idx === 2 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.activityIcon, { backgroundColor: item.vBg }]}>
                    <Ionicons name={item.icon} size={18} color={item.vFg} />
                  </View>
                  <View style={styles.activityBody}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activitySub}>{item.sub}</Text>
                    <Text style={styles.activityTime}>{item.time}</Text>
                  </View>
                  <View style={[styles.activityBadge, { backgroundColor: item.vBg, borderColor: item.vFg }]}>
                    <Text style={[styles.activityBadgeText, { color: item.vFg }]}>{item.verdict}</Text>
                  </View>
                </View>
              </ClayPress>
            ))}
          </View>
        </View>

        {/* 7. EMERGENCY BANNER */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ClayPress onPress={() => navigate('Emergency')} scaleDown={0.97}>
            <View style={[styles.emergCard, { backgroundColor: '#FFF0F3' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="alert-circle" size={32} color={COLORS.danger} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emergTitle}>Being scammed right now?</Text>
                  <Text style={styles.emergSub}>Call 1930 • Notify Family • Save Evidence</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={COLORS.danger} />
              </View>
            </View>
          </ClayPress>
        </View>

        {/* 8. MINIMALIST MISSION BANNER */}
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <View style={[styles.missionBanner, clayCardShadow]}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=800&auto=format' }}
              style={styles.bannerImage}
              imageStyle={{ borderRadius: 28 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.bannerOverlay}
              />
              <Text style={styles.bannerText}>Protecting Families From Digital Scams</Text>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- STYLES (unchanged) ----------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  tagline: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border, position: 'relative' },
  avatarBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '900', color: COLORS.white },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.white },
  heroCard: { backgroundColor: COLORS.white, borderRadius: 32, borderWidth: 1.5, borderColor: COLORS.white, overflow: 'hidden' },
  heroHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: COLORS.highlight, zIndex: 10 },
  heroInner: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  orbGrad: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  heroRight: { flex: 1 },
  protectionPill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  protectionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  protectionText: { fontSize: 11, fontWeight: '800', color: COLORS.success },
  heroTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 4 },
  heroDescription: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '600', color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: COLORS.textFaint },
  aiCta: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 28, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  aiIconBubble: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  aiTextBlock: { flex: 1, marginRight: 8 },
  aiTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  aiSubtitle: { fontSize: 9, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  aiArrow: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  toolWrapper: { width: (SCREEN_WIDTH - 40 - 12) / 2, marginBottom: 12 },
  toolCard: { borderRadius: 24, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white, position: 'relative' },
  toolTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginTop: 8, marginBottom: 2 },
  toolDesc: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  proBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.warning, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: COLORS.white },
  proBadgeText: { fontSize: 8, fontWeight: '900', color: '#fff' },
  alertCard: { borderRadius: 20, padding: 14, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: COLORS.danger },
  alertText: { fontSize: 12, color: COLORS.textPrimary, marginBottom: 8, lineHeight: 16 },
  alertLink: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  activityCard: { backgroundColor: COLORS.white, borderRadius: 28, borderWidth: 1.5, borderColor: COLORS.white, overflow: 'hidden' },
  cardHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: COLORS.highlight },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4FF' },
  activityIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  activityBody: { flex: 1, gap: 2 },
  activityTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  activitySub: { fontSize: 11, color: COLORS.textSecondary },
  activityTime: { fontSize: 10, color: COLORS.textFaint },
  activityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  activityBadgeText: { fontSize: 11, fontWeight: '800' },
  emergCard: { borderRadius: 28, padding: 16, borderWidth: 1.5, borderColor: COLORS.white },
  emergTitle: { fontSize: 14, fontWeight: '900', color: '#C0192E' },
  emergSub: { fontSize: 11, color: '#E57090', marginTop: 2 },
  missionBanner: { borderRadius: 28, overflow: 'hidden', height: 240 },
  bannerImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 28 },
  bannerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    lineHeight: 30,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

// Need to import Animated for ClayPress – re-add
import { Animated } from 'react-native';

export default HomeScreen;