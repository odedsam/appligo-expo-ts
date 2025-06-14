import { Pressable, Text } from 'react-native'

export function CustomButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ padding: 12, backgroundColor: '#007AFF', borderRadius: 8 }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>{title}</Text>
    </Pressable>
  )
}
