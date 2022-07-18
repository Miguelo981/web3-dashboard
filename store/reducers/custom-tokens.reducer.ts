import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenInfo } from '../../interfaces/token/token.interface';

export const customTokensSlice = createSlice({
  name: 'custom-tokens',
  initialState: [] as TokenInfo[],
  reducers: {
    addCustomToken: (state, action: PayloadAction<TokenInfo>) => {
      const customTokens = state.find(customTokens => customTokens.address === action.payload.address);

      if (customTokens) return;

      state.push(action.payload);
    },
    setCustomTokens: (state, action: PayloadAction<TokenInfo[]>) => {
      state = action.payload;
    },
    removeCustomToken: (state, action: PayloadAction<TokenInfo>) => {
      const customTokens = state.find(customTokens => customTokens.symbol === action.payload.symbol); //.address

      if (!customTokens) return;

      state.splice(state.indexOf(customTokens), 1);
    }
  },
})

export const { setCustomTokens, removeCustomToken, addCustomToken } = customTokensSlice.actions

export default customTokensSlice.reducer