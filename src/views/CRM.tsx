import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, X } from 'lucide-react';
import styles from './CRM.module.css';

type Category = 'All' | 'Clients' | 'Prospects' | 'Partners' | 'Suppliers';

interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
    location: string;
    category: Category;
    notes: string;
}

const mockContacts: Contact[] = [
    {
        id: 'c-1',
        name: 'Dr. Aris Thorne',
        role: 'Founder & CEO',
        company: 'Vanguard Longevity',
        email: 'aris@vanguardlongevity.com',
        phone: '+1 (415) 555-0198',
        location: 'San Francisco, CA',
        category: 'Clients',
        notes: 'Icarus Client since Q1 2025. Currently running PMax and Meta campaigns. Re-negotiating retainer for Q4 2026. Highly interested in standardizing their lead gen flow via Mick integrations.'
    },
    {
        id: 'c-2',
        name: 'Sarah Jenkins',
        role: 'CMO',
        company: 'Apex Supplements',
        email: 'sarah.j@apexsupps.com',
        phone: '+1 (310) 555-0244',
        location: 'Los Angeles, CA',
        category: 'Clients',
        notes: 'Primary point of contact for Apex. Very metrics-driven. Needs weekly ROAS reports on Monday mornings. Upset if CPA creeps above $60. Mick handles automated daily reporting for her.'
    },
    {
        id: 'c-3',
        name: 'Marcus Vane',
        role: 'CEO',
        company: 'Primal Athletics',
        email: 'marcus@primalathletics.co',
        phone: '+1 (512) 555-0811',
        location: 'Austin, TX',
        category: 'Prospects',
        notes: 'Met at the BioTech summit. Massive audience in the CrossFit space. High potential for a BPC-157 white-label deal under the VERO brand. Follow up next Tuesday regarding pricing tiers.'
    },
    {
        id: 'c-4',
        name: 'Dr. Elena Rostova',
        role: 'Lead Researcher',
        company: 'Biolab Inc. Europe',
        email: 'e.rostova@biolab.eu',
        phone: '+44 20 7946 0958',
        location: 'London, UK',
        category: 'Partners',
        notes: 'Lumova Health research partner. Providing the core literature reviews and clinical trial data we use for the Preventative Screening landing pages. Requires strict compliance review.'
    },
    {
        id: 'c-5',
        name: 'Chen Wei',
        role: 'Head of QA',
        company: 'SinoPeptides Manufacturing',
        email: 'c.wei@sinopeptides.cn',
        phone: '+86 10 1234 5678',
        location: 'Beijing, China',
        category: 'Suppliers',
        notes: 'Primary raw material supplier for VERO (BPC-157 and TB-500). Essential contact for batch testing purity reports (HPLC data). Needs 4 weeks lead time for bulk orders over 5kg.'
    },
    {
        id: 'c-6',
        name: 'James Holden',
        role: 'Logistics Director',
        company: 'Global Cold Chain',
        email: 'j.holden@globalcold.com',
        phone: '+1 (312) 555-0192',
        location: 'Chicago, IL',
        category: 'Suppliers',
        notes: 'Handles our cold-chain shipping logistics for Lumova testing kits. Keep on good terms—he rushes our priority shipments when inventory is tight at the testing facilities.'
    }
];

const categories: Category[] = ['All', 'Clients', 'Prospects', 'Partners', 'Suppliers'];

export default function CRMView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const filteredContacts = useMemo(() => {
        return mockContacts.filter(contact => {
            const matchesCategory = activeCategory === 'All' || contact.category === activeCategory;
            const matchesSearch =
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.role.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const getCategoryClass = (category: string) => {
        switch (category) {
            case 'Clients': return styles.catClients;
            case 'Prospects': return styles.catProspects;
            case 'Partners': return styles.catPartners;
            case 'Suppliers': return styles.catSuppliers;
            default: return '';
        }
    };

    return (
        <div className={styles.crmView}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>CRM & Network</h1>
                <p className={styles.subtitle}>Manage clients, partners, and supply chain contacts across all brands.</p>
            </header>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by name, role, or company..."
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

            {/* Contact Grid */}
            <div className={styles.contactGrid}>
                {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            className={styles.contactCard}
                            onClick={() => setSelectedContact(contact)}
                        >
                            <div className={styles.cardTop}>
                                <div className={styles.avatarContainer}>
                                    <div className={styles.avatar}>
                                        {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className={styles.contactName}>{contact.name}</h3>
                                        <div className={styles.contactRole}>{contact.role}</div>
                                        <div className={styles.contactCompany}>{contact.company}</div>
                                    </div>
                                </div>
                                <span className={`${styles.categoryBadge} ${getCategoryClass(contact.category)}`}>
                                    {contact.category}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.contactDetail}>
                                    <Mail size={14} />
                                    <span>{contact.email}</span>
                                </div>
                                <div className={styles.contactDetail}>
                                    <Phone size={14} />
                                    <span>{contact.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`col-span-full ${styles.emptyState}`}>
                        <p>No contacts found matching "{searchQuery}" in {activeCategory}.</p>
                    </div>
                )}
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className={styles.modalOverlay} onClick={() => setSelectedContact(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalAvatarContainer}>
                                <div className={styles.modalAvatar}>
                                    {selectedContact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className={styles.modalName}>{selectedContact.name}</h2>
                                    <div className={styles.modalRoleCompany}>
                                        {selectedContact.role} <span className="text-tertiary mx-2">|</span> {selectedContact.company}
                                    </div>
                                    <div className="mt-2">
                                        <span className={`${styles.categoryBadge} ${getCategoryClass(selectedContact.category)}`}>
                                            {selectedContact.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedContact(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Contact Information</span>
                                <div className={styles.infoValue}>
                                    <Mail size={16} />
                                    {selectedContact.email}
                                </div>
                                <div className={styles.infoValue}>
                                    <Phone size={16} />
                                    {selectedContact.phone}
                                </div>
                                <div className={styles.infoValue}>
                                    <MapPin size={16} />
                                    {selectedContact.location}
                                </div>
                            </div>

                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Context & Notes</span>
                                <div className={styles.notesBox}>
                                    {selectedContact.notes}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
