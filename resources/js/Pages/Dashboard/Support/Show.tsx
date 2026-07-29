import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';
import Card from '@/Components/UI/Card';
import { PageProps } from '@/types';
import { Send, Paperclip, X, Download, MessageSquare, AlertCircle } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

interface SupportShowProps extends PageProps {
    ticket: any;
}

export default function SupportShow({ ticket }: SupportShowProps) {
    const flash = usePage<PageProps>().props.flash;
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        attachments: [] as File[],
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [ticket.replies]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPreviewFiles(prev => [...prev, ...filesArray]);
            setData('attachments', [...data.attachments, ...filesArray]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...previewFiles];
        newFiles.splice(index, 1);
        setPreviewFiles(newFiles);
        setData('attachments', newFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/support/${ticket.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreviewFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <>
            <Head title={`Tiket ${ticket.ticket_number}`} />

            <PageHeader
                title={`Tiket: ${ticket.subject}`}
                description={`Detail percakapan dukungan untuk tiket ${ticket.ticket_number}`}
                breadcrumbs={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Support', href: '/dashboard/support' },
                    { name: ticket.ticket_number }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content: Chat / Replies */}
                <div className="lg:col-span-2 flex flex-col h-[70vh] bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Percakapan Tiket</h3>
                                <p className="text-xs text-gray-500">Dibuat pada {new Date(ticket.created_at).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <Badge variant={ticket.status === 'resolved' || ticket.status === 'closed' ? 'gray' : 'emerald'}>
                            {ticket.status === 'resolved' || ticket.status === 'closed' ? 'Selesai' : 'Aktif'}
                        </Badge>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                        {ticket.replies?.map((reply: any) => {
                            const isMe = reply.user_id === auth.user.id;
                            
                            return (
                                <div key={reply.id} className={`flex gap-4 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <Avatar name={reply.user?.name || 'Admin'} role={reply.user?.role} size="md" />
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-900">{reply.user?.name || 'Support Team'}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(reply.created_at).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                        }`}>
                                            {reply.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input Area */}
                    {(ticket.status !== 'resolved' && ticket.status !== 'closed') ? (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <form onSubmit={handleSubmit} className="relative">
                                {previewFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3 bg-white p-3 rounded-xl border border-gray-200">
                                        {previewFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs">
                                                <span className="font-semibold text-gray-700 truncate max-w-[150px]">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
                                        title="Lampirkan File"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.pdf,.zip,.doc,.docx"
                                    />
                                    
                                    <textarea
                                        placeholder="Ketik balasan Anda..."
                                        className="w-full bg-white rounded-2xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm resize-none py-3 px-4 min-h-[50px] max-h-[150px]"
                                        rows={1}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e as unknown as React.FormEvent);
                                            }
                                        }}
                                        required
                                    ></textarea>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim()}
                                        className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors disabled:opacity-50 shrink-0"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
                                {errors['attachments.0'] && <p className="text-red-500 text-xs mt-2">{errors['attachments.0']}</p>}
                            </form>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center justify-center text-center text-gray-500">
                            <AlertCircle size={24} className="mb-2 opacity-50" />
                            <p className="text-sm font-semibold">Tiket ini telah ditutup.</p>
                            <p className="text-xs">Jika Anda masih membutuhkan bantuan, silakan buat tiket baru.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Metadata & Attachments */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Informasi Tiket" className="p-0">
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500">Status</span>
                                <Badge variant={
                                    ticket.status === 'open' ? 'emerald' :
                                    ticket.status === 'waiting_user' ? 'amber' :
                                    ticket.status === 'waiting_admin' ? 'blue' : 'gray'
                                } className="uppercase">
                                    {ticket.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500">Prioritas</span>
                                <Badge variant={
                                    ticket.priority === 'critical' ? 'error' :
                                    ticket.priority === 'high' ? 'warning' : 'gray'
                                } className="uppercase">
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500">Kategori</span>
                                <span className="text-sm font-bold text-gray-900 capitalize">{ticket.category}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Lampiran Tiket" className="p-0">
                        {ticket.attachments && ticket.attachments.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {ticket.attachments.map((file: any) => (
                                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <Paperclip size={14} />
                                            </div>
                                            <div className="truncate">
                                                <div className="text-xs font-bold text-gray-900 truncate" title={file.file_name}>{file.file_name}</div>
                                                <div className="text-[10px] text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</div>
                                            </div>
                                        </div>
                                        <a
                                            href={`/storage/${file.file_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                                            title="Download File"
                                        >
                                            <Download size={16} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-xs font-medium text-gray-400">
                                Tidak ada lampiran.
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

SupportShow.layout = (page: any) => <AppLayout children={page} />;
