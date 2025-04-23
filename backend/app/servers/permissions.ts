const { and, or, rule, shield } = require('graphql-shield');

// function getPermissions(user: { [x: string]: { permissions: any } }) {
//   if (user) {
//     return user;
//   }
//   return [];
// }

const isAuthenticated = rule()((parent: any, args: any, { user }: any) => {
  console.log(parent);
  console.log(args);
  console.log(user);
  console.log('..................................');
  return user !== null;
});

const canReadAnyAccount = rule()(({ user }: any) => {
  // const userPermissions = getPermissions(user);
  // return userPermissions.includes('read:any_account');
  console.log(user);
  console.log('..................................');
  return true;
});

const canReadOwnAccount = rule()(({ user }: any) => {
  // const userPermissions = getPermissions(user);
  // return userPermissions.includes('read:own_account');
  console.log(user);
  console.log('..................................');
  return true;
});

const isReadingOwnAccount = rule()(({ id }: any, { user }: any) => {
  // return user && user.sub === id;
  console.log(id, user);
  return true;
});

export const permissions = shield({
  Query: {
    // getAllNotifications: or(
    //   and(canReadOwnAccount, isReadingOwnAccount),
    //   canReadAnyAccount
    // ),
    // getAllUsers: isAuthenticated,
    // getUser: isAuthenticated,
    // getAllRoles: isAuthenticated,
    // getRole: canReadAnyAccount,
    // getAllMenus: isAuthenticated,
    // getMenu: isAuthenticated,
    // getAllModules: isAuthenticated,
    // getModule: isAuthenticated,
  },
  Mutation: {
    // createUser: isAuthenticated,
    // updateUser: isAuthenticated,
    // createRole: isAuthenticated,
    // updateRole: isAuthenticated,
    // createMenu: isAuthenticated,
    // updateMenu: isAuthenticated,
    // createModule: isAuthenticated,
    // updateModule: isAuthenticated,
  },
  //  debug: true,
  // allowExternalErrors: true,
});
