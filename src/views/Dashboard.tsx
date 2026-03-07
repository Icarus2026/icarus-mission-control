
import { Activity, CheckCircle2, Clock, Terminal, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

interface ActivityItem {
    id: string;
    time: string;
    message: string;
    brand: 'Icarus' | 'VERO' | 'Lumova' | 'Mick';
    status: 'active' | 'pending' | 'error' | 'idle';
}

const mockActivityFeed: ActivityItem[] = [
    {
        id: 'act-1',
        time: '10:42 AM',
        message: 'Mick completed weekly PMax campaign analysis for VERO Launch. Report generated.',
        brand: 'VERO',
        status: 'active'
    },
    {
        id: 'act-2',
        time: '09:15 AM',
        message: 'Drafting landing page copy for Lumova Health preventative screening guide.',
        brand: 'Lumova',
        status: 'pending'
    },
    {
        id: 'act-3',
        time: '08:30 AM',
        message: 'Failed to sync latest CRM contacts from Hubspot API. Retrying in 15m.',
        brand: 'Icarus',
        status: 'error'
    },
    {
        id: 'act-4',
        time: '08:00 AM',
        message: 'System cron: Nightly database backup completed successfully.',
        brand: 'Mick',
        status: 'idle'
    },
    {
        id: 'act-5',
        time: 'Yesterday',
        message: 'Published LinkedIn carousel: "The AI ROI for Marketing Agencies".',
        brand: 'Icarus',
        status: 'active'
    }
];

export default function Dashboard() {
    const getBadgeClass = (brand: string) => {
        switch (brand) {
            case 'Icarus': return styles.badgeIcarus;
            case 'VERO': return styles.badgeVero;
            case 'Lumova': return styles.badgeLumova;
            case 'Mick': return styles.badgeMick;
            default: return '';
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
                <h1 className={`${styles.greeting} text-gradient`}>Good Morning, Commander.</h1>
                <p className={styles.subtitle}>All systems nominal. Here is your overview for today.</p>
            </header>

            <section className={styles.metricsGrid}>
                <div className={`glass-panel ${styles.metricCard} ${styles.cardIcarus}`}>
                    <div className={styles.metricHeader}>
                        Active Tasks
                        <CheckCircle2 size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        12 <span className={styles.metricLabel}>pending</span>
                    </div>
                    <div className={styles.metricTrend}>
                        <TrendingUp size={14} className={styles.trendPositive} />
                        <span className={styles.trendPositive}>+3</span> since yesterday
                    </div>
                </div>

                <div className={`glass-panel ${styles.metricCard} ${styles.cardVero}`}>
                    <div className={styles.metricHeader}>
                        Pipeline Status
                        <Activity size={18} className={styles.icon} />
                    </div>
                    <div className={styles.metricValue}>
                        8 <span className={styles.metricLabel}>drafts</span>
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
                    {mockActivityFeed.map(item => (
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
