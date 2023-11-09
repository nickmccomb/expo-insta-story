"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const StateHelpers_1 = require("./helpers/StateHelpers");
const StoryCircleListItem = ({ item, unPressedBorderColor, pressedBorderColor, unPressedAvatarTextColor, pressedAvatarTextColor, avatarSize = 60, showText, avatarTextStyle, handleStoryItemPress, avatarImageStyle, avatarWrapperStyle, }) => {
    const DEFAULT_AVATAR = require('./assets/images/logo.webp');
    const [isPressed, setIsPressed] = (0, react_1.useState)(item?.seen);
    const prevSeen = (0, StateHelpers_1.usePrevious)(item?.seen);
    (0, react_1.useEffect)(() => {
        if (prevSeen != item?.seen) {
            setIsPressed(item?.seen);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item?.seen]);
    const _handleItemPress = (item) => {
        if (handleStoryItemPress)
            handleStoryItemPress(item);
        setIsPressed(true);
    };
    const avatarWrapperSize = avatarSize + 4;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.TouchableOpacity onPress={() => _handleItemPress(item)} style={[
            styles.avatarWrapper,
            {
                height: avatarWrapperSize,
                width: avatarWrapperSize,
            },
            avatarWrapperStyle,
            !isPressed
                ? {
                    borderColor: unPressedBorderColor ?? 'red',
                }
                : {
                    borderColor: pressedBorderColor ?? 'grey',
                },
        ]}>
        {item.avatar_image ? (<react_native_1.Image style={[
                {
                    height: avatarSize,
                    width: avatarSize,
                    borderRadius: 100,
                },
                avatarImageStyle,
            ]} source={{ uri: item.avatar_image }}/>) : (<react_native_1.Image style={{ height: '56%', width: '56%', alignSelf: 'center' }} resizeMode={'contain'} source={{ uri: DEFAULT_AVATAR }}/>)}
      </react_native_1.TouchableOpacity>
      {showText && (<react_native_1.Text numberOfLines={1} ellipsizeMode="tail" style={[
                {
                    width: avatarWrapperSize,
                    ...styles.text,
                    ...avatarTextStyle,
                },
                isPressed
                    ? { color: pressedAvatarTextColor || undefined }
                    : { color: unPressedAvatarTextColor || undefined },
            ]}>
          {item.user_name}
        </react_native_1.Text>)}
    </react_native_1.View>);
};
exports.default = StoryCircleListItem;
const styles = react_native_1.StyleSheet.create({
    container: {
        marginVertical: 5,
        marginRight: 10,
    },
    avatarWrapper: {
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: 'red',
        borderRadius: 100,
        height: 75,
        width: 75,
    },
    text: {
        marginTop: 3,
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 11,
    },
});
