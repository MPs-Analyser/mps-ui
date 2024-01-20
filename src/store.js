import { create } from 'zustand';
import { persist } from "zustand/middleware";
import {produce} from "immer";

import {	
	EARLIEST_FROM_DATE
} from "./config/constants";

const useStore = create(
    persist(
        (set) => ({
            bears: 12,
            increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
            addBears: (amount) => set((state) => ({ bears: state.bears + amount })),
            removeAllBears: () => set({ bears: 0 }),
            votefilter: {
                from: new Date(new Date(EARLIEST_FROM_DATE)).toISOString().substr(0, 10),
                to: new Date().toISOString().substr(0, 10),
                type: "",
                title: "",
            } ,            
            setVotefilterFrom: (value) => set (produce((state) => { state.votefilter.from = value })),
            setVotefilterTo: (value) => set (produce((state) => { state.votefilter.to = value })),
            setVotefilterType: (value) => set (produce((state) => { state.votefilter.type = value })),
            setVotefilterTitle: (value) => set (produce((state) => { state.votefilter.title = value })),                        
          }), {
            name: "mps-storage",            
          } )
    );

export default useStore;