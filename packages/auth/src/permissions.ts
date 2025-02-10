import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from ".";
import { Role } from "./roles";
import { User } from "./models/user";

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_user, { can }) {
    can('manage', 'all');
  },
  MEMBER(_user, { can }) {
    // can('invite', 'User');
    can('manage', 'Project');
  },
  BILLING(_user, { can }) {
    // can('manage', 'all');
  },
}