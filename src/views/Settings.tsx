import { useState } from 'react';
import { Clock, Link as LinkIcon, Cpu, Play, FastForward } from 'lucide-react';
import styles from './Settings.module.css';

// Mock Data
const initialCronJobs = [
    {
        id: 'cron-1',
        name: 'Competitor Brand Keyword Scan',
        expression: '0 8 * * *',
        description: 'Searches SERPs for competitor target keywords (VERO, Apex).',
        lastRun: 'Today, 08:00 AM',
        nextRun: 'Tomorrow, 08:00 AM',
        active: true
    },
    {
        id: 'cron-2',
        name: 'Content Pipeline HubSpot Sync',
        expression: '*/15 * * * *',
        description: 'Bi-directional sync between the Mission Control Content Kanban and HubSpot.',
        lastRun: '10 min ago',
        nextRun: '5 min from now',
        active: true
    },
    {
        id: 'cron-3',
        name: 'Lumova Health Lead Form Ingestion',
        expression: '0 * * * *',
        description: 'Parses incoming Typeform leads and queues them for Mick orchestration.',
        lastRun: '50 min ago',
        nextRun: '10 min from now',
        active: true
    },
    {
        id: 'cron-4',
        name: 'System Database Backup',
        expression: '0 0 * * 0',
        description: 'Weekly full memory and vector database backup taking place on Sundays.',
        lastRun: 'Last Sunday, 12:00 AM',
        nextRun: 'Next Sunday, 12:00 AM',
        active: false
    }
];

const integrations = [
    { id: 'int-1', name: 'n8n Webhooks', status: 'Connected' },
    { id: 'int-2', name: 'Supabase Vector', status: 'Connected' },
    { id: 'int-3', name: 'Slack Bot (Mick)', status: 'Connected' },
    { id: 'int-4', name: 'Telegram Alerts', status: 'Disconnected' },
    { id: 'int-5', name: 'Anthropic Claude 3.5 API', status: 'Connected' },
    { id: 'int-6', name: 'Firecrawl Scraper', status: 'Connected' },
    { id: 'int-7', name: 'HubSpot CRM', status: 'Connected' },
    { id: 'int-8', name: 'Meta Ads API', status: 'Disconnected' }
];

export default function SettingsView() {
    const [cronJobs, setCronJobs] = useState(initialCronJobs);

    const toggleCronJob = (id: string) => {
        setCronJobs(jobs => jobs.map(job =>
            job.id === id ? { ...job, active: !job.active } : job
        ));
    };

    return (
        <div className={styles.settingsView}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>System Settings</h1>
                <p className={styles.subtitle}>Configure automated jobs, core integrations, and orchestrator parameters.</p>
            </header>

            <div className={styles.settingsGrid}>

                {/* Cron Job Manager */}
                <section className={`${styles.section} ${styles.cronSection}`}>
                    <div className={styles.sectionHeader}>
                        <Clock className={styles.sectionIcon} size={24} />
                        <h2 className={styles.sectionTitle}>Cron Job Manager</h2>
                    </div>

                    <div className={styles.cronList}>
                        {cronJobs.map(job => (
                            <div key={job.id} className={styles.cronItem}>
                                <div className={styles.cronInfo}>
                                    <div className="flex items-center gap-3">
                                        <span className={styles.cronName}>{job.name}</span>
                                        <span className={styles.cronExpression}>{job.expression}</span>
                                    </div>
                                    <div className="text-secondary text-sm mt-1">{job.description}</div>
                                    <div className={styles.cronMeta}>
                                        <div className={styles.cronMetaItem}>
                                            <Play size={12} /> Last: {job.lastRun}
                                        </div>
                                        <div className={styles.cronMetaItem}>
                                            <FastForward size={12} /> Next: {job.nextRun}
                                        </div>
                                    </div>
                                </div>

                                <label className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        checked={job.active}
                                        onChange={() => toggleCronJob(job.id)}
                                        aria-label={`Toggle ${job.name}`}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Integration Status */}
                <section className={`${styles.section} ${styles.integrationsSection}`}>
                    <div className={styles.sectionHeader}>
                        <LinkIcon className={styles.sectionIcon} size={24} />
                        <h2 className={styles.sectionTitle}>Integration Status</h2>
                    </div>

                    <div className={styles.integrationsGrid}>
                        {integrations.map(int => (
                            <div key={int.id} className={styles.integrationCard}>
                                <span className={styles.integrationName}>{int.name}</span>
                                <div className={`${styles.statusIndicator} ${int.status === 'Connected' ? styles.statusConnected : styles.statusDisconnected}`}>
                                    <div className={styles.statusDot}></div>
                                    {int.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Agent Configuration Panel */}
                <section className={`${styles.section} ${styles.configSection}`}>
                    <div className={styles.sectionHeader}>
                        <Cpu className={styles.sectionIcon} size={24} />
                        <h2 className={styles.sectionTitle}>Agent Configuration</h2>
                    </div>

                    <div className={styles.configList}>
                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Primary LLM Backend</span>
                            <div className={styles.configValue}>claude-3-5-sonnet-20241022</div>
                            <p className={styles.configDesc}>Model used for Mick's core orchestration and reasoning loop.</p>
                        </div>

                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Base Temperature</span>
                            <div className={styles.configValue}>0.3</div>
                            <p className={styles.configDesc}>Lower temperature ensures deterministic output for data tasks. Content agents dynamically override to 0.7.</p>
                        </div>

                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Memory Context Window</span>
                            <div className={styles.configValue}>200,000 tokens</div>
                            <p className={styles.configDesc}>Maximum allowed context size per persistent agent session.</p>
                        </div>

                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Vector DB Retrieval Threshold</span>
                            <div className={styles.configValue}>0.85</div>
                            <p className={styles.configDesc}>Cosine similarity threshold for RAG retrieval on the Memory Library.</p>
                        </div>
                    </div>

                    <button className={styles.saveBtn} onClick={() => alert('Configuration Saved (Mock)')}>
                        Save Configuration
                    </button>
                </section>

            </div>
        </div>
    );
}
