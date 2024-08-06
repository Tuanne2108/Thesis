/* eslint-disable react/prop-types */
import React from 'react';
import { Modal } from 'antd';

export const ModalComponent = ({ title ,visible, footer, modalText }) => (
  <Modal
    title={title}
    visible={visible}
    footer={footer}
  >
    <p>{modalText}</p>
  </Modal>
);

