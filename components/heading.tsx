import globalStyles, { colors } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { Href, Link } from 'expo-router';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        linkWrapper: {
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 'auto'
        },
        chevron: {
            marginLeft: 8
        },
        link: {
            ...globalStyles.link,
            fontSize: 14
        }
    })
};

interface HeadingProps {
    title: string;
    linkTo: Href;
    linkText: string;
}

export default function Heading({ title, linkTo, linkText, ...rest }: HeadingProps & ViewProps) {
    return (
        <View style={styles.heading} {...rest}>
            <Text style={styles.h1}>{title}</Text>
            <Link href={linkTo} style={{ marginLeft: 'auto' }}>
                <View style={styles.linkWrapper}>
                    <Text style={styles.link}>{linkText}</Text>
                    <Feather name="chevron-right" size={16} color={colors.primary} style={styles.chevron} />
                </View>
            </Link>
        </View>
    );
}
