import { useState, useMemo, useEffect } from 'react';
import { Search, Mail, Phone, X } from 'lucide-react';
import styles from './CRM.module.css';
import { supabase } from '../lib/supabase';

type Category = 'All' | 'Clients' | 'Prospects' | 'Partners' | 'Suppliers';

interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
    category: Category;
    notes: string;
}

const categories: Category[] = ['All', 'Clients', 'Prospects', 'Partners', 'Suppliers'];

export default function CRMView() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching contacts:', error);
            setIsLoading(false);
            return;
        }

        if (data) {
            setContacts(data as Contact[]);
        }
        setIsLoading(false);
    };

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
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
                <div className="flex items-center gap-4 mb-2">
                    <h1 className={`${styles.title} text-gradient`} style={{ marginBottom: 0 }}>CRM & Network</h1>
                    {isLoading && <span className="text-secondary text-sm animate-pulse">Syncing network...</span>}
                </div>
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
                            <button className={styles.closeBtn} onClick={() => setSelectedContact(null)} aria-label="Close contact details">
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.infoGroup}>
                                <span className={styles.infoLabel}>Contact Information</span>
                                <div className={styles.infoValue}>
                                    <Mail size={16} />
                                    {selectedContact.email || 'No email provided'}
                                </div>
                                <div className={styles.infoValue}>
                                    <Phone size={16} />
                                    {selectedContact.phone || 'No phone provided'}
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
