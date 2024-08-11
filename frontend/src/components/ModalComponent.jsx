/* eslint-disable react/prop-types */
import React from 'react';
import { Modal } from 'antd';

export const ModalComponent = ({ title ,open, footer, modalText }) => (
  <Modal
    title={title}
    open={open}
    footer={footer}
  >
    <p>{modalText}</p>
  </Modal>
);

