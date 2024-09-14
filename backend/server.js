const express = require('express');
const connect = require('./config/dbConnect');
const app = express();
const cookieParser = require('cookie-parser');

const cors = require('cors');
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');


const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const postFeed = require('./routes/feedRoute');
const likeRoute = require('./routes/likeRoute');
const commentRoute = require('./routes/commentRoute');

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/feed', postFeed);
app.use('/api/v1/like', likeRoute);
app.use('/api/v1/comment', commentRoute);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT} `);
});

// database connection
connect();
cloudinaryConnect();