import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <p className="mt-1 text-xs text-rose-700 font-bold">
                Setelah akun Anda dihapus, semua data dan riwayat belajar akan dihapus secara permanen.
            </p>

            <button onClick={confirmUserDeletion} className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 font-black rounded-xl px-6 py-2.5 text-sm transition-all active:scale-95">
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-black text-slate-900">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 font-bold">
                        Setelah akun Anda dihapus, semua data dan sumber daya yang terkait akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun ini.
                    </p>

                    <div className="mt-6">
                        <label className="sr-only" htmlFor="password">Kata Sandi</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold focus:outline-none focus:border-rose-500 transition"
                            autoFocus
                            placeholder="Kata Sandi"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
                            Batal
                        </button>

                        <button disabled={processing} className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 font-black rounded-xl px-6 py-2.5 text-sm transition-all active:scale-95 disabled:opacity-60">
                            Hapus Akun Permanen
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
