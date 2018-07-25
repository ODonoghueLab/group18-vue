const models = require('../localModels')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const Op = models.Sequelize.Op
const emailConfig = models.config.email
const clientConfig = models.config.client

const User = models.User

function createUser (values) {
  return User.findOne({
    where: {
      id: values.id
    }
  }).then(user => {
    if (user === null) {
      return User.create(values).then(models.unwrapInstance)
    }
  })
}

function updateUser (values) {
  return User.findOne({
    where: {
      id: values.id
    }
  }).then(user => {
    if (user) {
      return user.updateAttributes(values).then(models.unwrapInstance)
    } else {
      return null
    }
  })
}

function fetchUser (values) {
  return User.findOne({
    where: values
  }).then(user => {
    if (user) {
      return models.unwrapInstance(user)
    } else {
      return null
    }
  })
}

function fetchUserByToken (token) {
  return User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiresOn: {
        [Op.gte]: new Date().getTime()
      }
    }
  }).then(user => {
    if (user) {
      return models.unwrapInstance(user)
    } else {
      return null
    }
  })
}

function checkUserWithPassword (user, password) {
  return new Promise(resolve => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        resolve(null)
      } else if (isMatch) {
        resolve(user)
      } else {
        resolve(null)
      }
    })
  })
}

async function publicRegisterUser (user) {
  let errors = []
  if (!user.name) {
    errors.push('no user name')
  }
  if (!user.email) {
    errors.push('no email')
  }
  if (!user.password) {
    errors.push('no Password')
  }

  if (errors.length > 0) {
    throw errors.join(', ').join(errors)
  }

  let values = {
    name: user.name,
    email: user.email,
    password: user.password
  }

  try {
    await createUser(values)
    return {
      success: true
    }
  } catch (e) {
    throw new Error('Couldn\'t register, is your email already in use?')
  }
}

/**
 * Updates user where the id field is used to identify the user.
 * @param {Object} user
 * @promise {User}
 */
async function loginUpdateUser (user) {
  const keys = ['id', 'name', 'email', 'password']
  let values = {}
  for (let key of keys) {
    if (user[key]) {
      values[key] = user[key]
    }
  }
  if (!values) {
    throw new Error('No values to update')
  }
  if (!values.id) {
    throw new Error('No user.id to identify user')
  }

  try {
    console.log('>> handlers.updateUser', values)
    await updateUser(values)
    return {
      success: true
    }
  } catch (err) {
    throw new Error('Couldn\'t update user - ' + err.toString())
  }
}

const getToken = async function () {
  const buf = bcrypt.genSaltSync(10)
  const token = buf.toString('hex')
  return token
}

async function publicForgotPassword (email) {
  if (email) {
    email = email.toLowerCase()
  }
  const userByEmail = await fetchUser({
    email: email
  })
  if (!email || !userByEmail) {
    throw new Error('The email [' + email + '] has not been registered')
  }
  userByEmail.resetPasswordToken = await getToken()
  let expiryTime = new Date().getTime() + (1 * 60 * 60 * 1000) // 1 hour from now
  userByEmail.resetPasswordExpiresOn = expiryTime

  updateUser(userByEmail)

  const smtpTransport = nodemailer.createTransport(emailConfig.transport)

  const mailOptions = {
    to: userByEmail.email,
    from: emailConfig.resetEmail,
    subject: 'Password Reset',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      clientConfig.host + '/#/resetPassword/' + encodeURIComponent(userByEmail.resetPasswordToken) + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  }
  try {
    await smtpTransport.sendMail(mailOptions)
    return {
      message: 'An e-mail has been sent to ' + userByEmail.email + ' with further instructions.',
      success: true
    }
  } catch (err) {
    throw new Error(`Failed to send email: ${err}`)
  }
}

async function publicResetPassword (token, password) {
  const userByToken = await fetchUserByToken(token)
  if (!userByToken) {
    throw new Error('Password reset token is invalid or has expired.')
  }
  try {
    userByToken.resetPasswordToken = null
    userByToken.resetPasswordExpiresOn = null
    userByToken.password = password
    console.log('>> handlers.publicResetPassword', userByToken)
    await updateUser(userByToken)
    return {
      success: true
    }
  } catch (err) {
    throw new Error(`Update failure ${err}`)
  }
}

module.exports = {
  createUser,
  fetchUser,
  updateUser,
  checkUserWithPassword,
  publicRegisterUser,
  loginUpdateUser,
  publicForgotPassword,
  publicResetPassword
}
