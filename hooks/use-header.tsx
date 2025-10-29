import SearchBar from '@/components/search-bar';
import Text from '@/components/text';
import { colors, fonts } from '@/styles/global';
import { useNavigation } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useLayoutEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

export function useHeader({
    gestureEnabled = true,
    searchBarRef,
    searchPlaceholder,
    onChangeSearch,
    onCancelSearch,
    headerItems = [],
}: UseHeaderParams = {}): UseHeader {
    const navigation = useNavigation();
    const { OS, Version } = Platform;

    const isLegacyVersion = OS !== 'ios' || Number(Version) < 26;

    const platformHeaderItems = isLegacyVersion
        ? mapLegacyHeaderItems(headerItems)
        : mapLiquidGlassHeaderItems(headerItems);

    const [legacySearchTerm, setLegacySearchTerm] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled,
            headerSearchBarOptions:
                !searchBarRef || isLegacyVersion
                    ? null
                    : {
                          ref: searchBarRef,
                          autoCapitalize: 'none',
                          placeholder: searchPlaceholder || 'search...',
                          hideNavigationBar: false,
                          tintColor: colors.primary,
                          onChangeText: onChangeSearch,
                          onCancelButtonPress: onCancelSearch,
                      },
            ...platformHeaderItems,
        });
    }, [
        navigation,
        gestureEnabled,
        searchBarRef,
        searchPlaceholder,
        onChangeSearch,
        onCancelSearch,
        platformHeaderItems,
        isLegacyVersion,
        headerItems,
    ]);

    return {
        isLegacyVersion,
        SearchBar: isLegacyVersion
            ? () => (
                  <SearchBar
                      inputProps={{
                          autoFocus: !!legacySearchTerm,
                          placeholder: searchPlaceholder || 'search...',
                      }}
                      value={legacySearchTerm}
                      onChangeText={(text) => {
                          setLegacySearchTerm(text);
                          onChangeSearch?.({ nativeEvent: { text } });
                      }}
                      onCancel={onCancelSearch}
                  />
              )
            : undefined,
    };
}

function mapLegacyHeaderItems(headerItems: HeaderItem[]): {
    headerRight: () => React.ReactNode;
} {
    const nestedItems = headerItems.reduce(
        (acc, item) => {
            if (item.type === 'menu' && item.menu && item.menu.items.length > 0) {
                acc = [...acc, ...item.menu.items];
            } else {
                acc.push(item);
            }
            return acc;
        },
        [] as (HeaderItem | HeaderMenuItem)[]
    );

    return {
        headerRight: () => (
            <View
                style={{
                    flexDirection: 'row',
                    gap: 8,
                }}
            >
                {nestedItems.map((item, index) => {
                    return (
                        <Pressable
                            key={index}
                            onPress={item.onPress}
                            style={{
                                flexDirection: 'row',
                                gap: 8,
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor:
                                    'tintColor' in item && item.tintColor
                                        ? item.tintColor
                                        : colors.primary,
                            }}
                        >
                            {!item.icon && (
                                <Text
                                    style={{
                                        paddingHorizontal: 4,
                                        color: '#fff',
                                        fontFamily: fonts.poppins.medium,
                                    }}
                                >
                                    {item.label}
                                </Text>
                            )}
                            {item.icon && (
                                <SymbolView
                                    name={item.icon?.name || ''}
                                    size={24}
                                    tintColor='#fff'
                                />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        ),
    };
}

function mapLiquidGlassHeaderItems(headerItems: HeaderItem[]): {
    unstable_headerRightItems: () => HeaderItem[];
} {
    return {
        unstable_headerRightItems: () =>
            headerItems.map((item) => {
                const { labelStyle = {}, icon = {}, ...rest } = item;

                return {
                    type: 'button',
                    labelStyle: {
                        fontFamily: fonts.poppins.medium,
                        fontSize: 16,
                        color: '#fff',
                        ...labelStyle,
                    },
                    icon: icon
                        ? {
                              type: 'sfSymbol',
                              ...icon,
                          }
                        : undefined,
                    variant: 'prominent',
                    tintColor: colors.primary,
                    ...rest,
                };
            }),
    };
}
