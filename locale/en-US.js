const dictionaryENUS = {
  errors: {
    notAuthorized: "unauthorized",
    notAuthenticated: "user not authorized",
    invalidData: "invalid data",
    operationNotAllowed: "Operation not allowed",
    validate: {
      maxCharactersAllowed: "max characters exceeded",
      emptyData: "empty data",
      invalidUsername: "invalid username",
      invalidName: "invalid name",
      invalidEmail: "invalid email",
      passwordsDontMatch: "passwords don't match",
      invalidPassword: "invalid password",
      invalidRole: "invalid role",
    },
    user: {
      userExists: "user already exists",
      userDataInvalid: "Incorrect username or password",
      userNotExists: "user not exists",
      onUpdate: "error while updating user",
      onCreate: "error while creating user",
      onDelete: "error while deleting user",
    },
    tweet: {
      onDelete: "error while deleting tweet",
      onUpdate: "error while updating tweet",
    },
  },
  success: {
    user: {
      onUpdate: "user updated successfully",
      onCreate: "user created successfully",
      onDelete: "user removed successfully",
    },
    tweet: {
      onCreate: "tweet created successfully",
      onUpdate: "tweet updated successfully",
      tweetDeleted: "tweet removed successfully",
    },
  },
};

module.exports = { dictionaryENUS };
