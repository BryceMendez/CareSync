import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
const { width } = Dimensions.get('window');

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9FF',

  accent: '#1A56DB',
  accentBright: '#3B82F6',
  accentSoft: '#EBF2FF',
  accentMid: '#BFDBFE',

  textPrimary: '#0D1B3E',
  textSecondary: '#4B5E82',
  textMuted: '#9AAABE',

  green: '#16A34A',
  greenSoft: '#DCFCE7',
  greenBright: '#22C55E',

  amber: '#D97706',
  amberSoft: '#FEF3C7',
  amberBright: '#F59E0B',

  red: '#DC2626',
  redSoft: '#FEE2E2',
  redBright: '#EF4444',

  border: '#E8EDFB',
  divider: '#F1F4FB',
};

const SHADOW_SM = {
  shadowColor: '#1A3C6E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: '#1A3C6E',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.09,
  shadowRadius: 16,
  elevation: 4,
};

// ─── Reusable: Staff Tab Bar (UNCHANGED) ────────────────────────────────────
export function StaffTabBar({ active, onPress }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'residents', label: 'Residents', icon: '👥' },
    { id: 'camera', label: 'Camera', icon: '📷' },
    { id: 'logs', label: 'Logs', icon: '📋' },
  ];
  return (
    <View style={tab.container}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={tab.item}
          onPress={() => onPress(t.id)}
          activeOpacity={0.7}
        >
          <Text style={[tab.icon, active === t.id && tab.iconActive]}>{t.icon}</Text>
          <Text style={[tab.label, active === t.id && tab.labelActive]}>{t.label}</Text>
          {active === t.id && <View style={tab.dot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const tab = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    paddingBottom: 26,
    paddingTop: 10,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { fontSize: 21, marginBottom: 1, opacity: 0.4 },
  iconActive: { opacity: 1 },
  label: { fontSize: 10, color: '#B0BEC5', fontWeight: '600' },
  labelActive: { color: '#2196F3', fontWeight: '700' },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
    marginTop: 2,
  },
});

// ─── Stat Chip ───────────────────────────────────────────────────────────────
function StatChip({ icon, label, value, valueColor, chipBg }) {
  return (
    <View style={[sc.wrap, { backgroundColor: chipBg }]}>
      <Text style={sc.icon}>{icon}</Text>
      <Text style={[sc.value, { color: valueColor }]}>{value}</Text>
      <Text style={sc.label}>{label}</Text>
    </View>
  );
}

const sc = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 3,
  },
  icon: { fontSize: 20 },
  value: { fontSize: 15, fontWeight: '900', letterSpacing: -0.2 },
  label: { fontSize: 10, color: C.textMuted, fontWeight: '600', marginTop: 1 },
});

// ─── Resident Row ────────────────────────────────────────────────────────────
function ResidentRow({ initials, name, room, status, statusColor, statusBg, isLast }) {
  return (
    <View style={[rr.wrap, !isLast && rr.separator]}>
      <View style={rr.avatar}>
        <Text style={rr.avatarText}>{initials}</Text>
      </View>
      <View style={rr.accentBar} />
      <View style={rr.content}>
        <View style={rr.nameRow}>
          <Text style={rr.name} numberOfLines={1}>{name}</Text>
          <View style={[rr.chip, { backgroundColor: statusBg }]}>
            <Text style={[rr.chipText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>
        <Text style={rr.room}>{room}</Text>
      </View>
    </View>
  );
}

const rr = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.accent,
    letterSpacing: 0.2,
  },
  accentBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
    backgroundColor: C.accentSoft,
  },
  content: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  chip: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  chipText: { fontSize: 10, fontWeight: '800' },
  room: { fontSize: 12, color: C.textSecondary },
});

// ─── Task Row ────────────────────────────────────────────────────────────────
function TaskRow({ icon, title, time, priority, isLast }) {
  const priorityMap = {
    urgent: { color: C.red, bg: C.redSoft, label: 'Urgent' },
    pending: { color: C.amber, bg: C.amberSoft, label: 'Pending' },
    done: { color: C.green, bg: C.greenSoft, label: 'Done' },
  };
  const p = priorityMap[priority];
  return (
    <View style={[tr.wrap, !isLast && tr.separator]}>
      <View style={tr.iconBox}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={tr.content}>
        <Text style={tr.title} numberOfLines={1}>{title}</Text>
        <Text style={tr.time}>{time}</Text>
      </View>
      <View style={[tr.badge, { backgroundColor: p.bg }]}>
        <Text style={[tr.badgeText, { color: p.color }]}>{p.label}</Text>
      </View>
    </View>
  );
}

