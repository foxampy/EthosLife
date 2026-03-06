import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import {
  Plus,
  Clock,
  Calendar,
  FileText,
  Activity,
  Pill,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Upload,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Bell,
  TrendingUp,
  TrendingDown,
  Brain,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Stethoscope,
  User,
  MapPin,
  Phone,
  ExternalLink,
  Filter,
  Download,
  Printer,
  Settings,
  Shield,
  Sparkles,
  Zap,
  History,
} from 'lucide-react';

// ===== Types =====

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'custom';
  timesPerDay: number;
  schedule: ('morning' | 'afternoon' | 'evening' | 'night')[];
  withFood: 'with' | 'without' | 'either';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  refillDate?: string;
  pillsRemaining: number;
  totalPills: number;
  instructions: string;
  color: string;
  shape: 'round' | 'oval' | 'capsule' | 'tablet';
}

interface ScheduledDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: 'morning' | 'afternoon' | 'evening' | 'night';
  scheduledTime: string;
  taken: boolean;
  takenAt?: string;
  skipped: boolean;
  withFood: 'with' | 'without' | 'either';
  color: string;
  pillsRemaining?: number;
}

interface SymptomEntry {
  id: string;
  type: string;
  subtype: string;
  bodyPart?: string;
  severity: number;
  duration: string;
  triggers?: string[];
  relievers?: string[];
  notes?: string;
  timestamp: string;
}

interface LabResult {
  id: string;
  testName: string;
  category: string;
  date: string;
  results: {
    name: string;
    value: number | string;
    unit: string;
    referenceRange: { min: number; max: number };
    status: 'normal' | 'high' | 'low' | 'critical';
  }[];
  labName: string;
  doctor: string;
  aiInterpretation?: string;
  notes?: string;
  fileUrl?: string;
}

interface HealthDocument {
  id: string;
  name: string;
  category: 'prescription' | 'lab' | 'discharge' | 'insurance' | 'vaccination' | 'other';
  uploadDate: string;
  fileSize: string;
  ocrText?: string;
  aiSummary?: string;
  sharedWith: string[];
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  phone?: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  preVisitChecklist?: string[];
  notes?: string;
}

interface VitalSigns {
  id: string;
  type: 'bp' | 'hr' | 'weight' | 'temp' | 'glucose' | 'spo2';
  value: number;
  value2?: number; // For BP systolic/diastolic
  unit: string;
  timestamp: string;
  notes?: string;
}

interface TimelineEvent {
  id: string;
  type: 'medication' | 'symptom' | 'appointment' | 'lab' | 'vital';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface MedicineState {
  medications: Medication[];
  todaySchedule: ScheduledDose[];
  symptoms: SymptomEntry[];
  labResults: LabResult[];
  documents: HealthDocument[];
  appointments: Appointment[];
  vitals: VitalSigns[];
  adherence: {
    weekly: number;
    monthly: number;
  };
}

// ===== Mock Data =====

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10',
    unit: 'mg',
    frequency: 'daily',
    timesPerDay: 1,
    schedule: ['morning'],
    withFood: 'either',
    startDate: '2024-01-15',
    prescribedBy: 'Dr. Sarah Johnson',
    refillDate: '2024-04-15',
    pillsRemaining: 12,
    totalPills: 90,
    instructions: 'Take once daily in the morning',
    color: '#e11d48',
    shape: 'round',
  },
  {
    id: '2',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500',
    unit: 'mg',
    frequency: 'daily',
    timesPerDay: 2,
    schedule: ['morning', 'evening'],
    withFood: 'with',
    startDate: '2024-02-01',
    prescribedBy: 'Dr. Michael Chen',
    refillDate: '2024-04-01',
    pillsRemaining: 45,
    totalPills: 60,
    instructions: 'Take with meals to reduce stomach upset',
    color: '#059669',
    shape: 'oval',
  },
  {
    id: '3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20',
    unit: 'mg',
    frequency: 'daily',
    timesPerDay: 1,
    schedule: ['night'],
    withFood: 'either',
    startDate: '2024-01-20',
    prescribedBy: 'Dr. Sarah Johnson',
    refillDate: '2024-05-20',
    pillsRemaining: 28,
    totalPills: 90,
    instructions: 'Take at bedtime',
    color: '#7c3aed',
    shape: 'tablet',
  },
  {
    id: '4',
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    dosage: '2000',
    unit: 'IU',
    frequency: 'daily',
    timesPerDay: 1,
    schedule: ['morning'],
    withFood: 'with',
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Emily Roberts',
    pillsRemaining: 85,
    totalPills: 100,
    instructions: 'Take with fatty meal for better absorption',
    color: '#f59e0b',
    shape: 'capsule',
  },
  {
    id: '5',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    dosage: '20',
    unit: 'mg',
    frequency: 'daily',
    timesPerDay: 1,
    schedule: ['morning'],
    withFood: 'without',
    startDate: '2024-03-01',
    prescribedBy: 'Dr. Michael Chen',
    refillDate: '2024-05-01',
    pillsRemaining: 8,
    totalPills: 30,
    instructions: 'Take 30 minutes before breakfast',
    color: '#0891b2',
    shape: 'capsule',
  },
];

