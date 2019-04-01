import { connectToDB } from '../service';
// import User from '../model';

/**
 * Functions
 */
module.exports.getUsers = async () => {
  try {
    await connectToDB();
    const users = await User.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: e.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: e.message }),
    };
  }
};
