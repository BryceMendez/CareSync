import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';

// ─── Design Tokens (shared with StaffHomeScreen) ─────────────────────────────
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

  red: '#DC2626',
  redSoft: '#FEE2E2',

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

// ─── Info Row ────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, isLast }) {
  return (
    <View style={[ir.wrap, !isLast && ir.separator]}>
      <View style={ir.iconBox}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={ir.content}>
        <Text style={ir.label}>{label}</Text>
        <Text style={ir.value}>{value}</Text>
      </View>
    </View>
  );
}

const ir = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  label: { fontSize: 11, color: C.textMuted, fontWeight: '600', marginBottom: 2 },
  value: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
});

// ─── Setting Row ─────────────────────────────────────────────────────────────
function SettingRow({ icon, label, sublabel, hasToggle, toggleValue, onToggle, onPress, isLast, danger }) {
  return (
    <TouchableOpacity
      style={[sr.wrap, !isLast && sr.separator]}
      onPress={onPress}
      activeOpacity={hasToggle ? 1 : 0.7}
    >
      <View style={[sr.iconBox, danger && { backgroundColor: C.redSoft }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={sr.content}>
        <Text style={[sr.label, danger && { color: C.red }]}>{label}</Text>
        {sublabel ? <Text style={sr.sublabel}>{sublabel}</Text> : null}
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: C.border, true: C.accentMid }}
          thumbColor={toggleValue ? C.accent : '#fff'}
        />
      ) : (
        <Text style={[sr.chevron, danger && { color: C.red }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

const sr = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  sublabel: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  chevron: { fontSize: 22, color: C.textMuted, fontWeight: '300' },
});

// ─── Stat Badge ──────────────────────────────────────────────────────────────
function StatBadge({ value, label, color, bg }) {
  return (
    <View style={[sb.wrap, { backgroundColor: bg }]}>
      <Text style={[sb.value, { color }]}>{value}</Text>
      <Text style={sb.label}>{label}</Text>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 3,
  },
  value: { fontSize: 20, fontWeight: '900', letterSpacing: -0.3 },
  label: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function StaffProfileScreen({ profile, onBack, onSignOut }) {
  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifShift, setNotifShift] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const staffName = profile?.name || 'Nurse Sarah Mitchell';
  const staffEmail = profile?.email || 'sarah.mitchell@caresync.ph';
  const staffId = profile?.employeeId || 'EMP-20412';
  const staffRole = profile?.role || 'Registered Nurse';

  const initials = staffName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.75}>
            <Text style={s.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={s.topBarTitle}>My Profile</Text>
          <TouchableOpacity style={s.editBtn} activeOpacity={0.75}>
            <Text style={s.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Profile Hero ── */}
        <View style={s.heroCard}>
          {/* Avatar */}
          <View style={s.avatarWrapper}>
            <View style={s.avatarRing}>
              <View style={s.avatarInner}>
                <Text style={s.avatarText}>{initials}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.cameraBtn} activeOpacity={0.8}>
              <Text style={{ fontSize: 13 }}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* Name + Role */}
          <Text style={s.heroName}>{staffName}</Text>
          <View style={s.heroChipsRow}>
            <View style={s.heroChip}>
              <Text style={s.heroChipText}>👩‍⚕️ {staffRole}</Text>
            </View>
            <View style={[s.heroChip, { backgroundColor: C.greenSoft }]}>
              <View style={s.greenDot} />
              <Text style={[s.heroChipText, { color: C.green }]}>On Duty</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={s.heroDivider} />

          {/* Stats */}
          <View style={s.statsRow}>
            <StatBadge value="3.2y" label="Tenure" color={C.accent} bg={C.accentSoft} />
            <View style={{ width: 10 }} />
            <StatBadge value="12" label="Residents" color={C.green} bg={C.greenSoft} />
            <View style={{ width: 10 }} />
            <StatBadge value="98%" label="Attendance" color={C.amber} bg={C.amberSoft} />
          </View>
        </View>

        {/* ── Personal Info ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Personal Info</Text>
        </View>
        <View style={s.card}>
          <InfoRow icon="🪪" label="Employee ID" value={staffId} />
          <InfoRow icon="📧" label="Email" value={staffEmail} />
          <InfoRow icon="📞" label="Phone" value="+63 917 234 5678" />
          <InfoRow icon="🏢" label="Department" value="Geriatric Care · East Wing" />
          <InfoRow icon="🗓️" label="Date Hired" value="January 14, 2022" isLast />
        </View>

        {/* ── Current Assignment ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Current Assignment</Text>
        </View>
        <View style={s.card}>
          <InfoRow icon="🏠" label="Wing" value="East Wing · 3rd Floor" />
          <InfoRow icon="⏰" label="Shift" value="Morning · 07:00 AM – 03:00 PM" />
          <InfoRow icon="👥" label="Assigned Residents" value="12 Residents" />
          <InfoRow icon="👤" label="Supervisor" value="Head Nurse Dr. Reyes" isLast />
        </View>

        {/* ── Notifications ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Notifications</Text>
        </View>
        <View style={s.card}>
          <SettingRow
            icon="🔔"
            label="Resident Alerts"
            sublabel="Fall, vitals, and emergency alerts"
            hasToggle
            toggleValue={notifAlerts}
            onToggle={setNotifAlerts}
          />
          <SettingRow
            icon="📅"
            label="Shift Reminders"
            sublabel="15 min before shift starts"
            hasToggle
            toggleValue={notifShift}
            onToggle={setNotifShift}
            isLast
          />
        </View>

        {/* ── Preferences ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Preferences</Text>
        </View>
        <View style={s.card}>
          <SettingRow
            icon="🌙"
            label="Dark Mode"
            sublabel="Switch app appearance"
            hasToggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
          />
          <SettingRow
            icon="🌐"
            label="Language"
            sublabel="English (Philippines)"
            onPress={() => {}}
          />
          <SettingRow
            icon="🔒"
            label="Change Password"
            sublabel="Last changed 30 days ago"
            onPress={() => {}}
            isLast
          />
        </View>

        {/* ── Support ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Support</Text>
        </View>
        <View style={s.card}>
          <SettingRow
            icon="❓"
            label="Help Center"
            onPress={() => {}}
          />
          <SettingRow
            icon="📄"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <SettingRow
            icon="⭐"
            label="Rate the App"
            onPress={() => {}}
            isLast
          />
        </View>

        {/* ── Sign Out ── */}
        <View style={s.card}>
          <SettingRow
            icon="🚪"
            label="Sign Out"
            onPress={onSignOut}
            danger
            isLast
          />
        </View>

        {/* App version */}
        <Text style={s.version}>CareSync v1.0.0 · Staff Portal</Text>

      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 40 },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 58 : 46,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: C.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  backIcon: {
    fontSize: 26,
    color: C.textPrimary,
    fontWeight: '300',
    lineHeight: 30,
    marginTop: -2,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.accentSoft,
  },
  editText: { fontSize: 13, fontWeight: '700', color: C.accent },

  // Hero Card
  heroCard: {
    marginHorizontal: 22,
    backgroundColor: C.surface,
    borderRadius: 26,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW_MD,
  },
  avatarWrapper: {
    marginBottom: 14,
    position: 'relative',
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: C.accentBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: C.accent,
    letterSpacing: 1,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.border,
    ...SHADOW_SM,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.accentSoft,
    paddingVertical: 5,
    paddingHorizontal: 12,
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
  heroDivider: {
    height: 1,
    backgroundColor: C.divider,
    width: '100%',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
    letterSpacing: -0.3,
  },

  // Card
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

  version: {
    textAlign: 'center',
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 10,
  },
});