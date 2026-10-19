import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/styles';

function BookList() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverUri, setCoverUri] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const addOrUpdateBook = () => {
    if (title && author && totalPages) {
      if (editingId) {
        const updatedBooks = books.map(book =>
          book.id === editingId
            ? { ...book, title, author, totalPages: parseInt(totalPages) || 0, coverUri: coverUri }
            : book
        );
        setBooks(updatedBooks);
        setEditingId(null);
      } else {
        const newBook = {
          id: Date.now().toString(),
          title: title,
          author: author,
          totalPages: parseInt(totalPages) || 0,
          pagesRead: 0,
          coverUri: coverUri,
        };
        setBooks([...books, newBook]);
      }
      setTitle('');
      setAuthor('');
      setTotalPages('');
      setCoverUri(null);
    }
  };

  const editBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setTotalPages(book.totalPages.toString());
    setCoverUri(book.coverUri || null);
    setEditingId(book.id);
    if (titleInputRef.current) titleInputRef.current.focus();
  };

  const deleteBook = (id) => {
    const filteredBooks = books.filter(book => book.id !== id);
    setBooks(filteredBooks);
  };

  const updatePagesRead = (id, pages) => {
    const updatedBooks = books.map(book => {
      if (book.id === id) {
        let newPagesRead = parseInt(pages) || 0;
        if (newPagesRead > book.totalPages) newPagesRead = book.totalPages;
        if (newPagesRead < 0) newPagesRead = 0; // Mencegah nilai minus
        return { ...book, pagesRead: newPagesRead };
      }
      return book;
    });
    setBooks(updatedBooks);
  };

  const renderItem = ({ item }) => {
    // Menghitung persentase progres untuk lebar bar (0% sampai 100%)
    const progressPercent = item.totalPages > 0 ? (item.pagesRead / item.totalPages) * 100 : 0;

    return (
      <View style={styles.bookContainer}>
        <View style={{ flexDirection: 'row' }}>
          {/* Kiri: Gambar Cover */}
          <View style={{ marginRight: 15 }}>
            {item.coverUri ? (
              <Image 
                source={{ uri: item.coverUri }} 
                style={{ width: 90, height: 120, borderRadius: 8 }} 
              />
            ) : (
              <View style={{ width: 90, height: 120, backgroundColor: '#e0e0e0', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#888', fontSize: 12 }}>No Cover</Text>
              </View>
            )}
          </View>

          {/* Kanan: Detail Buku & Progress Bar */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            
            {/* Baris Atas: Judul dan Tombol Delete */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={[styles.bookTitle, { flex: 1, marginRight: 10 }]} numberOfLines={2}>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteBook(item.id)} style={{ padding: 4 }}>
                <Text style={{ color: '#F44336', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bookAuthor}>by {item.author}</Text>
            <Text style={[styles.bookStatus, { marginTop: 4, marginBottom: 6 }]}>
              Progress: {item.pagesRead} / {item.totalPages} Pages
            </Text>
            
            {/* Progress Bar Interaktif (- |===| +) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              {/* Tombol Minus */}
              <TouchableOpacity 
                style={{ backgroundColor: '#f0f0f0', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => updatePagesRead(item.id, item.pagesRead - 1)}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#555' }}>-</Text>
              </TouchableOpacity>

              {/* Batang Progress */}
              <View style={{ flex: 1, height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginHorizontal: 8, overflow: 'hidden' }}>
                <View style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 }} />
              </View>

              {/* Tombol Plus */}
              <TouchableOpacity 
                style={{ backgroundColor: '#f0f0f0', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => updatePagesRead(item.id, item.pagesRead + 1)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#555' }}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Tombol Aksi Bawah */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
               <TouchableOpacity onPress={() => updatePagesRead(item.id, 0)} style={{ marginRight: 20 }}>
                <Text style={styles.resetButton}>Reset</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => editBook(item)}>
                <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>Edit Info</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <Image style={[styles.logo, { marginTop: 40 }]} source={require('../../assets/book.png')} />
            <Text style={styles.title}>My Bookshelf</Text>
            
            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <View style={{ alignItems: 'center', marginRight: 15 }}>
                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={{ width: 90, height: 120, borderRadius: 8, marginBottom: 10 }} />
                  ) : (
                    <View style={{ width: 90, height: 120, backgroundColor: '#e0e0e0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={{ color: '#888', fontSize: 12 }}>No Cover</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={pickImage} style={{ backgroundColor: '#2196F3', padding: 8, borderRadius: 5, width: 90, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center' }}>{coverUri ? "Change" : "Pick Cover"}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <TextInput
                    ref={titleInputRef}
                    style={[styles.input, { marginBottom: 10 }]}
                    placeholder="Book Title"
                    onChangeText={setTitle}
                    value={title}
                  />
                  <TextInput
                    style={[styles.input, { marginBottom: 10 }]}
                    placeholder="Author"
                    onChangeText={setAuthor}
                    value={author}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Total Pages"
                    onChangeText={setTotalPages}
                    value={totalPages}
                    keyboardType="numeric"
                  />
                </View>
              </View>

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