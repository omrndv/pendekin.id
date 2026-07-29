export type UserRole = 'user' | 'admin' | 'moderator' | 'superadmin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string | null;
    email_verified_at?: string | null;
    status?: 'active' | 'suspended' | 'pending';
    is_active: boolean;
    links_count?: number;
    short_links_count?: number;
    api_keys_count?: number;
    qr_codes_count?: number;
    created_at: string;
    deleted_at?: string | null;
}

export interface ShortLink {
    id: number;
    user_id: number;
    user_name?: string;
    title: string;
    original_url: string;
    short_slug: string;
    short_url: string;
    clicks_count: number;
    max_clicks?: number | null;
    expires_at?: string | null;
    is_active: boolean;
    is_flagged?: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    user?: User;
}

export interface ClickAnalytics {
    id: number;
    link_id: number;
    country: string;
    city: string;
    device: string;
    browser: string;
    referrer: string;
    clicked_at: string;
}

export interface ApiKey {
    id: number;
    name: string;
    key_prefix?: string;
    last_used_at?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface AbuseReport {
    id: number;
    short_link_id: number;
    link_url?: string;
    short_link?: ShortLink;
    reason: string;
    description?: string | null;
    severity?: 'low' | 'medium' | 'high' | 'critical' | null;
    screenshot_path?: string | null;
    reporter_email: string;
    status: 'pending' | 'resolved' | 'dismissed' | 'approved' | 'rejected';
    created_at: string;
}

export interface AuditLog {
    id: number;
    user_id?: number | null;
    user?: { name: string };
    action: string;
    auditable_type?: string;
    auditable_id?: number;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface SystemLog {
    id: number;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    context?: string;
    user_email?: string;
    created_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface NavigationItem {
    name: string;
    href: string;
    icon: string;
    active: boolean;
    badge?: string | number;
    roles?: UserRole[];
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> extends T {
    auth: {
        user: User;
        unread_notifications_count?: number;
        pending_reports_count?: number;
        open_tickets_count?: number;
    };
    flash: {
        success?: string;
        error?: string;
        redirect_url?: string;
    };
};
