import { Stack } from 'expo-router';

export default function PantryLayout() {
  return (
    <Stack

      screenOptions={() => ({
        headerTitle: 'sous',
        headerStyle: {
          height: 112,
          backgroundColor: '#FFD541',
        },
        headerTitleStyle: {
          fontFamily: 'Caprasimo_400Regular',
          fontSize: 36
        },
        headerBackground: () => null,
        headerBackButtonMenuEnabled: false,
        headerBackButtonDisplayMode: 'minimal'
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Pantry',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Pantry Details',
        }}
      />
    </Stack>
  );
}