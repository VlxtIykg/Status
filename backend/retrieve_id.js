/**
 * Example usage demonstrating how to check username availability on the Roblox API.
 * 
 * @example
 * const usernameToCheck = 'Kanscutie';
 * const isAvailable = await checkUsernameAvailability(usernameToCheck);
 * 
 * // Check the response data 
 * {
 * data: [
 *   {
 *    requestedUsername: "Kanscutie",
 *    hasVerifiedBadge: false,
 *    id: 142616422,
 *    name: "Kanscutie",
 *    displayName: "Kami",
 *   }
 *  ],
 * }
 */
export async function checkUsernameAvailability(username) {
  const url = 'https://users.roblox.com/v1/usernames/users';
  const data = {
    usernames: [username],
    excludeBannedUsers: true,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
  }
}