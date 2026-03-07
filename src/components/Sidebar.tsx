import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    PenTool,
    Calendar as CalendarIcon,
    Database,
    Network,
    Users,
    Settings
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const coreItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Tasks Board', path: '/tasks', icon: CheckSquare },
        { name: 'Content Pipeline', path: '/pipeline', icon: PenTool },
        { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    ];

    const intelligenceItems = [
        { name: 'Memory', path: '/memory', icon: Database },
        { name: 'AI Team', path: '/ai-team', icon: Network },
        { name: 'CRM', path: '/crm', icon: Users },
    ];

    const systemItems = [
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.brandIcon}>I</div>
                <div className={styles.brandName}>Mission Control</div>
            </div>

            <div className={styles.navSection}>
                <div className={styles.sectionTitle}>Workspace</div>
                {coreItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                        <item.icon size={18} />
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className={styles.navSection}>
                <div className={styles.sectionTitle}>Intelligence</div>
                {intelligenceItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                        <item.icon size={18} />
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className={styles.spacer} />

            <div className={styles.navSection}>
                {systemItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                        <item.icon size={18} />
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>S</div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Simon Jordan</span>
                    <span className={styles.userRole}>Commander</span>
                </div>
            </div>
        </aside>
    );
}
