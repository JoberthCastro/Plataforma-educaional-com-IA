import React from 'react';
import styles from './FieldTypeSelector.module.css';

const fieldTypes = [
  { value: 'texto', label: 'Resposta curta', icon: '📝' },
  { value: 'paragrafo', label: 'Parágrafo', icon: '📄' },
  { value: 'multipla', label: 'Múltipla escolha', icon: '🔘' },
  { value: 'checkbox', label: 'Caixas de seleção', icon: '☑️' },
  { value: 'numero', label: 'Número', icon: '🔢' },
];

function FieldTypeSelector({ value, onChange }) {
  return (
    <div className={styles.selectorMenu}>
      {fieldTypes.map(ft => (
        <div
          key={ft.value}
          onClick={() => onChange(ft.value)}
          className={
            styles.selectorOption +
            (value === ft.value ? ' ' + styles.selected : '')
          }
        >
          <span className={styles.selectorIcon}>{ft.icon}</span>
          <span>{ft.label}</span>
        </div>
      ))}
    </div>
  );
}

export default FieldTypeSelector; 