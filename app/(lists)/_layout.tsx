import { Stack } from 'expo-router';

export default function ListsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Lists',
          headerShown: false
        }}
      />
    </Stack>
  );
}