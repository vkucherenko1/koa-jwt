const bcrypt = require("bcryptjs")

const userService = require('../services/user')
const { User } = require("./models/models")

const validationCredentials = require('../../shared/validators/credentials')


async function register(data) {
    const { login, password } = data;

    try {
        const validation = await validationCredentials(data);

        if (!validation.password) {
            return {
                success: false,
                message: "Not valid password"
            }
        }
        if (!validation.login) {
            return {
                success: false,
                message: "Not valid login"
            }
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            login,
            password: hashPassword,
            created: new Date()
        });
        if (!!(await userService.find(login)).length) {
            return {
                success: false,
                message: "This Name already created",
            };
        }
        else {
            await user.save((error) => {
                if (error) {
                    console.log(error);
                }
            });

            return {
                success: true,
                message: "Created"
            };
        }
    }
    catch (e) {
        return {
            success: false,
            message: "Something went wrong"
        }
    }
}

module.exports = register;
