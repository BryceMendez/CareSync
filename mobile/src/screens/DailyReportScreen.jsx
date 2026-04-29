import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';

export default function DailyReportScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Report</Text>
        <View style={styles.dateBadge}><Text style={styles.dateBadgeText}>OCT 5</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Resident */}
        <View style={styles.residentCard}>
          <View style={styles.residentAvatar}><Text style={styles.residentAvatarText}>NH</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.residentName}>Nora Henderson</Text>
            <Text style={styles.residentDetail}>🏠 Room 402</Text>
            <Text style={styles.residentDetail}>📅 October 5, 2023</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}><Text style={{ fontSize: 18 }}>📞</Text></TouchableOpacity>
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Meals & Nutrition</Text>
          <View style={styles.mealRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealName}>Breakfast: Oatmeal & Fruit</Text>
              <Text style={styles.mealDesc}>Consumed 100% of portion</Text>
            </View>
            <Text style={styles.mealTime}>6:15 AM</Text>
          </View>
          <View style={[styles.mealRow, { borderTopWidth: 1, borderTopColor: '#F5F9FF' }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealName}>Lunch: Grilled Chicken & Vegetables</Text>
              <Text style={styles.mealDesc}>Consumed 85% of portion</Text>
            </View>
            <View style={styles.lunchTimeBadge}><Text style={styles.lunchTimeText}>12:30 PM</Text></View>
          </View>
        </View>

        {/* Medication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Medication</Text>
          <View style={styles.medRow}>
            <View style={styles.medIconWrap}><Text style={{ fontSize: 16 }}>💊</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Blood Pressure Meds</Text>
              <Text style={styles.medDesc}>10mg, Tablet · Oral</Text>
            </View>
            <Text style={styles.medTime}>8:30 AM</Text>
          </View>
          <View style={[styles.medRow, { borderTopWidth: 1, borderTopColor: '#F5F9FF' }]}>
            <View style={styles.medIconWrap}><Text style={{ fontSize: 16 }}>🌿</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Multivitamin</Text>
              <Text style={styles.medDesc}>Standard Supplement</Text>
            </View>
            <Text style={styles.medTime}>9:00 AM</Text>
          </View>
        </View>

        {/* Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalLabel}>BP</Text>
              <Text style={styles.vitalValue}>120/80</Text>
              <Text style={styles.vitalStatus}>Normal</Text>
            </View>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalLabel}>PULSE</Text>
              <Text style={styles.vitalValue}>72<Text style={{ fontSize: 12 }}> bpm</Text></Text>
              <Text style={[styles.vitalStatus, { color: '#FF9800' }]}>Stable</Text>
            </View>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalLabel}>TEMP</Text>
              <Text style={styles.vitalValue}>98.4</Text>
              <Text style={styles.vitalStatus}>Normal</Text>
            </View>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalLabel}>SPO2</Text>
              <Text style={styles.vitalValue}>98</Text>
              <Text style={styles.vitalStatus}>Optimal</Text>
            </View>
          </View>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏃 Activities</Text>
          {[
            { name: 'Morning Hygiene', desc: 'Assisted shower and dressing' },
            { name: 'Garden Walk', desc: '30 minutes in fresh air' },
          ].map((a, i) => (
            <View key={i} style={[styles.activityRow, i > 0 && { borderTopWidth: 1, borderTopColor: '#F5F9FF' }]}>
              <Text style={styles.activityName}>{a.name}</Text>
              <Text style={styles.activityDesc}>{a.desc}</Text>
              <Text style={styles.activityCheck}>✅</Text>
            </View>
          ))}
        </View>

        {/* Caregiver Notes */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Text style={styles.notesIcon}>📝</Text>
            <Text style={styles.notesTitle}>Caregiver Notes</Text>
          </View>
          <Text style={styles.notesText}>
            Nora was very active and social today during the garden walk. She enjoyed the morning sunshine and participated in the group memory game. Appetite was good throughout the day. She complained of slight stiffness in her left knee, but it didn't impede her mobility.
          </Text>
          <View style={styles.notesAuthor}>
            <View style={styles.authorAvatar}><Text style={{ fontSize: 12 }}>👩‍⚕️</Text></View>
            <View>
              <Text style={styles.authorName}>Sarah Jenkins, RN</Text>
              <Text style={styles.authorRole}>Day Shift Lead</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
  },
  backArrow: { fontSize: 20, color: '#1565C0', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1565C0' },
  dateBadge: {
    backgroundColor: '#2196F3', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  dateBadgeText: { color: 'white', fontWeight: '800', fontSize: 12 },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  residentCard: {
    backgroundColor: 'white', borderRadius: 16,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 14, elevation: 2,
    shadowColor: '#2196F3', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
  },
  residentAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#BBDEFB', alignItems: 'center', justifyContent: 'center',
  },
  residentAvatarText: { fontSize: 16, fontWeight: '700', color: '#1565C0' },
  residentName: { fontSize: 16, fontWeight: '700', color: '#1565C0', marginBottom: 4 },
  residentDetail: { fontSize: 12, color: '#90A4AE', marginBottom: 1 },
  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center',
  },
  section: {
    backgroundColor: 'white', borderRadius: 16,
    padding: 14, marginBottom: 12, elevation: 1,
    shadowColor: '#2196F3', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1565C0', marginBottom: 12 },
  mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  mealName: { fontSize: 13, fontWeight: '600', color: '#263238', marginBottom: 2 },
  mealDesc: { fontSize: 11, color: '#90A4AE' },
  mealTime: { fontSize: 12, color: '#90A4AE', fontWeight: '600' },
  lunchTimeBadge: {
    backgroundColor: '#1565C0', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  lunchTimeText: { color: 'white', fontSize: 11, fontWeight: '700' },
  medRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  medIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center',
  },
  medName: { fontSize: 13, fontWeight: '600', color: '#263238', marginBottom: 2 },
  medDesc: { fontSize: 11, color: '#90A4AE' },
  medTime: { fontSize: 12, color: '#90A4AE', fontWeight: '600' },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vitalCard: {
    flex: 1, minWidth: '45%', backgroundColor: '#F5F9FF',
    borderRadius: 12, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#E3F2FD',
  },
  vitalLabel: { fontSize: 10, fontWeight: '700', color: '#90A4AE', letterSpacing: 0.5, marginBottom: 4 },
  vitalValue: { fontSize: 22, fontWeight: '800', color: '#1565C0', marginBottom: 4 },
  vitalStatus: { fontSize: 11, color: '#66BB6A', fontWeight: '600' },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  activityName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#263238' },
  activityDesc: { fontSize: 11, color: '#90A4AE', flex: 1 },
  activityCheck: { fontSize: 16 },
  notesCard: {
    backgroundColor: '#EBF4FF', borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderLeftWidth: 4, borderLeftColor: '#2196F3',
  },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  notesIcon: { fontSize: 16 },
  notesTitle: { fontSize: 14, fontWeight: '700', color: '#1565C0' },
  notesText: { fontSize: 13, color: '#37474F', lineHeight: 20, marginBottom: 14 },
  notesAuthor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authorAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#BBDEFB', alignItems: 'center', justifyContent: 'center',
  },
  authorName: { fontSize: 13, fontWeight: '700', color: '#1565C0' },
  authorRole: { fontSize: 11, color: '#90A4AE' },
});