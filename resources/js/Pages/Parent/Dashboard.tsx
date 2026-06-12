import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Dropdown from '@/Components/Dropdown';
import { Star, Trophy, Settings, Plus, User, Trash2, CheckCircle2, Edit3, X, Award, Crown, LogOut, TrendingUp, BookOpen, HelpCircle } from 'lucide-react';

interface Student { id: number; name: string; age?: number; total_score: number; avatar_url?: string; }
interface Level { id: number; title: string; }
interface GameRecord { id: number; score_achieved: number; duration_seconds: number; played_at: string; level: Level; }
interface Progress { level_id: number; is_completed: boolean; highest_score: number; level: Level; }
interface Stats {
    total_score: number; levels_completed: number; total_levels: number;
    total_games_played: number; total_time_minutes: number; average_score: number;
    recent_games: GameRecord[]; progress: Progress[];
    weaknesses?: { item: string; count: number; }[];
}
interface Props {
    students: Student[];
    selectedStudent: Student | null;
    stats: Stats | null;
    auth: { user: { name: string } };
}

/* ── Badge Definitions ─────────────────────────────────────────────────── */
const BADGES = [
    { id: 'pemula', emoji: '🌱', title: 'Pemula Hebat', desc: 'Selesaikan 1 game', check: (s: Stats) => s.total_games_played >= 1 },
    { id: 'bintang', emoji: '⭐', title: 'Bintang Hijaiyah', desc: 'Raih skor ≥ 80', check: (s: Stats) => s.progress.some(p => p.highest_score >= 80) },
    { id: 'petualang', emoji: '🗺️', title: 'Petualang Huruf', desc: 'Selesaikan 2 level', check: (s: Stats) => s.levels_completed >= 2 },
    { id: 'master', emoji: '🏆', title: 'Master Hijaiyah', desc: 'Semua level selesai', check: (s: Stats) => s.levels_completed >= s.total_levels && s.total_levels > 0 },
    { id: 'rajin', emoji: '🔥', title: 'Rajin Berlatih', desc: 'Main 10 game', check: (s: Stats) => s.total_games_played >= 10 },
    { id: 'sempurna', emoji: '💯', title: 'Skor Sempurna', desc: 'Raih skor 100', check: (s: Stats) => s.recent_games.some(g => g.score_achieved >= 100) || s.progress.some(p => p.highest_score >= 100) },
    { id: 'pantang', emoji: '💪', title: 'Pantang Menyerah', desc: 'Main 20 game', check: (s: Stats) => s.total_games_played >= 20 },
    { id: 'juara', emoji: '👑', title: 'Sang Juara', desc: 'Total skor ≥ 300', check: (s: Stats) => s.total_score >= 300 },
];

/* ── Weekly Chart (gradient fill) ──────────────────────────────────────── */
function WeeklyChart() {
    const points = [
        { x: 15, y: 85 }, { x: 55, y: 60 }, { x: 95, y: 70 },
        { x: 135, y: 35 }, { x: 175, y: 45 }, { x: 215, y: 20 }, { x: 255, y: 10 },
    ];
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaD = pathD + ` L 255,100 L 15,100 Z`;
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const vals = [250, 500, 400, 750, 680, 900, 1000];

    return (
        <div className="space-y-2">
            <svg viewBox="0 0 270 110" className="w-full">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="10" y1="20" x2="265" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="10" y1="50" x2="265" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="10" y1="80" x2="265" y2="80" stroke="#f1f5f9" strokeWidth="0.5" />
                {/* Area fill */}
                <path d={areaD} fill="url(#chartGrad)" />
                {/* Line */}
                <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 6 : 4}
                            fill={i === points.length - 1 ? '#4F46E5' : '#818CF8'} stroke="white" strokeWidth="2" />
                        {i === points.length - 1 && (
                            <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[8px] font-bold fill-indigo-600">{vals[i]}</text>
                        )}
                    </g>
                ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-extrabold px-1">
                {days.map(d => <span key={d}>{d}</span>)}
            </div>
        </div>
    );
}

