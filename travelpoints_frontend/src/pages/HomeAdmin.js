import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllAttractions } from '../requests/AdminRequests';
import {Button, Input, Space, Table, Modal, Form} from 'antd';

import '../styles/HomeAdmin.css'; 
const HomeAdmin = () => {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => record.isAddButton ? (
                <Button  type="dashed" color="green" onClick={()=>{setIsModalOpen(true)}}>
                  + Add New Attraction
                </Button>
              ) : (
                text
              ),
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Entry Fee',
          dataIndex: 'entryFee',
          key: 'entryFee',
          render: (text, record) => record.isAddButton ? '' : (
            `$${text}` 
          ) // add a dollar sign
        },
        {
          title: 'Longitude',
          dataIndex: 'longitude',
          key: 'longitude',
        },
        {
          title: 'Latitude',
          dataIndex: 'latitude',
          key: 'latitude',
        },
        {
          title: 'Last Update',
          dataIndex: 'lastUpdate',
          key: 'lastUpdate',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => record.isAddButton ? null : (
            <Space size="middle">
              <Button type="primary" onClick={() => console.log("Edit", record)}>Edit</Button>
              <Button type="primary" danger onClick={() => console.log("Delete", record)}>Delete</Button>
            </Space>
          ),
        }
    ];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm(); 

    const [selectedSetting, setSelectedSetting] = useState("attractions");
    const [data, setData] = useState([]);
    useEffect(()=>{
        const fetchAttractions = async () => {
            let attractions = await getAllAttractions();
            if (!Array.isArray(attractions)) {
                attractions=[attractions]; // the Table expects an array but we get an object
            }

            const dataSource = attractions.map((attraction)=>({
                key: attraction.id,
                id: attraction.id,  
                name: attraction.name,
                description: attraction.description,
                entryFee: attraction.entryFee,
                audioFilePath: attraction.audioFilePath,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                lastUpdate: attraction.lastUpdate,
            }))
            setData(
                [
                    ...dataSource,
                    {
                        key: 'add-new-attraction', 
                        isAddButton: true,
                    }
                ]
            );
        }
    // based on the selected setting, we will show the corresponding component

        switch(selectedSetting){
            case "users":
                break;
            case "attractions":
                fetchAttractions();
                break;  
            case "reviews":
                break;
        }
    },[selectedSetting]);

    return (
        <>
            <div className="admin-sidebar-container">
                <div className="admin-sidebar">
                    <h2>Admin Menu</h2>
                    <ul>
                        <hr></hr>
                        <button className = "admin-button"
                        onClick={() => setSelectedSetting("users")}>
                            Manage Users
                        </button>
                        <hr></hr>
                        <button
                         className = "admin-button"
                         onClick={() => setSelectedSetting("attractions")}>
                            Manage Attractions
                        </button>
                        <hr></hr>
                        <button className = "admin-button"
                         onClick={() => setSelectedSetting("reviews")}>
                            Manage Reviews
                        </button>
                        <hr></hr>
                    </ul>
                </div>
               
            </div>
            <div className="admin-content">     
                <Table dataSource={data} columns={columns} />
                <Modal
                    title="Add New Attraction"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={() => {
                        form
                        .validateFields()
                        .then(values => {
                            console.log('Form values:', values); 
                            form.resetFields();
                            setIsModalOpen(false);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                    }}
                    >
                    <Form form={form} layout="vertical">
                        <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                        <Input />
                        </Form.Item>
                        <Form.Item
                        name="age"
                        label="Age"
                        rules={[{ required: true, message: 'Please input the age!' }]}
                        >
                        <Input type="number" />
                        </Form.Item>
                        <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please input the address!' }]}
                        >
                        <Input />
                        </Form.Item>
                    </Form>
                    </Modal>
            </div>
        </>
    );
}

export default HomeAdmin;
