import { View, Text, StyleSheet } from 'react-native';
export default function WorkoutsScreen() {
  return (
    <View style={styles.container}><Text style={styles.text}>Tela de Treinos</Text></View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: 'white', fontSize: 24, fontFamily: 'Poppins_700Bold' },
});