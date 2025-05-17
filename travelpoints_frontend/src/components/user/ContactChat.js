import {React, useState} from "react";
import { Modal, Form, Input } from "antd";
import { sendContactMessageRequest } from "../../requests/TouristRequests";
import '../../styles/Chat.css';

const ContactChat = ({isModalOpen, setIsModalOpen, attractionId}) =>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [messageContext, setMessageContext] = useState('');

    const [form] = Form.useForm();

    const handleContactMessageSend = async (message) =>{
        const chatRoomId = await sendContactMessageRequest(message);
        console.log(chatRoomId);
    };

    return (<>
    <Modal
        title={<div style={{ textAlign: 'center', width: '100%', fontSize:20 }}>Contact Us</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Send"
       okButtonProps={{
      className: 'green-send-button'
  }}
        onOk={() => {
          form
            .validateFields()
            .then((_) => {
              const message = {
                name: name,
                email: email,
                message: messageContext,
                attraction:attractionId
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
        <Form.Item name = "name" label = "Name" rule = {[{required:true, message: "Please input your name!"}]}>
            <Input onChange={(e)=>{setName(e.target.value);}}/>
        </Form.Item>
        <Form.Item name = "email" label = "Email" rule = {[{required:true, message: "Please input your email!"}]}>
            <Input onChange={(e)=>{setEmail(e.target.value);}}/>
        </Form.Item>
        <Form.Item 
        name = "message" 
        label = "Message" 
        rule = {[{required:true, message: "Please input a message!"}]}
        
        >
            <Input.TextArea rows={5} onChange={(e)=>{setMessageContext(e.target.value);}}/>
        </Form.Item>
        </Form>
      </Modal>
      </>);
};

export default ContactChat;