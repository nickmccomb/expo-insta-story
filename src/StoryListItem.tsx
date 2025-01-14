import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  IUserStoryItem,
  NextOrPrevious,
  StoryListItemProps,
} from './interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { isNullOrWhitespace, usePrevious } from './helpers';

import GestureRecognizer from 'react-native-swipe-gestures';
import Video from 'react-native-video';
import timeago from 'epoch-timeago';

const { width, height } = Dimensions.get('window');

export const StoryListItem = ({
  index,
  key,
  userId,
  profileImage,
  profileName,
  duration,
  stories,
  currentPage,
  loadedAnimationBarStyle,
  unloadedAnimationBarStyle,
  animationBarContainerStyle,
  storyUserContainerStyle,
  storyImageStyle,
  storyAvatarImageStyle,
  onFinish,
  onClosePress,
  onStorySeen,
  renderCloseComponent,
}: StoryListItemProps) => {
  const [load, setLoad] = useState<boolean>(true);
  const [pressed, setPressed] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);
  const [content, setContent] = useState<IUserStoryItem[]>(
    stories.map((x) => ({
      ...x,
      finish: 0,
    })),
  );
  const progress = useRef(new Animated.Value(0)).current;
  const prevCurrentPage = usePrevious(currentPage);

  useEffect(() => {
    let isPrevious = !!prevCurrentPage && prevCurrentPage > currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          x.finish = 0;
        }
      } else {
        x.finish = 0;
      }
    });
    setContent(data);
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (prevCurrent) {
        if (
          current > prevCurrent &&
          content[current - 1].story == content[current].story
        ) {
          start();
        } else if (
          current < prevCurrent &&
          content[current + 1].story == content[current].story
        ) {
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
    Animated.timing(progress, {
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

  function onSwipeUp(_props?: any) {
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
    } else {
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
    } else {
      // the previous content is empty
      close('previous');
    }
  }

  function close(state: NextOrPrevious) {
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

  React.useEffect(() => {
    if (onStorySeen && currentPage === index) {
      onStorySeen({
        id: userId,
        avatar_image: profileImage,
        user_name: profileName,
        story: content[current],
      });
    }
  }, [currentPage, index, onStorySeen, current]);

  return (
    <GestureRecognizer
      key={key}
      config={config}
      style={[styles.backgroundContainer]}
    >
      <View style={styles.backgroundContainer}>
        {content[current]?.isVideo ? (
          <Video
            source={{
              uri: content[current].story,
            }}
            style={[styles.video]}
            controls={true}
            rate={1.0}
            volume={1.0}
            muted={false}
            resizeMode={'cover'}
            type={'m3u8'}
          />
        ) : (
          <Image
            onLoadEnd={() => start()}
            source={{ uri: content[current].story }}
            style={[styles.image, storyImageStyle]}
          />
        )}
        {load && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={'white'} />
          </View>
        )}
      </View>

      <View style={styles.flexCol}>
        <SafeAreaView style={[styles.userContainer, storyUserContainerStyle]}>
          <View
            style={[styles.animationBarContainer, animationBarContainerStyle]}
          >
            {content.map((index, key) => {
              return (
                <View
                  key={key}
                  style={[
                    styles.animationBackground,
                    unloadedAnimationBarStyle,
                  ]}
                >
                  <Animated.View
                    style={[
                      {
                        flex: current == key ? progress : content[key].finish,
                        height: 2,
                        backgroundColor: 'white',
                      },
                      loadedAnimationBarStyle,
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.profileTop}>
            <Image
              style={[styles.avatarImage, storyAvatarImageStyle]}
              source={{ uri: profileImage }}
            />
            <View style={styles.col}>
              <Text style={styles.avatarText}>{profileName}</Text>
              <Text style={styles.timeText}>{`${timeago(
                stories[current].time,
              )}`}</Text>
            </View>
            <View style={styles.closeIconContainer}>
              {typeof renderCloseComponent === 'function' ? (
                renderCloseComponent({
                  onPress: onClosePress,
                  item: content[current],
                })
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (onClosePress) {
                      onClosePress();
                    }
                  }}
                >
                  <Text style={styles.whiteText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.pressContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                previous();
              }
            }}
          >
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={() => progress.stopAnimation()}
            onLongPress={() => setPressed(true)}
            onPressOut={() => {
              setPressed(false);
              startAnimation();
            }}
            onPress={() => {
              if (!pressed && !load) {
                next();
              }
            }}
          >
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </GestureRecognizer>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};

const styles = StyleSheet.create({
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
    bottom: Platform.OS == 'ios' ? 20 : 50,
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
