import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MetamaskNetwork } from '../../interfaces/networks/network.interface';

export const networkSlice = createSlice({
  name: 'networks',
  initialState: [] as MetamaskNetwork[],
  reducers: {
    addNetwork: (state, action: PayloadAction<MetamaskNetwork>) => {
      const network = state.find(network => network.chainId === action.payload.chainId);

      if (network) return;

      state.push(action.payload);
    },
    setNetworks: (state, action: PayloadAction<MetamaskNetwork[]>) => {
      state = action.payload;
    },
    removeNetwork: (state, action: PayloadAction<MetamaskNetwork>) => {
      const network = state.find(network => network.chainId === action.payload.chainId);

      if (!network) return;

      state.splice(state.indexOf(network), 1);
    }
  },
})

export const { setNetworks, removeNetwork, addNetwork } = networkSlice.actions

export default networkSlice.reducer