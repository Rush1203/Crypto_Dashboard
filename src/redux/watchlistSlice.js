import { createSlice } from '@reduxjs/toolkit'

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: { ids: ['bitcoin', 'ethereum'] },
  reducers: {
    toggleWatch: (state, action) => {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id)
      } else {
        state.ids.push(id)
      }
    },
  },
})

export const { toggleWatch } = watchlistSlice.actions
export default watchlistSlice.reducer
