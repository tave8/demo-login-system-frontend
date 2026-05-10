import {Language, UserRole, UserRoleByLanguage} from "../my_types.ts";
import LanguageHelper from "./LanguageHelper.ts";

export default class UserRoleHelper {

    /**
     * Get role by local language
     */
    public static getRole(role: UserRole, withLocalLanguage: boolean=true): string {
        if(withLocalLanguage) {
            const lang = LanguageHelper.getLanguage()
            const rolesMap = UserRoleByLanguage[lang]
            return rolesMap[role]
        }
        const rolesMap = UserRoleByLanguage[Language.EN]
        return rolesMap[role]
    }

    /**
     * Get all user roles.
     */
    public static getAllRoles(withLocalLanguage: boolean=true): UserRole[] {
        if(withLocalLanguage) {
            const lang = LanguageHelper.getLanguage()
            const roles = UserRoleByLanguage[lang]
            return Object.values(roles) as UserRole[]
        }
        // english
        const roles = UserRoleByLanguage[Language.EN]
        return Object.values(roles) as UserRole[]
    }

    /**
     * Get all user roles map except admin.
     * Example:
     *
     *     ADMIN: ADMIN
     *     COORDINATOR: COORDINATORE
     *     OPERATOR: OPERATORE
     *
     */
    public static getAllRolesMapExceptAdmin(withLocalLanguage: boolean=true): Record<UserRole, string> {
        const allRolesInEnglish = UserRoleHelper.getAllRoles(false)
        const allRolesInEnglishWithoutAdmin = allRolesInEnglish.filter(role => role != UserRole.ADMIN)

        const lang = withLocalLanguage ? LanguageHelper.getLanguage() : Language.EN
        const translations = UserRoleByLanguage[lang]

        const map: Partial<Record<UserRole, string>> = {}

        allRolesInEnglishWithoutAdmin.forEach(role => {
            map[role] = translations[role]
        })

        return map as Record<UserRole, string>
    }



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