# DevTinder APIs

## authRouter
```
POST /signup
POST /login
POST /logout
POST /forgotPassword
```

## profileRouter
```
GET   /profile/view
PATCH /profile/edit
PATCH /profile/changePassword
```

## requestRouter
```
POST /request/sent/:status/:userId
POST /request/review/:status/:requestId
```

## userRouter
```
GET /user/connections
GET /user/requests/received
GET /user/requests/send
GET /feed   Gets you the profile of other users on the platform
```

**Status:** Ignore, Interested, Accepted, Rejected
