import { useState, useEffect } from "react";
import {
  Clock,
  Link as LinkIcon,
  Cpu,
  Play,
  FastForward,
} from "lucide-react";
import styles from "./Settings.module.css";
import { supabase } from '../lib/supabase';

const formatSettingsDate = (dateString?: string | null) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export default function SettingsView() {
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [integrationsList, setIntegrationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    setIsLoading(true);
    const [cronRes, intRes] = await Promise.all([
      supabase.from('cron_jobs').select('*').order('name'),
      supabase.from('integrations').select('*').order('name')
    ]);

    if (cronRes.data) setCronJobs(cronRes.data);
    if (intRes.data) setIntegrationsList(intRes.data);
    setIsLoading(false);
  };

  const toggleCronJob = async (id: string, currentActive: boolean) => {
    setCronJobs((jobs) =>
      jobs.map((job) =>
        job.id === id ? { ...job, is_active: !currentActive } : job,
      ),
    );
    const { error } = await supabase.from('cron_jobs').update({ is_active: !currentActive }).eq('id', id);
    if (error) {
      console.error("Error toggling cron job", error);
      fetchSettingsData(); // Revert on failure
    }
  };

  return (
    <div className={styles.settingsView}>
      <header className={styles.header}>
        <h1 className={`${styles.title} text-gradient`}>System Settings</h1>
        <p className={styles.subtitle}>
          Configure automated jobs, core integrations, and orchestrator
          parameters.
          {isLoading && <span className="text-secondary text-sm ml-2 animate-pulse">Syncing settings...</span>}
        </p>
      </header>

      <div className={styles.settingsGrid}>
        {/* Cron Job Manager */}
        <section className={`${styles.section} ${styles.cronSection}`}>
          <div className={styles.sectionHeader}>
            <Clock className={styles.sectionIcon} size={24} />
            <h2 className={styles.sectionTitle}>Cron Job Manager</h2>
          </div>

          <div className={styles.cronList}>
            {cronJobs.map((job) => (
              <div key={job.id} className={styles.cronItem}>
                <div className={styles.cronInfo}>
                  <div className="flex items-center gap-3">
                    <span className={styles.cronName}>{job.name}</span>
                    <span className={styles.cronExpression}>
                      {job.schedule}
                    </span>
                  </div>
                  <div className={styles.cronMeta}>
                    <div className={styles.cronMetaItem}>
                      <Play size={12} /> Last: {formatSettingsDate(job.last_run)}
                    </div>
                    <div className={styles.cronMetaItem}>
                      <FastForward size={12} /> Next: {formatSettingsDate(job.next_run)}
                    </div>
                  </div>
                </div>

                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={job.is_active}
                    onChange={() => toggleCronJob(job.id, job.is_active)}
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
            {integrationsList.map((int) => (
              <div key={int.id} className={styles.integrationCard}>
                <span className={styles.integrationName}>{int.name}</span>
                <div
                  className={`${styles.statusIndicator} ${int.status.toLowerCase() === "connected" ? styles.statusConnected : styles.statusDisconnected}`}
                >
                  <div className={styles.statusDot}></div>
                  {int.status.charAt(0).toUpperCase() + int.status.slice(1)}
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
              <div className={styles.configValue}>
                claude-3-5-sonnet-20241022
              </div>
              <p className={styles.configDesc}>
                Model used for Mick's core orchestration and reasoning loop.
              </p>
            </div>

            <div className={styles.configItem}>
              <span className={styles.configLabel}>Base Temperature</span>
              <div className={styles.configValue}>0.3</div>
              <p className={styles.configDesc}>
                Lower temperature ensures deterministic output for data tasks.
                Content agents dynamically override to 0.7.
              </p>
            </div>

            <div className={styles.configItem}>
              <span className={styles.configLabel}>Memory Context Window</span>
              <div className={styles.configValue}>200,000 tokens</div>
              <p className={styles.configDesc}>
                Maximum allowed context size per persistent agent session.
              </p>
            </div>

            <div className={styles.configItem}>
              <span className={styles.configLabel}>
                Vector DB Retrieval Threshold
              </span>
              <div className={styles.configValue}>0.85</div>
              <p className={styles.configDesc}>
                Cosine similarity threshold for RAG retrieval on the Memory
                Library.
              </p>
            </div>
          </div>

          <button
            className={styles.saveBtn}
            onClick={() => alert("Configuration Saved (Mock)")}
          >
            Save Configuration
          </button>
        </section>
      </div>
    </div>
  );
}