const mockSymptoms: SymptomEntry[] = [
  {
    id: '1',
    type: 'Pain',
    subtype: 'Headache',
    bodyPart: 'head',
    severity: 4,
    duration: '2 hours',
    triggers: ['stress', 'screen time'],
    relievers: ['rest', 'water'],
    notes: 'Mild tension headache',
    timestamp: '2024-03-06T09:30:00',
  },
  {
    id: '2',
    type: 'Digestive',
    subtype: 'Bloating',
    bodyPart: 'abdomen',
    severity: 3,
    duration: '4 hours',
    triggers: ['dairy'],
    notes: 'After lunch',
    timestamp: '2024-03-05T14:00:00',
  },
  {
    id: '3',
    type: 'Neurological',
    subtype: 'Dizziness',
    severity: 2,
    duration: '10 minutes',
    notes: 'When standing up quickly',
    timestamp: '2024-03-04T08:15:00',
  },
];

const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    date: '2024-03-01',
    results: [
      { name: 'WBC', value: 7.2, unit: 'K/μL', referenceRange: { min: 4.5, max: 11.0 }, status: 'normal' },
      { name: 'RBC', value: 4.8, unit: 'M/μL', referenceRange: { min: 4.0, max: 5.5 }, status: 'normal' },
      { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceRange: { min: 12.0, max: 16.0 }, status: 'normal' },
      { name: 'Platelets', value: 285, unit: 'K/μL', referenceRange: { min: 150, max: 400 }, status: 'normal' },
    ],
    labName: 'Quest Diagnostics',
    doctor: 'Dr. Sarah Johnson',
    aiInterpretation: 'All values within normal range. No signs of anemia or infection.',
  },
  {
    id: '2',
    testName: 'Comprehensive Metabolic Panel',
    category: 'Chemistry',
    date: '2024-03-01',
    results: [
      { name: 'Glucose', value: 98, unit: 'mg/dL', referenceRange: { min: 70, max: 100 }, status: 'normal' },
      { name: 'BUN', value: 18, unit: 'mg/dL', referenceRange: { min: 7, max: 20 }, status: 'normal' },
      { name: 'Creatinine', value: 0.9, unit: 'mg/dL', referenceRange: { min: 0.6, max: 1.2 }, status: 'normal' },
      { name: 'eGFR', value: 92, unit: 'mL/min', referenceRange: { min: 90, max: 120 }, status: 'normal' },
      { name: 'Sodium', value: 142, unit: 'mEq/L', referenceRange: { min: 135, max: 145 }, status: 'normal' },
      { name: 'Potassium', value: 4.1, unit: 'mEq/L', referenceRange: { min: 3.5, max: 5.0 }, status: 'normal' },
    ],
    labName: 'Quest Diagnostics',
    doctor: 'Dr. Sarah Johnson',
    aiInterpretation: 'Excellent kidney function. Electrolytes well-balanced. Glucose well-controlled.',
  },
  {
    id: '3',
    testName: 'Lipid Panel',
    category: 'Cardiology',
    date: '2024-02-15',
    results: [
      { name: 'Total Cholesterol', value: 195, unit: 'mg/dL', referenceRange: { min: 0, max: 200 }, status: 'normal' },
      { name: 'LDL', value: 118, unit: 'mg/dL', referenceRange: { min: 0, max: 130 }, status: 'normal' },
      { name: 'HDL', value: 52, unit: 'mg/dL', referenceRange: { min: 40, max: 100 }, status: 'normal' },
      { name: 'Triglycerides', value: 125, unit: 'mg/dL', referenceRange: { min: 0, max: 150 }, status: 'normal' },
    ],
    labName: 'LabCorp',
    doctor: 'Dr. Sarah Johnson',
    aiInterpretation: 'Cholesterol levels optimal. Continue current statin therapy.',
  },
];

