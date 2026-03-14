import { useState } from 'react';
import { glossaryData } from '../data/glossaryData';

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredTerms = glossaryData.filter(term =>
    term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTerms = filteredTerms.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="page-title">Cyber <span>Glossary</span></div>
      </div>

      <input 
        type="text" 
        className="glossary-search" 
        placeholder="Search terms — e.g. phishing, malware, firewall..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
      />

      <div className="section-header">Core Terms — Page {currentPage}</div>
      <div className="glossary-grid">
        {currentTerms.map((term, idx) => (
          <div key={idx} className="term-card">
            <div className="term-name">{term.name}</div>
            <div className="term-def">{term.definition}</div>
            <div className="term-category">{term.category}</div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
