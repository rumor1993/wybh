const bcrypt = require('bcrypt');
const saltRound = 10;

    bcrypt.genSalt(saltRound, (err,salt) => {
        if (err) return err
        
        bcrypt.hash(password, salt, (err, hash) =>{
            if (err) return err
            password = hash
        })
    })

