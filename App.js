import React from 'react';
import { View } from 'react-native';
import BookList from './components/BookList';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <BookList />
    </View>
  );
}
