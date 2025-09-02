import React, { useState, useRef, useEffect } from 'react';
import styles from './Autocomplete.module.css';

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
    <div className={styles.container}>
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
        className={styles.input}
        style={style}
        autoComplete="off"
      />

      {showSuggestions && (
        <div
          ref={listRef}
          className={styles.dropdown}
        >
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`${styles.suggestion} ${index === selectedIndex ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
