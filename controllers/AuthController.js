const User = require('../models/User');

const bcrypt = require('bcryptjs');
const { use } = require('../routes/authRoutes');

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login');
    }

    static async loginPost(req, res) {

        const { email, password } = req.body;

        //find user

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash('message', 'User not found');
            res.render('auth/login');

            return;
        }

        //check if password match

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            req.flash('message', 'user or password incorrect');
            res.render('auth/login');

            return;
        }

        req.session.userid = user.id;

        req.flash('message', 'Successful Login');

        req.session.save(() => {
            res.redirect('/');
        });
    }

    static register(req, res) {
        res.render('auth/register');
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmPassword } = req.body;

        //check if user exists
        const checkIfUserExits = await User.findOne({ where: { email: email } });

        if (checkIfUserExits) {
            req.flash('message', 'Email is already used');
            res.render('auth/register');

            return;
        }

        //password match validation

        if (password != confirmPassword) {
            req.flash('message', 'The confirm password is incorrect');
            res.render('auth/register');

            return;
        }

        //create a password

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user);

            req.session.userid = createdUser.id;

            req.flash('message', 'Successful registration!');

            req.session.save(() => {
                res.redirect('/');
            })

        } catch (error) {
            console.log(error);
        }

    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }

}