// app/(recipes)/_layout.tsx
import { Stack } from 'expo-router';

export default function PantryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Pantry',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Pantry Details',
          headerShown: false
        }}
      />
    </Stack>
  );
}