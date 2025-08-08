import React from 'react';

import Modal from 'antd/lib/modal'

import 'antd/lib/modal/style/index.css';
export default class ImagePreviewModal extends React.Component {
    render() {
        const { visible, imageUrl, onClose } = this.props;

        return (
            <Modal
                visible={visible}
                footer={null}
                onCancel={onClose}
                width="60%"
                style={{ top: 80 }}
            >
                <img
                    src={imageUrl}
                    alt="预览图片"
                    style={{ width: '100%', display: 'block' }}
                />
            </Modal>
        );
    }
}
