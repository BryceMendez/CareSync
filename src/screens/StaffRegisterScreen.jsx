import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
  Switch,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Shared Components ─────────────────────────────────────────────────────────

function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.backBtn}>
      <Text style={s.backArrow}>←</Text>
    </TouchableOpacity>
  );
}

function ProgressBar({ current, total, label }) {
  return (
    <View style={s.progressWrap}>
      <Text style={s.progressLabel}>{label || 'Step 1: Role Selection'}</Text>
      <Text style={s.progressCounter}>{current} of {total}</Text>
      <View style={s.progressTrack}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[s.progressSegment, i < current ? s.progressActive : s.progressInactive]} />
        ))}
      </View>
    </View>
  );
}

function InputField({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry, hint, icon }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <View style={s.inputGroup}>
      {label ? <Text style={s.inputLabel}>{label}</Text> : null}
      <View style={[s.inputWrapper, focused && s.inputFocused]}>
        {icon ? <Text style={s.inputIcon}>{icon}</Text> : null}
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor="#B0BEC5"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureTextEntry && !show}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShow(!show)} style={{ padding: 4 }}>
            <Text style={{ color: '#90CAF9', fontSize: 12 }}>{show ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {hint ? <Text style={s.hintText}>{hint}</Text> : null}
    </View>
  );
}

