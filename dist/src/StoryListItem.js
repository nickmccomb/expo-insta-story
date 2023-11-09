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
exports.StoryListItem = void 0;
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const helpers_1 = require("./helpers");
const react_native_swipe_gestures_1 = __importDefault(require("react-native-swipe-gestures"));
const react_native_video_1 = __importDefault(require("react-native-video"));
const epoch_timeago_1 = __importDefault(require("epoch-timeago"));
const { width, height } = react_native_1.Dimensions.get('window');
const StoryListItem = ({ index, key, userId, profileImage, profileName, duration, stories, currentPage, loadedAnimationBarStyle, unloadedAnimationBarStyle, animationBarContainerStyle, storyUserContainerStyle, storyImageStyle, storyAvatarImageStyle, onFinish, onClosePress, onStorySeen, renderCloseComponent, }) => {
    const [load, setLoad] = (0, react_1.useState)(true);
    const [pressed, setPressed] = (0, react_1.useState)(false);
    const [current, setCurrent] = (0, react_1.useState)(0);
    const [content, setContent] = (0, react_1.useState)(stories.map((x) => ({
        ...x,
        finish: 0,
    })));
    const progress = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const prevCurrentPage = (0, helpers_1.usePrevious)(currentPage);
    (0, react_1.useEffect)(() => {
        let isPrevious = !!prevCurrentPage && prevCurrentPage > currentPage;
        if (isPrevious) {
            setCurrent(content.length - 1);
        }
        else {
            setCurrent(0);
        }
        let data = [...content];
        data.map((x, i) => {
            if (isPrevious) {
                x.finish = 1;
                if (i == content.length - 1) {
                    x.finish = 0;
                }
            }
            else {
                x.finish = 0;
            }
        });
        setContent(data);
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    const prevCurrent = (0, helpers_1.usePrevious)(current);
    (0, react_1.useEffect)(() => {
        if (!(0, helpers_1.isNullOrWhitespace)(prevCurrent)) {
            if (prevCurrent) {
                if (current > prevCurrent &&
                    content[current - 1].story == content[current].story) {
                    start();
                }
                else if (current < prevCurrent &&
                    content[current + 1].story == content[current].story) {
                    start();
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);
    function start() {
        setLoad(false);
        progress.setValue(0);
        startAnimation();
    }
    function startAnimation() {
        react_native_1.Animated.timing(progress, {
            toValue: 1,
            duration: content[current].duration
                ? content[current].duration * 1000
                : duration,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                next();
            }
        });
    }
    function onSwipeUp(_props) {
        if (onClosePress) {
            onClosePress();
        }
        if (content[current].onPress) {
            content[current].onPress?.();
        }
    }
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };
    function next() {
        // check if the next content is not empty
        setLoad(true);
        if (current !== content.length - 1) {
            let data = [...content];
            data[current].finish = 1;
            setContent(data);
            setCurrent(current + 1);
            progress.setValue(0);
        }
        else {
            // the next content is empty
            close('next');
        }
    }
    function previous() {
        // checking if the previous content is not empty
        setLoad(true);
        if (current - 1 >= 0) {
            let data = [...content];
            data[current].finish = 0;
            setContent(data);
            setCurrent(current - 1);
            progress.setValue(0);
        }
        else {
            // the previous content is empty
            close('previous');
        }
    }
    function close(state) {
        let data = [...content];
        data.map((x) => (x.finish = 0));
        setContent(data);
        progress.setValue(0);
        if (currentPage == index) {
            if (onFinish) {
                onFinish(state);
            }
        }
    }
    react_1.default.useEffect(() => {
        if (onStorySeen && currentPage === index) {
            onStorySeen({
                id: userId,
                avatar_image: profileImage,
                user_name: profileName,
                story: content[current],
            });
        }
    }, [currentPage, index, onStorySeen, current]);
    return (<react_native_swipe_gestures_1.default key={key} config={config} style={[styles.backgroundContainer]}>
      <react_native_1.View style={styles.backgroundContainer}>
        {content[current]?.isVideo ? (<react_native_video_1.default source={{
                uri: content[current].story,
            }} style={[styles.video]} controls={true} rate={1.0} volume={1.0} muted={false} resizeMode={'cover'} type={'m3u8'}/>) : (<react_native_1.Image onLoadEnd={() => start()} source={{ uri: content[current].story }} style={[styles.image, storyImageStyle]}/>)}
        {load && (<react_native_1.View style={styles.spinnerContainer}>
            <react_native_1.ActivityIndicator size="large" color={'white'}/>
          </react_native_1.View>)}
      </react_native_1.View>

      <react_native_1.View style={styles.flexCol}>
        <react_native_1.SafeAreaView style={[styles.userContainer, storyUserContainerStyle]}>
          <react_native_1.View style={[styles.animationBarContainer, animationBarContainerStyle]}>
            {content.map((index, key) => {
            return (<react_native_1.View key={key} style={[
                    styles.animationBackground,
                    unloadedAnimationBarStyle,
                ]}>
                  <react_native_1.Animated.View style={[
                    {
                        flex: current == key ? progress : content[key].finish,
                        height: 2,
                        backgroundColor: 'white',
                    },
                    loadedAnimationBarStyle,
                ]}/>
                </react_native_1.View>);
        })}
          </react_native_1.View>
          <react_native_1.View style={styles.profileTop}>
            <react_native_1.Image style={[styles.avatarImage, storyAvatarImageStyle]} source={{ uri: profileImage }}/>
            <react_native_1.View style={styles.col}>
              <react_native_1.Text style={styles.avatarText}>{profileName}</react_native_1.Text>
              <react_native_1.Text style={styles.timeText}>{`${(0, epoch_timeago_1.default)(stories[current].time)}`}</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.closeIconContainer}>
              {typeof renderCloseComponent === 'function' ? (renderCloseComponent({
            onPress: onClosePress,
            item: content[current],
        })) : (<react_native_1.TouchableOpacity onPress={() => {
                if (onClosePress) {
                    onClosePress();
                }
            }}>
                  <react_native_1.Text style={styles.whiteText}>X</react_native_1.Text>
                </react_native_1.TouchableOpacity>)}
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.SafeAreaView>
        <react_native_1.View style={styles.pressContainer}>
          <react_native_1.TouchableWithoutFeedback onPressIn={() => progress.stopAnimation()} onLongPress={() => setPressed(true)} onPressOut={() => {
            setPressed(false);
            startAnimation();
        }} onPress={() => {
            if (!pressed && !load) {
                previous();
            }
        }}>
            <react_native_1.View style={styles.flex}/>
          </react_native_1.TouchableWithoutFeedback>
          <react_native_1.TouchableWithoutFeedback onPressIn={() => progress.stopAnimation()} onLongPress={() => setPressed(true)} onPressOut={() => {
            setPressed(false);
            startAnimation();
        }} onPress={() => {
            if (!pressed && !load) {
                next();
            }
        }}>
            <react_native_1.View style={styles.flex}/>
          </react_native_1.TouchableWithoutFeedback>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_swipe_gestures_1.default>);
};
exports.StoryListItem = StoryListItem;
exports.default = exports.StoryListItem;
exports.StoryListItem.defaultProps = {
    duration: 10000,
};
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    flexCol: {
        flex: 1,
        flexDirection: 'column',
    },
    col: {
        flexDirection: 'column',
        flex: 1,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileTop: {
        flexDirection: 'row',
        paddingTop: 12,
        paddingLeft: 12,
        paddingRight: 20,
    },
    image: {
        width: width,
        height: height,
        resizeMode: 'cover',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    spinnerContainer: {
        zIndex: -100,
        justifyContent: 'center',
        alignSelf: 'center',
        width: width,
        height: height,
    },
    animationBarContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    animationBackground: {
        height: 2,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(117, 117, 117, 0.5)',
        marginHorizontal: 2,
    },
    userContainer: {
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    avatarImage: {
        height: 34,
        width: 34,
        borderRadius: 100,
    },
    avatarText: {
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 6,
    },
    timeText: {
        color: 'white',
        paddingLeft: 6,
    },
    closeIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    swipeUpBtn: {
        position: 'absolute',
        right: 0,
        left: 0,
        alignItems: 'center',
        bottom: react_native_1.Platform.OS == 'ios' ? 20 : 50,
    },
    whiteText: {
        color: 'white',
        fontSize: 20,
    },
    video: {
        aspectRatio: 1 / 2,
        width: '100%',
        height: '100%',
    },
});
