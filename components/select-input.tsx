import Text from '@/components/text';
import globalStyles, { colors, fonts } from '@/styles/global';
import { StyleSheet, View } from 'react-native';
import {
    Adapt,
    Select,
    Sheet
} from 'tamagui';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        trigger: {
            display: 'flex',
            width: '100%',
            marginBottom: 32,
            borderColor: colors.primary,
            borderBottomWidth: 2,
            borderRadius: 0,
            padding: 16,
            backgroundColor: '#eee'
        },
        triggerText: {
            padding: 0,
            fontFamily: fonts.poppins.regular,
            fontSize: 16,
            color: colors.text
        },
        itemText: {
            fontFamily: fonts.poppins.regular,
            fontSize: 16,
            color: colors.text
        }
    })
};

export default function SelectInput({
    value,
    onValueChange,
    placeholder,
    label,
    selectLabel,
    selectItems,
    style,
    ...props
}: {
    value?: string,
    onValueChange: (value: string) => void,
    placeholder?: string,
    label?: string,
    selectLabel?: string,
    selectItems: { label: string, value: string }[],
    style?: object,
    props?: React.ComponentProps<typeof Select>
}) {

    return (
        <>
            {label && (<Text size={16} weight='regular'>{label}</Text>)}
            <Select
                value={value}
                onValueChange={(value) => onValueChange(value)}
                {...props}
            >
                <Select.Trigger
                    unstyled
                    backgroundColor='transparent'
                    paddingTop={0}
                    paddingLeft={0}
                    paddingRight={0}
                    paddingBottom={0}
                >
                    <View style={styles.trigger}>
                        <Text style={styles.triggerText}>{value}</Text>
                    </View>
                </Select.Trigger>

                <Adapt platform="touch">
                    <Sheet zIndex={2000000} modal>
                        <Sheet.Frame>
                            <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay />
                    </Sheet>
                </Adapt>

                <Select.Content>
                    <Select.ScrollUpButton />
                    <Select.Viewport unstyled flex={1}>
                        <Select.Group>
                            {selectLabel && (
                                <Select.Label>{selectLabel}</Select.Label>
                            )}
                            {selectItems?.map((item, index) => (
                                <Select.Item key={item.value} value={item.value} index={index}>
                                    <Select.ItemText style={styles.itemText}>{item.label}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select>
        </>
    )
}