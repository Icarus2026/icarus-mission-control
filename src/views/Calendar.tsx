import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { X, CalendarDays, Clock, FolderGit2 } from 'lucide-react';
import styles from './Calendar.module.css';

// Setup localizer for react-big-calendar
const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Project = 'Icarus Operations' | 'VERO Launch' | 'Lumova Health' | 'System Admin';

interface CalendarEvent {
    id: string;
    title: string;
    project: Project;
    type: 'Task Deadline' | 'Content Publish' | 'Meeting' | 'System';
    start: Date;
    end: Date;
    allDay?: boolean;
}

// Generate some dates relative to today for realistic mock data
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 4);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const mockEvents: CalendarEvent[] = [
    {
        id: 'e1',
        title: 'Review Icarus Q2 ad spend ROI',
        project: 'Icarus Operations',
        type: 'Task Deadline',
        start: new Date(tomorrow.setHours(14, 0, 0, 0)),
        end: new Date(tomorrow.setHours(15, 0, 0, 0)),
    },
    {
        id: 'e2',
        title: 'Analyze VERO competitor backlinks',
        project: 'VERO Launch',
        type: 'Task Deadline',
        start: new Date(tomorrow.setHours(10, 0, 0, 0)),
        end: new Date(tomorrow.setHours(12, 0, 0, 0)),
    },
    {
        id: 'e3',
        title: 'Lumova Health content strategy presentation',
        project: 'Lumova Health',
        type: 'Meeting',
        start: new Date(today.setHours(13, 0, 0, 0)),
        end: new Date(today.setHours(14, 30, 0, 0)),
    },
    {
        id: 'e4',
        title: 'Publish: The AI ROI (LinkedIn)',
        project: 'Icarus Operations',
        type: 'Content Publish',
        start: new Date(nextWeek.setHours(9, 0, 0, 0)),
        end: new Date(nextWeek.setHours(9, 30, 0, 0)),
    },
    {
        id: 'e5',
        title: 'Draft: BPC-157 deep dive (Instagram)',
        project: 'VERO Launch',
        type: 'Content Publish',
        start: new Date(nextWeek.setHours(15, 0, 0, 0)),
        end: new Date(nextWeek.setHours(16, 0, 0, 0)),
    },
    {
        id: 'e6',
        title: 'System DB Maintenance Window',
        project: 'System Admin',
        type: 'System',
        start: new Date(today.setHours(2, 0, 0, 0)),
        end: new Date(today.setHours(3, 0, 0, 0)),
        allDay: true
    }
];

export default function CalendarView() {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Custom event component to inject our CSS modules
    const CustomEvent = ({ event }: { event: CalendarEvent }) => {
        let brandClass = styles.eventAdmin;
        if (event.project === 'Icarus Operations') brandClass = styles.eventIcarus;
        if (event.project === 'VERO Launch') brandClass = styles.eventVero;
        if (event.project === 'Lumova Health') brandClass = styles.eventLumova;

        return (
            <div className={`${styles.eventWrapper} ${brandClass}`} title={event.title}>
                {event.title}
            </div>
        );
    };

    const getModalBrandClass = (project: string) => {
        if (project === 'Icarus Operations') return styles.modalIcarus;
        if (project === 'VERO Launch') return styles.modalVero;
        if (project === 'Lumova Health') return styles.modalLumova;
        return styles.modalAdmin;
    };

    return (
        <div className={styles.calendarView}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Chronology</h1>
                <p className={styles.subtitle}>Unified timeline for tasks, pipeline, and operations.</p>
            </header>

            <div className={styles.calendarContainer}>
                <BigCalendar
                    localizer={localizer}
                    events={mockEvents}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={(newView) => setView(newView)}
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                    components={{
                        event: CustomEvent,
                    }}
                    onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
                    popup
                    selectable
                />
            </div>

            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
                    <div
                        className={`${styles.modalContent} ${getModalBrandClass(selectedEvent.project)}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{selectedEvent.title}</h3>
                            <button className={styles.closeBtn} onClick={() => setSelectedEvent(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalDetail}>
                                <span className={styles.modalTypeBadge}>{selectedEvent.type}</span>
                            </div>
                            <div className={styles.modalDetail}>
                                <FolderGit2 size={16} />
                                <span>{selectedEvent.project}</span>
                            </div>
                            <div className={styles.modalDetail}>
                                <CalendarDays size={16} />
                                <span>{format(selectedEvent.start, 'MMM do, yyyy')}</span>
                            </div>
                            {!selectedEvent.allDay && (
                                <div className={styles.modalDetail}>
                                    <Clock size={16} />
                                    <span>
                                        {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
