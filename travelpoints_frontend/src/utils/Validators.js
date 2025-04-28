export const validateName = (username) => {
    if (!username) {
        return "Name is required.";
    }
    return "";
};

export const validateEmailRequired = (value) => {
    if (!value) {
        return "Email is required.";
    }
    return "";
};

export const validateEmailFormat = (value) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(ro|com|org)$/;
    if (!regex.test(value)) {
        return "Invalid format.";
    }
    return "";
};

export const validateEmail = (value) => {
    return validateEmailRequired(value) || validateEmailFormat(value);
};


export const validatePassword = (password) => {
    if (!password) {
        return "Password is required.";
    }
    return "";
};

// just in case we decide to add vals for passwd
// export const validatePasswordFormat = (password) => {
//     if (password.length < 8) {
//         return "Password must be at least 8 characters long.";
//     }
//     if (!/^[A-Z]/.test(password)) {
//         return "Password must start with a capital letter.";
//     }
//     if (!/\d/.test(password)) {
//         return "Password must contain at least one number.";
//     }
//     return "";
// };