const tr = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 3 },
  time: { fontSize: 12, color: C.textSecondary },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 10, fontWeight: '800' },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function StaffHomeScreen({ onNavigate, onProfile }) {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigate = (id) => {
    setActiveTab(id);
    onNavigate && onNavigate(id);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.headerLeft}
            onPress={() => onProfile && onProfile()}
            activeOpacity={0.75}
          >
            <View style={s.avatarRing}>
              <View style={s.avatarInner}>
                <Text style={s.avatarText}>NS</Text>
              </View>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={s.welcomeLabel}>On Duty · East Wing</Text>
              <Text style={s.greetingName}>Nurse Sarah</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.notifBtn} activeOpacity={0.75}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={s.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* ── Critical Alert Banner ── */}
        <TouchableOpacity style={s.alertBanner} activeOpacity={0.88}>
          <View style={s.alertBannerLeft}>
            <View style={s.alertBannerIconBox}>
              <Text style={{ fontSize: 20 }}>⚠️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.alertBannerEyebrow}>CRITICAL ALERT · ROOM 204</Text>
              <Text style={s.alertBannerTitle}>Fall Detected – James Wilson</Text>
            </View>
          </View>
          <View style={s.alertPulseDot} />
        </TouchableOpacity>

        {/* ── Shift Info Hero Card ── */}
        <View style={s.heroCard}>
          {/* Top row */}
          <View style={s.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroEyebrow}>CURRENT SHIFT</Text>
              <Text style={s.heroTitle}>Morning Shift</Text>
              <View style={s.heroChipsRow}>
                <View style={s.heroChip}>
                  <Text style={s.heroChipText}>🏢 East Wing · 3F</Text>
                </View>
                <View style={[s.heroChip, { backgroundColor: C.greenSoft }]}>
                  <View style={s.greenDot} />
                  <Text style={[s.heroChipText, { color: C.green }]}>On Duty</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={s.shiftBtn} activeOpacity={0.8}>
              <Text style={{ fontSize: 22 }}>📋</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={s.heroDivider} />

          {/* Shift meta row */}
          <View style={s.heroMetaRow}>
            <View style={s.heroMeta}>
              <Text style={s.heroMetaValue}>07:00 AM</Text>
              <Text style={s.heroMetaLabel}>Shift Start</Text>
            </View>
            <View style={s.heroMetaDivider} />
            <View style={s.heroMeta}>
              <Text style={s.heroMetaValue}>3:00 PM</Text>
              <Text style={s.heroMetaLabel}>Shift End</Text>
            </View>
            <View style={s.heroMetaDivider} />
            <View style={s.heroMeta}>
              <Text style={[s.heroMetaValue, { color: C.amber }]}>6.5h</Text>
              <Text style={s.heroMetaLabel}>Elapsed</Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity style={s.logBtn} activeOpacity={0.85}>
            <Text style={s.logBtnText}>View Shift Logs</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          <StatChip
            icon="👥"
            label="Residents"
            value="12"
            valueColor={C.accent}
            chipBg={C.accentSoft}
          />
          <View style={s.statGap} />
          <StatChip
            icon="🔔"
            label="Alerts"
            value="3"
            valueColor={C.red}
            chipBg={C.redSoft}
          />
          <View style={s.statGap} />
          <StatChip
            icon="✅"
            label="Tasks Done"
            value="5 / 8"
            valueColor={C.green}
            chipBg={C.greenSoft}
          />
        </View>

        {/* ── Today's Tasks ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity style={s.viewAllPill} activeOpacity={0.7}>
            <Text style={s.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <TaskRow
            icon="💊"
            title="Administer morning medications"
            time="08:00 AM · Rooms 201–210"
            priority="done"
          />
          <TaskRow
            icon="🩺"
            title="Vital signs check – James Wilson"
            time="10:00 AM · Room 204"
            priority="urgent"
          />
          <TaskRow
            icon="🍽️"
            title="Assist with lunch service"
            time="12:00 PM · Dining Hall"
            priority="pending"
            isLast
          />
        </View>

        {/* ── Resident Status ── */}
        <View style={[s.sectionHeader, { marginTop: 6 }]}>
          <Text style={s.sectionTitle}>Resident Status</Text>
          <TouchableOpacity style={s.viewAllPill} activeOpacity={0.7}>
            <Text style={s.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <ResidentRow
            initials="JW"
            name="James Wilson"
            room="Room 204 · Bedroom"
            status="⚠️ Alert"
            statusColor={C.red}
            statusBg={C.redSoft}
          />
          <ResidentRow
            initials="ER"
            name="Eleanor Rigby"
            room="Room 308 · Lounge"
            status="Resting"
            statusColor={C.accent}
            statusBg={C.accentSoft}
          />
          <ResidentRow
            initials="HS"
            name="Henry Smith"
            room="Room 221 · Garden"
            status="Active"
            statusColor={C.green}
            statusBg={C.greenSoft}
            isLast
          />
        </View>

        {/* ── Live Feeds Preview ── */}
        <View style={[s.sectionHeader, { marginTop: 6 }]}>
          <Text style={s.sectionTitle}>Live Feeds</Text>
          <TouchableOpacity style={s.viewAllPill} activeOpacity={0.7}>
            <Text style={s.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.feedsScroll}
        >
          {[
            { room: 'Room 204 – Bedroom', hasAlert: true },
            { room: 'Room 216 – Sitting Area', hasAlert: false },
            { room: 'Corridor A – East Wing', hasAlert: false },
          ].map((feed, i) => (
            <TouchableOpacity key={i} style={s.feedCard} activeOpacity={0.85}>
              <View style={[s.feedPreview, feed.hasAlert && s.feedPreviewAlert]}>
                <Text style={{ fontSize: 28, opacity: 0.35 }}>📹</Text>
                {feed.hasAlert && (
                  <View style={s.feedAlertBadge}>
                    <Text style={s.feedAlertText}>ALERT</Text>
                  </View>
                )}
                <View style={s.feedLiveBadge}>
                  <View style={s.feedLiveDot} />
                  <Text style={s.feedLiveText}>LIVE</Text>
                </View>
              </View>
              <Text style={s.feedLabel} numberOfLines={1}>{feed.room}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>

      <StaffTabBar active={activeTab} onPress={handleNavigate} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 30 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 58 : 46,
    paddingBottom: 18,
    backgroundColor: C.bg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: C.accentBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: C.accent,
    letterSpacing: 0.5,
  },
  welcomeLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginBottom: 1,
  },
  greetingName: {
    fontSize: 19,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  notifBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_SM,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.surface,
  },

  // Critical Alert Banner
  alertBanner: {
    marginHorizontal: 22,
    marginBottom: 16,
    backgroundColor: C.redSoft,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FECACA',
    ...SHADOW_SM,
    shadowColor: '#DC2626',
    shadowOpacity: 0.1,
  },
  alertBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  alertBannerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBannerEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  alertBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.red,
    letterSpacing: -0.2,
  },
  alertPulseDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.red,
    alignSelf: 'center',
    marginLeft: 8,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: 22,
    backgroundColor: C.surface,
    borderRadius: 26,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW_MD,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: C.textMuted,
    letterSpacing: 1.3,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroChipsRow: { flexDirection: 'row', gap: 8 },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.accentSoft,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 30,
    gap: 5,
  },
  heroChipText: {
    fontSize: 11,
    color: C.accent,
    fontWeight: '700',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.greenBright,
  },
  shiftBtn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginBottom: 16,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroMeta: { flex: 1, alignItems: 'center' },
  heroMetaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  heroMetaLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '600',
  },
  heroMetaDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.divider,
  },
  logBtn: {
    backgroundColor: C.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.1,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 22,
    marginBottom: 24,
  },
  statGap: { width: 10 },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  viewAllPill: {
    backgroundColor: C.accentSoft,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
  },
  viewAllText: { fontSize: 12, color: C.accent, fontWeight: '700' },

  // Shared card wrapper
  card: {
    marginHorizontal: 22,
    backgroundColor: C.surface,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW_SM,
  },

  // Live Feeds
  feedsScroll: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    gap: 12,
  },
  feedCard: {
    width: 148,
  },
  feedPreview: {
    width: 148,
    height: 96,
    borderRadius: 18,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.accentMid,
  },
  feedPreviewAlert: {
    backgroundColor: C.redSoft,
    borderColor: '#FECACA',
  },
  feedAlertBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: C.red,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  feedAlertText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  feedLiveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: C.greenBright,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  feedLiveText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  feedLabel: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});