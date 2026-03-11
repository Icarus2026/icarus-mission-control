import { useState, useEffect, useCallback } from 'react';
import { Activity, Server, X, ChevronRight, Cpu } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { supabase } from '../lib/supabase';
import styles from './FleetPage.module.css';

interface Agent {
    id: string;
    name: string;
    role: string;
    health_status: 'healthy' | 'degraded' | 'offline' | 'pending';
    vertical: string;
    brand: string;
    port: number | null;
    last_run_at: string | null;
    next_run_at: string | null;
    last_output_summary: string | null;
    run_count: number;
    error_count: number;
    created_at: string;
}

interface AgentLog {
    id: string;
    created_at: string;
    message: string;
    status_type: 'success' | 'warning' | 'error' | 'info';
    agent_id: string;
}

function relativeTime(dateStr: string | null): string {
    if (!dateStr) return 'Never';
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

function formatNextRun(dateStr: string | null): string {
    if (!dateStr) return 'Not scheduled';
    return format(new Date(dateStr), 'MMM d, h:mm a');
}

function HealthDot({ status }: { status: Agent['health_status'] }) {
    const classMap = {
        healthy: styles.dotHealthy,
        degraded: styles.dotDegraded,
        offline: styles.dotOffline,
        pending: styles.dotPending,
    };
    const labelMap = {
        healthy: 'Healthy',
        degraded: 'Degraded',
        offline: 'Offline',
        pending: 'Pending',
    };
    return (
        <span className={`${styles.healthBadge} ${classMap[status]}`}>
            <span className={styles.healthDot} />
            {labelMap[status]}
        </span>
    );
}

function BrandBadge({ brand }: { brand: string }) {
    const classMap: Record<string, string> = {
        vero: styles.brandVero,
        icarus: styles.brandIcarus,
    };
    return (
        <span className={`${styles.badge} ${classMap[brand] ?? styles.brandDefault}`}>
            {brand.toUpperCase()}
        </span>
    );
}

function VerticalBadge({ vertical }: { vertical: string }) {
    return <span className={styles.verticalBadge}>{vertical}</span>;
}

function AgentCard({
    agent,
    onViewLogs,
    onViewReports,
}: {
    agent: Agent;
    onViewLogs: () => void;
    onViewReports: () => void;
}) {
    const cardBorderClass = {
        healthy: styles.cardHealthy,
        degraded: styles.cardDegraded,
        offline: styles.cardOffline,
        pending: styles.cardPending,
    }[agent.health_status];

    return (
        <div className={`${styles.agentCard} ${cardBorderClass}`}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                    <Cpu size={16} className={styles.cardIcon} />
                    <span>{agent.name}</span>
                </div>
                <HealthDot status={agent.health_status} />
            </div>

            <div className={styles.badgeRow}>
                <BrandBadge brand={agent.brand} />
                <VerticalBadge vertical={agent.vertical} />
            </div>

            <p className={styles.roleText}>{agent.role}</p>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Last run</span>
                    <span className={styles.statValue}>{relativeTime(agent.last_run_at)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Next run</span>
                    <span className={styles.statValue}>{formatNextRun(agent.next_run_at)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Runs</span>
                    <span className={styles.statValue}>{agent.run_count}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Errors</span>
                    <span className={`${styles.statValue} ${agent.error_count > 0 ? styles.errorValue : ''}`}>
                        {agent.error_count}
                    </span>
                </div>
            </div>

            {agent.last_output_summary && (
                <p className={styles.outputSummary}>{agent.last_output_summary}</p>
            )}

            <div className={styles.cardActions}>
                <button className={styles.btnSecondary} onClick={onViewLogs}>
                    View Logs
                </button>
                {agent.vertical === 'research' && (
                    <button className={styles.btnPrimary} onClick={onViewReports}>
                        View Reports <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

function LogsSlideOver({
    agent,
    logs,
    loading,
    onClose,
}: {
    agent: Agent;
    logs: AgentLog[];
    loading: boolean;
    onClose: () => void;
}) {
    const logStatusClass = (status: string) => {
        switch (status) {
            case 'success': return styles.logSuccess;
            case 'warning': return styles.logWarning;
            case 'error': return styles.logError;
            default: return styles.logInfo;
        }
    };

    return (
        <>
            <div className={styles.slideOverBackdrop} onClick={onClose} />
            <div className={styles.slideOver}>
                <div className={styles.slideOverHeader}>
                    <div>
                        <div className={styles.slideOverTitle}>
                            <Server size={16} />
                            {agent.name}
                        </div>
                        <div className={styles.slideOverSubtitle}>Last 20 log entries</div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.logsList}>
                    {loading ? (
                        <div className={styles.logsLoading}>Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className={styles.logsEmpty}>No logs yet for this agent.</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className={styles.logEntry}>
                                <span className={`${styles.logBadge} ${logStatusClass(log.status_type)}`}>
                                    {log.status_type}
                                </span>
                                <div className={styles.logContent}>
                                    <span className={styles.logMessage}>{log.message}</span>
                                    <span className={styles.logTime}>
                                        {format(new Date(log.created_at), 'MMM d, h:mm:ss a')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default function FleetPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [slideOverAgent, setSlideOverAgent] = useState<Agent | null>(null);
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    const fetchAgents = useCallback(async () => {
        const { data } = await supabase
            .from('agents')
            .select('*')
            .order('created_at', { ascending: true });
        if (data) {
            setAgents(data as Agent[]);
            setLastUpdated(new Date());
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 30000);

        const channel = supabase
            .channel('agent-fleet')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (payload) => {
                if (payload.eventType === 'UPDATE') {
                    setAgents(prev =>
                        prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } as Agent : a)
                    );
                    setLastUpdated(new Date());
                } else if (payload.eventType === 'INSERT') {
                    setAgents(prev => [...prev, payload.new as Agent]);
                    setLastUpdated(new Date());
                }
            })
            .subscribe();

        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, [fetchAgents]);

    const openLogs = async (agent: Agent) => {
        setSlideOverAgent(agent);
        setLogsLoading(true);
        setLogs([]);
        const { data } = await supabase
            .from('agent_logs')
            .select('*')
            .eq('agent_id', agent.id)
            .order('created_at', { ascending: false })
            .limit(20);
        setLogs((data as AgentLog[]) || []);
        setLogsLoading(false);
    };

    const healthyCount = agents.filter(a => a.health_status === 'healthy').length;
    const degradedCount = agents.filter(a => a.health_status === 'degraded').length;
    const offlineCount = agents.filter(a => a.health_status === 'offline').length;
    const pendingCount = agents.filter(a => a.health_status === 'pending').length;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Agent Fleet</h1>
                    <p className={styles.subtitle}>Live status of all autonomous agents</p>
                </div>
                <div className={styles.lastUpdated}>
                    <Activity size={13} />
                    Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </div>
            </header>

            <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryCount}>{agents.length}</span>
                    <span className={styles.summaryLabel}>Total</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryHealthy}`}>
                    <span className={styles.summaryCount}>{healthyCount}</span>
                    <span className={styles.summaryLabel}>Healthy</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryDegraded}`}>
                    <span className={styles.summaryCount}>{degradedCount}</span>
                    <span className={styles.summaryLabel}>Degraded</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryOffline}`}>
                    <span className={styles.summaryCount}>{offlineCount}</span>
                    <span className={styles.summaryLabel}>Offline</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryPending}`}>
                    <span className={styles.summaryCount}>{pendingCount}</span>
                    <span className={styles.summaryLabel}>Pending</span>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>Loading fleet...</div>
            ) : (
                <div className={styles.grid}>
                    {agents.map(agent => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onViewLogs={() => openLogs(agent)}
                            onViewReports={() => window.location.href = '/research?brand=' + agent.brand}
                        />
                    ))}
                </div>
            )}

            {slideOverAgent && (
                <LogsSlideOver
                    agent={slideOverAgent}
                    logs={logs}
                    loading={logsLoading}
                    onClose={() => setSlideOverAgent(null)}
                />
            )}
        </div>
    );
}
