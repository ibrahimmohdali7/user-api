const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken');

/**
 * @swagger
 * /api/user/register:
 *    post:
 *      description: Use to add a user
 *    parameters:
 *      - name: email
 *        in: query
 *        description: email of user
 *        required: true
 *        schema:
 *          type: email
 *          format: email
 *      - name: password
 *        in: query
 *        description: password of user
 *        required: true
 *        schema:
 *          type: password
 *          format: password
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
router.post('/register',  async (req, res) => {

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({message: error.details[0].message})

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    email: req.body.email,
    password: hashPassword,
  });
  try {
    await user
      .save()
      .then((data) => {
        res.json(data);
      })
  } catch (error) {
    res.json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user/login:
 *    post:
 *      description: Use to login
 *    parameters:
 *      - name: email
 *        in: query
 *        description: email of user
 *        required: true
 *        schema:
 *          type: email
 *          format: email
 *      - name: password
 *        in: query
 *        description: password of user
 *        required: true
 *        schema:
 *          type: password
 *          format: password
 *    responses:
 *      '201':
 *        description: Successfully loggedin
 */
router.post('/login', async (req, res) => {
  const { error } = await loginValidation(req.body);
  if (error) return res.status(400).send({message: error.details[0].message});

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({message: 'Email is incorrect'})

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({message: 'Password is incorrect'});

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '4h'} );
  res.header('auth-token', token).send({token: token});
})

module.exports = router