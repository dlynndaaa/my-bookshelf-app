import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingTop: 20,
    width: width,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalBooks: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 10,
    textAlign: 'center',
  },
  bookContainer: {
    backgroundColor: '#C8E6C9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 5,
  },
  bookInput: {
    height: 40,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  resetButton: {
    color: '#FF5733',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  bookStatus: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});
