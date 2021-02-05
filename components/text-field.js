import styles from './text-field.module.css'
import React, {useState} from "react";

export default function TextField({label, onChange}) {
  const [textValue, setTextValue] = useState('');

  function changeInput(event) {
    setTextValue(event.target.value);
  }

  function onBlur() {
    onChange(textValue);
  }

  return <div className={styles.textInput}>
    <div className={styles.label}>{label}</div>
    <input type="text" value={textValue} onChange={changeInput} onBlur={onBlur}/>
  </div>
}
