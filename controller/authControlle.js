const UserModel = require('../models/authRouter')
const bcrypt = require('bcrypt')
// Create and Save a new user
exports.create = async (req, res) => {
    if (!req.body.email && !req.body.password && !req.body.passwordAgain) {
        res.status(400).render('index', {mydata: "Content can not be empty!"})
    }

    const user = new UserModel({
        email: req.body.email,
        password: req.body.password,
        passwordAgain: req.body.passwordAgain,

    });

    await user.save()
        .then(() => {
            res.render('profile', {mydata: user})
        })
        .catch(err => {
            console.log(err)
        });
    res.render('profile', {mydata: user})
};
// Retrieve all users from the database.
exports.findAll = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.status(200).render('index', {mydata: user})
    } catch (error) {
        res.status(404).render('index', {mydata: error.message})
    }
};
// Find a single User with an id
exports.findOne = async (req, res) => {
    try {
        const {email, password} = req.body
        console.log(email)
        UserModel.findOne({email:email}, (error, user) => {
            if (user) {
                console.log("adil")
                bcrypt.compare(password, user.password, (error, same) => {
                    if (same) {
                        req.session.userId = user._id
                        res.status(200).render('profile', {mydata: user})
                    } else {
                        res.redirect('/login')
                    }
                })
            } else {
                res.redirect('/login')
            }
        })

        // const user = await UserModel.findOne({email: req.body.email}).exec(); //change params to query
        //
        //
        // res.status(200).render('profile', {mydata: user})
    } catch (error) {
        res.status(404).render('profile', {mydata: error.message})
    }
};
// Update a user by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    await UserModel.findByIdAndUpdate(id, req.body, {useFindAndModify: false}).then(data => {
        if (!data) {
            res.status(404).send({
                message: `User not found.`
            });
        } else {
            res.send({message: "User updated successfully."})
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {
    await UserModel.deleteOne({email: req.query.email}).then(data => {
        if (!data) {
            res.status(404).render('index', {mydata: "User not found"}).redirect('/')

        } else {
            res.render('index', {mydata: "user " + data.password + " deleted succesfully!"})
        }
    }).catch(err => {
        res.status(500).render('index', {mydata: err.message})
    });
};