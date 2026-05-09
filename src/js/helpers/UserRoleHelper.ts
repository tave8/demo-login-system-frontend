import {UserRole} from "../my_types.ts";

export default class UserRoleHelper {

    /**
     * The given role is present in both lists?
     *
     * @param role
     * @param list1
     * @param list2
     */
    public static sameRoleOverlaps(role: UserRole,
                                   list1: UserRole[],
                                   list2: UserRole[]): boolean
    {
        return list1.includes(role) && list2.includes(role);
    }

}