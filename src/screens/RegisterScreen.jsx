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
  FlatList,
} from 'react-native';
const { width } = Dimensions.get('window');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  return (
    <View style={pb.container}>
      <Text style={pb.label}>Step {current}: Role Selection</Text>
      <Text style={pb.counter}>{current} of {total}</Text>
      <View style={pb.track}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[pb.segment, i < current ? pb.segmentActive : pb.segmentInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const pb = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 90, paddingBottom: 16 },
  label: { fontSize: 12, color: '#90CAF9', marginBottom: 6 },
  counter: { position: 'absolute', right: 24, top: 90, fontSize: 12, color: '#90CAF9' },
  track: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  segmentActive: { backgroundColor: '#2196F3' },
  segmentInactive: { backgroundColor: '#E3F2FD' },
});

function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backBtn}>
      <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity>
  );
}

function InputField({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry, optional }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {optional && <Text style={styles.optional}> Optional</Text>}
      </Text>
      <View style={[styles.inputWrapper, focused && styles.inputFocused]}>
        <TextInput
          style={styles.input}
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
    </View>
  );
}

function PasswordStrength({ password }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '#E3F2FD' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: '#EF5350' };
    if (password.length < 10) return { level: 2, label: 'Medium', color: '#FFA726' };
    return { level: 3, label: 'Strong', color: '#66BB6A' };
  };
  const { level, label, color } = getStrength();
  if (!password) return null;
  return (
    <View style={{ marginTop: -8, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map(i => (
          <View key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            backgroundColor: i <= level ? color : '#E3F2FD'
          }} />
        ))}
      </View>
      <Text style={{ fontSize: 11, color }}>{label}</Text>
    </View>
  );
}

function NextButton({ onPress, label }) {
  const text = label || 'Next Step';
  const hasArrow = !label || label.includes('→');
  return (
    <TouchableOpacity style={styles.nextBtn} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.nextBtnContent}>
        <Text style={styles.nextBtnText}>{text}</Text>
        {hasArrow && <Text style={styles.nextBtnArrow}>→</Text>}
      </View>
    </TouchableOpacity>
  );
}

function FooterLink({ onLogin }) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>Already have an account? </Text>
      <TouchableOpacity onPress={onLogin}>
        <Text style={styles.footerLink}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Step 1: Personal Info ─────────────────────────────────────────────────────

