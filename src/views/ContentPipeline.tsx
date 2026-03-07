import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Columns, Calendar, Twitter, Linkedin, Instagram, PlaySquare, CalendarDays } from 'lucide-react';
import styles from './ContentPipeline.module.css';

// Types
type Platform = 'X' | 'LinkedIn' | 'Instagram' | 'TikTok';
type Project = 'Icarus Operations' | 'VERO Launch' | 'Lumova Health';

interface ContentItem {
    id: string;
    title: string;
    platform: Platform;
    assignDate: string;
    project: Project;
}

interface ColumnData {
    [key: string]: ContentItem[];
}

// Realistic Placeholder Data mapped to Pipeline columns
const initialContent: ColumnData = {
    idea: [
        {
            id: 'cn-1',
            title: 'The AI ROI: Why your agency needs an automated agent orchestrator',
            platform: 'LinkedIn',
            assignDate: 'TBD',
            project: 'Icarus Operations'
        },
        {
            id: 'cn-2',
            title: 'BPC-157 deep dive – recovery protocols and half-life explained',
            platform: 'Instagram',
            assignDate: 'TBD',
            project: 'VERO Launch'
        }
    ],
    research: [
        {
            id: 'cn-3',
            title: 'Case study context: How we scaled a med-spa clinic using PMax',
            platform: 'X',
            assignDate: 'Oct 28',
            project: 'Icarus Operations'
        }
    ],
    brief: [
        {
            id: 'cn-4',
            title: 'Video Script: The 3 supplements every founder needs for cognitive endurance',
            platform: 'TikTok',
            assignDate: 'Nov 02',
            project: 'Lumova Health'
        }
    ],
    draft: [
        {
            id: 'cn-5',
            title: 'Carousel: Peptides vs Traditional TRT - The shift in optimizing men\'s health',
            platform: 'Instagram',
            assignDate: 'Oct 26',
            project: 'VERO Launch'
        },
        {
            id: 'cn-6',
            title: 'The "Invisible" AI workflow saving us 40 hours a week in client reporting',
            platform: 'LinkedIn',
            assignDate: 'Oct 25',
            project: 'Icarus Operations'
        }
    ],
    scheduled: [
        {
            id: 'cn-7',
            title: 'Thread: 5 Landing Page mistakes costing your brand conversions in Q4',
            platform: 'X',
            assignDate: 'Oct 24 • 09:30 AM',
            project: 'Icarus Operations'
        }
    ],
    published: [
        {
            id: 'cn-8',
            title: 'Just launched our new longevity protocol stack @LumovaHealth',
            platform: 'X',
            assignDate: 'Oct 22 • 11:00 AM',
            project: 'Lumova Health'
        }
    ]
};

const columns = [
    { id: 'idea', title: 'Idea' },
    { id: 'research', title: 'Research' },
    { id: 'brief', title: 'Brief' },
    { id: 'draft', title: 'Draft' },
    { id: 'scheduled', title: 'Scheduled' },
    { id: 'published', title: 'Published' }
];

export default function ContentPipeline() {
    const [contentItems, setContentItems] = useState<ColumnData>(initialContent);
    const [viewMode, setViewMode] = useState<'kanban' | 'calendar'>('kanban');

    // Drag and Drop Handler
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return; // Dropped outside

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceColumn = [...contentItems[source.droppableId]];
        const destColumn = source.droppableId === destination.droppableId
            ? sourceColumn
            : [...contentItems[destination.droppableId]];

        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);

        setContentItems({
            ...contentItems,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn
        });
    };

    // Platform Icon Helper
    const getPlatformIcon = (platform: Platform) => {
        switch (platform) {
            case 'X': return <Twitter size={14} />;
            case 'LinkedIn': return <Linkedin size={14} />;
            case 'Instagram': return <Instagram size={14} />;
            case 'TikTok': return <PlaySquare size={14} />;
            default: return null;
        }
    };

    return (
        <div className={styles.pipeline}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Content Factory</h1>
                <p className={styles.subtitle}>Ideate, generate, and distribute narratives across all brands.</p>
            </header>

            <div className={styles.controls}>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'kanban' ? styles.toggleActive : ''}`}
                        onClick={() => setViewMode('kanban')}
                    >
                        <Columns size={16} /> Kanban
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'calendar' ? styles.toggleActive : ''}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        <Calendar size={16} /> Calendar
                    </button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className={styles.kanbanBoard}>
                        {columns.map(column => {
                            const items = contentItems[column.id];

                            return (
                                <div key={column.id} className={styles.column}>
                                    <div className={styles.columnHeader}>
                                        <div className={styles.columnTitle}>
                                            {column.title}
                                            <span className={styles.columnCount}>{items.length}</span>
                                        </div>
                                    </div>

                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                className={`${styles.contentList} ${snapshot.isDraggingOver ? styles.isDraggingOver : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {items.map((item, index) => {
                                                    // Styling specific to project and platform
                                                    let platformClass = '';
                                                    if (item.platform === 'X') platformClass = styles.platformX;
                                                    if (item.platform === 'LinkedIn') platformClass = styles.platformLinkedIn;
                                                    if (item.platform === 'Instagram') platformClass = styles.platformInstagram;
                                                    if (item.platform === 'TikTok') platformClass = styles.platformTikTok;

                                                    let projectCardClass = styles.cardIcarus;
                                                    let projectShortName = 'ICR';
                                                    if (item.project === 'VERO Launch') { projectCardClass = styles.cardVero; projectShortName = 'VERO'; }
                                                    if (item.project === 'Lumova Health') { projectCardClass = styles.cardLumova; projectShortName = 'LMVA'; }

                                                    return (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`${styles.contentCard} ${projectCardClass} ${snapshot.isDragging ? styles.isDragging : ''}`}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                >
                                                                    <div className={styles.cardHeader}>
                                                                        <span className={styles.contentTitle}>{item.title}</span>
                                                                        <div className={`${styles.platformBadge} ${platformClass}`}>
                                                                            {getPlatformIcon(item.platform)}
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.cardFooter}>
                                                                        <div className={styles.projectLabel}>
                                                                            {projectShortName}
                                                                        </div>
                                                                        <div className={styles.publishDate}>
                                                                            <CalendarDays size={12} />
                                                                            {item.assignDate}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>
            ) : (
                <div className={styles.calendarPlaceholder}>
                    <CalendarDays size={48} className={styles.calIcon} />
                    <h2 className="text-gradient">Calendar View Mode</h2>
                    <p className="text-muted">Content scheduled view. Data is identical, represented chronologically.</p>
                </div>
            )}
        </div>
    );
}
