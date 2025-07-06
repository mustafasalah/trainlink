import { useContext } from "react";
import { AuthContext } from "../Providers";

export default function useLoggedUser() {
    const loggedUser = useContext(AuthContext);
    return loggedUser;
}
