var jwt = require('jsonwebtoken')


generateToken = ((userid, cb) => {
    // jwt 를 이용해서 토큰 만들기
    let token = jwt.sign(userid, 'wybhToken')
    
})