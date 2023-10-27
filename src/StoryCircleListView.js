"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const StoryCircleListItem_1 = __importDefault(require("./StoryCircleListItem"));
const StoryCircleListView = ({ data, handleStoryItemPress, unPressedBorderColor, pressedBorderColor, unPressedAvatarTextColor, pressedAvatarTextColor, avatarSize, showText, avatarTextStyle, avatarImageStyle, avatarWrapperStyle, avatarFlatListProps, }) => {
    return (<react_native_1.FlatList keyExtractor={(_item, index) => index.toString()} data={data} horizontal style={styles.paddingLeft} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} ListFooterComponent={<react_native_1.View style={styles.footer}/>} renderItem={({ item, index }) => (<StoryCircleListItem_1.default avatarSize={avatarSize} handleStoryItemPress={() => handleStoryItemPress && handleStoryItemPress(item, index)} unPressedBorderColor={unPressedBorderColor} pressedBorderColor={pressedBorderColor} unPressedAvatarTextColor={unPressedAvatarTextColor} pressedAvatarTextColor={pressedAvatarTextColor} item={item} showText={showText} avatarTextStyle={avatarTextStyle} avatarImageStyle={avatarImageStyle} avatarWrapperStyle={avatarWrapperStyle}/>)} {...avatarFlatListProps}/>);
};
const styles = react_native_1.StyleSheet.create({
    paddingLeft: {
        paddingLeft: 12,
    },
    footer: {
        flex: 1,
        width: 8,
    },
});
exports.default = StoryCircleListView;
