import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Badge from '@/Components/UI/Badge';
import Avatar from '@/Components/UI/Avatar';
import Card from '@/Components/UI/Card';
import Modal from '@/Components/UI/Modal';
import { PageProps } from '@/types';
import { Send, Paperclip, X, Download, MessageSquare, ShieldAlert, FileClock, Users } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

interface AdminTicketShowProps extends PageProps {
    ticket: any;
    admins: any[];
}

export default function AdminTicketShow({ ticket, admins }: AdminTicketShowProps) {
    const flash = usePage<PageProps>().props.flash;
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);
    const [isInternal, setIsInternal] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
        is_internal: false,
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
        setData('is_internal', isInternal); // Sync state to form
        
        // Use a small timeout to let form state sync before submitting
        setTimeout(() => {
            post(`/admin/tickets/${ticket.id}/reply`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setPreviewFiles([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                },
            });
        }, 50);
    };

    const handleStatusChange = (status: string) => {
        router.patch(`/admin/tickets/${ticket.id}/status`, { status }, { preserveScroll: true });
    };

    const handleAssign = (adminId: number) => {
        router.post(`/admin/tickets/${ticket.id}/assign`, { admin_id: adminId }, { 
            preserveScroll: true,
            onSuccess: () => setAssignModalOpen(false)
        });
    };

    return (
        <>
            <Head title={`Admin Tiket ${ticket.ticket_number}`} />

            <PageHeader
                title={`Tiket: ${ticket.subject}`}
                description={`Manajemen dan respon tiket dari ${ticket.user?.name}`}
                breadcrumbs={[
                    { name: 'Admin Console', href: '/admin/dashboard' },
                    { name: 'Tickets', href: '/admin/tickets' },
                    { name: ticket.ticket_number }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content: Chat / Replies */}
                <div className="lg:col-span-2 flex flex-col h-[75vh] bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar name={ticket.user?.name} src={ticket.user?.avatar} size="md" />
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{ticket.user?.name} <span className="text-gray-400 font-normal ml-1">({ticket.user?.email})</span></h3>
                                <p className="text-xs text-gray-500">Dibuat pada {new Date(ticket.created_at).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select 
                                className="text-xs font-bold border-gray-200 rounded-xl py-1.5 px-3 focus:ring-emerald-500/20 focus:border-emerald-500"
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="open">Open</option>
                                <option value="waiting_user">Waiting User</option>
                                <option value="waiting_admin">Waiting Admin</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                        {ticket.replies?.map((reply: any) => {
                            const isAdmin = ['admin', 'moderator'].includes(reply.user?.role);
                            const isMe = reply.user_id === auth.user.id;
                            
                            return (
                                <div key={reply.id} className={`flex gap-4 max-w-[85%] ${isAdmin ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <Avatar name={reply.user?.name} role={reply.user?.role} size="md" />
                                    <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-900">{reply.user?.name}</span>
                                            {reply.is_internal && <Badge variant="warning" className="text-[10px] px-1.5 py-0">Internal Note</Badge>}
                                            <span className="text-[10px] text-gray-400">{new Date(reply.created_at).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            reply.is_internal 
                                                ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-tr-sm' 
                                                : isAdmin 
                                                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                                                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
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
                                
                                <div className="w-full relative">
                                    <textarea
                                        placeholder={isInternal ? "Ketik catatan internal (hanya admin yang dapat melihat)..." : "Ketik balasan untuk pengguna..."}
                                        className={`w-full bg-white rounded-2xl border-gray-200 focus:ring-4 text-sm resize-none py-3 px-4 min-h-[50px] max-h-[150px] ${
                                            isInternal ? 'focus:border-amber-500 focus:ring-amber-500/10 bg-amber-50/30' : 'focus:border-blue-500 focus:ring-blue-500/10'
                                        }`}
                                        rows={2}
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
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsInternal(!isInternal)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                            isInternal ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                        }`}
                                    >
                                        {isInternal ? 'Note Mode' : 'Public Reply'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim()}
                                        className={`p-2.5 rounded-xl text-white shadow-md transition-colors flex items-center justify-center gap-2 ${
                                            isInternal ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                                        } disabled:opacity-50`}
                                    >
                                        {isInternal ? <ShieldAlert size={16} /> : <Send size={16} />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Metadata & Attachments */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Info Tiket & SLA" className="p-0">
                        <div className="divide-y divide-gray-100">
                            <div className="p-4">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tiket Di-Assign Kepada</label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span className="text-sm font-bold text-gray-900">{ticket.assigned_admin?.name || 'Unassigned'}</span>
                                    </div>
                                    <button 
                                        onClick={() => setAssignModalOpen(true)}
                                        className="text-xs font-bold text-indigo-600 hover:underline"
                                    >
                                        Ubah
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 block mb-1">Prioritas</span>
                                    <Badge variant={
                                        ticket.priority === 'critical' ? 'error' :
                                        ticket.priority === 'high' ? 'warning' : 'gray'
                                    } className="uppercase">
                                        {ticket.priority}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 block mb-1">Kategori</span>
                                    <span className="text-sm font-bold text-gray-900 capitalize">{ticket.category}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Resolusi & Waktu</label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 flex items-center gap-1"><FileClock size={12}/> First Response</span>
                                        <span className="font-bold text-gray-900">{ticket.first_response_at ? new Date(ticket.first_response_at).toLocaleString('id-ID') : 'Belum Dijawab'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 flex items-center gap-1"><FileClock size={12}/> Waktu Selesai</span>
                                        <span className="font-bold text-gray-900">{ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleString('id-ID') : '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Lampiran Tiket" className="p-0">
                        {ticket.attachments && ticket.attachments.length > 0 ? (
                            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
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

            {/* Assign Modal */}
            <Modal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Assign Tiket"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Pilih Admin atau Moderator untuk menangani tiket ini.</p>
                    <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto border border-gray-100 rounded-xl">
                        {admins.map((admin) => (
                            <button
                                key={admin.id}
                                onClick={() => handleAssign(admin.id)}
                                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${ticket.assigned_admin_id === admin.id ? 'bg-indigo-50' : ''}`}
                            >
                                <span className="text-sm font-bold text-gray-900">{admin.name}</span>
                                {ticket.assigned_admin_id === admin.id && <Badge variant="indigo">Assigned</Badge>}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}

AdminTicketShow.layout = (page: any) => <AppLayout children={page} />;
