export const validateName = (username) => {
    if (!username) {
        return "Name is required.";
    }
    return "";
};

export const validateEmail = (value) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(ro|com|org)$/

    if (!value) {
        return "Email is required.";
    }
    if (!regex.test(value)) {
        // return "Invalid format. Please enter a valid email: name@example.com";
        return "Invalid format.";
    }
    return "";
};

export const validatePassword = (password) => {
    if (!password) {
        return "Password is required.";
    }
    // if we want to add psswd val
    // if (password.length < 8) {
    //     return "Password must be at least 8 characters long";
    // }
    // if (!/^[A-Z]/.test(password)) {
    //     return "Password must start with a capital letter";
    // }
    // if (!/\d/.test(password)) {
    //     return "Password must contain at least 1 number";
    // }
    return "";
};