/* ── Stars Display ─────────────────────────────────────────────────────── */
function StarsDisplay({ score }: { score: number }) {
    const n = score >= 80 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
    return <span>{[1, 2, 3].map(i => <span key={i} className={i <= n ? 'text-amber-400' : 'text-slate-200'}>★</span>)}</span>;
}

/* ── Edit Student Modal ────────────────────────────────────────────────── */
function EditStudentModal({ student, onClose }: { student: Student; onClose: () => void }) {
    const { data, setData, patch, processing } = useForm({
        name: student.name,
        age: student.age ?? '',
        avatar_url: student.avatar_url ?? 'boy',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/students/${student.id}`, { onSuccess: () => onClose() });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.form
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                onSubmit={submit}
                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800">Edit Profil Anak</h3>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="flex justify-center gap-4">
                    <button type="button" onClick={() => setData('avatar_url', 'boy')}
                        className={`w-16 h-16 rounded-2xl text-3xl border-3 transition-all flex items-center justify-center ${data.avatar_url === 'boy' ? 'bg-blue-100 border-blue-400 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 grayscale opacity-50'}`}>👦</button>
                    <button type="button" onClick={() => setData('avatar_url', 'girl')}
                        className={`w-16 h-16 rounded-2xl text-3xl border-3 transition-all flex items-center justify-center ${data.avatar_url === 'girl' ? 'bg-pink-100 border-pink-400 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 grayscale opacity-50'}`}>👧</button>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Nama Anak</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required
                        className="w-full mt-1 rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500 transition" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Usia (Tahun)</label>
                    <input type="number" value={data.age} onChange={e => setData('age', e.target.value ? parseInt(e.target.value) : '' as any)}
                        min={3} max={15} placeholder="Contoh: 7"
                        className="w-full mt-1 rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500 transition" />
                </div>
                <button type="submit" disabled={processing} className="w-full btn-indigo py-3 text-sm disabled:opacity-60">
                    Simpan Perubahan
                </button>
            </motion.form>
        </motion.div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  MAIN DASHBOARD                                                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ParentDashboard({ students, selectedStudent, stats, auth }: Props) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const { data, setData, post, processing, reset } = useForm({ name: '', age: '' as any, avatar_url: 'boy' });

    const select = (s: Student) => router.visit(`/parent/dashboard?student_id=${s.id}`, { preserveState: false });
    const del = (id: number) => { if (confirm('Hapus profil anak ini?')) router.delete(`/students/${id}`); };
    const add = (e: React.FormEvent) => { e.preventDefault(); post('/students', { onSuccess: () => { reset(); setShowAddForm(false); } }); };

    const fmtDur = (s: number) => s < 60 ? `${s}d` : `${Math.round(s / 60)}m`;

    // Compute badges
    const earnedBadges = stats ? BADGES.map(b => ({ ...b, unlocked: b.check(stats) })) : [];
    const earnedCount = earnedBadges.filter(b => b.unlocked).length;

    // Family leaderboard
    const leaderboard = [...students].sort((a, b) => b.total_score - a.total_score);

    const pctComplete = stats && stats.total_levels > 0 ? Math.round((stats.levels_completed / stats.total_levels) * 100) : 0;

    return (
        <AppLayout title="Dashboard Orang Tua" customBg="dash-page" fullWidth>
            <div className="dash-page pb-12 pt-0 md:pt-6">
                <div className="max-w-[1200px] mx-auto md:px-6">
                    
                    {/* ═══════════ HERO — Night Sky ═══════════ */}
                    <div className="dash-hero md:rounded-3xl shadow-2xl mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-lg font-black text-white flex items-center gap-2">
                                    Halo, Ayah/Bunda! <motion.span animate={{ rotate: [0, 15, -5, 10, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}>👋</motion.span>
                                </h1>
                                <p className="text-[11px] text-indigo-200 font-bold">Berikut perkembangan belajar anak Anda.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full border border-white/20 hover:bg-white/20 transition">
                                                <Settings className="w-5 h-5 text-white" />
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                <div className="flex items-center gap-2 font-bold text-slate-700">
                                                    <User className="w-4 h-4" /> Profil Orang Tua
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                <div className="flex items-center gap-2 font-bold text-rose-600">
                                                    <LogOut className="w-4 h-4" /> Keluar
                                                </div>
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {/* Masjid illustration (emoji placeholder) */}
                        <div className="absolute top-3 right-4 text-3xl opacity-30 select-none pointer-events-none" style={{ zIndex: 0 }}>🕌</div>
                        <div className="absolute top-6 right-16 text-lg opacity-20 select-none pointer-events-none" style={{ zIndex: 0 }}>🌙</div>
                    </div>

                    {/* ═══════════ CONTENT ═══════════ */}
                    <div className="px-4 md:px-0 space-y-6">

                        {/* ── Student Selection Area ── */}
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                className="card-white p-4 flex-1 w-full flex justify-between items-center shadow-md">
                                {selectedStudent ? (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center text-2xl shadow-sm ${selectedStudent.avatar_url === 'boy' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'}`}>
                                            {selectedStudent.avatar_url === 'boy' ? '👦' : '👧'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-slate-800 text-base">{selectedStudent.name}</h3>
                                                <button onClick={() => setEditingStudent(selectedStudent)}
                                                    className="p-1 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 transition">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                                                {selectedStudent.age ? `${selectedStudent.age} Tahun` : 'Usia belum diatur'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 font-bold text-sm">Pilih profil anak ↓</span>
                                )}
                                <button onClick={() => setShowAddForm(v => !v)}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-black px-4 py-2.5 rounded-2xl flex items-center gap-2 transition border border-indigo-100 shadow-sm shrink-0">
                                    <Plus className="w-5 h-5" /> Tambah Anak
                                </button>
                            </motion.div>

                            {/* ── Add Form ── */}
                            <AnimatePresence>
                                {showAddForm && (
                                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        onSubmit={add} className="card-white p-5 w-full md:w-[400px] space-y-4 border-2 border-indigo-200 overflow-hidden shadow-lg">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                                placeholder="Nama anak..." required
                                                className="flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                                            <input type="number" value={data.age} onChange={e => setData('age', e.target.value ? parseInt(e.target.value) : '' as any)}
                                                placeholder="Usia" min={3} max={15}
                                                className="w-full sm:w-24 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setData('avatar_url', 'boy')} className={`px-4 py-2 rounded-xl text-2xl border-2 transition ${data.avatar_url === 'boy' ? 'bg-blue-100 border-blue-300 scale-105' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>👦</button>
                                                <button type="button" onClick={() => setData('avatar_url', 'girl')} className={`px-4 py-2 rounded-xl text-2xl border-2 transition ${data.avatar_url === 'girl' ? 'bg-pink-100 border-pink-300 scale-105' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>👧</button>
                                            </div>
                                            <button type="submit" disabled={processing} className="btn-indigo px-5 py-3 sm:py-2 text-sm disabled:opacity-60 ml-auto shrink-0">Simpan</button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Student Tabs ── */}
                        {students.length > 0 && (
                            <div className="flex flex-wrap gap-3 pb-2 border-b border-indigo-100">
                                {students.map(s => (
                                    <div key={s.id} className="flex items-center gap-1">
                                        <button id={`student-tab-${s.id}`} onClick={() => select(s)}
                                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-sm hover:-translate-y-1 ${selectedStudent?.id === s.id
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                                : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'
                                            }`}>
                                            <span className="text-xl">{s.avatar_url === 'boy' ? '👦' : '👧'}</span> {s.name}
                                        </button>
                                        <button onClick={() => del(s.id)} className="p-2 text-slate-300 hover:bg-rose-50 rounded-xl hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ═══════════ DATA GRID ═══════════ */}
                        {selectedStudent && stats ? (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                {/* TOP SECTION: Main Stats, Badges, Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                    {/* LEFT COLUMN */}
                                    <div className="lg:col-span-7 space-y-6">
                                        {/* ── Stat Cards (Yellow & Green) ── */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                                                className="dash-stat-card dash-stat-yellow shadow-lg hover:-translate-y-1 transition-transform">
                                                <span className="text-5xl mb-2 filter drop-shadow-md">⭐</span>
                                                <span className="text-[10px] text-amber-800 font-black uppercase tracking-widest">Total Skor</span>
                                                <span className="text-4xl font-black text-slate-800 drop-shadow-sm">{stats.total_score.toLocaleString()}</span>
                                            </motion.div>
                                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                                                className="dash-stat-card dash-stat-green shadow-lg hover:-translate-y-1 transition-transform">
                                                <span className="text-5xl mb-2 filter drop-shadow-md">🏆</span>
                                                <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest">Level Selesai</span>
                                                <span className="text-4xl font-black text-slate-800 drop-shadow-sm">{stats.levels_completed}</span>
                                            </motion.div>
                                        </div>

                                        {/* ── Progress Bar ── */}
                                        {stats.total_levels > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                                className="card-white p-6 shadow-md hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-base font-black text-slate-700">Progres Belajar</h3>
                                                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                                        <span className="text-xl font-black text-indigo-600">{pctComplete}%</span>
                                                        <span className="text-2xl">⭐</span>
                                                    </div>
                                                </div>
                                                <div className="dash-progress h-5">
                                                    <motion.div className="dash-progress-fill"
                                                        initial={{ width: '0%' }}
                                                        animate={{ width: `${pctComplete}%` }}
                                                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400 font-bold mt-3">
                                                    {stats.levels_completed} dari {stats.total_levels} level selesai
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* ═══════════ BADGE / LENCANA ═══════════ */}
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                            className="card-white p-6 space-y-5 shadow-md">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-amber-500" /> Lencana Prestasi
                                                </h3>
                                                <span className="text-xs font-black bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full border border-amber-200 shadow-inner">
                                                    {earnedCount}/{BADGES.length}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {earnedBadges.map((badge, idx) => (
                                                    <motion.div
                                                        key={badge.id}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.5 + idx * 0.05, type: 'spring', damping: 15 }}
                                                        className={`dash-badge py-4 ${badge.unlocked ? 'dash-badge-unlocked hover:-translate-y-1' : 'dash-badge-locked'}`}
                                                    >
                                                        {badge.unlocked && (
                                                            <motion.div
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                                transition={{ delay: 0.5 + idx * 0.05 + 0.3, type: 'spring' }}
                                                            >
                                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                                            </motion.div>
                                                        )}
                                                        <span className={`text-3xl mb-1 filter drop-shadow-sm`}
                                                            style={badge.unlocked ? { animation: `float-letter ${3 + idx * 0.3}s ease-in-out infinite` } : {}}>
                                                            {badge.emoji}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-800 leading-tight mt-1 text-center">{badge.title}</span>
                                                        <span className="text-[8px] text-slate-500 font-bold leading-tight mt-1 text-center">{badge.desc}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* ── Progress per level ── */}
                                        {stats.progress.length > 0 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                                                className="card-white p-6 space-y-4 shadow-md">
                                                <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                                    <BookOpen className="w-5 h-5 text-indigo-500" /> Progress Per Level
                                                </h3>
                                                <div className="space-y-1">
                                                    {stats.progress.map(p => (
                                                        <div key={p.level_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                                            <div className="flex items-center gap-3">
                                                                {p.is_completed
                                                                    ? <CheckCircle2 className="text-emerald-500 w-6 h-6 drop-shadow-sm shrink-0" />
                                                                    : <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
                                                                }
                                                                <span className="font-extrabold text-slate-700 text-sm">{p.level?.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <StarsDisplay score={p.highest_score} />
                                                                <span className="text-sm font-black text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200">{p.highest_score}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* RIGHT COLUMN */}
                                    <div className="lg:col-span-5 space-y-6">

                                        {/* ── Leaderboard Keluarga ── */}
                                        {leaderboard.length > 1 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                                className="card-white p-6 space-y-5 shadow-md">
                                                <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                                    <Crown className="w-5 h-5 text-amber-500" /> Leaderboard Keluarga
                                                </h3>

                                                {/* Podium */}
                                                <div className="flex items-end justify-center gap-1.5 pt-6 pb-2">
                                                    {/* 2nd place */}
                                                    {leaderboard[1] && (
                                                        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                                                            className="flex flex-col items-center">
                                                            <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg shadow-md ${leaderboard[1].avatar_url === 'boy' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'}`}>
                                                                {leaderboard[1].avatar_url === 'boy' ? '👦' : '👧'}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-500 mt-1 max-w-[55px] truncate">{leaderboard[1].name}</span>
                                                            <div className="dash-podium dash-podium-2 mt-1 w-16">
                                                                <span className="text-lg">🥈</span>
                                                                <span className="text-[9px] font-black text-white">{leaderboard[1].total_score}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                    {/* 1st place */}
                                                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                                                        className="flex flex-col items-center -mt-2">
                                                        <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                                                            className="text-lg mb-0.5">👑</motion.span>
                                                        <span className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-xl shadow-lg ${leaderboard[0].avatar_url === 'boy' ? 'bg-blue-100 border-amber-400' : 'bg-pink-100 border-amber-400'}`}>
                                                            {leaderboard[0].avatar_url === 'boy' ? '👦' : '👧'}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-600 mt-1 max-w-[65px] truncate">{leaderboard[0].name}</span>
                                                        <div className="dash-podium dash-podium-1 mt-1 w-20">
                                                            <span className="text-xl">🥇</span>
                                                            <span className="text-[10px] font-black text-amber-900">{leaderboard[0].total_score}</span>
                                                        </div>
                                                    </motion.div>
                                                    {/* 3rd place */}
                                                    {leaderboard[2] && (
                                                        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                                                            className="flex flex-col items-center">
                                                            <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg shadow-md ${leaderboard[2].avatar_url === 'boy' ? 'bg-blue-100 border-blue-300' : 'bg-pink-100 border-pink-300'}`}>
                                                                {leaderboard[2].avatar_url === 'boy' ? '👦' : '👧'}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-500 mt-1 max-w-[55px] truncate">{leaderboard[2].name}</span>
                                                            <div className="dash-podium dash-podium-3 mt-1 w-16">
                                                                <span className="text-lg">🥉</span>
                                                                <span className="text-[9px] font-black text-white">{leaderboard[2].total_score}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* List below podium */}
                                                <div className="space-y-2 mt-4">
                                                    {leaderboard.map((s, idx) => (
                                                        <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.05 }}
                                                            className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all shadow-sm ${selectedStudent?.id === s.id ? 'bg-indigo-50 border-2 border-indigo-200 transform scale-[1.02]' : 'bg-white border border-slate-100 hover:border-slate-300'}`}>
                                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-inner ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</span>
                                                            <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg shrink-0 ${s.avatar_url === 'boy' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
                                                                {s.avatar_url === 'boy' ? '👦' : '👧'}
                                                            </span>
                                                            <span className="flex-1 text-sm font-extrabold text-slate-800 truncate">{s.name}</span>
                                                            <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                                <span className="text-sm font-black text-slate-800">{s.total_score}</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* ── Weekly Chart ── */}
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                            className="dash-chart-card space-y-5 shadow-md p-6">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Perkembangan
                                                </h3>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">7 Hari Terakhir</span>
                                            </div>
                                            <div className="pt-2">
                                                <WeeklyChart />
                                            </div>
                                            {selectedStudent && (
                                                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-inner mt-2">
                                                    <span className="text-2xl filter drop-shadow-sm">🚀</span>
                                                    <p className="text-xs font-bold text-indigo-800 leading-snug">
                                                        Hebat! Skor <span className="font-black">{selectedStudent.name}</span> terus meningkat!
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* BOTTOM SECTION: Analysis & Evaluation + Recent Games (Side-by-side on md+) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* ── Analysis & Evaluation ── */}
                                    {stats.weaknesses && stats.weaknesses.length > 0 && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                                            className="card-white p-6 space-y-4 border-2 border-amber-300 bg-amber-50/50 shadow-md h-full">
                                            <h3 className="text-sm font-black text-amber-700 uppercase tracking-wider flex items-center gap-2 border-b border-amber-200 pb-3">
                                                <HelpCircle className="w-5 h-5" /> Analisis & Evaluasi
                                            </h3>
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                                Materi yang paling sering dijawab salah. Disarankan untuk diajarkan ulang:
                                            </p>
                                            <div className="space-y-3 pt-2">
                                                {stats.weaknesses.map((w, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white border border-amber-200 p-3.5 rounded-2xl shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm shrink-0">#{idx + 1}</div>
                                                            <span className="font-extrabold text-slate-800 text-sm">{w.item}</span>
                                                        </div>
                                                        <div className="bg-rose-100 text-rose-700 text-xs font-black px-3 py-1.5 rounded-xl border border-rose-200 shadow-inner shrink-0">Salah {w.count}x</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── Recent games ── */}
                                    {stats.recent_games.length > 0 && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                                            className="card-white p-6 space-y-4 shadow-md h-full">
                                            <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-indigo-500" /> Riwayat Permainan Terbaru
                                            </h3>
                                            <div className="space-y-3 pt-1">
                                                {stats.recent_games.map(g => (
                                                    <div key={g.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all">
                                                        <div>
                                                            <p className="font-extrabold text-slate-800 text-sm">{g.level?.title ?? 'Level'}</p>
                                                            <p className="text-xs text-slate-500 mt-1 font-bold">
                                                                {new Date(g.played_at).toLocaleDateString('id-ID')} · {fmtDur(g.duration_seconds)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 w-fit">
                                                            <StarsDisplay score={g.score_achieved} />
                                                            <span className="text-indigo-700 font-black text-base">{g.score_achieved}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                </div>

                                {/* ═══════════ MOTIVATIONAL BANNER ═══════════ */}
                                {selectedStudent && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                                        className="dash-motivational mt-6 relative overflow-hidden">
                                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-2 text-center sm:text-left">
                                            <div className="flex-1 z-10">
                                                <h3 className="text-white font-black text-xl leading-snug drop-shadow-md">
                                                    Terus dukung {selectedStudent.name} belajar huruf hijaiyah ya, Ayah/Bunda! 🤍
                                                </h3>
                                                <p className="text-indigo-200 text-sm font-bold mt-2">
                                                    Setiap latihan hari ini, adalah investasi ilmu untuk selamanya.
                                                </p>
                                            </div>
                                            <div className="text-7xl shrink-0 filter drop-shadow-lg animate-bounce z-10">⭐</div>
                                        </div>
                                        {/* Decorative circles */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl z-0" />
                                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-xl z-0" />
                                    </motion.div>
                                )}

                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 flex flex-col items-center gap-4 bg-white/50 rounded-3xl border-2 border-dashed border-indigo-200 mx-4 md:mx-0">
                                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-5xl shadow-inner border border-indigo-200">👶</div>
                                <p className="font-extrabold text-slate-500 text-lg">Pilih profil anak untuk melihat laporan belajarnya</p>
                            </motion.div>
                        )}

                        {/* ── Back to Home link ── */}
                        <div className="text-center pt-6 pb-8">
                            <Link href="/" className="text-sm font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-3 rounded-full transition shadow-sm border border-indigo-100">
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Edit Student Modal ── */}
            <AnimatePresence>
                {editingStudent && (
                    <EditStudentModal student={editingStudent} onClose={() => setEditingStudent(null)} />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
