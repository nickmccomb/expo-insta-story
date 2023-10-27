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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const AndroidCubeEffect_1 = __importDefault(require("./components/AndroidCubeEffect"));
const CubeNavigationHorizontal_1 = __importDefault(require("./components/CubeNavigationHorizontal"));
const react_native_modalbox_1 = __importDefault(require("react-native-modalbox"));
const StoryCircleListView_1 = __importDefault(require("./StoryCircleListView"));
const StoryListItem_1 = __importDefault(require("./StoryListItem"));
const helpers_1 = require("./helpers");
const { height, width } = react_native_1.Dimensions.get('window');
const Story = ({ data, unPressedBorderColor, pressedBorderColor, unPressedAvatarTextColor, pressedAvatarTextColor, style, onStart, onClose, duration, swipeText, avatarSize, showAvatarText, avatarTextStyle, onStorySeen, renderCloseComponent, renderSwipeUpComponent, renderTextComponent, autostart, loadedAnimationBarStyle, unloadedAnimationBarStyle, animationBarContainerStyle, storyUserContainerStyle, storyImageStyle, storyAvatarImageStyle, storyContainerStyle, avatarImageStyle, avatarWrapperStyle, avatarFlatListProps, storyVideoStyle, }) => {
    const [dataState, setDataState] = (0, react_1.useState)(data);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(0);
    const [selectedData, setSelectedData] = (0, react_1.useState)([]);
    const cube = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (!autostart)
            return;
        _handleStoryItemPress(data[0], 0);
    }, [autostart]);
    // Component Functions
    const _handleStoryItemPress = (item, index) => {
        const newData = dataState.slice(index);
        if (onStart) {
            onStart(item);
        }
        setCurrentPage(0);
        setSelectedData(newData);
        setIsModalOpen(true);
    };
    (0, react_1.useEffect)(() => {
        handleSeen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    const handleSeen = () => {
        const seen = selectedData[currentPage];
        const seenIndex = dataState.indexOf(seen);
        if (seenIndex > 0) {
            if (!dataState[seenIndex]?.seen) {
                let tempData = dataState;
                dataState[seenIndex] = {
                    ...dataState[seenIndex],
                    seen: true,
                };
                setDataState(tempData);
            }
        }
    };
    function onStoryFinish(state) {
        if (!(0, helpers_1.isNullOrWhitespace)(state)) {
            if (state == 'next') {
                const newPage = currentPage + 1;
                if (newPage < selectedData.length) {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                }
                else {
                    setIsModalOpen(false);
                    setCurrentPage(0);
                    if (onClose) {
                        onClose(selectedData[selectedData.length - 1]);
                    }
                }
            }
            else if (state == 'previous') {
                const newPage = currentPage - 1;
                if (newPage < 0) {
                    setIsModalOpen(false);
                    setCurrentPage(0);
                }
                else {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                }
            }
        }
    }
    const renderStoryList = () => selectedData.map((x, i) => {
        return (<StoryListItem_1.default duration={duration * 1000} key={i} userId={x.id} profileName={x.user_name} profileImage={x.avatar_image} stories={x.stories} currentPage={currentPage} onFinish={onStoryFinish} swipeText={swipeText} renderSwipeUpComponent={renderSwipeUpComponent} renderCloseComponent={renderCloseComponent} renderTextComponent={renderTextComponent} onClosePress={() => {
                setIsModalOpen(false);
                if (onClose) {
                    onClose(x);
                }
            }} index={i} onStorySeen={onStorySeen} unloadedAnimationBarStyle={unloadedAnimationBarStyle} animationBarContainerStyle={animationBarContainerStyle} loadedAnimationBarStyle={loadedAnimationBarStyle} storyUserContainerStyle={storyUserContainerStyle} storyImageStyle={storyImageStyle} storyAvatarImageStyle={storyAvatarImageStyle} storyContainerStyle={storyContainerStyle} storyVideoStyle={storyVideoStyle}/>);
    });
    const renderCube = () => {
        if (react_native_1.Platform.OS == 'ios') {
            return (<CubeNavigationHorizontal_1.default ref={cube} callBackAfterSwipe={(x) => {
                    if (x != currentPage) {
                        setCurrentPage(parseInt(x));
                    }
                }}>
          {renderStoryList()}
        </CubeNavigationHorizontal_1.default>);
        }
        else {
            return (<AndroidCubeEffect_1.default ref={cube} callBackAfterSwipe={(x) => {
                    if (x != currentPage) {
                        setCurrentPage(parseInt(x));
                    }
                }}>
          {renderStoryList()}
        </AndroidCubeEffect_1.default>);
        }
    };
    return (<react_1.Fragment>
      {!autostart && (<react_native_1.View style={style}>
          <StoryCircleListView_1.default handleStoryItemPress={_handleStoryItemPress} data={dataState} avatarSize={avatarSize} unPressedBorderColor={unPressedBorderColor} pressedBorderColor={pressedBorderColor} unPressedAvatarTextColor={unPressedAvatarTextColor} pressedAvatarTextColor={pressedAvatarTextColor} showText={showAvatarText} avatarTextStyle={avatarTextStyle} avatarWrapperStyle={avatarWrapperStyle} avatarImageStyle={avatarImageStyle} avatarFlatListProps={avatarFlatListProps}/>
        </react_native_1.View>)}
      
      <react_native_modalbox_1.default style={styles.modal} isOpen={isModalOpen} onClosed={() => setIsModalOpen(false)} position="center" swipeToClose swipeArea={250} backButtonClose coverScreen={true}>
        {renderCube()}
      </react_native_modalbox_1.default>
    </react_1.Fragment>);
};
exports.Story = Story;
const styles = react_native_1.StyleSheet.create({
    modal: {
        flex: 1,
        height,
        width,
    },
});
exports.default = exports.Story;
exports.Story.defaultProps = {
    showAvatarText: true,
};