const mockDocuments: HealthDocument[] = [
  {
    id: '1',
    name: 'Prescription_Lisinopril_Mar2024.pdf',
    category: 'prescription',
    uploadDate: '2024-03-01',
    fileSize: '245 KB',
    ocrText: 'Lisinopril 10mg - Take once daily...',
    aiSummary: 'Blood pressure medication prescription from Dr. Johnson, valid for 90 days with 3 refills.',
    sharedWith: [],
  },
  {
    id: '2',
    name: 'LabResults_CBC_Mar2024.pdf',
    category: 'lab',
    uploadDate: '2024-03-02',
    fileSize: '1.2 MB',
    ocrText: 'Complete Blood Count results...',
    aiSummary: 'All blood values within normal ranges. No abnormalities detected.',
    sharedWith: ['dr.johnson@clinic.com'],
  },
  {
    id: '3',
    name: 'Discharge_Summary_Jan2024.pdf',
    category: 'discharge',
    uploadDate: '2024-01-20',
    fileSize: '3.5 MB',
    ocrText: 'Patient discharged in stable condition...',
    aiSummary: 'Routine procedure discharge summary. Follow-up in 2 weeks.',
    sharedWith: [],
  },
  {
    id: '4',
    name: 'Insurance_Card_2024.pdf',
    category: 'insurance',
    uploadDate: '2024-01-05',
    fileSize: '890 KB',
    sharedWith: [],
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Internal Medicine',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'City Medical Center',
    address: '123 Health St, Medical District',
    phone: '(555) 123-4567',
    reason: 'Annual Physical Exam',
    status: 'upcoming',
    preVisitChecklist: ['Fast 12 hours before', 'Bring medication list', 'Insurance card'],
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Endocrinology',
    date: '2024-03-20',
    time: '2:30 PM',
    location: 'Diabetes Care Center',
    address: '456 Wellness Ave',
    phone: '(555) 234-5678',
    reason: 'Diabetes Follow-up',
    status: 'upcoming',
    preVisitChecklist: ['Bring glucose log', 'Recent A1C results'],
  },
  {
    id: '3',
    doctorName: 'Dr. Emily Roberts',
    specialty: 'Cardiology',
    date: '2024-02-28',
    time: '11:00 AM',
    location: 'Heart Care Institute',
    reason: 'Routine Checkup',
    status: 'completed',
    notes: 'Blood pressure well controlled. Continue current medications.',
  },
];

// ===== Components =====

