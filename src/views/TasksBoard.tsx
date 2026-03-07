import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Filter, Clock, ListFilter } from 'lucide-react';
import styles from './TasksBoard.module.css';

// Types and Interfaces
type Priority = 'High' | 'Medium' | 'Low';
type Assignee = 'Mick' | 'Simon';
type Project = 'Icarus Operations' | 'VERO Launch' | 'Lumova Health';

interface Task {
    id: string;
    title: string;
    project: Project;
    priority: Priority;
    assignee: Assignee;
    dueDate: string;
}

interface ColumnData {
    [key: string]: Task[];
}

// Initial Realistic Mock Data Data
const initialTasks: ColumnData = {
    todo: [
        {
            id: 't-1',
            title: 'Analyze VERO competitor backlink profiles for Q3 SEO push',
            project: 'VERO Launch',
            priority: 'High',
            assignee: 'Mick',
            dueDate: 'Tomorrow'
        },
        {
            id: 't-2',
            title: 'Review Icarus Q2 ad spend ROI and optimize PMax campaigns',
            project: 'Icarus Operations',
            priority: 'High',
            assignee: 'Simon',
            dueDate: 'Oct 24'
        },
        {
            id: 't-3',
            title: 'Draft landing page copy for Lumova Health preventative screening guide',
            project: 'Lumova Health',
            priority: 'Medium',
            assignee: 'Mick',
            dueDate: 'Next Week'
        }
    ],
    inProgress: [
        {
            id: 't-4',
            title: 'Develop automated creative brief generator (Firecrawl integration)',
            project: 'Icarus Operations',
            priority: 'High',
            assignee: 'Mick',
            dueDate: 'Tomorrow'
        },
        {
            id: 't-5',
            title: 'Finalize VERO brand identity guidelines and color palette',
            project: 'VERO Launch',
            priority: 'Medium',
            assignee: 'Simon',
            dueDate: 'Oct 25'
        }
    ],
    review: [
        {
            id: 't-6',
            title: 'Lumova Health content strategy presentation for founders',
            project: 'Lumova Health',
            priority: 'High',
            assignee: 'Simon',
            dueDate: 'Today'
        }
    ],
    done: [
        {
            id: 't-7',
            title: 'Set up Vite + React scaffolding for Mission Control Dashboard',
            project: 'Icarus Operations',
            priority: 'High',
            assignee: 'Mick',
            dueDate: 'Completed'
        }
    ]
};

const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
];

const projects = ['All Projects', 'Icarus Operations', 'VERO Launch', 'Lumova Health'];

export default function TasksBoard() {
    const [tasks, setTasks] = useState<ColumnData>(initialTasks);
    const [activeProject, setActiveProject] = useState('All Projects');
    const [assigneeFilter, setAssigneeFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    // Drag and drop handler
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return; // Dropped outside list
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColumn = [...tasks[source.droppableId]];
        const destColumn = source.droppableId === destination.droppableId
            ? sourceColumn
            : [...tasks[destination.droppableId]];

        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);

        setTasks({
            ...tasks,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn
        });
    };

    // Filter logic
    const getFilteredTasks = (columnId: string) => {
        return tasks[columnId].filter(task => {
            const matchProject = activeProject === 'All Projects' || task.project === activeProject;
            const matchAssignee = assigneeFilter === 'All' || task.assignee === assigneeFilter;
            const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;
            return matchProject && matchAssignee && matchPriority;
        });
    };

    return (
        <div className={styles.board}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>Mission Objectives</h1>
                <p className={styles.subtitle}>Manage directives, track progress, and conquer deadlines.</p>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.tabs}>
                    {projects.map(proj => (
                        <button
                            key={proj}
                            className={`${styles.tabBtn} ${activeProject === proj ? styles.tabActive : ''}`}
                            onClick={() => setActiveProject(proj)}
                        >
                            {proj}
                        </button>
                    ))}
                </div>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <Filter size={16} />
                        <select
                            className={styles.filterSelect}
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                            <option value="All">All Assignees</option>
                            <option value="Simon">Simon</option>
                            <option value="Mick">Mick</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <ListFilter size={16} />
                        <select
                            className={styles.filterSelect}
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.kanbanBoard}>
                    {columns.map(column => {
                        const filteredTasks = getFilteredTasks(column.id);

                        return (
                            <div key={column.id} className={styles.column}>
                                <div className={styles.columnHeader}>
                                    <div className={styles.columnTitle}>
                                        {column.title}
                                    </div>
                                    <span className={styles.columnCount}>{filteredTasks.length}</span>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            className={`${styles.taskList} ${snapshot.isDraggingOver ? styles.isDraggingOver : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {filteredTasks.map((task, index) => {
                                                let priorityClass = styles.priorityLow;
                                                if (task.priority === 'High') priorityClass = styles.priorityHigh;
                                                if (task.priority === 'Medium') priorityClass = styles.priorityMedium;

                                                let projectClass = styles.cardIcarus;
                                                if (task.project === 'VERO Launch') projectClass = styles.cardVero;
                                                if (task.project === 'Lumova Health') projectClass = styles.cardLumova;

                                                const isMick = task.assignee === 'Mick';

                                                return (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`${styles.taskCard} ${projectClass} ${snapshot.isDragging ? styles.isDragging : ''}`}
                                                                style={{ ...provided.draggableProps.style }}
                                                            >
                                                                <div className={`${styles.priorityBadge} ${priorityClass}`}>
                                                                    {task.priority}
                                                                </div>

                                                                <div className={styles.taskTitle}>
                                                                    {task.title}
                                                                </div>

                                                                <div className={styles.cardFooter}>
                                                                    <div className={styles.assignee}>
                                                                        <div className={`${styles.avatar} ${isMick ? styles.avatarMick : ''}`}>
                                                                            {task.assignee.charAt(0)}
                                                                        </div>
                                                                        {task.assignee}
                                                                    </div>
                                                                    <div className={styles.dueDate}>
                                                                        <Clock size={12} />
                                                                        {task.dueDate}
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
        </div>
    );
}
