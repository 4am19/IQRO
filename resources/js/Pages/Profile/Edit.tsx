import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { ArrowLeft, User, Shield, AlertTriangle } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppLayout title="Pengaturan Profil">
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link href={route('parent.dashboard')} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">Pengaturan Profil</h1>
                        <p className="text-xs text-slate-400 font-bold">Kelola informasi akun Anda</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card-white p-5 space-y-4">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                <User className="w-4 h-4" />
                            </div>
                            Informasi Profil
                        </h2>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="card-white p-5 space-y-4">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Shield className="w-4 h-4" />
                            </div>
                            Ubah Kata Sandi
                        </h2>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="card-white border-rose-200 bg-rose-50/30 p-5 space-y-4">
                        <h2 className="text-sm font-black text-rose-700 flex items-center gap-2 border-b border-rose-100 pb-3">
                            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            Hapus Akun
                        </h2>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
