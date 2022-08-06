import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const addressSlice = createSlice({
  name: 'address',
  initialState: null,
  reducers: {
    setAddress: (state: string , action: PayloadAction<string>) => {
      return action.payload;
    }
  },
})

export const { setAddress } = addressSlice.actions

export default addressSlice.reducer