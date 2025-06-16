import { CalendarList } from 'react-native-calendars';

import React from 'react';
import { Text, View } from 'react-native';

export default function PlannerScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CalendarList
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator
        onDayPress={(day) => {
          console.log('selected day', day);
          // כאן תוסיף ניווט או עדכון סטייט לפי היום שנבחר
        }}
      />
      <Text style={{ marginTop: 16 }}>Tasks for selected day will show here.</Text>
    </View>
  );
}
