async function validationCredentials(data) {
    const { login, password } = data;
    const response = {
        login: true,
        password: true
    };
    if (!password || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || password.length < 8) {
        response.password = false
    }
    if (!login || login.length < 6) {
        response.login = false
    }
    return response
}

module.exports = validationCredentials;