function DropdownField({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.inputGroup}>
      {label ? <Text style={s.inputLabel}>{label}</Text> : null}
      <TouchableOpacity
        style={[s.inputWrapper, { justifyContent: 'space-between' }]}
        onPress={() => setOpen(!open)}
      >
        <Text style={value ? s.dropdownSelected : s.dropdownPlaceholder}>
          {value || placeholder || 'Select...'}
        </Text>
        <Text style={{ color: '#90CAF9' }}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={s.dropdown}>
          {options.map(o => (
            <TouchableOpacity key={o} style={s.dropdownItem} onPress={() => { onChange(o); setOpen(false); }}>
              <Text style={s.dropdownItemText}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function ContinueButton({ onPress, label }) {
  const text = label || 'Next Step';
  const hasArrow = !label || label.includes('→');
  return (
    <TouchableOpacity style={s.continueBtn} onPress={onPress} activeOpacity={0.85}>
      <View style={s.continueBtnContent}>
        <Text style={s.continueBtnText}>{text}</Text>
        {hasArrow && <Text style={s.continueBtnArrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );
}

function FooterLogin({ onLogin }) {
  return (
    <View style={s.footerRow}>
      <Text style={s.footerText}>Already have an account? </Text>
      <TouchableOpacity onPress={onLogin}>
        <Text style={s.footerLink}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Step 1: Professional Details ─────────────────────────────────────────────────

function StepProfessionalDetails({ onNext, onBack, onLogin }) {
  const [form, setForm] = useState({ fullName: '', employeeId: '', wing: '' });
  const [errors, setErrors] = useState({});
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 3) newErrors.fullName = 'Name must be at least 3 characters';
    
    if (!form.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    else if (form.employeeId.trim().length < 3) newErrors.employeeId = 'Employee ID must be at least 3 characters';
    
    if (!form.wing) newErrors.wing = 'Please select your wing assignment';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={s.screen}>
      <BackButton onPress={onBack} />
      <ProgressBar current={1} total={4} label="Step 1: Professional Details" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Staff Credentials</Text>
          <View style={s.infoCard}>
            <Text style={s.infoTitle}>Professional Details</Text>
            <Text style={s.infoText}>Please provide your official employment information to proceed with your caregiver profile.</Text>
          </View>
          <InputField label="Full Name" placeholder="e.g. Sarah Jenkins" value={form.fullName} onChangeText={set('fullName')} icon="👤" />
          {errors.fullName && <Text style={s.errorMsg}>{errors.fullName}</Text>}
          
          <InputField label="Employee ID" placeholder="Enter your unique ID" value={form.employeeId} onChangeText={set('employeeId')} icon="🪪" />
          {errors.employeeId && <Text style={s.errorMsg}>{errors.employeeId}</Text>}
          
          <DropdownField
            label="Wing Assignment"
            value={form.wing}
            onChange={set('wing')}
            options={['Wing A', 'Wing B', 'Wing C', 'Wing D', 'All Wings']}
            placeholder="Select your assigned wing"
          />
          {errors.wing && <Text style={s.errorMsg}>{errors.wing}</Text>}
          
          <View style={s.noteCard}>
            <Text style={s.noteText}>🔒 Your credentials will be verified by the facility administrator within 24 hours.</Text>
          </View>
          <ContinueButton onPress={() => validate() && onNext(form)} />
          <FooterLogin onLogin={onLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Step 3: Create Password ───────────────────────────────────────────────────

function PasswordStrength({ password }) {
  if (!password) return null;
  const getStrength = () => {
    if (password.length < 6) return { level: 1, label: 'WEAK', color: '#EF5350' };
    if (password.length < 10) return { level: 2, label: 'MEDIUM', color: '#FFA726' };
    return { level: 3, label: 'STRONG', color: '#66BB6A' };
  };
  const { level, label, color } = getStrength();
  return (
    <View style={{ marginTop: -10, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
        {[1,2,3].map(i => (
          <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= level ? color : '#E3F2FD' }} />
        ))}
      </View>
      <Text style={{ fontSize: 11, color, fontWeight: '700' }}>PASSWORD STRENGTH  <Text style={{ fontWeight: '400', color: '#90A4AE' }}>  {label}</Text></Text>
    </View>
  );
}

function StepCreatePassword({ onNext, onBack, onLogin }) {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  
  const requirements = [
    { text: 'At least 8 characters long', met: form.password.length >= 8 },
    { text: 'Includes uppercase & lowercase letters', met: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) },
    { text: 'Includes at least one number', met: /[0-9]/.test(form.password) },
    { text: 'Includes one special character (@#$!)', met: /[^a-zA-Z0-9]/.test(form.password) },
  ];

  const allRequirementsMet = requirements.every(r => r.met);

  const validate = () => {
    const newErrors = {};
    if (!form.password) newErrors.password = 'Password is required';
    else if (!allRequirementsMet) newErrors.password = 'Password does not meet all requirements';
    
    if (!form.confirm) newErrors.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={s.screen}>
      <BackButton onPress={onBack} />
      <ProgressBar current={2} total={4} label="Step 2: Create Password" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Register: Create Password</Text>
          <View style={s.infoCard}>
            <Text style={s.infoTitle}>Secure Your Account</Text>
            <Text style={s.infoText}>Set a strong password to protect your personal caregiver profile and sensitive patient data.</Text>
          </View>
          <InputField label="Create Password" placeholder="••••••••" value={form.password} onChangeText={set('password')} secureTextEntry />
          {errors.password && <Text style={s.errorMsg}>{errors.password}</Text>}
          <PasswordStrength password={form.password} />
          
          <InputField label="Confirm Password" placeholder="••••••••" value={form.confirm} onChangeText={set('confirm')} secureTextEntry />
          {errors.confirm && <Text style={s.errorMsg}>{errors.confirm}</Text>}

          {/* Requirements */}
          <View style={s.requirementsCard}>
            <Text style={s.requirementsTitle}>SECURITY REQUIREMENTS</Text>
            {requirements.map((r, i) => (
              <View key={i} style={s.requirementRow}>
                <Text style={{ color: r.met ? '#66BB6A' : '#90A4AE', fontSize: 13, marginRight: 8 }}>
                  {r.met ? '✅' : '○'}
                </Text>
                <Text style={{ fontSize: 12, color: r.met ? '#2E7D32' : '#78909C' }}>{r.text}</Text>
              </View>
            ))}
          </View>

          <ContinueButton onPress={() => validate() && onNext(form)} />
          <FooterLogin onLogin={onLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Step 4: Shift & Escalation ───────────────────────────────────────────────

function StepShiftEscalation({ onNext, onBack, onLogin }) {
  const [shift, setShift] = useState('day');
  const [onCall, setOnCall] = useState(false);
  const [escalation, setEscalation] = useState('5');

  const shifts = [
    { id: 'day', label: 'Day Shift', time: '6:00 AM - 2:00 PM' },
    { id: 'evening', label: 'Evening Shift', time: '2:00 PM - 10:00 PM' },
    { id: 'night', label: 'Night Shift', time: '10:00 PM - 6:00 AM' },
  ];

  return (
    <View style={s.screen}>
      <BackButton onPress={onBack} />
      <ProgressBar current={3} total={4} label="Step 3: Shift Settings & Escalation" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Caregiver Registration</Text>
        <Text style={s.subtitle}>Configure your availability and response protocols.</Text>

        <Text style={s.sectionLabel}>Primary Shift Selection</Text>

        {shifts.map(sh => (
          <TouchableOpacity
            key={sh.id}
            style={[s.shiftCard, shift === sh.id && s.shiftCardSelected]}
            onPress={() => setShift(sh.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[s.shiftLabel, shift === sh.id && { color: '#2196F3' }]}>{sh.label}</Text>
              <Text style={s.shiftTime}>{sh.time}</Text>
            </View>
            <View style={[s.shiftRadio, shift === sh.id && s.shiftRadioSelected]}>
              {shift === sh.id && <View style={s.shiftRadioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* On-Call */}
        <View style={s.onCallRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.onCallLabel}>On-Call Availability</Text>
            <Text style={s.onCallDesc}>Be available for emergency assignments</Text>
          </View>
          <Switch
            value={onCall}
            onValueChange={setOnCall}
            trackColor={{ false: '#E3F2FD', true: '#90CAF9' }}
            thumbColor={onCall ? '#2196F3' : '#fff'}
          />
        </View>

        {/* Escalation */}
        <Text style={s.sectionLabel}>Escalation Rules</Text>
        <View style={s.escalationCard}> 
          <Text style={s.escalationLabel}>TRIGGER CONDITION</Text>
          <DropdownField
            value={`If unacknowledged for ${escalation} mins`}
            onChange={(v) => setEscalation(v)}
            options={['If unacknowledged for 5 mins', 'If unacknowledged for 10 mins', 'If unacknowledged for 15 mins']}
          />
        </View>

        <ContinueButton onPress={() => onNext({ shift, onCall, escalation })} />
        <FooterLogin onLogin={onLogin} />
      </ScrollView>
    </View>
  );
}

// ─── Step 5: Verify Credentials ───────────────────────────────────────────────

function StepVerifyCredentials({ onNext, onBack, onLogin }) {
  const [photoSelected, setPhotoSelected] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!photoSelected) {
      setError('Please upload a photo of your Staff ID or professional license');
      return;
    }
    setError('');
    onNext({ photoSelected });
  };

  return (
    <View style={s.screen}>
      <BackButton onPress={onBack} />
      <ProgressBar current={4} total={4} label="Step 4: Shift Settings & Escalation" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Verify Credentials</Text>
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>Primary Shift Selection</Text>
          <Text style={s.infoText}>Please upload a photo of your Staff ID or professional license for verification. This helps us ensure the security of our residents.</Text>
        </View>

        {/* Upload area */}
        <View style={s.uploadArea}>
          {photoSelected ? (
            <View style={s.uploadSelected}>
              <Text style={{ fontSize: 40 }}>🪪</Text>
              <Text style={s.uploadSelectedText}>Document selected ✓</Text>
            </View>
          ) : (
            <View style={s.uploadEmpty}>
              <Text style={{ fontSize: 40, opacity: 0.3 }}>📄</Text>
              <Text style={s.uploadEmptyText}>No document selected</Text>
              <Text style={s.uploadHint}>Your ID photo will appear here</Text>
            </View>
          )}
        </View>

        {error && <Text style={s.errorMsg}>{error}</Text>}

        {/* View requirements */}
        <TouchableOpacity style={s.requirementsBtn}>
          <Text style={s.requirementsBtnText}>View Requirements</Text>
        </TouchableOpacity>

        {/* Upload buttons */}
        <View style={s.uploadBtnsRow}>
          <TouchableOpacity style={s.uploadBtn} onPress={() => { setPhotoSelected(true); setError(''); }}>
            <Text style={{ fontSize: 20, marginBottom: 4 }}>📷</Text>
            <Text style={s.uploadBtnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.uploadBtn} onPress={() => { setPhotoSelected(true); setError(''); }}>
            <Text style={{ fontSize: 20, marginBottom: 4 }}>🖼️</Text>
            <Text style={s.uploadBtnText}>From Gallery</Text>
          </TouchableOpacity>
        </View>

        <ContinueButton onPress={handleContinue} />
        <FooterLogin onLogin={onLogin} />
      </ScrollView>
    </View>
  );
}

// ─── Step 6: Email Verification ───────────────────────────────────────────────

const CODE_LENGTH = 6;

function StepEmailVerification({ onComplete, onBack, email = 'caregiv...@example.com' }) {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (val, index) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');
    if (digit && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleVerify = () => {
    if (code.join('').length < CODE_LENGTH) {
      setError('Please enter the complete 6-digit code.');
      shake();
      return;
    }
    onComplete(code.join(''));
  };

  return (
    <View style={s.screen}>
      <BackButton onPress={onBack} />
      <ProgressBar current={4} total={4} label="Step 4: Shift Settings & Escalation" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Shield icon */}
        <View style={s.shieldWrap}>
          <View style={s.shieldIcon}>
            <Text style={{ fontSize: 36 }}>🛡️</Text>
          </View>
        </View>

        <Text style={s.title}>Register: Email Verification</Text>
        <Text style={s.subtitle}>Step 3 of 3: Final Security Check</Text>

        <View style={s.infoCard}>
          <Text style={s.infoText}>
            Check your inbox{'\n'}We've sent a six-digit code to{'\n'}
            <Text style={{ color: '#2196F3', fontWeight: '600' }}>{email}</Text>
          </Text>
        </View>

        {/* Code inputs */}
        <Animated.View style={[s.codeRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array(CODE_LENGTH).fill(0).map((_, i) => (
            <TextInput
              key={i}
              ref={ref => inputRefs.current[i] = ref}
              style={[s.codeBox, code[i] ? s.codeBoxFilled : null]}
              value={code[i]}
              onChangeText={val => handleChange(val, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        <TouchableOpacity style={s.continueBtn} onPress={handleVerify} activeOpacity={0.85}>
          <Text style={s.continueBtnText}>Verify & Complete</Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={s.resendRow}>
          <Text style={s.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity disabled={!canResend}>
            <Text style={[s.resendLink, !canResend && { color: '#90A4AE' }]}>
              Resend in {String(Math.floor(timer/60)).padStart(2,'0')}:{String(timer%60).padStart(2,'0')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: '#90A4AE' }}>
            ● Resend available in{' '}
            <Text style={{ color: '#EF5350' }}>00:{String(timer).padStart(2,'0')}</Text>
          </Text>
          <TouchableOpacity style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#2196F3', fontWeight: '600' }}>✏️ Change Email</Text>
          </TouchableOpacity>
        </View>

        <View style={s.secureNote}>
          <Text style={s.secureNoteText}>🔐 SECURE REGISTRATION PROTOCOL</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Main Staff Register Screen ────────────────────────────────────────────────

export default function StaffRegisterScreen({ onComplete, onLogin, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const handleNext = (stepData) => {
    setData(d => ({ ...d, ...stepData }));
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else setStep(s => s - 1);
  };

  if (step === 1) return <StepProfessionalDetails onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 2) return <StepCreatePassword onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 3) return <StepShiftEscalation onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 4) return <StepVerifyCredentials onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 5) return <StepEmailVerification onComplete={(code) => onComplete({ ...data, code })} onBack={handleBack} email={data.email} />;

  return null;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F7FF' },
  backBtn: { position: "absolute", top: 30, left: 10, padding: 8, zIndex: 10 },
  backArrow: { fontSize: 30, color: "#1565C0", fontWeight: "600" },
  progressWrap: { paddingHorizontal: 24, paddingTop: 100, paddingBottom: 8 },
progressLabel: { fontSize: 12, color: '#90CAF9', marginBottom: 6 },
progressCounter: { position: 'absolute', right: 24, top: 100, fontSize: 12, color: '#90CAF9' },
  progressTrack: { flexDirection: 'row', gap: 4 },
  progressSegment: { flex: 1, height: 4, borderRadius: 2 },
  progressActive: { backgroundColor: '#2196F3' },
  progressInactive: { backgroundColor: '#E3F2FD' },
  scroll: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  title: {
    fontSize: 24, fontWeight: '700', color: '#1565C0',
    textAlign: 'center', marginBottom: 8, marginTop: 8,
  },
  subtitle: {
    fontSize: 13, color: '#5B8DB8', textAlign: 'center',
    marginBottom: 20, lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: '#1565C0',
    marginBottom: 10, marginTop: 4,
  },

  // Info card
  infoCard: {
    backgroundColor: '#E3F2FD', borderRadius: 14,
    padding: 14, marginBottom: 20,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1565C0', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#5B8DB8', lineHeight: 19 },

  // Note card
  noteCard: {
    backgroundColor: '#FFF3E0', borderRadius: 12,
    padding: 12, marginBottom: 20,
    borderLeftWidth: 3, borderLeftColor: '#FF9800',
  },
  noteText: { fontSize: 12, color: '#E65100', lineHeight: 18 },

  // Role cards
  roleCard: {
    backgroundColor: 'white', borderRadius: 16,
    padding: 16, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: '#E3F2FD',
    elevation: 2, overflow: 'hidden',
  },
  roleCardSelected: { borderColor: '#2196F3', backgroundColor: '#F0F7FF' },
  roleIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  roleIconText: { fontSize: 20 },
  roleTitle: { fontSize: 15, fontWeight: '700', color: '#1565C0', marginBottom: 3 },
  roleDesc: { fontSize: 12, color: '#78909C', lineHeight: 17 },
  roleCheck: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2196F3',
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  roleIllust: { position: 'absolute', right: 12, bottom: 8, opacity: 0.3 },

  // Input
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#1565C0', marginBottom: 7 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E3F2FD',
    paddingHorizontal: 14, height: 50,
  },
  inputFocused: { borderColor: '#2196F3', backgroundColor: '#F0F7FF' },
  inputIcon: { fontSize: 14, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A237E', paddingVertical: 0 },
  hintText: { fontSize: 11, color: '#90CAF9', marginTop: 4 },
  errorMsg: { fontSize: 12, color: '#EF5350', marginTop: -12, marginBottom: 12, marginLeft: 2 },
  dropdownSelected: { fontSize: 15, color: '#1A237E' },
  dropdownPlaceholder: { fontSize: 15, color: '#B0BEC5' },
  dropdown: {
    backgroundColor: 'white', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E3F2FD',
    marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F5F9FF',
  },
  dropdownItemText: { fontSize: 14, color: '#37474F' },

  // Shift cards
  shiftCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E3F2FD',
  },
  shiftCardSelected: { borderColor: '#2196F3', backgroundColor: '#F0F7FF' },
  shiftLabel: { fontSize: 14, fontWeight: '600', color: '#263238', marginBottom: 2 },
  shiftTime: { fontSize: 12, color: '#90A4AE' },
  shiftRadio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#BBDEFB',
    alignItems: 'center', justifyContent: 'center',
  },
  shiftRadioSelected: { borderColor: '#2196F3' },
  shiftRadioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#2196F3',
  },
  onCallRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#E3F2FD',
  },
  onCallLabel: { fontSize: 14, fontWeight: '600', color: '#263238', marginBottom: 2 },
  onCallDesc: { fontSize: 12, color: '#90A4AE' },
  escalationCard: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#E3F2FD',
  },
  escalationLabel: { fontSize: 11, fontWeight: '700', color: '#90A4AE', marginBottom: 8, letterSpacing: 0.5 },

  // Requirements
  requirementsCard: {
    backgroundColor: '#F5F9FF', borderRadius: 12,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#E3F2FD',
  },
  requirementsTitle: {
    fontSize: 11, fontWeight: '700', color: '#90A4AE',
    marginBottom: 10, letterSpacing: 0.5,
  },
  requirementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },

  // Upload
  uploadArea: {
    backgroundColor: 'white', borderRadius: 16,
    borderWidth: 2, borderColor: '#E3F2FD',
    borderStyle: 'dashed', padding: 24,
    alignItems: 'center', marginBottom: 12,
    minHeight: 140,
  },
  uploadEmpty: { alignItems: 'center' },
  uploadEmptyText: { fontSize: 14, color: '#90A4AE', fontWeight: '500', marginTop: 8 },
  uploadHint: { fontSize: 12, color: '#BBDEFB', marginTop: 4 },
  uploadSelected: { alignItems: 'center' },
  uploadSelectedText: { fontSize: 14, color: '#66BB6A', fontWeight: '600', marginTop: 8 },
  requirementsBtn: {
    alignSelf: 'center', borderWidth: 1.5, borderColor: '#2196F3',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20, marginBottom: 16,
  },
  requirementsBtnText: { fontSize: 13, color: '#2196F3', fontWeight: '600' },
  uploadBtnsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  uploadBtn: {
    flex: 1, backgroundColor: 'white',
    borderRadius: 14, padding: 16,
    alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E3F2FD',
    elevation: 2,
  },
  uploadBtnText: { fontSize: 13, color: '#5B8DB8', fontWeight: '600' },

  // Shield
  shieldWrap: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
  shieldIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
  },

  // Code
  codeRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 8, marginBottom: 20,
  },
  codeBox: {
    width: 44, height: 54, borderRadius: 12,
    borderWidth: 2, borderColor: '#E3F2FD',
    backgroundColor: 'white', textAlign: 'center',
    fontSize: 22, fontWeight: '700', color: '#1565C0',
  },
  codeBoxFilled: { borderColor: '#2196F3', backgroundColor: '#F0F7FF' },
  errorText: { color: '#EF5350', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  resendText: { fontSize: 13, color: '#90A4AE' },
  resendLink: { fontSize: 13, color: '#2196F3', fontWeight: '600' },
  secureNote: {
    alignItems: 'center', marginTop: 20,
    borderTopWidth: 1, borderTopColor: '#E3F2FD', paddingTop: 12,
  },
  secureNoteText: { fontSize: 10, color: '#90CAF9', letterSpacing: 0.5, fontWeight: '600' },

  // Continue button
  continueBtn: {
    backgroundColor: '#2196F3', borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2196F3', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  continueBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueBtnText: { color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  continueBtnArrow: { color: 'white', fontSize: 27, fontWeight: '700', lineHeight: 28, transform: [{ translateY: -5 }] },

  // Footer
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 13, color: '#90A4AE' },
  footerLink: { fontSize: 13, color: '#2196F3', fontWeight: '700' },
});