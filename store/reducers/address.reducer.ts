import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const addressSlice = createSlice({
  name: 'address',
  initialState: "",
  reducers: {
    addAddress: (state: string, action: PayloadAction<string>) => {
      state = action.payload;

      return state;
    },
    removeAddress: (state: string) => {
      state = "";

      return state;
    }
  },
})

export const { addAddress, removeAddress } = addressSlice.actions

export default addressSlice.reducer