import { useState, useMemo } from 'react';
import { Search, FileText, CalendarDays, X, ChevronRight } from 'lucide-react';
import styles from './Memory.module.css';

type Category = 'All' | 'Icarus' | 'VERO' | 'Lumova' | 'Research' | 'Archive';

interface Document {
    id: string;
    title: string;
    category: Category;
    date: string;
    snippet: string;
    content: React.ReactNode;
}

// Realistic mock documents
const mockDocuments: Document[] = [
    {
        id: 'doc-1',
        title: 'Q2 2026 Ad Spend Analysis & PMax Strategy',
        category: 'Icarus',
        date: 'Oct 15, 2026',
        snippet: 'Comprehensive review of Icarus Operations ad spend across Meta and Google ecosystems, outlining the transition to Performance Max fully managed by Mick.',
        content: (
            <>
                <h2>Executive Summary</h2>
                <p>In Q2, total ad spend reached $42,500 with an overall ROAS of 3.8x. While Meta campaigns remained stable, Google Search showed fatigue. Transitioning heavily to Performance Max (PMax) driven by Mick's real-time bid adjustments is the primary objective for Q3.</p>
                <h2>Key Metrics</h2>
                <ul>
                    <li><strong>Meta Ads:</strong> Spend: $22k | CPA: $45 | ROAS: 3.2x</li>
                    <li><strong>Google Search:</strong> Spend: $15k | CPA: $65 | ROAS: 2.1x (Action required)</li>
                    <li><strong>Google PMax (Beta):</strong> Spend: $5.5k | CPA: $28 | ROAS: 5.4x</li>
                </ul>
                <h2>Mick Directives</h2>
                <p>Mick is authorized to reallocate up to 40% of the Google Search budget into PMax automatically if CPA on Search exceeds $70 over a rolling 3-day window.</p>
            </>
        )
    },
    {
        id: 'doc-2',
        title: 'BPC-157 & TB-500 Product Launch Protocol',
        category: 'VERO',
        date: 'Oct 18, 2026',
        snippet: 'Launch strategy for the new recovery peptide stack. Includes regulatory compliance checks, influencer outreach tiers, and email sequence framing.',
        content: (
            <>
                <h2>Product Positioning: "The Recovery Stack"</h2>
                <p>Positioning BPC-157 and TB-500 not just as isolated research chemicals, but as the ultimate synergistic recovery protocol for high-performance athletes navigating injuries.</p>
                <h2>Compliance Reminders</h2>
                <p>All copy MUST adhere to the "For Research Purposes Only" framework. Automated scans by Mick will flag any "human consumption" language in Shopify drafts before publishing.</p>
                <h2>Influencer Outreach (Tier 1)</h2>
                <ul>
                    <li>Target: CrossFit Games athletes & BJJ black belts recovering from joint/tendon injuries.</li>
                    <li>Offer: 3-month supply + affiliate code (15% kickback).</li>
                    <li>Deliverable: 2 IG Reels detailing their recovery protocol timeline.</li>
                </ul>
            </>
        )
    },
    {
        id: 'doc-3',
        title: 'Preventative Screening Guide - Copy Draft v2',
        category: 'Lumova',
        date: 'Oct 20, 2026',
        snippet: 'Updated landing page copy for the top-of-funnel preventative screening lead magnet. Focuses on the "longevity dividend" concept.',
        content: (
            <>
                <h2>Hero Section</h2>
                <p><strong>Headline:</strong> Catch it before it counts. Your personalized preventative screening roadmap.</p>
                <p><strong>Sub-headline:</strong> Stop guessing about your health span. Download the exact testing protocols used by longevity doctors to identify risks years before symptoms appear.</p>
                <p><strong>CTA:</strong> Send Me The Roadmap (Button)</p>

                <h2>The "Longevity Dividend" Concept</h2>
                <p>We need to introduce the concept that investing $1000 in advanced blood work today pays a "longevity dividend" of an extra 5 years of vigorous living. It shifts the mindset from "medical expense" to "life investment".</p>
            </>
        )
    },
    {
        id: 'doc-4',
        title: 'LLM Orchestration Patterns 2026',
        category: 'Research',
        date: 'Sep 05, 2026',
        snippet: 'Research notes on emerging paradigms in multi-agent orchestration, specifically focused on contextual memory retrieval techniques like GraphRAG.',
        content: (
            <>
                <h2>Standard RAG is Dead for Context-Heavy Tasks</h2>
                <p>Simple vector similarity search fails when an agent (like Mick) needs to understand the relationship between a client's Q1 marketing brief and their Q3 ad performance. It retrieves scattered documents but loses the semantic connection between the timeline.</p>
                <h2>GraphRAG Implementation Notes</h2>
                <p>By shifting Mick's retrieval system to GraphRAG, nodes become concepts (e.g., "Client X", "PMax Campaign", "Lead Gen") and edges become relationships ("ran in Q2", "resulted in").</p>
                <h3>Action Items</h3>
                <ul>
                    <li>Investigate Neo4j integration with current LangChain setup.</li>
                    <li>Test GraphRAG specifically on the Icarus case study repository.</li>
                </ul>
            </>
        )
    },
    {
        id: 'doc-5',
        title: '2024 End of Year Review',
        category: 'Archive',
        date: 'Dec 28, 2024',
        snippet: 'Historical archive of the 2024 company retrospective, highlighting the transition from traditional agency model to AI-augmented services.',
        content: (
            <>
                <h2>The Major Pivot</h2>
                <p>2024 marked the complete transition from a labor-heavy traditional agency model to our current AI-augmented system. Headcount reduced by 40%, profit margins increased by 65%.</p>
                <h2>Lessons Learned</h2>
                <p>Clients do not care how the sausage is made (AI vs Human). They care about the speed of delivery and the cost per acquisition. Focusing our marketing on "We use AI" was a mistake; focusing on "We deliver 3x faster" was the breakthrough.</p>
            </>
        )
    }
];

const categories: Category[] = ['All', 'Icarus', 'VERO', 'Lumova', 'Research', 'Archive'];

export default function MemoryView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    // Filter documents based on search query and category
    const filteredDocs = useMemo(() => {
        return mockDocuments.filter(doc => {
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
                <h1 className={`${styles.title} text-gradient`}>Memory Library</h1>
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
                        <div className={styles.modalBody}>
                            {selectedDoc.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
