import { useState, useMemo, useEffect } from 'react';
import { Search, FileText, CalendarDays, X, ChevronRight } from 'lucide-react';
import styles from './Memory.module.css';
import { supabase } from '../lib/supabase';

type Category = 'All' | 'Icarus' | 'VERO' | 'Lumova' | 'Research' | 'Archive';

interface Document {
    id: string;
    title: string;
    category: Category;
    date: string;
    snippet: string;
    content: string;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const categories: Category[] = ['All', 'Icarus', 'VERO', 'Lumova', 'Research', 'Archive'];

export default function MemoryView() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching documents:', error);
            setIsLoading(false);
            return;
        }

        if (data) {
            const formattedDocs = data.map((doc: any) => ({
                ...doc,
                date: formatDate(doc.created_at)
            }));
            setDocuments(formattedDocs);
        }
        setIsLoading(false);
    };

    // Filter documents based on search query and category
    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.snippet.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const getCategoryClass = (category: string, isModal = false) => {
        const prefix = isModal ? 'modal' : 'cat';
        switch (category) {
            case 'Icarus': return styles[`${prefix}Icarus`];
            case 'VERO': return styles[`${prefix}Vero`];
            case 'Lumova': return styles[`${prefix}Lumova`];
            case 'Research': return styles[`${prefix}Research`];
            case 'Archive': return styles[`${prefix}Archive`];
            default: return '';
        }
    };

    const getCardBorderClass = (category: string) => {
        switch (category) {
            case 'Icarus': return styles.cardIcarus;
            case 'VERO': return styles.cardVero;
            case 'Lumova': return styles.cardLumova;
            case 'Research': return styles.cardResearch;
            case 'Archive': return styles.cardArchive;
            default: return '';
        }
    };

    return (
        <div className={styles.memoryView}>
            <header className={styles.header}>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className={`${styles.title} text-gradient`} style={{ marginBottom: 0 }}>Memory Library</h1>
                    {isLoading && <span className="text-secondary text-sm animate-pulse">Syncing library...</span>}
                </div>
                <p className={styles.subtitle}>Unified knowledge base: SOPs, research, strategy, and archives.</p>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search documents, snippets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filters}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.documentGrid}>
                {filteredDocs.length > 0 ? (
                    filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            className={`${styles.docCard} ${getCardBorderClass(doc.category)}`}
                            onClick={() => setSelectedDoc(doc)}
                        >
                            <div className={styles.cardHeader}>
                                <span className={`${styles.docCategory} ${getCategoryClass(doc.category)}`}>
                                    {doc.category}
                                </span>
                                <FileText size={16} className="text-tertiary" />
                            </div>
                            <h3 className={styles.docTitle}>{doc.title}</h3>
                            <p className={styles.docSnippet}>{doc.snippet}</p>
                            <div className={styles.cardFooter}>
                                <div className={styles.docDate}>
                                    <CalendarDays size={14} />
                                    {doc.date}
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`col-span-full ${styles.emptyState}`}>
                        <p>No documents found matching "{searchQuery}" in {activeCategory}.</p>
                    </div>
                )}
            </div>

            {/* Document Detail Modal */}
            {selectedDoc && (
                <div className={styles.modalOverlay} onClick={() => setSelectedDoc(null)}>
                    <div
                        className={`${styles.modalContent} ${getCategoryClass(selectedDoc.category, true)}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderLeft}>
                                <div className={styles.modalMeta}>
                                    <span className={`${styles.docCategory} ${getCategoryClass(selectedDoc.category)}`}>
                                        {selectedDoc.category}
                                    </span>
                                    <div className="text-tertiary flex items-center gap-1 text-sm">
                                        <CalendarDays size={14} />
                                        {selectedDoc.date}
                                    </div>
                                </div>
                                <h2 className={styles.modalTitle}>{selectedDoc.title}</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedDoc(null)} aria-label="Close document">
                                <X size={20} />
                            </button>
                        </div>
                        <div
                            className={styles.modalBody}
                            dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
