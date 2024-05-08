const { checkUsernameAvailability } = await import("./backend/retrieve_id")
const user_id = await checkUsernameAvailability("Kanscutie");
console.log(user_id.data[0].id)
// console.log(uname.data[0].id)
