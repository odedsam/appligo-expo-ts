// import React, { useState } from 'react'
// import { View, TextInput, Button, FlatList, Text } from 'react-native'
// import { useOpenAIStore } from '@/store/openai'

// export default function AssistantScreen() {
//   const [input, setInput] = useState('')
//   const { messages, sendMessage } = useOpenAIStore()

//   const onSend = () => {
//     if (!input.trim()) return
//     sendMessage(input.trim())
//     setInput('')
//   }

//   return (
//     <View style={{ flex: 1, padding: 16 }}>ß
//       <FlatList
//         data={messages}
//         keyExtractor={(_, i) => i.toString()}
//         renderItem={({ item }) => (
//           <Text style={{ marginVertical: 4 }}>
//             <Text style={{ fontWeight: 'bold' }}>{item.role}: </Text>
//             {item.content}
//           </Text>
//         )}
//       />
//       <TextInput
//         value={input}
//         onChangeText={setInput}
//         placeholder="Ask AI anything..."
//         style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
//       />
//       <Button title="Send" onPress={onSend} />
//     </View>
//   )
// }
