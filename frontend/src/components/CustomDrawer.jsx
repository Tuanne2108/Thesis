/* eslint-disable react/prop-types */
import React from "react";
import { Button, Drawer, Space } from "antd";

const CustomDrawer = ({ open, onClose, onSubmit, title, children }) => {
    return (
        <Drawer
            title={title}
            placement="right"
            open={open}
            onClose={onClose}
            style={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onSubmit} type="primary">
                        Submit
                    </Button>
                </Space>
            }>
            {children}
        </Drawer>
    );
};

export default CustomDrawer;
