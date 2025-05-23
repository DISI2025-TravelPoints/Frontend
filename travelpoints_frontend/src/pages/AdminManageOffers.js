import React, { useEffect, useState } from "react";
import "../styles/ManageOffers.css";
import { getUsersByAttraction } from "../requests/WishlistRequests";
import { getAllAttractions } from "../requests/AdminRequests";
import { sendOffer } from "../requests/WishlistRequests";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "react-toastify/dist/ReactToastify.css";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import "../styles/ToastStyles.css";
import SuccessToast from "../components/SuccessToast"; //do NOT delete -> used in the toast

const AdminManageOffers = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [validUntil, setValidUntil] = useState(null);
    const [attractions, setAttractions] = useState([]);
    const [selectedAttractionId, setSelectedAttractionId] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);

    const customDatePickerTheme = createTheme({
        palette: {
            primary: {
                main: '#40af7a',
            },
        },
        components: {
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: '#4dc690',
                        },
                        '&.Mui-selected:hover': {
                            backgroundColor: '#389b6a',
                        },
                    },
                },
            },
        },
    });

    useEffect(() => {
        getAllAttractions()
            .then(setAttractions)
            .catch(err => console.error("Error fetching attractions:", err));
    }, []);

    useEffect(() => {
        if (!selectedAttractionId) return;
        getUsersByAttraction(selectedAttractionId)
            .then(setUsers)
            .catch(err => console.error("Error fetching users:", err));
    }, [selectedAttractionId]);

    const handleSelectAll = (checked) => {
        setSelectedUsers(checked ? users.map(u => u.id) : []);
    };

    // === VALIDATION INSIDE handleSubmit ===
    const handleSubmit = async () => {
        if (!title || !description || !validUntil || !selectedAttractionId || selectedUsers.length === 0) {
            toast(
                ({ closeToast }) => (
                    <div className="custom-error-toast">
                    <span className="error-icon">
                        <ErrorOutlineIcon fontSize="small" />
                    </span>
                        <span className="toast-text">All fields are required</span>
                        <button className="toast-close" onClick={closeToast}>
                            &times;
                        </button>
                    </div>
                ),
                {
                    position: "bottom-right",
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    autoClose: 4000,
                    closeButton: false,
                    icon: false,
                    style: {
                        background: "transparent",
                        boxShadow: "none",
                        padding: 0,
                    },
                }
            );
            return;
        }

        const payload = {
            title,
            description,
            validUntil,
            attractionId: selectedAttractionId,
            userIds: selectedUsers
        };

        try {
            await sendOffer(payload);

            toast(
                ({ closeToast }) => (
                    <div className="custom-success-toast">
                    <span className="check-icon">
                        <CheckCircleIcon fontSize="small" />
                    </span>
                        <span className="toast-text">Offer successfully sent</span>
                        <button className="toast-close" onClick={closeToast}>
                            &times;
                        </button>
                    </div>
                ),
                {
                    position: "bottom-right",
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    autoClose: 4000,
                    closeButton: false,
                    icon: false,
                    style: {
                        background: "transparent",
                        boxShadow: "none",
                        padding: 0,
                    },
                }
            );

            resetForm();
        } catch (err) {
            console.error("Error sending offer:", err);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setValidUntil(null);
        setSelectedAttractionId("");
        setUsers([]);
        setSelectedUsers([]);
        setPreviewMode(false);
    };

    return (
        <div className="manage-offers-container">
            {/*<h2>Offer Form</h2>*/}
            <h2>{previewMode ? "Preview Offer" : "Offer Form"}</h2>

            {!previewMode ? (
                <>
                    <input
                        type="text"
                        placeholder="Name"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="offer-input"
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="offer-textarea"
                    />
                    <div className="date-picker-wrapper">
                        <ThemeProvider theme={customDatePickerTheme}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Valid Until"
                                    value={validUntil}
                                    onChange={(newDate) => {
                                        if (newDate) {
                                            const withTime = new Date(newDate);
                                            withTime.setHours(23, 59, 0, 0);
                                            setValidUntil(withTime);
                                        } else {
                                            setValidUntil(null);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth className="offer-input"/>
                                    )}
                                />
                            </LocalizationProvider>
                        </ThemeProvider>
                    </div>


                    <select
                        value={selectedAttractionId}
                        onChange={e => setSelectedAttractionId(e.target.value)}
                        className="offer-input"
                    >
                        <option value="">Select attraction</option>
                        {attractions.map(attr => (
                            <option key={attr.id} value={attr.id}>
                                {attr.name}
                            </option>
                        ))}
                    </select>

                    {users.length > 0 && (
                        <div className="users-section">
                            <div className="users-header">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === users.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                    Select All
                                </label>
                            </div>

                            <div className="users-list">
                                {users.map(user => (
                                    <div key={user.id} className="user-item">
                                        <span>{user.name || `User ${user.id}`}</span>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => {
                                                setSelectedUsers(prev =>
                                                    prev.includes(user.id)
                                                        ? prev.filter(id => id !== user.id)
                                                        : [...prev, user.id]
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="buttons-row">
                        <button onClick={() => setPreviewMode(true)} className="preview-btn">
                            Preview
                        </button>
                        <button onClick={handleSubmit} className="submit-btn">
                            Send Offer
                        </button>
                    </div>
                </>
            ) : (
                <div className="preview-section">
                    {/*<h3>Preview Offer</h3>*/}
                    <p><strong>Name:</strong> {title}</p>
                    <p><strong>Description:</strong> {description}</p>
                    <p><strong>Valid Until:</strong> {validUntil?.toLocaleString()}</p>
                    <p><strong>Target Attraction:</strong> {attractions.find(a => a.id === selectedAttractionId)?.name}
                    </p>
                    <p><strong>Users:</strong> {selectedUsers.length} selected</p>

                    <div className="buttons-row">
                        <button onClick={() => setPreviewMode(false)} className="cancel-btn">
                            Back
                        </button>
                        <button onClick={handleSubmit} className="submit-btn">
                            Confirm & Send
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default AdminManageOffers;
