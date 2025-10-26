import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, SafeAreaView, Image} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {ButtonView} from '../../reuseableComponents';
import {Metrics} from '../../theme';

const modalClose = require('./img/modalClose.png');

interface IImageViewerModal {
  gallery: [{uri: string; id: number}];
  isAddImageIcon?: boolean;
  onPress?: () => void;
  renderFooter?: React.ReactNode;
}

const ImageViewerModal = forwardRef(
  (
    {
      gallery,
      isAddImageIcon,
      onPress,
      renderFooter,
      ...rest
    }: IImageViewerModal,
    ref,
  ) => {
    const [isVisible, setVisible] = useState(false);
    const [isIndex, setIndex] = useState(0);

    const hide = () => {
      setVisible(false);
    };

    useImperativeHandle(ref, () => ({
      show() {
        setVisible(true);
      },

      hideModal() {
        setVisible(false);
      },
      setIndexParam(index: number) {
        setIndex(index);
      },
    }));
    const index = !isAddImageIcon ? isIndex - 1 : isIndex;
    const id = gallery[index] && gallery[index].id;
    return (
      <Modal transparent={true} visible={isVisible} animationIn="fadeIn">
        <ImageViewer
          imageUrls={gallery}
          enableSwipeDown
          onCancel={() => {
            hide();
          }}
          flipThreshold={1}
          enableImageZoom
          enablePreload
          renderFooter={renderFooter}
          index={index}
          pageAnimateTime={500}
          style={{justifyContent: 'center'}}
          renderHeader={() => (
            <SafeAreaView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: Metrics.screenWidth - Metrics.smallMargin,
                zIndex: 100,
                position: 'absolute',
                top: Metrics.heightRatio(10),
                left: 0,
              }}>
              <ButtonView
                style={{
                  paddingVertical: 30,
                  paddingHorizontal: 30,
                }}
                onPress={onPress}>
                <Image source={modalClose} style={{width: 20, height: 20}} />
              </ButtonView>
            </SafeAreaView>
          )}
          {...rest}
        />
      </Modal>
    );
  },
);

export default ImageViewerModal;