function StepPersonalInfo({ onNext, onBack, onLogin }) {
  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) newErrors.firstName = 'First name must be at least 2 characters';
    
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
    
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address';
    
    if (form.phone && !/^[\d\s\-\(\)]+$/.test(form.phone)) newErrors.phone = 'Please enter a valid phone number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={styles.stepContainer}>
      <BackButton onPress={onBack} />
      <ProgressBar current={1} total={4} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Family Member</Text>

          <InputField label="First Name" placeholder="Enter your first name"
            value={form.firstName} onChangeText={set('firstName')} />
          {errors.firstName && <Text style={styles.errorMsg}>{errors.firstName}</Text>}
          
          <InputField label="Middle Name" placeholder="Optional"
            value={form.middleName} onChangeText={set('middleName')} optional />
          
          <InputField label="Last Name" placeholder="Enter your last name"
            value={form.lastName} onChangeText={set('lastName')} />
          {errors.lastName && <Text style={styles.errorMsg}>{errors.lastName}</Text>}
          
          <InputField label="Email Address" placeholder="example@email.com"
            value={form.email} onChangeText={set('email')} keyboardType="email-address" />
          {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
          
          <InputField label="Phone Number" placeholder="(555) 000-0000"
            value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
          {errors.phone && <Text style={styles.errorMsg}>{errors.phone}</Text>}

          <NextButton onPress={() => validate() && onNext(form)} />
          <FooterLink onLogin={onLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Step 3: Password + Access Code ───────────────────────────────────────────

function StepPassword({ onNext, onBack, onLogin }) {
  const [form, setForm] = useState({
    password: '', confirmPassword: '', accessCode: '', relationship: '',
  });
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Grandchild', 'Other'];
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const newErrors = {};
    
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password)) 
      newErrors.password = 'Password must have uppercase and lowercase letters';
    else if (!/[0-9]/.test(form.password)) 
      newErrors.password = 'Password must include at least one number';
    
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!form.accessCode.trim()) newErrors.accessCode = 'Access code is required';
    
    if (!form.relationship) newErrors.relationship = 'Please select your relationship';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={styles.stepContainer}>
      <BackButton onPress={onBack} />
      <ProgressBar current={2} total={4} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Family Member</Text>

          <InputField label="Password" placeholder="••••••••"
            value={form.password} onChangeText={set('password')} secureTextEntry />
          {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}
          <PasswordStrength password={form.password} />

          <InputField label="Confirm Password" placeholder="••••••••"
            value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry />
          {errors.confirmPassword && <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>}
          <PasswordStrength password={form.confirmPassword} />

          <InputField label="Facility Access Code" placeholder="e.g. CS-1234"
            value={form.accessCode} onChangeText={set('accessCode')} />
          {errors.accessCode && <Text style={styles.errorMsg}>{errors.accessCode}</Text>}
          <Text style={styles.hintText}>Provided by the CareSync coordinator.</Text>

          {/* Relationship Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relationship to Resident</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, { justifyContent: 'space-between' }]}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={form.relationship ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                {form.relationship || 'Select relationship'}
              </Text>
              <Text style={{ color: '#90CAF9' }}>{dropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={styles.dropdown}>
                {relationships.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={styles.dropdownItem}
                    onPress={() => { set('relationship')(r); setDropdownOpen(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {errors.relationship && <Text style={styles.errorMsg}>{errors.relationship}</Text>}

          <NextButton onPress={() => validate() && onNext(form)} />
          <FooterLink onLogin={onLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Step 4: Link Resident ─────────────────────────────────────────────────────

const MOCK_RESIDENTS = [
  { id: '1', name: 'Eleanor Roosevelt', room: 'Room 102-A' },
  { id: '2', name: 'Arthur Miller', room: 'Room 135' },
  { id: '3', name: 'Martha Stewart', room: 'Room 208-B' },
  { id: '4', name: 'Roosevelt Jr.', room: 'Room 110' },
  { id: '5', name: 'Robert Frost', room: 'Room 214' },
];

function ResidentCard({ resident, onLink }) {
  const initials = resident.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <View style={styles.residentCard}>
      <View style={styles.residentAvatar}>
        <Text style={styles.residentInitials}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.residentName}>{resident.name}</Text>
        <Text style={styles.residentRoom}>{resident.room}</Text>
      </View>
      <TouchableOpacity style={styles.linkBtn} onPress={() => onLink(resident)}>
        <Text style={styles.linkBtnText}>Link</Text>
      </TouchableOpacity>
    </View>
  );
}

function StepLinkResident({ onNext, onBack, onLogin }) {
  const [query, setQuery] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [linked, setLinked] = useState(null);
  const [errors, setErrors] = useState('');

  const filtered = MOCK_RESIDENTS.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleContinue = () => {
    if (!agreed) {
      setErrors('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    if (!linked) {
      setErrors('Please select a resident to link');
      return;
    }
    setErrors('');
    onNext({ linked });
  };

  return (
    <View style={styles.stepContainer}>
      <BackButton onPress={onBack} />
      <ProgressBar current={3} total={4} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>Link Your Resident</Text>
        <Text style={styles.stepSubtitle}>Search for your loved one by their name</Text>

        {/* Search box */}
        <View style={[styles.inputWrapper, { marginBottom: 16 }]}>
          <Text style={{ color: '#B0BEC5', marginRight: 8, fontSize: 14 }}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Roosevelt"
            placeholderTextColor="#B0BEC5"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Results */}
        {query.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsLabel}>SEARCH RESULTS</Text>
              <Text style={styles.resultsCount}>{filtered.length} found</Text>
            </View>
            {filtered.map(r => (
              <ResidentCard
                key={r.id}
                resident={r}
                onLink={(res) => { setLinked(res); setErrors(''); }}
              />
            ))}
          </View>
        )}

        {linked && (
          <View style={styles.linkedBanner}>
            <Text style={styles.linkedText}>✓ Linked to {linked.name}</Text>
          </View>
        )}

        {/* Terms checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree to the{' '}
            <Text style={styles.checkboxLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.checkboxLink}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        {errors && <Text style={styles.errorMsg}>{errors}</Text>}

        <NextButton
          onPress={handleContinue}
          label="Send Verification Code"
        />
        <FooterLink onLogin={onLogin} />
      </ScrollView>
    </View>
  );
}

// ─── Step 5: Verify Email ──────────────────────────────────────────────────────

const CODE_LENGTH = 6;

function StepVerifyEmail({ onVerified, onBack, email = 'n...a@example.com' }) {
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
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
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
    const full = code.join('');
    if (full.length < CODE_LENGTH) {
      setError('Please enter the complete 6-digit code.');
      shake();
      return;
    }
    onVerified(full);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    setCode(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.stepContainer}>
      <BackButton onPress={onBack} />

      {/* Progress bar */}
      <View style={vStyles.progressWrap}>
        <Text style={vStyles.progressLabel}>Step 4: Email Verification</Text>
        <Text style={vStyles.progressCounter}>4 of 4</Text>
        <View style={vStyles.track}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[vStyles.segment, vStyles.segmentActive]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={vStyles.title}>Verify Your Email</Text>
        <Text style={vStyles.subtitle}>
          Enter the 6-digit code sent to your email{' '}
          <Text style={vStyles.emailHighlight}>({email})</Text>
          {' '}to verify your CareSync account.
        </Text>

        {/* Code inputs */}
        <Animated.View style={[vStyles.codeRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array(CODE_LENGTH).fill(0).map((_, i) => (
            <TextInput
              key={i}
              ref={ref => inputRefs.current[i] = ref}
              style={[vStyles.codeBox, code[i] ? vStyles.codeBoxFilled : null]}
              value={code[i]}
              onChangeText={val => handleChange(val, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {error ? <Text style={vStyles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.nextBtn} onPress={handleVerify} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Verify & Continue</Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={vStyles.resendRow}>
          <Text style={vStyles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[vStyles.resendLink, !canResend && vStyles.resendDisabled]}>
              Resend in {String(Math.floor(timer / 60)).padStart(2,'0')}:{String(timer % 60).padStart(2,'0')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const vStyles = StyleSheet.create({
  progressWrap: {
    paddingHorizontal: 24, paddingTop: 90, paddingBottom: 16,
  },
  progressLabel: { fontSize: 12, color: '#90CAF9', marginBottom: 6 },
  progressCounter: { position: 'absolute', right: 24, top: 90, fontSize: 12, color: '#90CAF9' },
  track: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  segmentActive: { backgroundColor: '#2196F3' },
  title: {
    fontSize: 26, fontWeight: '700', color: '#1565C0',
    textAlign: 'center', marginBottom: 12, marginTop: 16,
  },
  subtitle: {
    fontSize: 14, color: '#5B8DB8', textAlign: 'center',
    lineHeight: 22, marginBottom: 32,
  },
  emailHighlight: { color: '#2196F3', fontWeight: '600' },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  codeBox: {
    width: 46, height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E3F2FD',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1565C0',
  },
  codeBoxFilled: {
    borderColor: '#2196F3',
    backgroundColor: '#F0F7FF',
  },
  errorText: {
    color: '#EF5350', fontSize: 13,
    textAlign: 'center', marginBottom: 12,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: { fontSize: 13, color: '#90A4AE' },
  resendLink: { fontSize: 13, color: '#2196F3', fontWeight: '600' },
  resendDisabled: { color: '#90A4AE' },
});

// ─── Main Registration Screen ──────────────────────────────────────────────────

export default function RegisterScreen({ onComplete, onLogin }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const handleNext = (stepData) => {
    setData(d => ({ ...d, ...stepData }));
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 1) onLogin();
    else setStep(s => s - 1);
  };

  if (step === 1) return <StepPersonalInfo onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 2) return <StepPassword onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 3) return <StepLinkResident onNext={handleNext} onBack={handleBack} onLogin={onLogin} />;
  if (step === 4) return <StepVerifyEmail onVerified={(code) => onComplete({ ...data, code })} onBack={handleBack} email={data.email} />;

  return null;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  backBtn: {
  position: 'absolute',
  top: 30,
  left: 10,
  zIndex: 10,
  padding: 8,
},
backArrow: {
  fontSize: 30,
  color: '#1565C0',
  fontWeight: '600',
},
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#5B8DB8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  // Role cards
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E3F2FD',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  roleCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#F0F7FF',
  },
  roleIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  roleIcon: { fontSize: 20 },
  roleTextWrap: { flex: 1 },
  roleTitle: {
    fontSize: 15, fontWeight: '700', color: '#1565C0', marginBottom: 3,
  },
  roleDesc: {
    fontSize: 12, color: '#78909C', lineHeight: 17,
  },
  roleCheck: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2196F3',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
  roleIllustration: {
    position: 'absolute',
    right: 12, bottom: 8,
    opacity: 0.3,
  },

  // Input
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13, fontWeight: '600', color: '#1565C0', marginBottom: 7,
  },
  optional: { color: '#90CAF9', fontWeight: '400' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E3F2FD',
    paddingHorizontal: 14,
    height: 50,
  },
  inputFocused: { borderColor: '#2196F3', backgroundColor: '#F0F7FF' },
  input: { flex: 1, fontSize: 15, color: '#1A237E', paddingVertical: 0 },
  hintText: {
    fontSize: 11, color: '#90CAF9', marginTop: -10, marginBottom: 14, marginLeft: 2,
  },
  errorMsg: { fontSize: 12, color: '#EF5350', marginTop: -12, marginBottom: 12, marginLeft: 2 },

  // Dropdown
  dropdownSelected: { fontSize: 15, color: '#1A237E' },
  dropdownPlaceholder: { fontSize: 15, color: '#B0BEC5' },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E3F2FD',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F5F9FF',
  },
  dropdownItemText: { fontSize: 14, color: '#37474F' },

  // Residents
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E3F2FD',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultsLabel: { fontSize: 11, fontWeight: '700', color: '#90A4AE', letterSpacing: 0.5 },
  resultsCount: { fontSize: 11, color: '#2196F3', fontWeight: '600' },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F9FF',
  },
  residentAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#BBDEFB',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  residentInitials: { fontSize: 13, fontWeight: '700', color: '#1565C0' },
  residentName: { fontSize: 14, fontWeight: '600', color: '#263238' },
  residentRoom: { fontSize: 12, color: '#90A4AE' },
  linkBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 6, paddingHorizontal: 16,
    borderRadius: 20,
  },
  linkBtnText: { color: 'white', fontSize: 13, fontWeight: '700' },
  linkedBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10, padding: 12,
    marginBottom: 14,
    borderLeftWidth: 3, borderLeftColor: '#66BB6A',
  },
  linkedText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: '#90CAF9',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  checkboxLabel: { flex: 1, fontSize: 12, color: '#78909C', lineHeight: 18 },
  checkboxLink: { color: '#2196F3', fontWeight: '600' },

  // Next button
  nextBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12,
    elevation: 5,
  },
  nextBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  nextBtnText: {
    color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 0.5,
  },
  nextBtnArrow: {
    color: 'white', fontSize: 27, fontWeight: '700', lineHeight: 28, transform: [{ translateY: -5 }],
  },

  // Footer
  footerRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  footerText: { fontSize: 13, color: '#90A4AE' },
  footerLink: { fontSize: 13, color: '#2196F3', fontWeight: '700' },
});