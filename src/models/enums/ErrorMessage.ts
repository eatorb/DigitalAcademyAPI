export enum ErrorMessage {
    serverError = "an error occurred on the server",
    invalidCredentials = "username or password is invalid!",
    invalidUser = "credentials does not match!",
    unknownServerError = "an unknown error occurred",
    alreadyRegistered = "oops! looks like you are already registered!",
    tokenMissing = "session lacks an authentication token!",
    tokenInvalid = "provided token does not correspond to a valid session!",
    keyIdMissing = "provided token does not have the required keyid!",
    invalidModuleId = "Invalid Module ID",
    moduleNotFound = "Module not found",
    invalidContents = "Invalid contents",
    invalidContentId = "Invalid Content ID",
    contentNotFound = "Content has not been found.",
    unauthorizedUser = "Unauthorized user",
    invalidUserId = "Invalid user id"
}

export enum PasswordErrorMessage {
    invalidLenght = "password needs to be at least 9 characters long",
    oneNumber = "password must contain at least one number",
    upperCaseLetter = "password must contain at least one uppercase letter",
    specialCharacter = "password must contain at least one special character"
}