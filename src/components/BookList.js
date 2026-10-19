import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/styles';

function BookList() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [chapter, setChapter] = useState(''); // State baru untuk input Chapter
  const [editingId, setEditingId] = useState(null); // Menyimpan ID buku yang sedang diedit

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const addOrUpdateBook = () => {
    if (title && author) {
      if (editingId) {
        // Mode Edit: Perbarui buku yang ada
        const updatedBooks = books.map(book =>
          book.id === editingId
            ? { ...book, title, author, chaptersRead: parseInt(chapter) || 0 }
            : book
        );
        setBooks(updatedBooks);
        setEditingId(null);
      } else {
        // Mode Tambah: Buat buku baru
        const newBook = {
          id: Date.now().toString(),
          title: title,
          author: author,
          chaptersRead: parseInt(chapter) || 0, // Gunakan nilai input chapter atau 0
        };
        setBooks([...books, newBook]);
      }
      // Reset input setelah selesai
      setTitle('');
      setAuthor('');
      setChapter('');
    }
  };

  const editBook = (book) => {
    // Isi form dengan data buku yang dipilih
    setTitle(book.title);
    setAuthor(book.author);
    setChapter(book.chaptersRead.toString());
    setEditingId(book.id); // Set ID untuk menandakan mode edit
    if (titleInputRef.current) titleInputRef.current.focus();
  };

  const deleteBook = (id) => {
    const filteredBooks = books.filter(book => book.id !== id);
    setBooks(filteredBooks);
  };

  const updateChaptersReadInList = (id, chapters) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, chaptersRead: parseInt(chapters) || 0 } : book
    );
    setBooks(updatedBooks);
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookContainer}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <TextInput
        style={styles.bookInput}
        placeholder="Update Chapters Read"
        onChangeText={(text) => updateChaptersReadInList(item.id, text)}
        keyboardType="numeric"
        value={item.chaptersRead.toString()}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
         <TouchableOpacity onPress={() => updateChaptersReadInList(item.id, 0)}>
          <Text style={styles.resetButton}>Reset</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => editBook(item)}>
          <Text style={{ color: 'blue', fontWeight: 'bold' }}>Edit</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => deleteBook(item.id)}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
         </TouchableOpacity>
      </View>
      <Text style={styles.bookStatus}>Chapters Read: {item.chaptersRead}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            {/* Menggeser logo ke bawah sedikit dengan marginTop */}
            <Image style={[styles.logo, { marginTop: 40 }]} source={require('../../assets/book.png')} />
            <Text style={styles.title}>My Bookshelf</Text>
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
              {/* Input baru untuk Chapter */}
              <TextInput
                style={styles.input}
                placeholder="Chapter"
                onChangeText={setChapter}
                value={chapter}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={addOrUpdateBook} style={styles.addButton}>
                <Text style={styles.addButtonText}>{editingId ? "Update Book" : "Add Book"}</Text>
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