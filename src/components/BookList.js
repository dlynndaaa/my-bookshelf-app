import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/styles';

const { width } = Dimensions.get('window');

function BookList() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const addBook = () => {
    if (title && author) {
      const newBook = {
        id: Date.now().toString(),
        title: title,
        author: author,
        chaptersRead: 0,
      };

      setBooks([...books, newBook]);
      setTitle('');
      setAuthor('');
    }
  };

  const updateChaptersRead = (id, chapters) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, chaptersRead: parseInt(chapters) } : book
    );
    setBooks(updatedBooks);
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookContainer}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <TextInput
        style={styles.bookInput}
        placeholder="Chapters Read"
        onChangeText={(text) => updateChaptersRead(item.id, text)}
        keyboardType="numeric"
        value={item.chaptersRead.toString()}
      />
      <TouchableOpacity onPress={() => updateChaptersRead(item.id, 0)}>
        <Text style={styles.resetButton}>Reset Chapters</Text>
      </TouchableOpacity>
      <Text style={styles.bookStatus}>Chapters Read: {item.chaptersRead}</Text>
    </View>
  );

return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <Image style={styles.logo} source={require('../../assets/book.png')} />
      <Text style={styles.title}>My Bookshelf</Text>
      
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={titleInputRef}
                style={styles.input}
                placeholder="Book Title"
                onChangeText={setTitle}
                value={title}
              />
              <TextInput
                style={styles.input}
                placeholder="Author"
                onChangeText={setAuthor}
                value={author}
              />
              <TouchableOpacity onPress={addBook} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Book</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalBooks}>Total Books: {books.length}</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

export default BookList;
