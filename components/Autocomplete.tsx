import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => Promise<string[]>;
  style?: React.CSSProperties;
  required?: boolean;
}

function Autocomplete({ 
  name, 
  placeholder, 
  value, 
  onChange, 
  onSearch, 
  style, 
  required = false 
}: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim().length > 0) {
      setLoading(true);
      try {
        const results = await onSearch(newValue);
        setSuggestions(results);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
      setLoading(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = async () => {
    if (suggestions.length === 0 && value.trim().length === 0) {
      setLoading(true);
      try {
        const results = await onSearch('');
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
      setLoading(false);
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      if (!listRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        style={{
          width: '100%',
          padding: 8,
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          fontSize: '1rem',
          boxSizing: 'border-box',
          ...style
        }}
        autoComplete="off"
      />
      
      {showSuggestions && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000, // High z-index to ensure it's on top
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginTop: '1px'
          }}
        >
          {loading ? (
            <div style={{
              padding: '12px',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                display: 'inline-block',
                width: '12px',
                height: '12px',
                border: '2px solid #ddd',
                borderTop: '2px solid #666',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? '#f7fafc' : '#fff',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div style={{
              padding: '12px',
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
