import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllAttractions, createAttraction, deleteAttraction, updateAttraction } from '../requests/AdminRequests';
import { S3_BUCKET_PUBLIC_URL } from '../requests/S3Bucket';
import ReactPlayer from 'react-player';
import {Button, Input, Space, Table, Modal, Form} from 'antd';
import AudioFileUploader from '../components/admin/AudioFileUploader';
import MapPicker from '../components/admin/MapPicker';
import '../styles/HomeAdmin.css'; 
const HomeAdmin = () => {
    
    // state definition for attraction creation
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [entryFee, setEntryFee] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [audioFile, setAudioFile] = useState(null);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    // TODO : break attraction creation into a separate component
    const handleLocationSelected = (location) => {
        setLatitude(parseFloat(location[0]));
        setLongitude(parseFloat(location[1]));
        form.setFieldsValue(
            {coordinates: location}
        )
        console.log('Selected location:', location);
    };

    const handleFileUpload = (file) => {
        setAudioFile(file);
        form.setFieldsValue({
            audioFile: file, 
        });
        //console.log('Selected file:', file);
    };

    const handleAttractionDeleteion = async (id) =>{
        const res = await deleteAttraction(id);
        if (res === 200) {
            alert("Attraction deleted successfully");
        } else {
            alert("Error deleting attraction");
        }
    }

    const handleAttractionUpdate = async (id) =>{
        const updatedAttraction = {
            name: name,
            description: description,
            entryFee: entryFee,
            latitude: latitude,
            longitude: longitude,     
        }
        const updatedFile = audioFile ? audioFile : null;
        const res = await updateAttraction(id, updatedAttraction, updatedFile);
        if (res === 200) {
            alert("Attraction updated successfully");
        } else {
            alert("Error updating attraction");
        }
    }
    
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
            title: 'Audio',
            key: 'audio',
            dataIndex: 'audioFilePath',
            render: (text, record) => record.isAddButton ? null : (
                <ReactPlayer
                url={S3_BUCKET_PUBLIC_URL + text} 
                controls                                                                                                                     
                width="100%"
                height="50px"
                style={{ margin: '0 auto' }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => record.isAddButton ? null : (
                <Space size="middle">
                <Button type="primary" onClick={(e) => {
                    setIsEditModalOpen(true);
                    form.setFieldsValue({
                        name: record.name,
                        description: record.description,
                        entryFee: record.entryFee,
                        coordinates: [record.latitude, record.longitude],
                        audioFile: record.audioFilePath,
                    });
                    setName(record.name);
                    setDescription(record.description);
                    setEntryFee(record.entryFee);
                    setLatitude(record.latitude);
                    setLongitude(record.longitude);
                    setSelectedAttraction(record.id);
                }}>Edit</Button>
                <Button type="primary" danger onClick={(e) =>{
                    setData(prev => prev.filter(item => item.id !== record.id));
                    handleAttractionDeleteion(record.id);
                } }>Delete</Button>
                </Space>
            ),
        }
    ];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    
//TODO return the created instance to update the table for a faster experience

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
        okText="Create"
        onOk={() => {
            form
            .validateFields()
            .then(_ => {
                const attraction = {
                    name: name,
                    description: description,
                    entryFee: entryFee,
                    latitude: latitude,
                    longitude: longitude,
                }
                let res = createAttraction(attraction, audioFile);
                if (res === 201) {
                    //alert("Attraction created successfully");
                    form.resetFields();
                    setIsModalOpen(false);
                } else {
                    alert("Error creating attraction");
                }
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
        <Input onChange={(e)=>{setName(e.target.value)}}/>
        </Form.Item>
        <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input the description!' }]}
        >
        <Input  onChange={(e)=>{setDescription(e.target.value)}}/>
        </Form.Item>
        <Form.Item
        name="entryFee"
        label="Entry Fee"
        rules={[{ required: true, message: 'Please input the entry fee!' }]}
        >
        <Input type='number' onChange={(e)=>{setEntryFee(parseFloat(e.target.value))}}/>
        </Form.Item>
        <Form.Item
        name="coordinates"
        label="Coordinates"
        rules={[{ required: true, message: 'Please input the coordinates!' }]}
        >
        <MapPicker onLocationSelected={handleLocationSelected} position={null}/>
        </Form.Item>
        <Form.Item
        name="audioFile"
        label="Audio File"
        rules={[{ required: true, message: 'Please input the audio file!' }]}
        >
        <AudioFileUploader uploadFile={handleFileUpload} />
        </Form.Item>
        </Form>
        </Modal>

        <Modal
            title="Update Attraction"
            open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Update"
        onOk={() => {
            form
            .validateFields()
            .then(_ => {
                handleAttractionUpdate(selectedAttraction);
                form.resetFields();
                setIsEditModalOpen(false);
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
        <Input onChange={(e)=>{setName(e.target.value)}}/>
        </Form.Item>
        <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input the description!' }]}
        >
        <Input  onChange={(e)=>{setDescription(e.target.value)}}/>
        </Form.Item>
        <Form.Item
        name="entryFee"
        label="Entry Fee"
        rules={[{ required: true, message: 'Please input the entry fee!' }]}
        >
        <Input type='number' onChange={(e)=>{setEntryFee(parseFloat(e.target.value))}}/>
        </Form.Item>
        <Form.Item
        name="coordinates"
        label="Coordinates"
        rules={[{ required: true, message: 'Please input the coordinates!' }]}
        >
        <MapPicker onLocationSelected={handleLocationSelected} position={[latitude,longitude]} />
        </Form.Item>
        <Form.Item
        name="audioFile"
        label="Audio File"
        rules={[{ required: true, message: 'Please input the audio file!' }]}
        >
        <AudioFileUploader uploadFile={handleFileUpload} />
        </Form.Item>
        </Form>
        </Modal>
        </div>
        </>
    );
}

export default HomeAdmin;
