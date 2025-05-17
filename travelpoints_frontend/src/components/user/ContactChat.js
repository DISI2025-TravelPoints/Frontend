import { React, useState } from "react";
import { Modal, Form, Input } from "antd";
import { sendContactMessageRequest } from "../../requests/TouristRequests";
import "../../styles/Chat.css";
import { getEmailFromToken } from "../../utils/Auth";

const ContactChat = ({
  isModalOpen,
  setIsModalOpen,
  attractionId,
  messageApi,
}) => {
  const [name, setName] = useState("");
  const email = getEmailFromToken();
  const [messageContext, setMessageContext] = useState("");

  const [form] = Form.useForm();

  const handleContactMessageSend = async (message) => {
    const chatRoomId = await sendContactMessageRequest(message);
    if (chatRoomId) {
      messageApi.open({
        type: "success",
        duration: 3,
        content: `Message sent successfully!`,
      });
    }
  };

  return (
    <>
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%", fontSize: 20 }}>
            Contact Us
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Send"
        okButtonProps={{
          className: "green-send-button",
        }}
        onOk={() => {
          form
            .validateFields()
            .then((_) => {
              const message = {
                email: email,
                message: messageContext,
                attraction: attractionId,
              };
              form.resetFields();
              setIsModalOpen(false);
              handleContactMessageSend(message);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="message"
            label="Message"
            rule={[{ required: true, message: "Please input a message!" }]}
          >
            <Input.TextArea
              rows={5}
              onChange={(e) => {
                setMessageContext(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ContactChat;
