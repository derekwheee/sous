import Text from '@/components/text';
import { usePathname } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
    const pathname = usePathname();

    console.log(pathname);

    // if (pathname === '/') {
    //   return <Redirect href="/recipes" />;
    // }

    return (
        <View>
            <Text>Not Found</Text>
        </View>
    );
}
