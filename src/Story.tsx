import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { IUserStory, NextOrPrevious, StoryProps } from './interfaces';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import AndroidCubeEffect from './components/AndroidCubeEffect';
import CubeNavigationHorizontal from './components/CubeNavigationHorizontal';
import Modal from 'react-native-modalbox';
import StoryCircleListView from './StoryCircleListView';
import StoryListItem from './StoryListItem';
import { isNullOrWhitespace } from './helpers';

const { height, width } = Dimensions.get('window');

export const Story = ({
  data,
  unPressedBorderColor,
  pressedBorderColor,
  unPressedAvatarTextColor,
  pressedAvatarTextColor,
  style,
  duration,
  avatarSize,
  showAvatarText,
  avatarTextStyle,
  autostart,
  loadedAnimationBarStyle,
  unloadedAnimationBarStyle,
  animationBarContainerStyle,
  storyUserContainerStyle,
  storyImageStyle,
  storyAvatarImageStyle,
  storyContainerStyle,
  avatarImageStyle,
  avatarWrapperStyle,
  avatarFlatListProps,
  storyVideoStyle,
  onStart,
  onClose,
  onStorySeen,
  renderCloseComponent,
}: StoryProps) => {
  const [dataState, setDataState] = useState<IUserStory[]>(data);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<IUserStory[]>([]);
  const cube = useRef<CubeNavigationHorizontal | AndroidCubeEffect>();

  useEffect(() => {
    if (!autostart) return;

    _handleStoryItemPress(data[0], 0);
  }, [autostart]);

  // Component Functions
  const _handleStoryItemPress = (item: IUserStory, index?: number) => {
    const newData = dataState.slice(index);
    if (onStart) {
      onStart(item);
    }

    setCurrentPage(0);
    setSelectedData(newData);
    setIsModalOpen(true);
  };

  useEffect(() => {
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

  function onStoryFinish(state: NextOrPrevious) {
    if (!isNullOrWhitespace(state)) {
      if (state == 'next') {
        const newPage = currentPage + 1;
        if (newPage < selectedData.length) {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        } else {
          setIsModalOpen(false);
          setCurrentPage(0);
          if (onClose) {
            onClose(selectedData[selectedData.length - 1]);
          }
        }
      } else if (state == 'previous') {
        const newPage = currentPage - 1;
        if (newPage < 0) {
          setIsModalOpen(false);
          setCurrentPage(0);
        } else {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        }
      }
    }
  }

  const renderStoryList = () =>
    selectedData.map((x, i) => {
      return (
        <StoryListItem
          duration={duration * 1000}
          key={i}
          userId={x.id}
          profileName={x.user_name}
          profileImage={x.avatar_image}
          stories={x.stories}
          currentPage={currentPage}
          onFinish={onStoryFinish}
          renderCloseComponent={renderCloseComponent}
          onClosePress={() => {
            setIsModalOpen(false);
            if (onClose) {
              onClose(x);
            }
          }}
          index={i}
          onStorySeen={onStorySeen}
          unloadedAnimationBarStyle={unloadedAnimationBarStyle}
          animationBarContainerStyle={animationBarContainerStyle}
          loadedAnimationBarStyle={loadedAnimationBarStyle}
          storyUserContainerStyle={storyUserContainerStyle}
          storyImageStyle={storyImageStyle}
          storyAvatarImageStyle={storyAvatarImageStyle}
          storyContainerStyle={storyContainerStyle}
          storyVideoStyle={storyVideoStyle}
        />
      );
    });

  const renderCube = () => {
    if (Platform.OS == 'ios') {
      return (
        <CubeNavigationHorizontal
          ref={cube as React.LegacyRef<CubeNavigationHorizontal>}
          callBackAfterSwipe={(x: any) => {
            if (x != currentPage) {
              setCurrentPage(parseInt(x));
            }
          }}
        >
          {renderStoryList()}
        </CubeNavigationHorizontal>
      );
    } else {
      return (
        <AndroidCubeEffect
          ref={cube as React.LegacyRef<AndroidCubeEffect>}
          callBackAfterSwipe={(x: any) => {
            if (x != currentPage) {
              setCurrentPage(parseInt(x));
            }
          }}
        >
          {renderStoryList()}
        </AndroidCubeEffect>
      );
    }
  };

  return (
    <Fragment>
      {!autostart && (
        <View style={style}>
          <StoryCircleListView
            handleStoryItemPress={_handleStoryItemPress}
            data={dataState}
            avatarSize={avatarSize}
            unPressedBorderColor={unPressedBorderColor}
            pressedBorderColor={pressedBorderColor}
            unPressedAvatarTextColor={unPressedAvatarTextColor}
            pressedAvatarTextColor={pressedAvatarTextColor}
            showText={showAvatarText}
            avatarTextStyle={avatarTextStyle}
            avatarWrapperStyle={avatarWrapperStyle}
            avatarImageStyle={avatarImageStyle}
            avatarFlatListProps={avatarFlatListProps}
          />
        </View>
      )}

      <Modal
        style={styles.modal}
        isOpen={isModalOpen}
        onClosed={() => setIsModalOpen(false)}
        position="center"
        swipeToClose
        swipeArea={250}
        backButtonClose
        coverScreen={true}
      >
        {renderCube()}
      </Modal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    height,
    width,
  },
});

export default Story;

Story.defaultProps = {
  showAvatarText: true,
};
