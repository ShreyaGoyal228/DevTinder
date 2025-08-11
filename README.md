# DevTinder api's

## authRouter
post /signup
post /login
post /logout
post /forgotPassword

## profileRouter
get   /profile/view
patch /profile/edit
patch /profile/changePassword

## requestRouter
post /request/send/ignore/:userId
post /request/send/interest/:userId
post /request/review/accept/:receiverId
post /request/review/reject/:receiverId

## userRouter
get /user/connections
get /user/receivedReq
get /user/sendReq
get /feed  Gets you the profile of other users on the platform

Status : Ignored , Interested , Accepted , Rejected

