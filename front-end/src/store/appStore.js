import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        // tweet: tweetReducer,
        // video: videoReducer,
        // comment: commentReducer,
        // like: likeReducer,
        // playlist: playlistReducer,
        // subscription: subscriptionReducer
    }
})


export default appStore;