const MedicationCard: React.FC<{
  dose: ScheduledDose;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
}> = ({ dose, onTake, onSkip }) => {
  const isLowRefill = dose.pillsRemaining !== undefined && dose.pillsRemaining <= 10;
  
  return (
    <div className={`neu-card p-4 mb-3 transition-all ${
      dose.taken ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${dose.color}20` }}
          >
            <Pill className="w-6 h-6" style={{ color: dose.color }} />
          </div>
          <div>
            <h4 className="font-semibold text-ink">{dose.medicationName}</h4>
            <p className="text-sm text-ink-light">{dose.dosage}</p>
            {dose.withFood !== 'either' && (
              <p className="text-xs text-rose-600 mt-1">
                {dose.withFood === 'with' ? '🍽️ Take with food' : '⏰ Take on empty stomach'}
              </p>
            )}
            {dose.taken && dose.takenAt && (
              <p className="text-xs text-emerald-600 mt-1">
                ✓ Taken at {new Date(dose.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {!dose.taken && !dose.skipped && (
            <div className="flex space-x-2">
              <button
                onClick={() => onTake(dose.id)}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Take</span>
              </button>
              <button
                onClick={() => onSkip(dose.id)}
                className="px-3 py-1.5 bg-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-300 transition-colors"
              >
                Skip
              </button>
            </div>
          )}
          {dose.taken && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              Taken ✓
            </span>
          )}
          {dose.skipped && (
            <span className="px-3 py-1.5 bg-stone-200 text-stone-500 rounded-lg text-sm font-medium">
              Skipped
            </span>
          )}
          {isLowRefill && (
            <span className="flex items-center text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3 h-3 mr-1" />
              {dose.pillsRemaining} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const SymptomTracker: React.FC = () => {
  const [severity, setSeverity] = useState(5);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(mockSymptoms);
  const [showForm, setShowForm] = useState(false);

  const symptomTypes = [
    { id: 'pain', label: 'Pain', subtypes: ['Sharp', 'Dull', 'Burning', 'Throbbing', 'Aching'] },
    { id: 'digestive', label: 'Digestive', subtypes: ['Nausea', 'Bloating', 'Heartburn', 'Diarrhea', 'Constipation'] },
    { id: 'respiratory', label: 'Respiratory', subtypes: ['Cough', 'Shortness of breath', 'Wheezing', 'Congestion'] },
    { id: 'neurological', label: 'Neurological', subtypes: ['Headache', 'Dizziness', 'Numbness', 'Tingling'] },
    { id: 'other', label: 'Other', subtypes: ['Fatigue', 'Fever', 'Swelling', 'Rash'] },
  ];

  const bodyParts = [
    'Head', 'Neck', 'Chest', 'Back', 'Abdomen', 
    'Arms', 'Hands', 'Legs', 'Feet', 'Skin'
  ];

  const handleAddSymptom = () => {
    const newSymptom: SymptomEntry = {
      id: Date.now().toString(),
      type: selectedType,
      subtype: symptomTypes.find(t => t.id === selectedType)?.subtypes[0] || '',
      bodyPart: selectedBodyPart,
      severity,
      duration: 'Just started',
      timestamp: new Date().toISOString(),
    };
    setSymptoms([newSymptom, ...symptoms]);
    setShowForm(false);
    setSelectedType('');
    setSelectedBodyPart('');
    setSeverity(5);
  };

  const getSeverityColor = (s: number) => {
    if (s <= 3) return 'bg-emerald-500';
    if (s <= 6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <Activity className="w-5 h-5 mr-2 text-rose-500" />
          Symptom Tracker
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-rose-50/50 rounded-xl border border-rose-100">
          <h4 className="text-sm font-medium text-ink mb-3">Log New Symptom</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-light mb-1 block">Symptom Type</label>
              <div className="grid grid-cols-3 gap-2">
                {symptomTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-2 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedType === type.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-100 text-ink-light hover:bg-stone-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-ink-light mb-1 block">Body Location</label>
              <div className="flex flex-wrap gap-1">
                {bodyParts.map(part => (
                  <button
                    key={part}
                    onClick={() => setSelectedBodyPart(part)}
                    className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                      selectedBodyPart === part
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-100 text-ink-light hover:bg-stone-200'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-ink-light mb-1 block">
                Severity: <span className="font-semibold text-rose-600">{severity}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-xs text-ink-light mt-1">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>

            <button
              onClick={handleAddSymptom}
              disabled={!selectedType}
              className="w-full py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Symptom
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {symptoms.slice(0, 5).map(symptom => (
          <div key={symptom.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-ink">{symptom.subtype}</p>
              <p className="text-xs text-ink-light">
                {symptom.bodyPart} • {new Date(symptom.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-lg text-white text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
              {symptom.severity}/10
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HealthTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const filters = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'medication', label: 'Meds', icon: Pill },
    { id: 'symptom', label: 'Symptoms', icon: Activity },
    { id: 'appointment', label: 'Visits', icon: Stethoscope },
    { id: 'lab', label: 'Labs', icon: FileText },
  ];

  return (
    <div className="neu-card p-4">
      <h3 className="font-semibold text-ink mb-4 flex items-center">
        <History className="w-5 h-5 mr-2 text-rose-500" />
        Health Timeline
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center ${
              filter === f.id
                ? 'bg-rose-500 text-white'
                : 'bg-stone-100 text-ink-light hover:bg-stone-200'
            }`}
          >
            <f.icon className="w-3 h-3 mr-1" />
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredEvents.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: event.color + '20' }}
              >
                {event.icon}
              </div>
              {index < filteredEvents.length - 1 && (
                <div className="w-0.5 h-full bg-stone-200 mt-1 min-h-[24px]" />
              )}
            </div>
            <div className="flex-1 pb-3">
              <p className="text-sm font-medium text-ink">{event.title}</p>
              <p className="text-xs text-ink-light">{event.description}</p>
              <p className="text-xs text-stone-500 mt-1">
                {new Date(event.timestamp).toLocaleString([], { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LabResultsPanel: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [results] = useState<LabResult[]>(mockLabResults);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <Check className="w-4 h-4 text-emerald-500" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-amber-500" />;
      case 'low': return <TrendingDown className="w-4 h-4 text-amber-500" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <FileText className="w-5 h-5 mr-2 text-rose-500" />
          Lab Results
        </h3>
        <button className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors">
          <Upload className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {results.map(result => (
          <div 
            key={result.id} 
            onClick={() => setSelectedResult(result)}
            className="p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{result.testName}</p>
                <p className="text-xs text-ink-light">{result.labName}</p>
              </div>
              <span className="text-xs text-stone-500">
                {new Date(result.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {result.results.map((r, i) => (
                <span 
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'critical' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}
                >
                  {r.name}: {r.value} {r.unit}
                </span>
              ))}
            </div>
            {result.aiInterpretation && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-start">
                <Sparkles className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">{result.aiInterpretation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#e4dfd5] rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 neu-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">{selectedResult.testName}</h3>
              <button 
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedResult.results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-ink-light">
                      Ref: {r.referenceRange.min}-{r.referenceRange.max} {r.unit}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-semibold ${
                      r.status === 'normal' ? 'text-emerald-600' :
                      r.status === 'critical' ? 'text-rose-600' :
                      'text-amber-600'
                    }`}>
                      {r.value}
                    </span>
                    {getStatusIcon(r.status)}
                  </div>
                </div>
              ))}
            </div>

            {selectedResult.aiInterpretation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Brain className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-700">AI Interpretation</span>
                </div>
                <p className="text-sm text-blue-600">{selectedResult.aiInterpretation}</p>
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 py-2 bg-stone-200 text-ink rounded-lg text-sm font-medium hover:bg-stone-300 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center justify-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentsManager: React.FC = () => {
  const [documents, setDocuments] = useState<HealthDocument[]>(mockDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All', icon: FileText },
    { id: 'prescription', label: 'Prescriptions', icon: Pill },
    { id: 'lab', label: 'Lab Results', icon: Activity },
    { id: 'discharge', label: 'Discharge', icon: FileText },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'vaccination', label: 'Vaccines', icon: Shield },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.aiSummary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || FileText;
  };

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <FileText className="w-5 h-5 mr-2 text-rose-500" />
          Documents
        </h3>
        <button className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors">
          <Upload className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-light" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="neu-input pl-9 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
              selectedCategory === cat.id
                ? 'bg-rose-500 text-white'
                : 'bg-stone-100 text-ink-light hover:bg-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredDocs.map(doc => {
          const Icon = getCategoryIcon(doc.category);
          return (
            <div key={doc.id} className="flex items-start justify-between p-3 bg-stone-50 rounded-xl group">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{doc.name}</p>
                  <p className="text-xs text-ink-light">{doc.fileSize} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  {doc.aiSummary && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{doc.aiSummary}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-stone-200 rounded-lg">
                  <Download className="w-4 h-4 text-ink-light" />
                </button>
                <button className="p-1.5 hover:bg-stone-200 rounded-lg">
                  <Share2 className="w-4 h-4 text-ink-light" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AppointmentsPanel: React.FC = () => {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [showAddForm, setShowAddForm] = useState(false);

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status !== 'upcoming');

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-rose-500" />
          Appointments
        </h3>
        <button 
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        <p className="text-xs font-medium text-ink-light uppercase tracking-wide">Upcoming</p>
        {upcoming.map(apt => (
          <div key={apt.id} className="p-3 bg-rose-50 rounded-xl border border-rose-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{apt.doctorName}</p>
                <p className="text-xs text-rose-600">{apt.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-600">{apt.time}</p>
                <p className="text-xs text-ink-light">{new Date(apt.date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-xs text-ink-light mt-2 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {apt.location}
            </p>
            {apt.preVisitChecklist && apt.preVisitChecklist.length > 0 && (
              <div className="mt-2 pt-2 border-t border-rose-200">
                <p className="text-xs text-ink-light mb-1">Pre-visit:</p>
                <div className="flex flex-wrap gap-1">
                  {apt.preVisitChecklist.map((item, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-white rounded-full text-rose-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {past.length > 0 && (
          <>
            <p className="text-xs font-medium text-ink-light uppercase tracking-wide mt-4">Past</p>
            {past.map(apt => (
              <div key={apt.id} className="p-3 bg-stone-50 rounded-xl opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{apt.doctorName}</p>
                    <p className="text-xs text-ink-light">{apt.reason}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#e4dfd5] rounded-2xl max-w-md w-full p-6 neu-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Add Appointment</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Doctor Name" className="neu-input" />
              <input type="text" placeholder="Specialty" className="neu-input" />
              <input type="date" className="neu-input" />
              <input type="time" className="neu-input" />
              <input type="text" placeholder="Location" className="neu-input" />
              <input type="text" placeholder="Reason for visit" className="neu-input" />
            </div>
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-stone-200 text-ink rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HealthMetrics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('bp');

  const metrics = [
    { id: 'bp', label: 'Blood Pressure', unit: 'mmHg', icon: Heart, color: '#e11d48' },
    { id: 'weight', label: 'Weight', unit: 'kg', icon: Activity, color: '#059669' },
    { id: 'temp', label: 'Temperature', unit: '°C', icon: Thermometer, color: '#f59e0b' },
    { id: 'glucose', label: 'Glucose', unit: 'mg/dL', icon: Droplets, color: '#7c3aed' },
    { id: 'spo2', label: 'SpO2', unit: '%', icon: Wind, color: '#0891b2' },
  ];

  const chartData = [
    { date: 'Mon', value: 120, value2: 80 },
    { date: 'Tue', value: 118, value2: 78 },
    { date: 'Wed', value: 122, value2: 82 },
    { date: 'Thu', value: 119, value2: 79 },
    { date: 'Fri', value: 121, value2: 81 },
    { date: 'Sat', value: 117, value2: 77 },
    { date: 'Sun', value: 120, value2: 80 },
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const Icon = currentMetric?.icon || Heart;

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <Activity className="w-5 h-5 mr-2 text-rose-500" />
          Health Metrics
        </h3>
        <button className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(m => {
          const MetricIcon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors ${
                selectedMetric === m.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-stone-100 text-ink-light hover:bg-stone-200'
              }`}
            >
              <MetricIcon className="w-3 h-3 mr-1" />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcd3c6" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#e4dfd5', 
                border: '1px solid #8c7a6b',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={currentMetric?.color} 
              strokeWidth={2}
              dot={false}
            />
            {selectedMetric === 'bp' && (
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke="#8c7a6b" 
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-stone-50 rounded-lg">
          <p className="text-lg font-semibold text-ink">120</p>
          <p className="text-xs text-ink-light">Latest</p>
        </div>
        <div className="text-center p-2 bg-stone-50 rounded-lg">
          <p className="text-lg font-semibold text-emerald-600">118</p>
          <p className="text-xs text-ink-light">Avg (7d)</p>
        </div>
        <div className="text-center p-2 bg-stone-50 rounded-lg">
          <p className="text-lg font-semibold text-emerald-600">✓</p>
          <p className="text-xs text-ink-light">In Range</p>
        </div>
      </div>
    </div>
  );
};

const AIAssistant: React.FC<{ 
  medications: Medication[]; 
  symptoms: SymptomEntry[];
  adherence: { weekly: number; monthly: number };
}> = ({ medications, symptoms, adherence }) => {
  const [expanded, setExpanded] = useState(true);

  const lowRefills = medications.filter(m => m.pillsRemaining <= 10);
  const recentSymptoms = symptoms.slice(0, 3);
  const interactions = [
    { med1: 'Lisinopril', med2: 'Potassium supplements', severity: 'moderate' },
  ];

  return (
    <div className="neu-card p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center mr-3">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-ink">AI Health Assistant</h3>
            <p className="text-xs text-ink-light">Personalized insights & reminders</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-ink-light" /> : <ChevronDown className="w-5 h-5 text-ink-light" />}
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {/* Adherence Alert */}
          {adherence.weekly < 90 && (
            <div className="flex items-start p-3 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Adherence Alert</p>
                <p className="text-xs text-amber-700">
                  Your weekly adherence is {adherence.weekly}%. Try to stay consistent with your medications.
                </p>
              </div>
            </div>
          )}

          {/* Refill Reminders */}
          {lowRefills.length > 0 && (
            <div className="flex items-start p-3 bg-rose-50 rounded-xl border border-rose-200">
              <Bell className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-800">Refill Reminder</p>
                <p className="text-xs text-rose-700">
                  {lowRefills.map(m => m.name).join(', ')} - Running low on supply
                </p>
              </div>
            </div>
          )}

          {/* Interaction Warning */}
          {interactions.length > 0 && (
            <div className="flex items-start p-3 bg-orange-50 rounded-xl border border-orange-200">
              <Shield className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-800">Drug Interaction</p>
                <p className="text-xs text-orange-700">
                  {interactions[0].med1} may interact with {interactions[0].med2}. Consult your doctor.
                </p>
              </div>
            </div>
          )}

          {/* Symptom Pattern */}
          {recentSymptoms.length > 0 && (
            <div className="flex items-start p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Sparkles className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pattern Detected</p>
                <p className="text-xs text-blue-700">
                  You've logged {recentSymptoms[0].subtype.toLowerCase()} {recentSymptoms.length} times recently. 
                  Consider discussing with your doctor.
                </p>
              </div>
            </div>
          )}

          {/* Doctor Visit Summary */}
          <div className="p-3 bg-white/50 rounded-xl">
            <p className="text-xs font-medium text-ink-light mb-2">For your next doctor visit:</p>
            <ul className="text-xs text-ink space-y-1">
              <li className="flex items-center">
                <Check className="w-3 h-3 text-emerald-500 mr-1" />
                Current adherence rate: {adherence.weekly}% this week
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 text-emerald-500 mr-1" />
                {medications.length} active medications
              </li>
              <li className="flex items-center">
                <Check className="w-3 h-3 text-emerald-500 mr-1" />
                {symptoms.length} symptoms logged this month
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const MedicationManager: React.FC<{
  medications: Medication[];
  onUpdate: (meds: Medication[]) => void;
}> = ({ medications, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const filteredMeds = medications.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      onUpdate(medications.filter(m => m.id !== id));
    }
  };

  return (
    <div className="neu-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink flex items-center">
          <Pill className="w-5 h-5 mr-2 text-rose-500" />
          Medication Manager
        </h3>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-light" />
        <input
          type="text"
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="neu-input pl-9 py-2 text-sm"
        />
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredMeds.map(med => (
          <div key={med.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl group">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${med.color}20` }}
              >
                <Pill className="w-5 h-5" style={{ color: med.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{med.name}</p>
                <p className="text-xs text-ink-light">
                  {med.dosage}{med.unit} • {med.frequency} • {med.schedule.join(', ')}
                </p>
                <div className="flex items-center mt-1">
                  <div 
                    className="h-1.5 rounded-full mr-2"
                    style={{ 
                      width: '60px',
                      background: `linear-gradient(to right, ${med.color} ${(med.pillsRemaining / med.totalPills) * 100}%, #e5e7eb ${(med.pillsRemaining / med.totalPills) * 100}%)`
                    }}
                  />
                  <span className={`text-xs ${med.pillsRemaining <= 10 ? 'text-rose-600' : 'text-ink-light'}`}>
                    {med.pillsRemaining}/{med.totalPills} left
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingMed(med)}
                className="p-1.5 hover:bg-stone-200 rounded-lg"
              >
                <Edit className="w-4 h-4 text-ink-light" />
              </button>
              <button 
                onClick={() => handleDelete(med.id)}
                className="p-1.5 hover:bg-rose-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#e4dfd5] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 neu-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Add New Medication</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Medication Name" className="neu-input" />
              <input type="text" placeholder="Generic Name (optional)" className="neu-input" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Dosage" className="neu-input" />
                <select className="neu-input">
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="mcg">mcg</option>
                  <option value="IU">IU</option>
                  <option value="mL">mL</option>
                </select>
              </div>
              <select className="neu-input">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
              <select className="neu-input">
                <option value="with">With food</option>
                <option value="without">Without food</option>
                <option value="either">Either</option>
              </select>
              <input type="text" placeholder="Prescribing Doctor" className="neu-input" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" placeholder="Start Date" className="neu-input" />
                <input type="date" placeholder="End Date (optional)" className="neu-input" />
              </div>
              <input type="text" placeholder="Instructions" className="neu-input" />
            </div>
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-stone-200 text-ink rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium"
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Main Component =====

export default function Medicine2() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(mockSymptoms);
  const [todaySchedule, setTodaySchedule] = useState<ScheduledDose[]>([]);
  const [adherence, setAdherence] = useState({ weekly: 87, monthly: 92 });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'medications' | 'history'>('dashboard');

  // Generate today's schedule from medications
  useEffect(() => {
    const schedule: ScheduledDose[] = [];
    medications.forEach(med => {
      med.schedule.forEach((time, index) => {
        schedule.push({
          id: `${med.id}-${time}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: `${med.dosage}${med.unit}`,
          time,
          scheduledTime: time === 'morning' ? '8:00 AM' : time === 'afternoon' ? '1:00 PM' : time === 'evening' ? '6:00 PM' : '9:00 PM',
          taken: false,
          skipped: false,
          withFood: med.withFood,
          color: med.color,
          pillsRemaining: med.pillsRemaining,
        });
      });
    });
    setTodaySchedule(schedule);
  }, [medications]);

  const handleTakeDose = (id: string) => {
    setTodaySchedule(prev => prev.map(dose => 
      dose.id === id 
        ? { ...dose, taken: true, takenAt: new Date().toISOString() }
        : dose
    ));
    
    // Update adherence
    const taken = todaySchedule.filter(d => d.taken || d.id === id).length;
    const total = todaySchedule.length;
    setAdherence(prev => ({ ...prev, weekly: Math.round((taken / total) * 100) }));
  };

  const handleSkipDose = (id: string) => {
    setTodaySchedule(prev => prev.map(dose => 
      dose.id === id ? { ...dose, skipped: true } : dose
    ));
  };

  const handleTakeAllMorning = () => {
    const morningDoses = todaySchedule.filter(d => d.time === 'morning' && !d.taken && !d.skipped);
    morningDoses.forEach(dose => handleTakeDose(dose.id));
  };

  const groupedSchedule = useMemo(() => ({
    morning: todaySchedule.filter(d => d.time === 'morning'),
    afternoon: todaySchedule.filter(d => d.time === 'afternoon'),
    evening: todaySchedule.filter(d => d.time === 'evening'),
    night: todaySchedule.filter(d => d.time === 'night'),
  }), [todaySchedule]);

  const adherencePercentage = useMemo(() => {
    const taken = todaySchedule.filter(d => d.taken).length;
    const total = todaySchedule.filter(d => !d.skipped).length;
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  }, [todaySchedule]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const events: TimelineEvent[] = [];
    
    todaySchedule.filter(d => d.taken).map(dose => ({
      id: dose.id,
      type: 'medication',
      title: `Took ${dose.medicationName}`,
      description: dose.dosage,
      timestamp: dose.takenAt || new Date().toISOString(),
      icon: '💊',
      color: dose.color,
    })).forEach(e => events.push(e));

    symptoms.forEach(s => events.push({
      id: s.id,
      type: 'symptom',
      title: s.subtype,
      description: `Severity: ${s.severity}/10`,
      timestamp: s.timestamp,
      icon: '😷',
      color: '#f59e0b',
    }));

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [todaySchedule, symptoms]);

  const timeLabels = {
    morning: { label: 'Morning', time: '6:00 - 11:59 AM', icon: '🌅' },
    afternoon: { label: 'Afternoon', time: '12:00 - 4:59 PM', icon: '☀️' },
    evening: { label: 'Evening', time: '5:00 - 8:59 PM', icon: '🌆' },
    night: { label: 'Night', time: '9:00 PM - 5:59 AM', icon: '🌙' },
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-rose-500" />
            Medicine & Health Records
          </h1>
          <p className="text-ink-light">Track medications, symptoms, and health metrics</p>
        </div>
        
        {/* Adherence Dashboard */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="neu-card px-4 py-2 flex items-center">
            <div className="mr-3">
              <p className="text-xs text-ink-light">Today's Adherence</p>
              <p className={`text-xl font-bold ${adherencePercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {adherencePercentage}%
              </p>
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                <circle 
                  cx="24" 
                  cy="24" 
                  r="20" 
                  stroke={adherencePercentage >= 80 ? '#059669' : '#f59e0b'} 
                  strokeWidth="4" 
                  fill="none"
                  strokeDasharray={`${(adherencePercentage / 100) * 125.6} 125.6`}
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
          
          <div className="neu-card px-4 py-2">
            <p className="text-xs text-ink-light">Weekly</p>
            <p className="text-lg font-semibold text-ink">{adherence.weekly}%</p>
          </div>
          
          <div className="neu-card px-4 py-2">
            <p className="text-xs text-ink-light">Monthly</p>
            <p className="text-lg font-semibold text-ink">{adherence.monthly}%</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Today\'s Dashboard', icon: Activity },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'history', label: 'History', icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap flex items-center transition-all ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'neu-card hover:bg-rose-50 text-ink-light'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Medication Schedule & Symptom Tracker */}
          <div className="lg:col-span-4 space-y-6">
            {/* Today's Medications */}
            <div className="neu-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-rose-500" />
                  Today's Medications
                </h3>
                {groupedSchedule.morning.some(d => !d.taken && !d.skipped) && (
                  <button
                    onClick={handleTakeAllMorning}
                    className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Take All Morning
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {(Object.keys(groupedSchedule) as Array<keyof typeof groupedSchedule>).map(timeKey => {
                  const doses = groupedSchedule[timeKey];
                  if (doses.length === 0) return null;
                  
                  const timeInfo = timeLabels[timeKey];
                  const allTaken = doses.every(d => d.taken);
                  
                  return (
                    <div key={timeKey}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{timeInfo.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-ink">{timeInfo.label}</p>
                            <p className="text-xs text-ink-light">{timeInfo.time}</p>
                          </div>
                        </div>
                        {allTaken && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="pl-8">
                        {doses.map(dose => (
                          <MedicationCard
                            key={dose.id}
                            dose={dose}
                            onTake={handleTakeDose}
                            onSkip={handleSkipDose}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Symptom Tracker */}
            <SymptomTracker />

            {/* AI Assistant */}
            <AIAssistant 
              medications={medications}
              symptoms={symptoms}
              adherence={adherence}
            />
          </div>

          {/* Center Panel - Timeline & Documents */}
          <div className="lg:col-span-5 space-y-6">
            <HealthTimeline events={timelineEvents} />
            <DocumentsManager />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="neu-card p-4 text-center">
                <p className="text-3xl font-bold text-rose-500">{medications.length}</p>
                <p className="text-sm text-ink-light">Active Medications</p>
              </div>
              <div className="neu-card p-4 text-center">
                <p className="text-3xl font-bold text-amber-500">{symptoms.length}</p>
                <p className="text-sm text-ink-light">Symptoms This Month</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Appointments & Lab Results */}
          <div className="lg:col-span-3 space-y-6">
            <AppointmentsPanel />
            <LabResultsPanel />
            <HealthMetrics />
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MedicationManager medications={medications} onUpdate={setMedications} />
          
          {/* Medication History */}
          <div className="neu-card p-4">
            <h3 className="font-semibold text-ink mb-4 flex items-center">
              <History className="w-5 h-5 mr-2 text-rose-500" />
              Medication History
            </h3>
            <div className="space-y-2">
              {medications.map(med => (
                <div key={med.id} className="p-3 bg-stone-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{med.name}</p>
                      <p className="text-xs text-ink-light">
                        Started {new Date(med.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">
                        {Math.round(((med.totalPills - med.pillsRemaining) / med.totalPills) * 100)}%
                      </p>
                      <p className="text-xs text-ink-light">adherence</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <HealthTimeline events={timelineEvents} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LabResultsPanel />
            <AppointmentsPanel />
            <HealthMetrics />
          </div>
        </div>
      )}
    </div>
  );
}
