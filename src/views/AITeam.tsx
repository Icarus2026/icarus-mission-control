
import { Network, Database, PenTool, Cpu, Activity, Clock, Zap } from 'lucide-react';
import styles from './AITeam.module.css';

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

const masterAgent = {
    name: 'Mick',
    role: 'Master Orchestrator',
    status: 'Online' as Status,
    currentTask: 'Monitoring global task limits and allocating compute to Data Analysis sub-agents. Awaiting approval on Lumova brief.',
    lastActive: 'Just now',
    metrics: [
        { label: 'Active Tasks', value: '14' },
        { label: 'Avg Task Time', value: '1.2s' },
        { label: 'Uptime', value: '99.9%' }
    ]
};

const departments: Department[] = [
    {
        id: 'research',
        title: 'Research',
        icon: <Database size={20} />,
        agents: [
            {
                id: 'r1',
                name: 'Athena',
                role: 'Data Miner',
                status: 'Busy',
                currentTask: 'Scraping competitor SEO backlinks for VERO Launch.',
                lastActive: '2m ago'
            },
            {
                id: 'r2',
                name: 'Apollo',
                role: 'Trend Analyst',
                status: 'Idle',
                currentTask: 'Pending new search parameters.',
                lastActive: '45m ago'
            }
        ]
    },
    {
        id: 'content',
        title: 'Content',
        icon: <PenTool size={20} />,
        agents: [
            {
                id: 'c1',
                name: 'Calliope',
                role: 'Copywriter',
                status: 'Busy',
                currentTask: 'Drafting LinkedIn carousel for Icarus Operations "AI ROI" framework.',
                lastActive: 'Just now'
            },
            {
                id: 'c2',
                name: 'Hermes',
                role: 'Social Dist',
                status: 'Online',
                currentTask: 'Queuing approved VERO drafts to Buffer API.',
                lastActive: '5m ago'
            }
        ]
    },
    {
        id: 'development',
        title: 'Development',
        icon: <Cpu size={20} />,
        agents: [
            {
                id: 'd1',
                name: 'Hephaestus',
                role: 'Code Gen',
                status: 'Idle',
                currentTask: 'Awaiting Next.js component specifications.',
                lastActive: '2h ago'
            },
            {
                id: 'd2',
                name: 'Argus',
                role: 'QA/Testing',
                status: 'Busy',
                currentTask: 'Running end-to-end Cypress tests on Lumova staging environment.',
                lastActive: '1m ago'
            }
        ]
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: <Activity size={20} />,
        agents: [
            {
                id: 'o1',
                name: 'Janus',
                role: 'CRM Sync',
                status: 'Online',
                currentTask: 'Syncing recent lead form submissions to HubSpot and updating tags.',
                lastActive: '12m ago'
            }
        ]
    }
];

export default function AITeam() {
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
                <h1 className={`${styles.title} text-gradient`}>Autonomous Team</h1>
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
