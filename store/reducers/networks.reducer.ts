import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MetamaskNetwork } from '../../interfaces/networks/network.interface';

export const networkSlice = createSlice({
  name: 'networks',
  initialState: {
    networks: [] as MetamaskNetwork[]
  },
  reducers: {
    addNetwork: (state, action: PayloadAction<MetamaskNetwork>) => {
      const network = state.networks.find(network => network.chainId === action.payload.chainId);

      if (network) return;

      state.networks.push(action.payload);
    },
    setNetworks: (state, action: PayloadAction<MetamaskNetwork[]>) => {
      state.networks = action.payload;
    },
    removeNetwork: (state, action: PayloadAction<MetamaskNetwork>) => {
      const network = state.networks.find(network => network.chainId === action.payload.chainId);

      if (!network) return;

      state.networks.splice(state.networks.indexOf(action.payload), 1);
    }
  },
})

export const { setNetworks, removeNetwork, addNetwork } = networkSlice.actions

export default networkSlice.reducer