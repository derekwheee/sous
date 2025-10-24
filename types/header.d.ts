interface UseHeaderParams {
    searchBarRef?: any;
    searchPlaceholder?: string;
    onChangeSearch?: ({ nativeEvent: { text } }: { nativeEvent: { text: string } }) => void;
    onCancelSearch?: () => void;
    headerItems?: HeaderItem[];
    dependencies?: React.DependencyList;
}

interface UseHeader {
    isLegacyVersion: boolean;
    SearchBar?: React.Element;
}

interface HeaderMenuItem {
    type: 'action' | 'submenu';
    label?: string;
    icon?: {
        type: 'sfSymbol' | 'image';
        name?: string;
        source?: any;
    };
    onPress?: () => void;
    state?: 'on' | 'off' | 'mixed';
    disabled?: boolean;
    destructive?: boolean;
    hidden?: boolean;
    keepsMenuPresented?: boolean;
    discoverabilityLabel?: string;
    items?: HeaderMenuItem[];
}

interface HeaderItem {
    type?: 'button' | 'menu';
    label: string;
    labelStyle?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        color?: string;
    };
    icon?: {
        type?: 'sfSymbol' | 'image';
        name?: any;
        source?: any;
    };
    variant?: 'prominent' | 'plain' | 'done';
    tintColor?: string;
    disabled?: boolean;
    width?: number;
    hidesSharedBackground?: boolean;
    sharesBackground?: boolean;
    identifier?: string;
    badge?: {
        value: string | number;
        style?: {
            fontFamily?: string;
            fontSize?: number;
            fontWeight?: string;
            color?: string;
        };
    };
    accessibilityLabel?: string;
    accessibilityHint?: string;
    onPress?: () => void;
    selected?: boolean;
    changesSelectionAsPrimaryAction?: boolean;
    menu?: {
        items: HeaderMenuItem[];
    };
}
