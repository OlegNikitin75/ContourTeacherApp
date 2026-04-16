import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface AppDropdownProps {
  label?: string;
  data: { label: string; value: string }[];
  value: string | null;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;   
  onFocus?: () => void; 
}

export default function AppDropdown  ({ label, data, value, placeholder, error, onChange, onBlur, onFocus }: AppDropdownProps)  {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View className='w-full mb-4'>
      {label && (
        <Text className='text-h4 text-app-black mb-3>
          {label}
        </Text>
      )}
      
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: '#2196F3' }, // Синяя рамка при фокусе
          error && { borderColor: 'red' }        // Красная при ошибке
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? (placeholder || "Выберите...") : '...'}
        value={value}
        
        // Обработка событий
        onFocus={() => {
          setIsFocus(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setIsFocus(false);
          if (onBlur) onBlur();
        }}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 8, color: '#333', fontWeight: '500' },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: { fontSize: 16, color: '#999' },
  selectedTextStyle: { fontSize: 16, color: '#000' },
  itemTextStyle: { fontSize: 16, color: '#333' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4, marginLeft: 4 },
});
