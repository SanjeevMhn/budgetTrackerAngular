import { withStorageSync } from "@angular-architects/ngrx-toolkit";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export type User = {
    name: string;
    img: string;
    password?: string
}

type UserStoreState = User

const initialState:UserStoreState = {
    name: '',
    img: '',
    password: ''
}

export const UserStore = signalStore(
    {providedIn: 'root'},
    withState<UserStoreState>(initialState),
    withMethods((store) => ({
        setUserData(data: Partial<User>):void{
            patchState(store, (state) => ({
                ...state,
                ...data
            }))
        }
    })),
    withStorageSync({
        key: 'user'
    })
)