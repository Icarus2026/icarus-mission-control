import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Clock, Terminal, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';
import { supabase } from '../lib/supabase';

interface ActivityItem {
    id: string;
    time: string;
    message: string;
    brand: string;
    status: 'active' | 'pending' | 'error' | 'idle';
}

const formatDashboardTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    // Use simple diff for today vs yesterday roughly
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    if (isToday) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function Dashboard() {
    const [feed, setFeed] = useState<ActivityItem[]>([]);
    const [activeTasksCount, setActiveTasksCount] = useState<number>(0);
    const [draftsCount, setDraftsCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        const [logsRes, tasksRes, contentRes] = await Promise.all([
            // In a real foreign key relationship we'd do: select(`*, agents(name)`)
            // But if agents is not properly keyed we can just use the project string directly
            supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(10),
            supabase.from('tasks').select('id, status'),
            supabase.from('content_items').select('id, status')
        ]);

        if (logsRes.data) {
            setFeed(logsRes.data.map((log: any) => ({
                id: log.id,
                time: formatDashboardTime(log.created_at),
                message: log.message,
                brand: log.project || 'System',
                status: log.status_type as any
            })));
        }

        if (tasksRes.data) {
            setActiveTasksCount(tasksRes.data.filter((t: any) => t.status !== 'Done').length);
        }

        if (contentRes.data) {
            setDraftsCount(contentRes.data.filter((c: any) => c.status.toLowerCase() === 'draft').length);
        }
        setIsLoading(false);
    };

    const getBadgeClass = (brand: string) => {
        switch (brand) {
            case 'Icarus': return styles.badgeIcarus;
            case 'VERO': return styles.badgeVero;
            case 'Lumova': return styles.badgeLumova;
            case 'Mick': return styles.badgeMick;
            default: return styles.badgeMick;
        }
    };

    const getStatusDotClass = (status: string) => {
        switch (status) {
            case 'active': return styles.dotActive;
            case 'pending': return styles.dotPending;
            case 'error': return styles.dotError;
            case 'idle': return styles.dotIdle;
            default: return styles.dotIdle;
        }
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className="flex items-center gap-4">
                    <h1 className={`${styles.greeting} text-gradient mb-0`}>Good Morning, Commander.</h1>
                    {isLoading && <span className="text-secondary text-sm animate-pulse mt-2">Syncing telemetry...</span>}
                </div>
                <p className={styles.subtitle}>All systems nominal. Here is your overview for today.</p>
            </header>

            <section className={styles.metricsGrid}>
                <div className={`glass-panel ${styles.metricCard} ${styles.cardIcarus}`}>
                    <div className={styles.metricHeader}>
                        Active Tasks
                        <CheckCircle2 size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        {activeTasksCount} <span className={styles.metricLabel}>pending</span>
                    </div>
                    <div className={styles.metricTrend}>
                        <TrendingUp size={14} className={styles.trendPositive} />
                        <span className={styles.trendPositive}>Live sync</span> Active queue
                    </div>
                </div>

                <div className={`glass-panel ${styles.metricCard} ${styles.cardVero}`}>
                    <div className={styles.metricHeader}>
                        Pipeline Status
                        <Activity size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        {draftsCount} <span className={styles.metricLabel}>drafts</span>
                    </div>
                    <div className={styles.metricTrend}>
                        <span className={styles.trendNeutral}>4 ready for publish</span>
                    </div>
                </div>

                <div className={`glass-panel ${styles.metricCard} ${styles.cardLumova}`}>
                    <div className={styles.metricHeader}>
                        Upcoming (48h)
                        <Clock size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        3 <span className={styles.metricLabel}>events</span>
                    </div>
                    <div className={styles.metricTrend}>
                        <span className={styles.trendNeutral}>Next: Lumova Content Sync</span>
                    </div>
                </div>

                <div className={`glass-panel ${styles.metricCard} ${styles.cardAdmin}`}>
                    <div className={styles.metricHeader}>
                        Mick Activity
                        <Terminal size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        Online
                    </div>
                    <div className={styles.metricTrend}>
                        <span className={styles.trendPositive}>●</span> System Orchestrator Active
                    </div>
                </div>
            </section>

            <section className={styles.feedSection}>
                <div className={styles.feedHeader}>
                    <h2 className={styles.feedTitle}>
                        Live Mission Feed
                        <div className={styles.liveIndicator} />
                    </h2>
                </div>

                <div className={styles.feedList}>
                    {feed.map(item => (
                        <div key={item.id} className={styles.feedItem}>
                            <div className={`${styles.statusDot} ${getStatusDotClass(item.status)}`} />
                            <div className={styles.feedTime}>{item.time}</div>
                            <div className={styles.feedContent}>
                                <div className={styles.feedMessage}>{item.message}</div>
                                <div className={styles.feedMeta}>
                                    <span className={`${styles.badge} ${getBadgeClass(item.brand)}`}>
                                        {item.brand}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
