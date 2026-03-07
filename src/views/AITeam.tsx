import { useState, useEffect } from 'react';
import { Network, Database, PenTool, Cpu, Activity, Clock, Zap } from 'lucide-react';
import styles from './AITeam.module.css';
import { supabase } from '../lib/supabase';

type Status = 'Online' | 'Busy' | 'Idle';

interface Agent {
    id: string;
    name: string;
    role: string;
    status: Status;
    currentTask: string;
    lastActive: string;
}

interface Department {
    id: string;
    title: string;
    icon: React.ReactNode;
    agents: Agent[];
}

const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
};

const baseDepartments = [
    { id: 'Research', title: 'Research', icon: <Database size={20} /> },
    { id: 'Content', title: 'Content', icon: <PenTool size={20} /> },
    { id: 'Development', title: 'Development', icon: <Cpu size={20} /> },
    { id: 'Operations', title: 'Operations', icon: <Activity size={20} /> }
];

export default function AITeam() {
    const [rawAgents, setRawAgents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('agents').select('*');
        if (error) {
            console.error('Error fetching agents:', error);
            setIsLoading(false);
            return;
        }
        if (data) {
            setRawAgents(data);
        }
        setIsLoading(false);
    };

    const orchestrator = rawAgents.find(a => a.department === 'Orchestrator') || {};
    const masterAgent = {
        name: orchestrator.name || 'Mick',
        role: orchestrator.role || 'Master Orchestrator',
        status: (orchestrator.status || 'Online') as Status,
        currentTask: orchestrator.current_task || 'Loading...',
        lastActive: formatRelativeTime(orchestrator.last_active),
        metrics: [
            { label: 'Active Tasks', value: '14' },
            { label: 'Avg Task Time', value: '1.2s' },
            { label: 'Uptime', value: '99.9%' }
        ]
    };

    const departments: Department[] = baseDepartments.map(dept => ({
        ...dept,
        agents: rawAgents
            .filter(a => a.department === dept.id)
            .map(a => ({
                id: a.id,
                name: a.name,
                role: a.role,
                status: a.status as Status,
                currentTask: a.current_task,
                lastActive: formatRelativeTime(a.last_active)
            }))
    }));

    const getStatusClass = (status: Status) => {
        switch (status) {
            case 'Online': return styles.statusOnline;
            case 'Busy': return styles.statusBusy;
            case 'Idle': return styles.statusIdle;
            default: return '';
        }
    };

    const renderAgentCard = (agent: Agent) => (
        <div key={agent.id} className={styles.agentCard}>
            <div className={styles.agentHeader}>
                <div className={styles.agentInfo}>
                    <div className={styles.avatar}>{agent.name.charAt(0)}</div>
                    <div>
                        <div className={styles.agentName}>{agent.name}</div>
                        <div className={styles.agentRole}>{agent.role}</div>
                    </div>
                </div>
                <div className={`${styles.statusBadge} ${getStatusClass(agent.status)}`}>
                    <div className={styles.statusDot}></div>
                    {agent.status}
                </div>
            </div>
            <div className={styles.agentTask}>
                <span className="text-tertiary">Current Task:</span> <br />
                {agent.currentTask}
            </div>
            <div className={styles.agentFooter}>
                <div className={styles.lastActive}>
                    <Clock size={12} /> Last active: {agent.lastActive}
                </div>
                <Zap size={14} className={agent.status === 'Idle' ? 'text-tertiary' : 'text-icarus'} />
            </div>
        </div>
    );

    return (
        <div className={styles.teamView}>
            <header className={styles.header}>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className={`${styles.title} text-gradient`} style={{ marginBottom: 0 }}>Autonomous Team</h1>
                    {isLoading && <span className="text-secondary text-sm animate-pulse">Syncing compute nodes...</span>}
                </div>
                <p className={styles.subtitle}>Current topology of deployed agents and active processes.</p>
            </header>

            <div className={styles.orgChart}>

                {/* Master Agent */}
                <div className={styles.masterAgent}>
                    <div className={styles.agentHeader}>
                        <div className={styles.agentInfo}>
                            <div className={`${styles.avatar} ${styles.masterAvatar}`}>
                                <Network size={32} />
                            </div>
                            <div>
                                <div className={`${styles.agentName} ${styles.masterName}`}>{masterAgent.name}</div>
                                <div className={`${styles.agentRole} ${styles.masterRole}`}>{masterAgent.role}</div>
                            </div>
                        </div>
                        <div className={`${styles.statusBadge} ${getStatusClass(masterAgent.status)}`}>
                            <div className={styles.statusDot}></div>
                            {masterAgent.status}
                        </div>
                    </div>

                    <div className={styles.agentTask}>
                        <strong>Orchestration Scope:</strong><br />
                        <span className="text-secondary">{masterAgent.currentTask}</span>
                    </div>

                    <div className={styles.performanceMetrics}>
                        {masterAgent.metrics.map((metric, idx) => (
                            <div key={idx} className={styles.metric}>
                                <span className={styles.metricValue}>{metric.value}</span>
                                <span className={styles.metricLabel}>{metric.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.agentFooter}>
                        <div className={styles.lastActive}>
                            <Clock size={14} /> System synchronized
                        </div>
                    </div>
                </div>

                {/* Departments */}
                <div className={styles.departmentsContainer}>
                    {departments.map(dept => (
                        <div key={dept.id} className={styles.department}>
                            <div className={styles.deptHeader}>
                                <div className={styles.deptIcon}>{dept.icon}</div>
                                <h3 className={styles.deptTitle}>{dept.title}</h3>
                            </div>
                            <div className={styles.agentList}>
                                {dept.agents.map(agent => renderAgentCard(agent))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
