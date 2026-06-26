import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import watchlistReducer from './watchlistSlice'

export default configureStore({
  reducer: {
    theme: themeReducer,
    watchlist: watchlistReducer,
  },
})
