import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Snowflake, Flame, Droplets, Activity } from 'lucide-react';

const round = (num: number) => Math.round(num * 100) / 100;

const cToF = (c: number) => (c * 9 / 5) + 32;
const cToK = (c: number) => c + 273.15;
const fToC = (f: number) => (f - 32) * 5 / 9;
const kToC = (k: number) => k - 273.15;

const format = (num: number) => {
  if (isNaN(num)) return '';
  if (num === 0) return '0';
  return String(round(num));
};

type Unit = 'C' | 'F' | 'K';

const REFERENCE_TEMPS = [
  { label: 'Absolute Zero', value: 0, unit: 'K', icon: Snowflake, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/20' },
  { label: 'Water Freezes', value: 0, unit: 'C', icon: Droplets, color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/20' },
  { label: 'Body Temp', value: 37, unit: 'C', icon: Activity, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/20' },
  { label: 'Water Boils', value: 100, unit: 'C', icon: Flame, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20' },
];

export default function App() {
  const [activeUnit, setActiveUnit] = useState<Unit>('C');
  const [activeValue, setActiveValue] = useState<string>('20');

  let c = '';
  let f = '';
  let k = '';

  const numVal = parseFloat(activeValue);
  const isValid = !isNaN(numVal) && activeValue.trim() !== '';

  if (activeUnit === 'C') {
    c = activeValue;
    if (isValid) {
      f = format(cToF(numVal));
      k = format(cToK(numVal));
    }
  } else if (activeUnit === 'F') {
    f = activeValue;
    if (isValid) {
      c = format(fToC(numVal));
      k = format(cToK(fToC(numVal)));
    }
  } else if (activeUnit === 'K') {
    k = activeValue;
    if (isValid) {
      c = format(kToC(numVal));
      f = format(cToF(kToC(numVal)));
    }
  }

  const kNum = parseFloat(k);
  const kError = !isNaN(kNum) && kNum < 0;

  const handleFocus = (unit: Unit) => {
    setActiveUnit(unit);
    if (unit === 'C') setActiveValue(c);
    else if (unit === 'F') setActiveValue(f);
    else if (unit === 'K') setActiveValue(k);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, unit: Unit) => {
    const val = e.target.value;
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      setActiveUnit(unit);
      setActiveValue(val);
    }
  };

  const setReference = (temp: typeof REFERENCE_TEMPS[0]) => {
    setActiveUnit(temp.unit as Unit);
    setActiveValue(String(temp.value));
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background p-4 sm:p-8 font-sans selection:bg-primary/20">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto"
      >
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Thermometer className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
              Temperature
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">
              Precision conversion tool
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          <InputRow
            unit="C"
            symbol="°C"
            label="Celsius"
            value={c}
            isActive={activeUnit === 'C'}
            onChange={handleChange}
            onFocus={handleFocus}
          />
          <InputRow
            unit="F"
            symbol="°F"
            label="Fahrenheit"
            value={f}
            isActive={activeUnit === 'F'}
            onChange={handleChange}
            onFocus={handleFocus}
          />
          <InputRow
            unit="K"
            symbol="K"
            label="Kelvin"
            value={k}
            isActive={activeUnit === 'K'}
            onChange={handleChange}
            onFocus={handleFocus}
            error={kError}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
            Reference Points
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REFERENCE_TEMPS.map((temp, i) => (
              <motion.div
                key={temp.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + (i * 0.05), ease: "easeOut" }}
              >
                <ReferenceButton 
                  temp={temp} 
                  onClick={() => setReference(temp)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const InputRow = ({
  unit,
  symbol,
  label,
  value,
  isActive,
  onChange,
  onFocus,
  error,
}: {
  unit: Unit;
  symbol: string;
  label: string;
  value: string;
  isActive: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, unit: Unit) => void;
  onFocus: (unit: Unit) => void;
  error?: boolean;
}) => {
  return (
    <motion.div layout className="flex flex-col">
      <div
        className={`relative flex items-center justify-between rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 ease-out cursor-text overflow-hidden
          ${
            isActive
              ? 'bg-card border-primary/40 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] scale-[1.02] z-10'
              : 'bg-card/40 border-transparent hover:bg-card hover:border-border/60 scale-100 z-0'
          }
          ${error ? '!border-destructive/50 !bg-destructive/10' : ''}
        `}
        onClick={() => document.getElementById(`input-${unit}`)?.focus()}
      >
        <div className="flex flex-col flex-1 z-10">
          <label className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-2 cursor-text transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'} ${error ? '!text-destructive' : ''}`}>
            {label}
          </label>
          <input
            id={`input-${unit}`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e, unit)}
            onFocus={() => onFocus(unit)}
            className={`w-full bg-transparent text-5xl sm:text-6xl font-mono tracking-tighter outline-none placeholder:text-muted-foreground/20 transition-colors ${
              error ? 'text-destructive' : 'text-foreground'
            }`}
            placeholder="0"
          />
        </div>
        <div className="flex items-end h-full pt-8 z-10">
          <span className={`text-3xl font-medium tracking-tight transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground/60'} ${error ? '!text-destructive' : ''}`}>
            {symbol}
          </span>
        </div>
        
        {isActive && !error && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        )}
        {error && (
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="text-sm font-medium text-destructive px-3 overflow-hidden"
          >
            Absolute zero is 0 K. Temperature cannot be lower.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReferenceButton = ({
  temp,
  onClick
}: {
  temp: typeof REFERENCE_TEMPS[0],
  onClick: () => void
}) => {
  const Icon = temp.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-card/40 border-2 border-transparent hover:bg-card hover:border-border/60 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 active:scale-95 group"
    >
      <div className={`p-3 rounded-full ${temp.bg} mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-[0.16,1,0.3,1]`}>
        <Icon className={`w-5 h-5 ${temp.color}`} />
      </div>
      <span className="text-xs font-semibold text-foreground mb-1 text-center leading-tight">
        {temp.label}
      </span>
      <span className="text-[11px] text-muted-foreground font-mono font-medium">
        {temp.value}{temp.unit !== 'K' ? `°${temp.unit}` : ' K'}
      </span>
    </button>
  );
};