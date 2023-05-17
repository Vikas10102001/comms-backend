const jwt=require('jsonwebtoken')

const verifyTokenSocket=(socket,next)=>{
    const token=socket.handshake.auth?.token
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        socket.user=decoded;
    }
    catch(er)
    {
        next(new Error('Not authorized'))
    }
    next()
}

module.exports=verifyTokenSocket