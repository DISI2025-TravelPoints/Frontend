import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllAttractions, createAttraction, deleteAttraction, updateAttraction } from '../requests/AdminRequests';
import { S3_BUCKET_PUBLIC_URL, S3_BUCKET_FOLDER } from '../requests/S3Bucket';
import ReactPlayer from 'react-player';
import {Button, Input, Space, message, Table, Modal, Form} from 'antd';
import AudioFileUploader from '../components/admin/AudioFileUploader';
import MapPicker from '../components/admin/MapPicker';
import '../styles/HomeAdmin.css'; 
import { FaRegSadTear } from 'react-icons/fa';
const HomeAdmin = () => {
    const [messageApi, contextHolder] = message.useMessage();
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

    const alertMessage = (type, msg) => {
        messageApi.open({
          type: type,
          duration: 1,
          content: msg,
        });
      };

    const handleFileUpload = (file) => {
        setAudioFile(file);
        form.setFieldsValue({
            audioFile: file, 
        });
        //console.log('Selected file:', file);
    };

    const handleAttractionDeletion = async (id) =>{
        const res = await deleteAttraction(id);
        if (res === 200) {
            alertMessage("success","Attraction deleted successfully");
        } else {
            alertMessage("error","Error deleting attraction");
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
            // update the table accordingly
            setData(prev => prev.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        name: name,
                        description: description,
                        entryFee: entryFee,
                        latitude: latitude,
                        longitude: longitude,
                        audioFilePath: updatedFile ? S3_BUCKET_FOLDER + updatedFile.name : item.audioFilePath, // update the audio file path if a new file is uploaded
                        lastUpdate: new Date().toLocaleString(), // update the last update time
                    };
                }
                return item;
            }
            ));
            alertMessage("success","Attraction updated successfully");

        } else {
            alertMessage("error","Failed to update attraction");

        }
    }

    //FIXME : sometimes mongo returns 500 error
    const handleAttractionCreation = async (attraction, audioFile) => {
        let res = await createAttraction(attraction, audioFile);
        if (res.status === 201) {
            setData(prev => {
                const newItem = {
                    key: res.data,
                    id: res.data,
                    name: name,
                    description: description,
                    entryFee: entryFee,
                    audioFilePath: S3_BUCKET_FOLDER + audioFile.name,
                    latitude: latitude,
                    longitude: longitude,
                    lastUpdate: new Date().toLocaleString(),
                };
            
                const dataWithoutButton = prev.slice(0, -1);
                const addButton = prev[prev.length - 1];
                
                return [...dataWithoutButton, newItem, addButton];
            });
            alertMessage("success","Attraction created successfully");
        } else {
            alertMessage("error","Failed to create attraction");
        }
        return res.status;
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
                key={text}
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
                    handleAttractionDeletion(record.id);
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
        {contextHolder}
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
                handleAttractionCreation(attraction, audioFile);
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
