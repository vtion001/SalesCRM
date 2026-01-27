import React, { useState, useMemo } from 'react';
import { X, User, Building, Mail, Phone, Briefcase, DollarSign, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '../types';

interface LeadFormProps {
  onSave: (lead: Omit<Lead, 'id'>) => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    status: 'New Lead' as Lead['status'],
    dealValue: 0,
    probability: 0,
    lastActivityTime: 'Just now',
    lastContactDate: 'Never',
    isOnline: false,
    avatar: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => ({
    name: formData.name.length < 2,
    email: !formData.email.includes('@'),
    company: formData.company.length < 2,
    phone: formData.phone.length < 5
  }), [formData]);

  const progress = useMemo(() => {
    const fields = ['name', 'role', 'company', 'email', 'phone'];
    const filled = fields.filter(f => (formData as any)[f].length > 0).length;
    return (filled / fields.length) * 100;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(v => v)) return;
    
    onSave({
      ...formData,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    });
  };

  return (
    <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden border border-white">
      {/* Header with Progress */}
      <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Opportunity</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Entry Form</p>
        
        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="space-y-5">
          <SmartInput 
            label="Full Name" 
            icon={<User size={18} />} 
            placeholder="Lead full name"
            value={formData.name}
            onChange={v => setFormData({...formData, name: v})}
            error={touched.name && errors.name}
            onBlur={() => setTouched({...touched, name: true})}
          />

          <div className="grid grid-cols-2 gap-4">
            <SmartInput 
              label="Job Title" 
              icon={<Briefcase size={18} />} 
              placeholder="e.g. CEO"
              value={formData.role}
              onChange={v => setFormData({...formData, role: v})}
            />
            <SmartInput 
              label="Company" 
              icon={<Building size={18} />} 
              placeholder="Company name"
              value={formData.company}
              onChange={v => setFormData({...formData, company: v})}
              error={touched.company && errors.company}
              onBlur={() => setTouched({...touched, company: true})}
            />
          </div>

          <SmartInput 
            label="Email Address" 
            icon={<Mail size={18} />} 
            type="email"
            placeholder="email@company.com"
            value={formData.email}
            onChange={v => setFormData({...formData, email: v})}
            error={touched.email && errors.email}
            onBlur={() => setTouched({...touched, email: true})}
          />

          <SmartInput 
            label="Phone Number" 
            icon={<Phone size={18} />} 
            type="tel"
            placeholder="+1 (000) 000-0000"
            value={formData.phone}
            onChange={v => setFormData({...formData, phone: v})}
            error={touched.phone && errors.phone}
            onBlur={() => setTouched({...touched, phone: true})}
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation ($)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input
                  type="number" 
                  value={formData.dealValue}
                  onChange={e => setFormData({...formData, dealValue: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl text-sm font-black outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confidence (%)</label>
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input
                  type="number" max="100" min="0"
                  value={formData.probability}
                  onChange={e => setFormData({...formData, probability: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl text-sm font-black outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 px-6 py-4 bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={Object.values(errors).some(v => v)}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
          >
            Deploy Lead
          </button>
        </div>
      </form>
    </div>
  );
};

const SmartInput = ({ label, icon, value, onChange, error, onBlur, ...props }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center ml-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[9px] font-black text-rose-500 uppercase">Invalid Entry</motion.span>
        )}
      </AnimatePresence>
    </div>
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-indigo-500'}`}>
        {icon}
      </div>
      <input
        {...props}
        value={value}
        onBlur={onBlur}
        onChange={e => onChange(e.target.value)}
        className={`w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all border-2 ${
          error 
            ? 'bg-rose-50 border-rose-100 text-rose-900 focus:bg-white' 
            : 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 text-slate-900'
        }`}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {value.length > 2 && !error && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </motion.div>
        )}
        {error && (
          <AlertCircle size={16} className="text-rose-500" />
        )}
      </div>
    </div>
  </div>
);