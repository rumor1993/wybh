

let auth = (req, res, next) => {
    console.log("auth middleware")
    let token = req.cookies.x_auth
    req.token = token
    next()
}

module.exports = { auth }