import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { BarChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width

const data = {
  labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [{ data: [3, 5, 2, 8, 6, 4, 7] }],
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
}

export default function StatsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Weekly Productivity</Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30} yAxisLabel={''} yAxisSuffix={''}      />
    </View>
  )
}
