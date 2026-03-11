import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Server } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './ResearchPage.module.css';

interface CompetitorUpdate {
    competitor: string;
    what_changed: string;
    significance: string;
}

interface FdaAlert {
    title: string;
    detail: string;
}

interface MarketSignal {
    signal: string;
    source?: string;
}

interface RecommendedAction {
    action: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface ResearchReport {
    id: string;
    created_at: string;
    run_type: 'deep' | 'light';
    brand: 'vero' | 'peptides-please' | 'uglow-uslim' | 'icarus';
    summary: string | null;
    competitor_updates: CompetitorUpdate[];
    fda_alerts: FdaAlert[];
    market_signals: MarketSignal[];
    recommended_actions: RecommendedAction[];
    critical_alert: boolean;
    run_duration_seconds: number | null;
    sources_checked: number;
    agent_id: string | null;
}

const BRAND_LABELS: Record<string, string> = {
    vero: 'VERO',
    'peptides-please': 'Peptides Please',
    'uglow-uslim': 'Uglow/Uslim',
    icarus: 'Icarus',
};

const BRAND_CLASSES: Record<string, string> = {
    vero: styles.brandVero,
    'peptides-please': styles.brandPeptides,
    'uglow-uslim': styles.brandUglow,
    icarus: styles.brandIcarus,
};

function ReportCard({ report }: { report: ResearchReport }) {
    const [expanded, setExpanded] = useState(false);

    const competitorUpdates = Array.isArray(report.competitor_updates) ? report.competitor_updates : [];
    const fdaAlerts = Array.isArray(report.fda_alerts) ? report.fda_alerts : [];
    const marketSignals = Array.isArray(report.market_signals) ? report.market_signals : [];
    const recommendedActions = Array.isArray(report.recommended_actions) ? report.recommended_actions : [];

    return (
        <div className={`${styles.reportCard} ${report.critical_alert ? styles.reportCritical : ''}`}>
            <div className={styles.reportHeader} onClick={() => setExpanded(e => !e)}>
                <div className={styles.reportMeta}>
                    <span className={styles.reportDate}>
                        {format(new Date(report.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                    <span className={`${styles.badge} ${BRAND_CLASSES[report.brand] ?? styles.brandIcarus}`}>
                        {BRAND_LABELS[report.brand] ?? report.brand}
                    </span>
                    <span className={`${styles.runTypeBadge} ${report.run_type === 'deep' ? styles.runTypeDeep : styles.runTypeLight}`}>
                        {report.run_type.toUpperCase()}
                    </span>
                    {report.critical_alert && (
                        <span className={styles.criticalBadge}>
                            <AlertTriangle size={11} />
                            CRITICAL
                        </span>
                    )}
                </div>
                <button className={styles.expandBtn}>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {report.summary && (
                <p className={styles.reportSummary}>{report.summary}</p>
            )}

            <div className={styles.reportStats}>
                <span>{competitorUpdates.length} competitor update{competitorUpdates.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{marketSignals.length} market signal{marketSignals.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{recommendedActions.length} action{recommendedActions.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{report.sources_checked} sources checked</span>
                {report.run_duration_seconds && (
                    <>
                        <span>·</span>
                        <span>{report.run_duration_seconds}s</span>
                    </>
                )}
            </div>

            {expanded && (
                <div className={styles.expandedContent}>
                    {/* Competitor Updates */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Competitor Updates</h4>
                        {competitorUpdates.length === 0 ? (
                            <p className={styles.emptySection}>No competitor updates this run.</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Competitor</th>
                                        <th>What Changed</th>
                                        <th>Significance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitorUpdates.map((u, i) => (
                                        <tr key={i}>
                                            <td className={styles.tdCompetitor}>{u.competitor}</td>
                                            <td>{u.what_changed}</td>
                                            <td>{u.significance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* FDA Alerts */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>FDA Alerts</h4>
                        {fdaAlerts.length === 0 ? (
                            <div className={styles.noAlerts}>No alerts this run.</div>
                        ) : (
                            <div className={styles.fdaAlertsList}>
                                {fdaAlerts.map((alert, i) => (
                                    <div key={i} className={styles.fdaAlert}>
                                        <span className={styles.fdaAlertTitle}>{alert.title}</span>
                                        <span className={styles.fdaAlertDetail}>{alert.detail}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Market Signals */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Market Signals</h4>
                        {marketSignals.length === 0 ? (
                            <p className={styles.emptySection}>No market signals this run.</p>
                        ) : (
                            <ul className={styles.signalList}>
                                {marketSignals.map((s, i) => (
                                    <li key={i} className={styles.signalItem}>
                                        <span className={styles.signalBullet}>—</span>
                                        <span>
                                            {s.signal}
                                            {s.source && (
                                                <span className={styles.signalSource}> · {s.source}</span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Recommended Actions */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Recommended Actions</h4>
                        {recommendedActions.length === 0 ? (
                            <p className={styles.emptySection}>No actions recommended this run.</p>
                        ) : (
                            <ol className={styles.actionList}>
                                {recommendedActions.map((a, i) => (
                                    <li key={i} className={styles.actionItem}>
                                        <span className={styles.actionNumber}>{i + 1}</span>
                                        <span className={styles.actionText}>{a.action}</span>
                                        <span className={`${styles.priorityBadge} ${styles['priority' + a.priority]}`}>
                                            {a.priority}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ResearchPage() {
    const navigate = useNavigate();
    const [reports, setReports] = useState<ResearchReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [brandFilter, setBrandFilter] = useState<string>('all');
    const [runTypeFilter, setRunTypeFilter] = useState<string>('all');
    const [criticalOnly, setCriticalOnly] = useState(false);

    useEffect(() => {
        // Check URL params for brand filter from Fleet page
        const params = new URLSearchParams(window.location.search);
        const brandParam = params.get('brand');
        if (brandParam) setBrandFilter(brandParam);
    }, []);

    useEffect(() => {
        async function fetchReports() {
            setLoading(true);
            const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
            let query = supabase
                .from('research_reports')
                .select('*')
                .gte('created_at', thirtyDaysAgo)
                .order('created_at', { ascending: false });

            if (brandFilter !== 'all') query = query.eq('brand', brandFilter);
            if (runTypeFilter !== 'all') query = query.eq('run_type', runTypeFilter);
            if (criticalOnly) query = query.eq('critical_alert', true);

            const { data } = await query;
            setReports((data as ResearchReport[]) || []);
            setLoading(false);
        }
        fetchReports();
    }, [brandFilter, runTypeFilter, criticalOnly]);

    const recentCriticalCount = reports.filter(r =>
        r.critical_alert && isAfter(new Date(r.created_at), subDays(new Date(), 7))
    ).length;

    const brandTabs = [
        { value: 'all', label: 'All Brands' },
        { value: 'vero', label: 'VERO' },
        { value: 'peptides-please', label: 'Peptides Please' },
        { value: 'uglow-uslim', label: 'Uglow/Uslim' },
        { value: 'icarus', label: 'Icarus' },
    ];

    return (
        <div className={styles.page}>
            {recentCriticalCount > 0 && (
                <div className={styles.criticalBanner}>
                    <AlertTriangle size={16} />
                    <strong>{recentCriticalCount} critical alert{recentCriticalCount !== 1 ? 's' : ''} in the last 7 days</strong>
                    — review immediately
                </div>
            )}

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Research Intelligence</h1>
                    <p className={styles.subtitle}>Competitive intelligence reports from the Research Agent</p>
                </div>
            </header>

            {/* Filters */}
            <div className={styles.filtersRow}>
                <div className={styles.brandTabs}>
                    {brandTabs.map(tab => (
                        <button
                            key={tab.value}
                            className={`${styles.brandTab} ${brandFilter === tab.value ? styles.brandTabActive : ''}`}
                            onClick={() => setBrandFilter(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className={styles.filterControls}>
                    <select
                        className={styles.select}
                        value={runTypeFilter}
                        onChange={e => setRunTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="deep">Deep Run</option>
                        <option value="light">Light Run</option>
                    </select>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={criticalOnly}
                            onChange={e => setCriticalOnly(e.target.checked)}
                            className={styles.toggleInput}
                        />
                        <span className={styles.toggleSwitch} />
                        Critical only
                    </label>
                </div>
            </div>

            {/* Reports */}
            {loading ? (
                <div className={styles.loadingState}>Loading reports...</div>
            ) : reports.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Server size={40} />
                    </div>
                    <h3 className={styles.emptyTitle}>No reports yet</h3>
                    <p className={styles.emptyText}>
                        The Research Agent hasn't run yet. Once deployed, reports will appear here automatically.
                    </p>
                    <button className={styles.emptyBtn} onClick={() => navigate('/fleet')}>
                        View Fleet Status
                    </button>
                </div>
            ) : (
                <div className={styles.reportsList}>
                    {reports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>
            )}
        </div>
    );
}
