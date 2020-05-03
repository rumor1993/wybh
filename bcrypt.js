const bcrypt = require('bcrypt');
const saltRound = 10;

module.exports = {  
    encrypt : ((password, callback) => {
        bcrypt.genSalt(saltRound, (err,salt) => {
            if (err) return err
            
            bcrypt.hash(password, salt, (err, hash) =>{
                if (err) return err
                password = hash
                console.log("encryptPassword1", password)
                callback(password)
            })
        })
    }),
    comparePassword : ((plainPassword, encryptPassword, callback) => {
        console.log("plainPassword ", plainPassword)
        console.log("encryptPassword ", encryptPassword)
        bcrypt.compare(plainPassword, encryptPassword, (err, isMatch) => {
            if (err) return callback(err)
            callback(null,isMatch)
        })
    })
}